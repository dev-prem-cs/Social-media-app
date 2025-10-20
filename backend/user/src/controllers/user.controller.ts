import generateToken from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitMQ.js";
import  tryCatch from "../config/tryCatch.js";
import { redisClient } from "../index.js";
import { User } from "../model/user.model.js";

export const  loginUser=tryCatch(async(req,res)=>{
        const {email}=req.body;
        const rateLimitKey=`otp-rate-limit:${email}`;
        const rateLimit=await redisClient.get(rateLimitKey);
        if(rateLimit){
            return res.status(429).json({message:"Too many requests. Please try again later."});
        }
        const otp=  Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.setEx(`otp:${email}`,300,otp); 
        await redisClient.setEx(rateLimitKey,60, '1');

        const message={
            TO:email,
            subject:"Your OTP Code",
            body:`Your OTP code is ${otp}. It is valid for 5 minutes.`
        };

        await publishToQueue("send-otp-email-queue",message);

        res.status(200).json({message:"OTP sent successfully", otp}); 
});

export const verifyOtp=tryCatch(async(req,res)=>{
        const {email,otp}=req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }
        const storedOtp=await redisClient.get(`otp:${email}`);
        if(!storedOtp){
            return res.status(400).json({message:"Invalid or expired OTP."});
        }
        if(storedOtp !== otp){
            return res.status(400).json({message:"Invalid OTP."});
        }
        await redisClient.del(`otp:${email}`);

        let user=await User.findOne({email});
        if(!user){
            const name=email.slice(0,email.indexOf("@"));
            user=await User.create({email,name});
            
        }
        const token = generateToken(user );



        res.status(200).json({message:"OTP verified successfully.", token,user});
});

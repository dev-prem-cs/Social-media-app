import type { NextFunction, Request, Response } from "express";
import  tryCatch from "../config/tryCatch.js";
import type { IUser } from "../model/user.model.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
export interface AuthenticatedRequest extends Request{
    user?:IUser | null;
} 

export const isAuth= async(req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const authHeaders=req.headers.authorization;
        if(!authHeaders||!authHeaders.startsWith("Bearer ")){
            res.status(401).json({
                message:"Please login , no auth header found!!"
            })
        }
        console.log("mere andar aa gaya")
        const token :any =authHeaders!.split(" ")[1];
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET as string) as JwtPayload;
        console.log("verify hoo gaya")
        if (!decodedToken || !decodedToken.user) {
            res.status(401).json({ message: "Invalid token. Please login again." });
            return;
        }
        req.user = decodedToken.user;
        console.log("yahoooo")

        next();

    } catch (error : any) {
        res.status(401).json({ message: "Unauthorized access. Please login.",
            err:error.message 

         },
        );
    }
}
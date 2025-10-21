import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const startSendOTPConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: Number(process.env.RABBITMQ_PORT),
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
        });

        const channel = await connection.createChannel();
        const queueName = "send-otp-email-queue";
        await channel.assertQueue(queueName, { durable: true });
        console.log("mail service consumer started, listening to otp mails");

        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    
                    const { TO, subject, body } = JSON.parse(msg.content.toString());
                    console.log(JSON.parse(msg.content.toString()))
                    console.log({ TO, subject, body });
                    // Quick check: If TO is missing, log it and reject the message
                    if (!TO) {
                        console.error("Message is missing 'TO' field:", { subject, body });
                        channel.nack(msg, false, false); // nack = reject, false = don't requeue
                        return;
                    }

                    console.log("Sending email to:", TO);

                    const mailOptions = {
                        from: "chat-app", // You can also use process.env.SMTP_USER
                        to: TO,
                        subject: subject,
                        text: body,
                    };
                
                   
                    await transporter.sendMail(mailOptions);
                    
                    console.log(`Email sent to ${TO}`);
                    channel.ack(msg); // Acknowledge the message (it's done)
                
                } catch (error) {
                    console.error("Error sending otp email:", error);
                 
                }
            }
        });
    } catch (error: any) {
        console.error("Error in startSendOTPConsumer:", error.message);
    }
};
import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST ,
            port: Number(process.env.RABBITMQ_PORT) ,
            username: process.env.RABBITMQ_USER ,
            password: process.env.RABBITMQ_PASSWORD ,
        });
        channel = await connection.createChannel();
        console.log("🐰 Connected to RabbitMQ");
    } catch (error) {
        console.log("💔failed to connect to rabbitMQ ", error);
    }
}




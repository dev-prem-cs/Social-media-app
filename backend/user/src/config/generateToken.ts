import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET as string;
const generateToken = (user :object) => {
    const token = jwt.sign({ user   }, jwtSecret, {
        expiresIn: '15d',
    });
    return token;
};

export default generateToken;

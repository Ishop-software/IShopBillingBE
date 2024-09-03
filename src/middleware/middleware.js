import { tokenValidation } from "../helper/generateToken.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/UserModel.js";

export const checkToken = (req, res, next) => {
    let data = req.body;
    console.log("token entry", data);
    if (data && data.token) {
        const result = tokenValidation(data.token)
        if (result && result.data) {
            req.userDetails = result.data
            next(); return;
        }
    }
    return res.json({ success: false, message: "Invalid Token!" });
};

export const authenticate = async (req,res,next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(400).json({ success: false, error: "Access-Denied" });
        } else {
            const verified = jwt.verify( token, process.env.SECRET_KEY);
            const checkUser = await User.findOne({ userId: verified.data.userId })
            if (!checkUser) {
                return res.status(400).json({ success: false, message: "Invalid User" });
            }
            next();
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
} 
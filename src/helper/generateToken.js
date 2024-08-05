import jwt from "jsonwebtoken";

export const generateToken = (data) => {
    const secretKey = "kavithatp98@gmail.com";
    const hourseExpiresIn = "10h";
    const token = jwt.sign({data}, secretKey, { expiresIn: hourseExpiresIn });
    return token;
};

export const tokenValidation = (token) => {
    try {
        return jwt.verify(token, "keytest");
    } catch (error) {
        return false;
    }
};

export const validUser = (req, res) => {
    const token = req.header("Authorization");
    return res({ token });
};
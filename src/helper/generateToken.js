import jwt from "jsonwebtoken";

export const generateToken = (data) => {
    const hourseExpiresIn = "10h";
    const token = jwt.sign({data}, process.env.SECRET_KEY, { expiresIn: hourseExpiresIn });
    return token;
};

export const tokenValidation = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        return false;
    }
};

export const validUser = (req, res) => {
    const token = req.header("Authorization");
    return res({ token });
};

export const getUserIdFromToken = (token) => {
    const userId = jwt.decode(token,process.env.SECRET_KEY);
    return userId.data.userId;
}
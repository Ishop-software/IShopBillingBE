import { tokenValidation } from "../helper/generateToken";

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
}
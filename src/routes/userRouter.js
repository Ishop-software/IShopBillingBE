import express from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";

const router = express.Router();

// Register API
router.post("/api/users/userRegister", async (req, res) => {
    try {
        const userRegisterData = req.body;
        const findUserEmail = await User.findOne({ email: userRegisterData.email });
        const findUserMobile = await User.findOne({ mobileNo: userRegisterData.mobileNo });
        const findUserName = await User.findOne({ name: userRegisterData.name });
        if (findUserEmail) {
            return res.status(400).json({ success: false, message: "Email Already Exists!" });
        } else if (findUserMobile) {
            return res.status(400).json({ success: false, message: "Mobile No Already Exists!" });
        } else if (findUserName) {
            return res.status(400).json({ success: false, message: "User Name Already Exists!" });
        } else {
            const password = userRegisterData.password;
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            userRegisterData.password = hashedPassword;
            const createDate = new Date();
            const date = ("0" + createDate.getDate()).slice(-2);
            const month = ("0" + (createDate.getMonth() + 1)).slice(-2);
            const year = createDate.getFullYear();
            const hours = createDate.getHours();
            const minutes = ("0" + createDate.getMinutes()).slice(-2);
            const seconds = ("0" + createDate.getSeconds()).slice(-2);
            const createUserId = year + "" + month + "" + date + "" + hours + "" + minutes + "" + seconds;
            userRegisterData["userId"] = createUserId;
            const createUserData = await User.create(userRegisterData);
            return res.status(200).json({ success: true, message: "User Registered Successfully!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

// Login API
router.post("/api/users/userLogin", async (req, res) => {
    try {
        const userLoginData = req.body;
        const getUserEmail = userLoginData.email;
        const getPassword = userLoginData.password;
        const findUserLogin = await User.findOne({ email: getUserEmail });
        if (!findUserLogin) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }
        const isMatch = await bcrypt.compare(getPassword, findUserLogin.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password Not Valid!" });
        }
        const token = jwt.sign({ email: getUserEmail }, "your_jwt_secret");
        return res.status(200).json({ success: "true", message: "User Login Successfully!", token: token });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

// GetAll User Data List
router.get("/api/users/getAllUserRegister", async (req, res) => {
    try {
        const findUserList = await User.find({});
        if (findUserList) {
            return res.status(200).json({ success: false, message: findUserList });
        } else {
            return res.status(404).json({ success: false, message: "User Register Data List Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

// GetUserId
router.get("/api/users/getUserRegister", async (req, res) => {
    try {
        const userRegisterData = req.body;
        const getUserId = userRegisterData.userId;
        const findUserId = await User.findOne({ userId: getUserId });
        if (findUserId) {
            return res.status(200).json({ success: true, message: findUserId });
        }
        else {
            return res.status(404).json({ success: false, message: "UserId Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
})

export default router;
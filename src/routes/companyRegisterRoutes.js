import express from "express";
import { companyUserRegister } from "../models/CompanyRegisterModel.js";

const router = express.Router();

router.post("/api/companyregister/addCompanyUser", async (req, res) => {
    try {
        const companyData = req.body;
        const findCompanyEmail = await companyUserRegister.findOne({ email: companyData.email });
        const findCompanyMobile = await companyUserRegister.findOne({ mobileNo: companyData.mobileNo });
        const findCompanyName = await companyUserRegister.findOne({ name: companyData.enter_a_name_of_company });
        if (findCompanyEmail) {
            return res.status(400).json({ success: false, message: "Email Already Exists!" });
        } else if (findCompanyMobile) {
            return res.status(400).json({ success: false, message: "Mobile No Already Exists!" });
        } else if (findCompanyName) {
            return res.status(400).json({ success: false, message: "User Name Already Exists!" });
        } else {
            const companyName = "IShop";
            function getRandomSixDigit() {
                return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            }
            let randomSixDigit = getRandomSixDigit();
            const generateId = companyName.concat(randomSixDigit);
            companyData["companyUserId"] = generateId;
            const createCompany = await companyUserRegister.create(companyData);
            return res.status(200).json({ success: true, message: "Company User Account Created Successfully!", companyUserId: createCompany.companyUserId });          
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/companyregister/CompanyUserLogin", async (req, res) => {
    try {
        const companyData = req.body; 
        const findCompanyEmail = await companyUserRegister.findOne({ email: companyData.email });
        const findCompanyMobile = await companyUserRegister.findOne({ mobileNo: companyData.mobileNo });
        if (!findCompanyEmail) {
            return res.status(404).json({ success: false, message: "Company User Email Id Not Found!" });
        } else if (!findCompanyMobile) {
            return res.status(404).json({ success: false, message: "Company User Mobile No Not Found!" });
        } else {
            return res.status(200).json({ success: true, message: "Company User Email Login Successfully!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/companyregister/getAllCompanyUser", async (req, res) => {
    try {
        const findAllCompanyUsers = await companyUserRegister.find({});
        if (findAllCompanyUsers) {
            return res.status(200).json({ success: true, message: findAllCompanyUsers });
        } else {
            return res.status(404).json({ success: true, message: "Company Users List Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/companyregister/getCompanyUserId", async (req, res) => {
    try {
        const companyData = req.body; 
        const getCompanyUserId = companyData.companyUserId;
        const findCompanyUserId = await companyUserRegister.findOne({ companyUserId: getCompanyUserId });
        if (findCompanyUserId) {
            return res.status(200).json({ success: true, message: findCompanyUserId });
        } else {
            return res.status(404).json({ success: true, message: "Company UserId Is Not Found!" });
        } 
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.put("/api/companyregister/updateCompanyUserId", async (req, res) => {
    try {
        const companyData = req.body;
        const getCompanyUserId = companyData.companyUserId;
        const findCompanyUserId = await companyUserRegister.findOneAndUpdate({ companyUserId: getCompanyUserId }, { $set: companyData });
        if (findCompanyUserId) {
            return res.status(200).json({ success: true, message: "Company User Id Updated Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Company User Id Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.delete("/api/companyregister/deleteCompanyUserId", async (req, res) => {
    try {
        const companyData = req.body;
        const getCompanyUserId = companyData.companyUserId;
        const deleteCompanyUserId = await companyUserRegister.deleteOne({ companyUserId: getCompanyUserId });
        if (deleteCompanyUserId.deletedCount === 1) {
            return res.status(200).json({ success: true, message: "Company User Id Deleted Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Company User Id Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

export default router;
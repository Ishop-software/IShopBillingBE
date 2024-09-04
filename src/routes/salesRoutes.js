import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { salesRegister } from "../models/SalesModel.js";
import { authenticate } from "../middleware/middleware.js";
import { getUserIdFromToken } from "../helper/generateToken.js";

const router = express.Router();

router.post("/api/usersales/addSalesRegister", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token)
        const salesRegisterData = req.body;
        const findSaleRegId = uuidv4();
        salesRegisterData["saleRegId"] = findSaleRegId;
        salesRegisterData["userId"] = userId;
        const createSalesData = await salesRegister.create(salesRegisterData);
        return res.status(200).json({ success: true, message: "Sales Register Data Added Successfully!", saleRegId: createSalesData.saleRegId });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/usersales/getAllSalesList", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const findAllSalesList = await salesRegister.find({ userId: userId }, { _id:0, __v:0 }); 
        if (findAllSalesList) {
            return res.status(200).json({ success: true, message: findAllSalesList });
        } else {
            return res.status(404).json({ success: false, message: "Sales Register List Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/usersales/getSalesRegister", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const salesRegisterData = req.body;
        const getUserSalesId = salesRegisterData.saleRegId;
        const findSalesUserId = await salesRegister.findOne({ userId: userId, saleRegId: getUserSalesId }, { __v:0, _id:0 });
        if (findSalesUserId) {
            return res.status(200).json({ success: true, message: findSalesUserId });
        } else {
            return res.status(404).json({ success: false, message: "Sales Register Id Is Not Found!" });
        } 
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.put("/api/usersales/updateSalesRegData", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const salesRegisterData = req.body;
        const getUserSalesId = salesRegisterData.saleRegId;
        const findSalesUserId = await salesRegister.findOneAndUpdate({ userId: userId, saleRegId: getUserSalesId }, { $set: salesRegisterData });
        if (findSalesUserId) {
            return res.status(200).json({ success: false, message: "Sales Register Data Id Is Updated Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Sales Register Data Id Was Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.delete("/api/usersales/deleteSalesData", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token); 
        const salesRegisterData = req.body;
        const getUserSalesId = salesRegisterData.saleRegId;
        const findSalesUserId = await salesRegister.findOneAndDelete({ userId: userId, saleRegId: getUserSalesId });
        if (findSalesUserId) {
            return res.status(200).json({ success: false, message: "Sales Register Data Id Is Deleted Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Sales Register Data Id Was Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

export default router;
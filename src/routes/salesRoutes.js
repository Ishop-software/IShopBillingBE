import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { salesRegister } from "../models/SalesModel.js";

const router = express.Router();

router.post("/api/usersales/addSalesRegister", async (req, res) => {
    try {
        const salesRegisterData = req.body;
        const findSalRegId = uuidv4();
        salesRegisterData["saleRegId"] = findSalRegId;
        const createSalesData = await salesRegister.create(salesRegisterData);
        return res.status(200).json({ success: true, message: "Sales Register Data Added Successfully!", saleRegId: createSalesData.saleRegId });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/usersales/getAllSalesList", async (req, res) => {
    try {
        const findAllSalesList = await salesRegister.find({}); 
        if (findAllSalesList) {
            return res.status(200).json({ success: true, message: findAllSalesList });
        } else {
            return res.status(404).json({ success: false, message: "Sales Register List Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/usersales/getSalesRegister", async (req, res) => {
    try {
        const salesRegisterData = req.body;
        const getUserSalesId = salesRegisterData.saleRegId;
        const findSalesUserId = await salesRegister.findOne({ saleRegId: getUserSalesId });
        if (findSalesUserId) {
            return res.status(200).json({ success: true, message: findSalesUserId });
        } else {
            return res.status(404).json({ success: false, message: "Sales Register Id Is Not Found!" });
        } 
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.put("/api/usersales/updateSalesRegData", async (req, res) => {
    try {
        const salesRegisterData = req.body;
        const getUserSalesId = salesRegisterData.saleRegId;
        const findSalesUserId = await salesRegister.findOneAndUpdate({ saleRegId: getUserSalesId }, { $set: salesRegisterData });
        if (findSalesUserId) {
            return res.status(200).json({ success: false, message: "Sales Register Data Id Is Updated Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Sales Register Data Id Was Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.delete("/api/usersales/deleteSalesData", async (req, res) => {
    try {
        const salesRegisterData = req.body;
        const getUserSalesId = salesRegisterData.saleRegId;
        const findSalesUserId = await salesRegister.findOneAndDelete({ saleRegId: getUserSalesId });
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
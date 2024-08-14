import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { salesRegister } from "../models/SalesModel.js";

const router = express.Router();

router.post("/api/usersales/salesRegister", async (req, res) => {
    try {
        const salesRegisterData = req.body;
        const findSalRegId = uuidv4();
        salesRegisterData["sal_reg_id"] = findSalRegId;
        const createSalesData = await salesRegister.create(salesRegisterData);
        return res.status(200).json({ success: true, message: "Sales Register Data Added Successfully!", sal_reg_id: createSalesData.sal_reg_id });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

export default router;
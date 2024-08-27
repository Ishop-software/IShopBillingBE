import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { purchaseRegister } from "../models/PurchaseModel.js";

const router = express.Router();

router.post("/api/userpurchase/addPurchaseRegister", async (req, res) => {
    try {
        const purchaseData = req.body;
        const createPurchaseId = uuidv4();
        purchaseData["purchaseRegId"] = createPurchaseId;
        const createPurchaseData = await purchaseRegister.create(purchaseData);
        if (createPurchaseData) {
            return res.status(200).json({ success: true, message: "Purchase Register Data Added Successfully!", purchaseRegId: purchaseData.purchaseRegId });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/userpurchase/getAllPurchaseList", async (req, res) => {
    try {
        const findPurchaseDataList = await purchaseRegister.find({});
        if (findPurchaseDataList) {
            return res.status(200).json({ success: true, message: findPurchaseDataList });
        } else {
            return res.status(404).json({ success: false, message: "Purchase Data List Was Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/userpurchase/getPurchaseData", async (req, res) => {
    try {
        const purchaseData = req.body;
        const getPurchaseId = purchaseData.purchaseRegId;
        const findePurchaseId = await purchaseRegister.findOne({ purchaseRegId: getPurchaseId });
        if (findePurchaseId) {
            return res.status(200).json({ success: true, message: findePurchaseId });
        } else {
            return res.status(404).json({ success: false, message: "Purchase Register Id Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.put("/api/userpurchase/updatePurchaseData", async (req, res) => {
    try {
        const purchaseData = req.body;
        const getPurchaseId = purchaseData.purchaseRegId;
        const findPurchaseData = await purchaseRegister.findOneAndUpdate({ purchaseRegId: getPurchaseId }, { $set: purchaseData });
        if (findPurchaseData) {
            return res.status(200).json({ success: true, message: "Purchase Data Id Updated Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Purchase Data Id Was Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.delete("/api/userpurchase/deletePurchaseData", async (req, res) => {
    try {
        const purchaseData = req.body;
        const getPurchaseId = purchaseData.purchaseRegId;
        const findPurchaseData = await purchaseRegister.findOneAndDelete({ purchaseRegId: getPurchaseId });
        if (findPurchaseData) {
            return res.status(200).json({ success: true, message: "Purchase Data Id Is Deleted Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Purchase Data Id Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

export default router;
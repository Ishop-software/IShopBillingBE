import express from "express";
import { chargesRegister } from "../models/ChargesRegisterModel.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post("/api/usercharge/addChargeRegister", async (req, res) => {
    try {
        const chargeRegData = req.body;
        const chargeId = uuidv4();
        chargeRegData["chargeRegId"] = chargeId;
        const createChargeData = await chargesRegister.create(chargeRegData);
        if (createChargeData) {
            return res.status(200).json({ success: true, message: "Charge Registered Successfully!", chargeRegId: createChargeData.chargeRegId });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/usercharge/getAllChargeList", async (req, res) => {
    try {
        const findAllChargeList = await chargesRegister.find({});
        if (findAllChargeList) {
            return res.status(200).json({ success: true, message: findAllChargeList });
        } else {
            return res.status(404).json({ success: false, message: "ChargeList Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/usercharge/getChargeData", async (req, res) => {
    try {
        const chargeRegData = req.body;
        const getChargeId = chargeRegData.chargeRegId;
        const findChargeId = await chargesRegister.findOne({ chargeRegId: getChargeId });
        if (findChargeId) {
            return res.status(200).json({ success: true, message: findChargeId });
        } else {
            return res.status(404).json({ success: false, message: "Charge Register Id Was Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.put("/api/usercharge/updateChargeData", async (req, res) => {
    try {
        const chargeRegData = req.body;
        const getChargeId = chargeRegData.chargeRegId;
        const updateChargeId = await chargesRegister.findOneAndUpdate({ chargeRegId: getChargeId }, { $set: chargeRegData });
        if (updateChargeId) {
            return res.status(200).json({ success: true, message: "Charge Register Id Updated Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Charge Register Id Was Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.delete("/api/usercharge/deleteChargeData", async (req, res) => {
    try {
        const chargeRegData = req.body;
        const getChargeId = chargeRegData.chargeRegId;
        const findChargeId = await chargesRegister.findOneAndDelete({ chargeRegId: getChargeId });
        if (findChargeId) {
            return res.status(200).json({ success: true, message: "Charge Register Id Deleted Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Charge Register Id Was Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

export default router;
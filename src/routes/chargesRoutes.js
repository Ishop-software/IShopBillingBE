import express from "express";
import { chargesRegister } from "../models/ChargesRegisterModel.js";
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from "../middleware/middleware.js";
import { getUserIdFromToken } from "../helper/generateToken.js";

const router = express.Router();

router.post("/api/usercharge/addChargeRegister", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token)
        const chargeRegData = req.body;
        const chargeId = uuidv4();
        chargeRegData["chargeRegId"] = chargeId;
        const { typesOfCharges, chargesHeading, printAs, accountHeadToPost, typesOfCharges1, inputAmountOfChargesAs, taxSettings } = req.body;
        const craeteChargesData = {
            userId: userId,
            chargeRegId : chargeId,
            chargesHeading: chargesHeading,
            printAs: printAs,
            accountHeadToPost: accountHeadToPost,
            typesOfCharges: typesOfCharges,
            typesOfCharges1: inputAmountOfChargesAs === "percentage" ? typesOfCharges1 : null,
            inputAmountOfChargesAs: inputAmountOfChargesAs,
            taxSettings: taxSettings
        };
        const createChargeData = await chargesRegister.create(craeteChargesData);
        if (createChargeData) {
            return res.status(200).json({ success: true, message: "Charge Registered Successfully!", chargeRegId: createChargeData.chargeRegId });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/usercharge/getAllChargeList", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token)
        const findAllChargeList = await chargesRegister.find({ userId: userId },{ __v:0, _id:0, createdAt:0, updatedAt:0 });
        if (findAllChargeList) {
            return res.status(200).json({ success: true, message: findAllChargeList });
        } else {
            return res.status(404).json({ success: false, message: "ChargeList Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/usercharge/getChargeData", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token)
        const chargeRegData = req.body;
        const getChargeId = chargeRegData.chargeRegId;
        const findChargeId = await chargesRegister.findOne({ chargeRegId: getChargeId, userId: userId },{ __v:0, _id:0, createdAt:0, updatedAt:0 });
        if (findChargeId) {
            return res.status(200).json({ success: true, message: findChargeId });
        } else {
            return res.status(404).json({ success: false, message: "Charge Register Id Was Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.put("/api/usercharge/updateChargeData", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token)
        const chargeRegData = req.body;
        const { typesOfCharges1, chargeRegId } = req.body;
        chargeRegData["typesOfCharges1"] = chargeRegData.inputAmountOfChargesAs === "percentage" ? typesOfCharges1 : null;
        const updateChargeId = await chargesRegister.findOneAndUpdate({ chargeRegId: chargeRegId, userId: userId }, { $set: chargeRegData });
        if (updateChargeId) {
            return res.status(200).json({ success: true, message: "Charge Register Id Updated Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Charge Register Id Was Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.delete("/api/usercharge/deleteChargeData", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token)
        const chargeRegData = req.body;
        const getChargeId = chargeRegData.chargeRegId;
        const findChargeId = await chargesRegister.findOneAndDelete({ chargeRegId: getChargeId, userId: userId });
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
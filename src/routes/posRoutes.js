import express from 'express';
import { v4 as uuidv4 } from "uuid";
import { POSModel } from '../models/PosModel.js';
import { authenticate } from '../middleware/middleware.js';
import { getUserIdFromToken } from '../helper/generateToken.js';

const router = express.Router();

router.post('/api/pos/createPOS', authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const posId = uuidv4();
        const posData = req.body;

        posData['userId'] = userId;
        posData['posId'] = posId;
        const createPosData = await POSModel.create(posData)
        .then(() => { return res.status(200).json({ success: true, message: "POS created successfully.." }) })
        .catch(() => { return res.status(404).json({ success: false, message: "POS not created.." }) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/pos/getAllPOS", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);

        const getPOSData = await POSModel.find({ userId: userId }, { _id:0, __v:0, createdAt:0, updatedAt:0});
        if (getPOSData) {
            return res.status(200).json({ success: true, data: getPOSData });
        } else {
            return res.status(400).json({ success: false, message: "There is no data for this user." });    
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/pos/getPOS", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const { posId } = req.body;

        const getPOSData = await POSModel.findOne({ userId: userId, posId: posId }, { _id:0, __v:0, createdAt:0, updatedAt:0 });
        if (getPOSData) {
            return res.status(200).json({ success: true, data: getPOSData });
        } else {
            return res.status(400).json({ success: false, message: "There is no data for this userId." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/pos/updatePOS", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const posData = req.body;
        const { posId } = req.body;
 
        const updatePosData = await POSModel.findOneAndUpdate({ userId: userId, posId: posId },{ $set: { posData } });
        if(updatePosData) {
            return res.status(200).json({ success: false, message: "POS data updated successfully." });    
        } else {
            return res.status(500).json({ success: false, message: "POS data not updated.." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/pos/deletePOS", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const { posId } = req.body;

        const deletePOS = await POSModel.findOneAndDelete({ userId: userId, posId: posId });
        if(deletePOS) {
            return res.status(200).json({ success: true, message: "POS data deleted successfully.." });
        } else {
            return res.status(400).json({ success: false, message: "POS data was not deleted.." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
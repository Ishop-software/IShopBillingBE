import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { birthdayRemainder } from '../models/BirthdayRemaiderModel.js';

const router = express.Router();

router.post('/api/addBirthdayRemainder', async ( req, res ) => {
    try {
        const bithdayData = req.body;
        bithdayData["BrId"] = uuidv4();
        const createBirthdayRemainder = await birthdayRemainder.create(bithdayData);
        if(createBirthdayRemainder) {
            return res.status(200).json({ success: true, message: "Birthday data was stored successfulluy." });
        } else {
            return res.status(404).json({ success: false, message: "Birthday data was not stored." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/api/getAllRemainder', async ( req, res ) => {
    try {
        const birthdayData = req.body;
        const findData = await birthdayRemainder.find({},{_id: 0, __v: 0});
        if (findData) {
            return res.status(200).json({ success: true, data: findData });
        } else {
            return res.status(400).json({ success: false, message: "No data found." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/getRemainder', async ( req, res ) => {
    try {
        const { BrId } = req.body;
        const findData = await birthdayRemainder.findOne({ BrId: BrId },{_id: 0, __v: 0});
        if (findData) {
            return res.status(200).json({ success: true, data: findData });
        } else {
            return res.status(400).json({ success: false, message: "No data found." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/updateBirthdayRemainder', async ( req, res) => {
    try {
        const birthdayData = req.body;
        const BrId = birthdayData.BrId;
        const updateRemainderData = await birthdayRemainder.updateOne({ BrId: BrId },{$set: birthdayData} );
        if (updateRemainderData) {
            return res.status(200).json({ success: true, message: "Birthday data updated successfully." });
        } else {
            return res.status(400).json({ success: false, message: "Birthday data was not updated." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/deleteBirthdayRemainder', async ( req, res ) => {
    try {
        const { BrId } = req.body;
        const deleteBirthdayRemainder = await birthdayRemainder.findOneAndDelete({ BrId: BrId });
        if (deleteBirthdayRemainder) {
            return res.status(200).json({ success: true, message: "Birthday data was deleted successfully." });
        } else {
            return res.status(400).json({ success: false, message: "Birthday data was not deleted." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

export default router;
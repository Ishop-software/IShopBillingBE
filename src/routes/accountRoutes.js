import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { accountDetails } from '../models/AccountDetailsModel.js';

const router = express.Router();

router.post('/api/users/createAccount', async ( req, res ) => {
    try {
        const data = req.body;
        data["accountId"] = uuidv4();
        const mobileNo = data.mobileNo;
        const email = data.email;
        const checkMob = await accountDetails.findOne({ mobileNo: mobileNo });
        const checkEmail = await accountDetails.findOne({ email: email})
        if (checkMob) {
            return res.status(404).json({ success: false, message: "This mobile number is already registered.."})
        }
        if (checkEmail) {
            return res.status(404).json({ success: false, message: "This email is already registered.." });
        }
        const createAccount = await accountDetails.create(data);
        if (createAccount) {
            return res.status(200).json({ success: true, message: "Account created successfully.." });
        } else {
            return res.status(404).json({ success: false, message: "Account not created.."})
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.get('/api/users/getAllAccountDetails', async (req, res) => {
    try {
        const getAllAccountDetails = await accountDetails.find({},{_id: 0, __v: 0});
        if (getAllAccountDetails.length === 0) {
            return res.status(404).json({ success: false, message: 'Sone problem in getting account details!' });
        } else {
            return res.status(200).json({ success: true, data: getAllAccountDetails });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

export default router;
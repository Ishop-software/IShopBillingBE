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

router.put('/api/updateAccountDetails', async ( req, res ) => {
    try {
        const data = req.body;
        const accountId = data.accountId;
        console.log(accountId)
        const updateAccountDetails = await accountDetails.findOneAndUpdate({accountId: accountId},{$set:data});
        if(!updateAccountDetails) {
            return res.status(404).json({ success: false, message: "data not updated!" });
        } else {
            return res.status(200).json({ success: true, message: "data updated successfully!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/api/deleteAccountDetails', async ( req, res ) => {
    try {
        const { accountId } = req.body;
        const deleteAccountDetails = await accountDetails.findOneAndDelete({ accountId: accountId });
        if(!deleteAccountDetails) {
            return res.status(404).json({ success: false, message: "data not deleted!" });
        } else {
            return res.status(200).json({ success: true, message: "data deleted successfully!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Twilio from 'twilio/lib/rest/Twilio.js';
import { accountDetails } from '../models/AccountDetailsModel.js';
import { createMongoDump } from '../utils/helper.js';

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

router.post('/api/users/getAllAccountDetails', async (req, res) => {
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

router.post('/api/sendingSMS', async ( req, res ) => {
    try {
        const { message, sendMsg, toMobileNo } = req.body;
            const client = new Twilio(process.env.TWILIO_ACCOUNT_ID,process.env.TWILIO_AUTH_TOKEN);

            const sendMessage = client.messages.create({
                body: `Hi this is sundaresh from Ishop Software Solution \n message: \n ${message} \n address: \n ${sendMsg}`,
                from: process.env.FROM_MOB,
                to: toMobileNo
            })
            .then(message => { return res.status(200).json({ success: true, message: message }) })
            .catch(error => { return res.status(404).json({ success: false, error: error }) })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/sendingWhatsappMsg', async ( req, res ) => {
    try {
        const { message, sendMsg, toMobileNo } = req.body;
        const client = new Twilio(process.env.TWILIO_ACCOUNT_ID,process.env.TWILIO_AUTH_TOKEN);

        const sendingWhatsappMsg = client.messages.create({
            body: `Hi this is sundaresh from Ishop Software Solution \n message: \n ${message} \n address: \n ${sendMsg}`,
            from: `whatsapp:${process.env.FROM_WHATSAPP_MOB}`,
            to: `whatsapp:${toMobileNo}`
        })
        .then(message => { return res.status(200).json({ success: true, message: message.sid }) })
        .catch(error => console.log(error) )
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

router.get('/api/getMongoDump', async ( req, res ) => {
    try {
        createMongoDump()
        .then( message => {return res.status(200).json({ success: true, message: "Mongodump was taken successfully." }) })
        .catch( error => { return res.status(404).json({ success: false, message: "Mongodump hasn't taken." }) })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

export default router;
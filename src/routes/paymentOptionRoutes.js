import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { paymentOption } from '../models/PaymentOptionModel.js';
import { authenticate } from '../middleware/middleware.js';
import { getUserIdFromToken } from '../helper/generateToken.js';
import { salesRegister } from '../models/SalesModel.js';
import { purchaseRegister } from '../models/PurchaseModel.js';

const router = express.Router();

router.post('/api/payment/addPaymentOption', authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const { cartAmt1, cardAmt2, eWalletAmt, chequeAmt } = req.body;

        const paymentData = req.body;
        const paymentId = uuidv4()

        paymentData['userId'] = userId;
        paymentData['paymentId'] = paymentId;
        paymentData['cartAmt1'] = cartAmt1 ? cartAmt1 : null;
        paymentData['cardAmt2'] = cardAmt2 ? cardAmt2 : null;
        paymentData['eWalletAmt'] = eWalletAmt ? eWalletAmt : null;
        paymentData['chequeAmt'] = chequeAmt ? chequeAmt : null;
        const addPaymentOption = await paymentOption.create(paymentData)
        .then(() => { return res.status(200).json({ success: true, message: "Payment data created successfully.." })})
        .catch((error) => { return res.status(400).json({ success: false, message: error.message }) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/payment/getAllPaymentOptions', authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const getAllPaymentOptions = await paymentOption.find({ userId: userId },{_id:0,__v:0, createdAt:0, updatedAt:0});
        if (getAllPaymentOptions) {
            return res.status(200).json({ success: true, data: getAllPaymentOptions });
        } else {
            return res.status(404).json({ success: false, message: "There is no payment data for this user.." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/pament/getPaymentOptions', authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const { paymentId } = req.body;

        const getPaymentOptions = await paymentOption.findOne({ userId: userId, paymentId: paymentId }, { _id:0, __v:0, createdAt:0, updatedAt:0 });
        if (getPaymentOptions) {
            return res.status(200).json({ success: true, data: getPaymentOptions });
        } else {
            return res.status(404).json({ success: false, message: "There is no payment data for this specific paymentId.." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/payment/updatePaymentOptions', authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const updateData = req.body;
        const { paymentId } = req.body;

        const updatePaymentOptions = await paymentOption.findOneAndUpdate({ userId: userId, paymentId: paymentId },{ $set: updateData })
        .then(() => { return res.status(200).json({ success: true, message: "Payment data updated successfully.." }) })
        .catch(() => { return res.status(404).json({ success: false, message: "Payment data not updated.." }) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/payment/deletePaymentOptions', authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const { paymentId } = req.body;

        const deletePaymentOptions = await paymentOption.findOneAndDelete({ userId: userId, paymentId: paymentId })
        .then(() => { return res.status(200).json({ success: true, message: "Payment data deleted successfully.." }) })
        .catch(() => { return res.status(400).json({ success: false, message: "There is no data deleted.." }) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
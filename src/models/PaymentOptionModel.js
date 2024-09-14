import mongoose from "mongoose";

var Schema = mongoose.Schema;

export const paymentOption = mongoose.model("PaymentOptions", new Schema(
    {
        userId: String,
        saleORpurchase: String,
        id: String,
        paymentId: String,
        paymentMethod: String,
        cashAmt: Number,
        cardAmt1: {
            cardAmt1: Number,
            cardAccount: String,
            transactionRefNo: Number
        },
        cardAmt2: {
            cardAmt2: Number,
            cardAccount: String,
            transactionRefNo: Number
        },
        eWalletAmt: {
            eWalletAmt: Number,
            cardAccount: String,
            transactionRefNo: Number
        },
        chequeAmt: {
            chequeAmt: Number,
            cardAccount: String,
            transactionRefNo: Number
        },
        chequeNo: Number,
        bankName: String,
        date: Date,
        redeemPoints: Number
    },
    { timestamps: true }
), "PaymentOptions");
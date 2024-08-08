import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const User = mongoose.model("userRegisterData", new Schema ({
    activationkey: String,
    isFirstLogin: Boolean,
    companyName: { required: true , type: String },
    userId: String,
    name: { required: true , type: String },
    mobileNo: { required: true , type: String },
    email: { required: true , type: String, lowercase: true},
    password: { required: true, type: String },
    subscription:{
        planName: String,
        isFreeTrial: Boolean,
        isFreeTrialUsed: Boolean,
        paymentFrequency: String,
        startDate: String,
        endDate: String,
        paymentDetails:{
          transactionId: String,
          amount: Number,
          currency: String,
          paymentDate: String
        },
        paymentLogs: Array,
    },
}), "userRegisterData");
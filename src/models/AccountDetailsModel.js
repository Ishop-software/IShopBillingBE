import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const accountDetails = mongoose.model("AccountDetails",new Schema({
    userId: String,
    accountId: String,
    name: String,
    printAs: String,
    group: String,
    openingBal: Number,
    DR_CR: String,
    taxNo: String,
    Address1: String,
    Address2: String,
    city: String,
    pincode: Number,
    state: String,
    stateCode: String,
    mobileNo: String,
    phone: String,
    email: String,
    contactPerson: String,
    panCardNo: String,
    },
    { timestamps: true }
), "AccountDetails");
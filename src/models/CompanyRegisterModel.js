import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const companyUserRegister = mongoose.model("companyUserRegister", new Schema ({
    companyUserId: String,
    companyName: String,
    addressLineOne: String,
    addressLineTwo: String,
    city: String,
    pinCode: { type: String, required: true, maxlength: 6 },
    countryIsd: String,
    taxationSystem: String,
    taxNo: String,
    state: String,
    mobileNo: String, 
    phone: String, 
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    website: String,
    sendDataBackupOnSameMailId: Boolean,
    trade: String,
    other: String,
    engineerName: String,
    engineerContactNo: String,
    authPartnerCode: String,
    dateFormat: { type: String, default: "DD/MM/YYYY" },
    booksStartOn: String,
    yearClosingDate: String,
}), "companyUserRegister");
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const chargesRegister = mongoose.model("chargesRegisterData", new Schema({
    chargeRegId: String,
    chargesHeading: String,
    printAs: String,
    accountHeadToPost: String,
    typesOfCharges: String,
    inputAmountOfChargesAs: String,
    taxSettings: Array,
}), "chargesRegisterData");
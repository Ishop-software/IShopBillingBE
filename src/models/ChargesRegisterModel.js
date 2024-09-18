import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const chargesRegister = mongoose.model("chargesRegisterData", new Schema({
    userId: String,
    chargeRegId: String,
    chargesHeading: String,
    printAs: String,
    accountHeadToPost: String,
    typesOfCharges: String,
    typesOfCharges1: Object,
    inputAmountOfChargesAs: String,
    taxSettings: Object,
}), "chargesRegisterData");
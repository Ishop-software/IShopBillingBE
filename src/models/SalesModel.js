import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const salesRegister = mongoose.model("salesRegisterData", new Schema({
    saleRegId: String,
    partyName: String,
    billNo: Number,
    dueDate: Date,  
    itemName: String,
    qty: Number,
    altQty: Number,
    free: Number,
    per: String,  
    rate: Number,
    discAmount: Number,
    basicAmount: Number,
    taxAmount: Number,
    discs: Number,
    netValue: Number,
    otherCharges: Number,
    remarks: String,  
    onValue: Number,  
    at: String, 
    plusMinus: String,  
    amount: Number,  
}), "salesRegisterData");

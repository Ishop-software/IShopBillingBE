import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const purchaseRegister = mongoose.model("purchaseRegisterData", new Schema ({
    purchaseRegId: String,
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
    otherCharges: String,
    remarks: String,  
    onValue: Number,  
    at: String, 
    plusMinus: String,  
    amount: Number,  
}), "purchaseRegisterData")
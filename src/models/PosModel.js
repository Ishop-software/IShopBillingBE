import mongoose from "mongoose";

var Schema = mongoose.Schema;

export const POSModel = mongoose.model('POS', new Schema (
    {
        userId: String,
        posId: String,
        customerName: String,
        billNo: Number,
        date: Date,
        customerMob: String,
        itemName: String,
        barcode: String,
        qty: Number,
        basicAmount: Number,
        price: Number,
        discount: Number,
        discountAmount: Number,
        taxAmount: Number,
        totalAmount: Number
    },
    {
        timestamps: true
    }
), "POS" );
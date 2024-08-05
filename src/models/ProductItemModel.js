import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const ProductItem = mongoose.model("ProductItemData", new Schema ({
    productItemId: String,
    itemName: { type: String, required: true },
    shortName: String,
    HSNCode: String,
    taxSlab: { type: Number, required: true },
    primaryUnit: String,
    company: String,
    uploadImage: String, 
    maintainBatch: { type: Boolean, default: false },
    group: String,
    seriolNoTracking: { type: Boolean, default: false },
    variation: String,
    color: String,
    size: String,
    expDate: Date,
    mfgDate: Date,
    purchase: Number,
    salePrice: Number,
    mrp: Number,
    basicPrice: Number,
    selfVal: Number,
    minSalePrice: Number,
    barcode: String,
    openingPck: Number,
    openingValue: Number,
    delete: { type: Boolean, default: false },
    copy: { type: Boolean, default: false },
    details: String
}), "ProductItemData");
import mongoose, { model } from "mongoose";

const Schema = mongoose.Schema;

export const salesRegister = mongoose.model("salesRegisterData", new Schema ({
    sal_reg_id: String,
    party_name: { type: String, required: true },
    no: { type: Number, required: true },
    due_date: { type: String, required: true },
    item_name: { type: String, required: true },
    qty: { type: Number, required: true },
    alt_qty: { type: Number, required: true },
    free: { type: Number, required: true },
    rate: { type: Number, required: true },
    per: { type: Number, required: true },
    basic_amount: { type: Number, required: true },
    disc: { type: Number, required: true },
    disc_amount: { type: Number, required: true },
    tax_amount: { type: Number, required: true },
    net_value: { type: Number, required: true },
}), "salesRegisterData");
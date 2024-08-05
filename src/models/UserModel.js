import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const User = mongoose.model("userRegisterData", new Schema ({
    activationkey: Number,
    userId: String,
    name: { required: true , type: String },
    mobileNo: { required: true , type: String },
    email: { required: true , type: String, lowercase: true},
    password: { required: true, type: String },
}), "userRegisterData");
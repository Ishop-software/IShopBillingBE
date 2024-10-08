import mongoose from "mongoose";
import userRoutes from "../routes/userRouter.js";
import productItemRoutes from "../routes/productItemsRoutes.js";
import accountRoutes from "../routes/accountRoutes.js";
import companyRegisterRoutes from "../routes/companyRegisterRoutes.js";
import birthdayRemainderRoutes from "../routes/birthdayRemainderRoutes.js"
import salesRoutes from "../routes/salesRoutes.js";
import chargesRoutes from "../routes/chargesRoutes.js";
import purchaseRoutes from "../routes/purchaseRoutes.js";
import paymentRoutes from '../routes/paymentOptionRoutes.js';
import posRoutes from '../routes/posRoutes.js';
import dotenv from "dotenv";
dotenv.config();

const db = mongoose.connect(process.env.DBConnection)

if (db) {
    console.log("DataBase Connected Successfully!");
} else {
    console.log("Database Does Not Connected!");
}

export const apiHelper = (app) => {
    app.use(userRoutes);
    app.use(productItemRoutes);
    app.use(accountRoutes);
    app.use(companyRegisterRoutes);
    app.use(birthdayRemainderRoutes);
    app.use(salesRoutes);
    app.use(purchaseRoutes);
    app.use(chargesRoutes);
    app.use(paymentRoutes);
    app.use(posRoutes)
};
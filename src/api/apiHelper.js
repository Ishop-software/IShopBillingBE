import mongoose from "mongoose";
import userRoutes from "../routes/userRouter.js";
import productItemRoutes from "../routes/productItemsRoutes.js";
import accountRoutes from "../routes/accountRoutes.js";
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
};
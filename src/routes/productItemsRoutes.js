import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { ProductItem } from "../models/ProductItemModel.js";

const router = express.Router();

router.post("/api/addProductItem", async (req, res) => {
    try {
        const prdouctDataList = req.body;
        const randomId = uuidv4();
        prdouctDataList["productItemId"] = randomId;
        const CreateProductData = await ProductItem.create(prdouctDataList);
        return res.status(200).json({ success: false, message: "Product Item Created Successfully!", data: CreateProductData });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

export default router;
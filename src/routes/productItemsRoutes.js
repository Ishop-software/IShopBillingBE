import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { ProductItem } from "../models/ProductItemModel.js";

const router = express.Router();

// Add Product Items
router.post("/api/productitems/addProductItem", async (req, res) => {
    try {
        const prdouctDataList = req.body;
        const randomId = uuidv4();
        prdouctDataList["productItemId"] = randomId;
        const CreateProductData = await ProductItem.create(prdouctDataList);
        return res.status(200).json({ success: true, message: "Product Item Created Successfully!", productItemId: CreateProductData.productItemId });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

// Get All Product Item List
router.post("/api/productitems/getAllProductItems", async (req, res) => {
    try {
        const findAllProductItems = await ProductItem.find({});
        if (findAllProductItems) {
            return res.status(200).json({ success: true, message: findAllProductItems });
        } else {
            return res.status(404).json({ success: true, message: "Product Item List Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

// Get Product Item
router.post("/api/productitems/getProductItem", async (req, res) => {
    try {
        const prdouctDataList = req.body;
        const getProductId =  prdouctDataList.productItemId;
        const findProductId = await ProductItem.findOne({ productItemId: getProductId });
        if (findProductId) {
            return res.status(200).json({ success: true, message: findProductId });
        } else {
            return res.status(404).json({ success: true, message: "Product Item Data Id Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

// Update Product Item 
router.put("/api/productitems/updateProductItem", async (req, res) => {
    try {
        const prdouctDataList = req.body;
        const getProductId = prdouctDataList.productItemId;
        const updateProduct = await ProductItem.findOneAndUpdate({ productItemId: getProductId }, { $set: prdouctDataList });
        if (updateProduct) {
            return res.status(200).json({ success: true, message: "Product Item Updated Successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Product Item Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Delete Product Item
router.delete("/api/productitems/deleteProductItem", async (req, res) => {
    try {
        const prdouctDataList = req.body;
        const getProductId = prdouctDataList.productItemId; 
        const delProductItem = await ProductItem.deleteOne({ productItemId: getProductId });
        if (delProductItem.deletedCount ===1) {
            return res.status(200).json({ success: true, message: "Product Item Id Deleted Successfully!" })
        } else {
            return res.status(404).json({ success: false, message: "Product Item Id Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

export default router;
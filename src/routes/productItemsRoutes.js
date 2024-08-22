import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { ProductItem } from "../models/ProductItemModel.js";
import { authenticate } from "../middleware/middleware.js";
import { getUserIdFromToken } from "../helper/generateToken.js";

const router = express.Router();

// Add Product Items
router.post("/api/productitems/addProductItem", async (req, res) => {
    try {
        const prdouctDataList = req.body;
        const { itemName, company, userId } = req.body;
        const checkConditions = await ProductItem.findOne({ userId: userId, itemName: itemName, company: company });
        if (checkConditions) {
            return res.status(404).json({ success: false, message: "Given item already excist.." });
        }
        const randomId = uuidv4();
        prdouctDataList["productItemId"] = randomId;
        const CreateProductData = await ProductItem.create(prdouctDataList);
        return res.status(200).json({ success: true, message: "Product Item Created Successfully!", productItemId: CreateProductData.productItemId });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

// Get All Product Item List
router.post("/api/productitems/getAllProductItems", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const findAllProductItems = await ProductItem.find({ userId: userId });
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
router.post("/api/productitems/getProductItem", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const { productItemId, itemName, HSNCode, company } = req.body;
        const findProductId = await ProductItem.findOne(
            { 
                userId: userId,
                productItemId: productItemId, 
                itemName: itemName,
                HSNCode: HSNCode, 
                company: company
            },{_id:0,__v:0,createAt:0,updatedAt:0}
        );
        if (findProductId) {
            return res.status(200).json({ success: true, message: findProductId });
        } else {
            return res.status(404).json({ success: true, message: "Product Data Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

// Update Product Item 
router.put("/api/productitems/updateProductItem", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const prdouctDataList = req.body;
        const getProductId = prdouctDataList.productItemId;
        const updateProduct = await ProductItem.findOneAndUpdate({ productItemId: getProductId, userId: userId }, { $set: prdouctDataList });
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
router.post("/api/productitems/deleteProductItem", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const { productItemId }= req.body;
        const delProductItem = await ProductItem.findOneAndDelete({ productItemId: productItemId, userId: userId });
        if (delProductItem) {
            return res.status(200).json({ success: true, message: "Product Item Id Deleted Successfully!" })
        } else {
            return res.status(404).json({ success: false, message: "Product Item Id Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

export default router;
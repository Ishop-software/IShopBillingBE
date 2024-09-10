import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { ProductItem } from "../models/ProductItemModel.js";
import { authenticate } from "../middleware/middleware.js";
import { getUserIdFromToken } from "../helper/generateToken.js";
import { Parser } from "json2csv";
import fs from "fs";
import path from "path";
import multer from "multer";
import XLSX from 'xlsx';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Add Product Items
router.post("/api/productitems/addProductItem", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const prdouctDataList = req.body;
        prdouctDataList["userId"] = userId;
        const { itemName, company} = req.body;
        const checkConditions = await ProductItem.findOne({ userId: userId, itemName: itemName, company: company });
        if (checkConditions) {
            return res.status(404).json({ success: false, message: "Given item already excist.." });
        }
        const randomId = uuidv4();
        prdouctDataList["productItemId"] = randomId;
        const CreateProductData = await ProductItem.create(prdouctDataList);
        return res.status(200).json({ success: true, message: "Product Item Created Successfully!", productItemId: CreateProductData.productItemId });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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

router.post("/api/exportProtuctItemData", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const exportData = await ProductItem.find({ userId: userId });
        const date = new Date();

        const fields = [
            "userId",
            "productItemId",
            "itemName",
            "shortName",
            "HSNCode",
            "taxSlab",
            "primaryUnit",
            "company",
            "uploadImage",
            "maintainBatch",
            "group",
            "seriolNoTracking",
            "variation",
            "color",
            "size",
            "expDate",
            "mfgDate",
            "purchase",
            "salePrice",
            "mrp",
            "basicPrice",
            "selfVal",
            "minSalePrice",
            "barcode",
            "openingPck",
            "openingValue",
            "delete",
            "copy",
            "details"
        ];

        const option = { fields };

        const parser = new Parser(option);
        const csv = parser.parse(exportData);

        const directory = "C:/ISHOP/ProductItemsDataExports";
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        const location = path.join( directory, `ProductItem-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.csv`);
        fs.writeFileSync(location, csv);

        return res.status(200).json({ success: true, message: "Data exported successfully..", path: location });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/importProductItemDate", upload.single('file'), async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file Uploaded." });
        } else {
            const workBook = XLSX.read(req.file.buffer, { type: "buffer" });
            const sheetName = workBook.SheetNames[0];
            const workSheet = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);

            const newProductItem = workSheet.map((row) => {
                const productItemId = uuidv4();
                return {
                    userId: row.userId ? row.userId : userId,
                    productItemId: row.productItemId ? row.productItemId : productItemId,
                    itemName: row.itemName,
                    shortName: row.shortName,
                    HSNCode: row.HSNCode,
                    taxSlab: row.taxSlab,
                    primaryUnit: row.primaryUnit,
                    company: row.company,
                    uploadImage: row.uploadImage,
                    maintainBatch: row.maintainBatch,
                    group: row.group,
                    seriolNoTracking: row.seriolNoTracking,
                    variation: row.variation,
                    color: row.color,
                    size: row.size,
                    expDate: row.expDate,
                    mfgDate: row.mfgDate,
                    purchase: row.purchase,
                    salePrice: row.salePrice,
                    mrp: row.mrp,
                    basicPrice: row.basicPrice,
                    selfVal: row.selfVal,
                    minSalePrice: row.minSalePrice,
                    barcode: row.barcode,
                    openingPck: row.openingPck,
                    openingValue: row.openingValue,
                    delete: row.delete,
                    copy: row.copy,
                    details: row.details
                }
            });
            const insertDatas = await ProductItem.insertMany(newProductItem);
            if(!insertDatas) {
                return res.status(400).json({
                    success: false,
                    message: "Error in importing data into DB."
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Successfully imported..."
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
import express from "express";
import { v4 as uuidv4 } from "uuid";
import Twilio from "twilio/lib/rest/Twilio.js";
import XLSX from "xlsx";
import multer from "multer";
import { Parser, parse } from "json2csv";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { accountDetails, groupAccount } from "../models/AccountDetailsModel.js";
import { User } from "../models/UserModel.js";
import { createMongoDump } from "../utils/helper.js";
import { authenticate } from "../middleware/middleware.js";
import { getUserIdFromToken } from "../helper/generateToken.js";
import { Account } from "../models/AccountDetailsModel.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/api/checkServer", async (req, res) => {
    return res.send("Server is live...");
});

router.post("/api/users/createAccount", authenticate, async (req, res) => {
    try {
        const token = req.header("Authorization");
        const userId = getUserIdFromToken(token);
        const data = req.body;
        data["accountId"] = uuidv4();
        data["userId"] = userId;
        const mobileNo = data.mobileNo;
        const email = data.email;
        const checkMob = await accountDetails.findOne({ mobileNo: mobileNo });
        const checkEmail = await accountDetails.findOne({ email: email });
        if (checkMob) {
            return res.status(404).json({
                success: false,
                message: "This mobile number is already registered..",
            });
        };
        if (checkEmail) {
            return res.status(404).json({
                success: false,
                message: "This email is already registered..",
            });
        };
        const createAccount = await accountDetails.create(data);
        if (createAccount) {
            return res.status(200).json({ 
                success: true,
                message: "Account created successfully.." 
            });
        } else {
            return res.status(404).json({ 
                success: false, 
                message: "Account wasn't created.." 
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error!" 
        });
    }
});

router.post("/api/users/getAccountDetails", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const {accountId} = req.body;
        const getAccountDetails = await accountDetails.findOne({ userId: userId, accountId: accountId },{__v:0, _id:0, createdAt:0, updatedAt:0});
        if (getAccountDetails) {
            return res.status(200).json({ success: true, data: getAccountDetails });
        } else {
            return res.status(500).json({ success: false, message: "Can't find account data for this user.." });    
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/users/getAllAccountDetails", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const getAllAccountDetails = await accountDetails.find(
            { userId: userId },
            { _id: 0, __v: 0, createdAt:0, updatedAt:0 }
        );
        if (getAllAccountDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Sone problem in getting account details!",
            });
        } else {
            return res
                .status(200)
                .json({ success: true, data: getAllAccountDetails });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error!" });
    }
});

router.put("/api/users/updateAccountDetails", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const data = req.body;
        const { email, mobileNo, accountId } = data;      
        const checkMail = await accountDetails.findOne({ userId: userId, email: email });
        const checkMob = await accountDetails.findOne({ userId: userId, mobileNo: mobileNo });
        if( checkMail && checkMail.accountId !== accountId ) {
            return res.status(404).json({
                success: false,
                message: "This email is already registered..",
            });
        }
        if (checkMob && checkMob.accountId !== accountId ) {
            return res.status(404).json({
                success: false,
                message: "This mobile number is already registered..",
            });
        };
        const updateAccountDetails = await accountDetails.findOneAndUpdate(
            { userId: userId, accountId: accountId },
            { $set: data }
        );
        if (!updateAccountDetails) {
            return res.status(404).json({ 
                success: false, 
                message: "data not updated!" 
            });
        } else {
            return res.status(200).json({ 
                success: true, 
                message: "data updated successfully!" 
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

router.delete("/api/users/deleteAccountDetails", authenticate, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        const { accountId } = req.body;
        const deleteAccountDetails = await accountDetails.findOneAndDelete(
            { userId: userId, accountId: accountId } 
        );
        if (!deleteAccountDetails) {
            return res.status(404).json({ 
                success: false, 
                message: "data not deleted!" 
            });
        } else {
            return res.status(200).json({ 
                success: true, 
                message: "data deleted successfully!" 
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/sendingSMS", async (req, res) => {
    try {
        const { message, sendMsg, toMobileNo } = req.body;
        const client = new Twilio(
            process.env.TWILIO_ACCOUNT_ID,
            process.env.TWILIO_AUTH_TOKEN
        );

        const sendMessage = client.messages
            .create({
                body: `Hi this is sundaresh from Ishop Software Solution \n message: \n ${message} \n address: \n ${sendMsg}`,
                from: process.env.FROM_MOB,
                to: toMobileNo,
            })
            .then((message) => {
                return res.status(200).json({ success: true, message: message });
            })
            .catch((error) => {
                return res.status(404).json({ success: false, error: error });
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/sendingWhatsappMsg", async (req, res) => {
    try {
        const { message, sendMsg, toMobileNo } = req.body;
        const client = new Twilio(
            process.env.TWILIO_ACCOUNT_ID,
            process.env.TWILIO_AUTH_TOKEN
        );

        const sendingWhatsappMsg = client.messages
            .create({
                body: `Hi this is sundaresh from Ishop Software Solution \n message: \n ${message} \n address: \n ${sendMsg}`,
                from: `whatsapp:${process.env.FROM_WHATSAPP_MOB}`,
                to: `whatsapp:${toMobileNo}`,
            })
            .then((message) => {
                return res.status(200).json({ success: true, message: message.sid });
            })
            .catch((error) => console.log(error));
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post(
    "/api/importExcelDataInAccount",
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    success: false, 
                    message: "No file uploaded." 
                });
            }
            const workBook = XLSX.read(req.file.buffer, { type: "buffer" });
            const sheetName = workBook.SheetNames[0];
            const workSheet = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);

            const newAccount = workSheet.map((row) => {
                const accountId = uuidv4();
                return {
                    accountId: accountId,
                    name: row.name,
                    printAs: row.ptintAs,
                    group: row.group,
                    openingBal: row.openingBal,
                    DR_CR: row.DR_CR,
                    taxNo: row.taxNo,
                    Address1: row.Address1,
                    city: row.city,
                    pincode: row.pincode,
                    state: row.state,
                    stateCode: row.stateCode,
                    mobileNo: row.mobileNo,
                    phone: row.phone,
                    email: row.email,
                    contactPerson: row.contactPerson,
                    panCardNo: row.panCardNo,
                };
            });

            await accountDetails.insertMany(newAccount);

            return res.status(200).json({ 
                success: true, 
                message: "Successfully imported.." 
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
);

router.post("/api/exportDataIntoExcelInAccount", async (req, res) => {
    try {
        const exportData = await accountDetails.find();
        const date = new Date();

        const fields = [
            "accountId",
            "name",
            "printAs",
            "group",
            "openingBal",
            "DR_CR",
            "taxNo",
            "Address1",
            "city",
            "pincode",
            "state",
            "stateCode",
            "mobileNo",
            "email",
            "contactPerson",
        ];
        const option = { fields };

        const parser = new Parser(option);
        const csv = parser.parse(exportData);

        const directory = "C:/ISHOP/AccountExports";
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        const location = path.join(
            directory,
            `Account-${date.getDate()}-${date.getMonth() + 1
            }-${date.getFullYear()}.csv`
        );

        fs.writeFileSync(location, csv);

        return res.status(200).json({
            success: true,
            message: "Data exported successfully.",
            path: location,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/api/getMongoDump", async (req, res) => {
    try {
        createMongoDump()
            .then((message) => {
                return res.status(200).json({
                    success: true,
                    message: "Mongodump was taken successfully.",
                });
            })
            .catch((error) => {
                return res
                    .status(404)
                    .json({ success: false, message: "Mongodump hasn't taken." });
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/api/mongoDBToSql", async (req, res) => {
    const sqlConnection = {
        host: "localhost",
        user: "root",
        password: "@Hitzz158",
        database: "dummyDatabase",
    };
    try {
        const collection = User;
        const date = new Date();
        const accountData = await collection.find({}, { _id: 0, __v: 0 });
        console.log(accountData);

        const mysqlConnection = await mysql.createConnection(sqlConnection);
        const sqlPromises = accountData.map(async (doc) => {
            const keys = Object.keys(doc)
                .map((keys) => `${keys}`)
                .join(", ");
            const values = Object.values(doc).map((values) => {
                if (typeof values === "string") {
                    return mysqlConnection.escape(values);
                } else if (typeof values === "object" && values !== null) {
                    return mysqlConnection.escape(JSON.stringify(values));
                } else {
                    return values;
                }
            });

            const sql = `INSERT INTO AccountDetail (${keys}) VALUES (${values.join(
                ","
            )});`;

            return mysqlConnection.execute(sql);
        });
        await Promise.all(sqlPromises);
        console.log(sqlPromises);

        await mysqlConnection
            .end()
            .then((message) => {
                return res.status(200).json({
                    success: true,
                    message: "Data transfered to sql completely.",
                });
            })
            .catch((error) => {
                return res.status(404).json({ success: false, message: error.message });
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Group Account Creations

router.post("/api/groupaccounts/addGroupAccount", async (req, res) => {
    try {
        const groupAccountData = req.body;
        const createGroupAccId = uuidv4();
        groupAccountData["groupAccountId"] = createGroupAccId;
        const newGroupAccount = await groupAccount.create(groupAccountData);
        if (newGroupAccount) {
            return res.status(200).json({ success: true, message: "Account Group Data Added Successfully!", groupAccountId: newGroupAccount.groupAccountId });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/groupaccounts/getAllGroupAccount", async (req, res) => {
    try {
        const findAllGroupAccount = await groupAccount.find({});
        if (findAllGroupAccount) {
            return res.status(200).json({ success: true, message: findAllGroupAccount });
        } else {
            return res.status(404).json({ success: true, message: "Group Account List Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post("/api/groupaccounts/getGroupAccountId", async (req, res) => {
    try {
        const groupAccountData = req.body; 
        const getGroupAccountId = groupAccountData.groupAccountId;
        const findGroupAccountId = await groupAccount.findOne({ groupAccountId: getGroupAccountId });
        if (findGroupAccountId) {
            return res.status(200).json({ success: true, message: findGroupAccountId });
        } else {
            return res.status(404).json({ success: true, message: "Group Account Id Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.put("/api/groupaccounts/updateGroupAccountId", async (req, res) => {
    try {
        const groupAccountData = req.body;
        const getGroupAccountId = groupAccountData.groupAccountId;
        const findUpdateData = await groupAccount.findOneAndUpdate({ groupAccountId: getGroupAccountId }, { $set: groupAccountData });
        if (findUpdateData) {
            return res.status(200).json({ success: true, message: "Group Account Data Updated Successfully!" });
        } else {
            return res.status(404).json({ success: true, message: "Group Account Data Id Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.delete("/api/groupaccounts/deleteGroupAccountId", async (req, res) => {
    try {
        const groupAccountData = req.body;
        const getGroupAccountId = groupAccountData.groupAccountId;
        const findGroupAccountId = await groupAccount.findOneAndDelete({ groupAccountId: getGroupAccountId });
        if (findGroupAccountId) {
            return res.status(200).json({ success: true, message: "Group Account Data Id Deleted Successfully!" });
        } else {
            return res.status(404).json({ success: true, message: "Group Account Data Id Is Not Found!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

export default router;

//For NEW ACCOUNT

router.post("/api/importNewData", authenticate, upload.single("file"), async (req, res) => {
    try {
        const token = req.header('Authorization');
        const userId = getUserIdFromToken(token);
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file Uploaded."
            });
        }
        const workBook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workBook.SheetNames[0];
        const workSheet = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
        
        const newAccount = workSheet.map((row) => {
            const accountId = uuidv4();
            return {
                userId: userId,
                AccountId: accountId,
                GroupName: row.GroupName ? row.GroupName : null ,
                AccountName: row.AccountName ? row.AccountName : null ,
                OpBal: row.OpBal ? row.OpBal : null ,
                Dr_Cr: row.Dr_Cr ? row.Dr_Cr : null ,
                AddressLine1: row.AddressLine1 ? row.AddressLine1 : null ,
                AddressLine2: row.AddressLine2 ? row.AddressLine2 : null ,
                City: row.City ? row.City : null ,
                State: row.State ? row.State : null ,
                Phone: row.Phone ? row.Phone : null ,
                Mobile: row.Mobile ? row.Mobile : null ,
                Email: row.Email ? row.Email : null ,
                ContactPerson: row.ContactPerson ? row.ContactPerson : null ,
                Birthday: row.Birthday ? row.Birthday : null ,
                Anniversary: row.Anniversary ? row.Anniversary : null ,
                BankName: row.BankName ? row.BankName : null ,
                BankAccountNo: row.BankAccountNo ? row.BankAccountNo : null ,
                ChequePricingName: row.ChequePricingName ? row.ChequePricingName : null ,
                PartyType: row.PartyType ? row.PartyType : null ,
                VAT_NO: row.VAT_NO ? row.VAT_NO : null ,
                CST_NO: row.CST_NO ? row.CST_NO : null ,
                ITPAN: row.ITPAN ? row.ITPAN : null ,
                DL_No1: row.DL_No1 ? row.DL_No1 : null ,
                DL_NO2: row.DL_NO2 ? row.DL_NO2 : null ,
                BillByBill: row.BillByBill ? row.BillByBill : null ,
                CreditLimit: row.CreditLimit ? row.CreditLimit : null ,
                BillLimit: row.BillLimit ? row.BillLimit : null ,
                CreditDaysSale: row.CreditDaysSale ? row.CreditDaysSale : null ,
                CreditDaysPurchase: row.CreditDaysPurchase ? row.CreditDaysPurchase : null ,
                AdditionalField1: row.AdditionalField1 ? row.AdditionalField1 : null ,
                AdditionalField2: row.AdditionalField2 ? row.AdditionalField2 : null ,
                AdditionalField3: row.AdditionalField3 ? row.AdditionalField3 : null ,
                AdditionalField4: row.AdditionalField4 ? row.AdditionalField4 : null ,
                AdditionalField5: row.AdditionalField5 ? row.AdditionalField5 : null ,
                AdditionalField6: row.AdditionalField6 ? row.AdditionalField6 : null ,
                AdditionalField7: row.AdditionalField7 ? row.AdditionalField7 : null ,
                AdditionalField8: row.AdditionalField8 ? row.AdditionalField8 : null ,
                AdditionalField9: row.AdditionalField9 ? row.AdditionalField9 : null ,
                AdditionalField10: row.AdditionalField10 ? row.AdditionalField10 : null ,
                PrintName: row.PrintName ? row.PrintName : null ,
                GSTNo: row.GSTNo ? row.GSTNo : null ,
                UCardNo: row.UCardNo ? row.UCardNo : null ,
                MyOpBal: row.MyOpBal ? row.MyOpBal : null ,
                My_D_C: row.My_D_C ? row.My_D_C : null ,
                AadharNo: row.AadharNo ? row.AadharNo : null ,
                StateCode: row.StateCode ? row.StateCode : null ,
                Pincode: row.Pincode ? row.Pincode : null ,
                AccountID: row.AccountID ? row.AccountID : null 
            }
        });
        console.log(newAccount);

        const insertDatas = await Account.insertMany(newAccount);
        if(!insertDatas) {
            return res.status(400).json({
                success: false,
                message: "Error in importing data into DB."
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Successfully imported.."
            })
        }
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});
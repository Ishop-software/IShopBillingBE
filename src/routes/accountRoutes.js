import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Twilio from 'twilio/lib/rest/Twilio.js';
import XLSX from 'xlsx';
import multer from 'multer';
import { Parser,parse } from 'json2csv';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise'
import { accountDetails } from '../models/AccountDetailsModel.js';
import { User } from '../models/UserModel.js';
import { createMongoDump } from '../utils/helper.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/api/checkServer', async ( req, res ) => {
    return res.send("Server is live...");
})

router.post('/api/users/createAccount', async ( req, res ) => {
    try {
        const data = req.body;
        data["accountId"] = uuidv4();
        const mobileNo = data.mobileNo;
        const email = data.email;
        const checkMob = await accountDetails.findOne({ mobileNo: mobileNo });
        const checkEmail = await accountDetails.findOne({ email: email})
        if (checkMob) {
            return res.status(404).json({ success: false, message: "This mobile number is already registered.."})
        }
        if (checkEmail) {
            return res.status(404).json({ success: false, message: "This email is already registered.." });
        }
        const createAccount = await accountDetails.create(data);
        if (createAccount) {
            return res.status(200).json({ success: true, message: "Account created successfully.." });
        } else {
            return res.status(404).json({ success: false, message: "Account not created.."})
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.post('/api/users/getAllAccountDetails', async (req, res) => {
    try {
        const getAllAccountDetails = await accountDetails.find({},{_id: 0, __v: 0});
        if (getAllAccountDetails.length === 0) {
            return res.status(404).json({ success: false, message: 'Sone problem in getting account details!' });
        } else {
            return res.status(200).json({ success: true, data: getAllAccountDetails });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
});

router.put('/api/updateAccountDetails', async ( req, res ) => {
    try {
        const data = req.body;
        const accountId = data.accountId;
        const updateAccountDetails = await accountDetails.findOneAndUpdate({accountId: accountId},{$set:data});
        if(!updateAccountDetails) {
            return res.status(404).json({ success: false, message: "data not updated!" });
        } else {
            return res.status(200).json({ success: true, message: "data updated successfully!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/api/deleteAccountDetails', async ( req, res ) => {
    try {
        const { accountId } = req.body;
        const deleteAccountDetails = await accountDetails.findOneAndDelete({ accountId: accountId });
        if(!deleteAccountDetails) {
            return res.status(404).json({ success: false, message: "data not deleted!" });
        } else {
            return res.status(200).json({ success: true, message: "data deleted successfully!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/sendingSMS', async ( req, res ) => {
    try {
        const { message, sendMsg, toMobileNo } = req.body;
            const client = new Twilio(process.env.TWILIO_ACCOUNT_ID,process.env.TWILIO_AUTH_TOKEN);

            const sendMessage = client.messages.create({
                body: `Hi this is sundaresh from Ishop Software Solution \n message: \n ${message} \n address: \n ${sendMsg}`,
                from: process.env.FROM_MOB,
                to: toMobileNo
            })
            .then(message => { return res.status(200).json({ success: true, message: message }) })
            .catch(error => { return res.status(404).json({ success: false, error: error }) })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/sendingWhatsappMsg', async ( req, res ) => {
    try {
        const { message, sendMsg, toMobileNo } = req.body;
        const client = new Twilio(process.env.TWILIO_ACCOUNT_ID,process.env.TWILIO_AUTH_TOKEN);

        const sendingWhatsappMsg = client.messages.create({
            body: `Hi this is sundaresh from Ishop Software Solution \n message: \n ${message} \n address: \n ${sendMsg}`,
            from: `whatsapp:${process.env.FROM_WHATSAPP_MOB}`,
            to: `whatsapp:${toMobileNo}`
        })
        .then(message => { return res.status(200).json({ success: true, message: message.sid }) })
        .catch(error => console.log(error) )
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/importExcelDataInAccount', upload.single('file'), async ( req, res ) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }
        const workBook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workBook.SheetNames[0];
        const workSheet = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);

        const newAccount = workSheet.map( row => {
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
                panCardNo: row.panCardNo
            }
        });

        await accountDetails.insertMany(newAccount);
        
        return res.status(200).json({ success: true, message: "Successfully imported.." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/exportDataIntoExcelInAccount', async ( req, res ) => {
    try {
        const exportData = await accountDetails.find();
        const date = new Date();

        const fields = ['accountId','name','printAs','group','openingBal','DR_CR','taxNo','Address1','city','pincode','state','stateCode','mobileNo','email','contactPerson'];
        const option = { fields };

        const parser = new Parser(option);
        const csv = parser.parse(exportData);

        const directory = 'C:/ISHOP/AccountExports';
        if(!fs.existsSync(directory)){
            fs.mkdirSync(directory, { recursive: true });
        }

        const location = path.join(directory,`Account-${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}.csv`);

        fs.writeFileSync(location, csv);

        return res.status(200).json({ success: true, message: "Data exported successfully.", path: location });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/api/getMongoDump', async ( req, res ) => {
    try {
        createMongoDump()
        .then( message => {return res.status(200).json({ success: true, message: "Mongodump was taken successfully." }) })
        .catch( error => { return res.status(404).json({ success: false, message: "Mongodump hasn't taken." }) })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/mongoDBToSql', async ( req, res ) => {
    const sqlConnection = {
        host: 'localhost',
        user: 'root',
        password: '@Hitzz158',
        database: 'dummyDatabase'
    };
    try {
        const collection = User;
        const date = new Date();
        const accountData = await collection.find({},{_id:0,__v:0});
        console.log(accountData)

        const mysqlConnection = await mysql.createConnection(sqlConnection);
        const sqlPromises = accountData.map( async (doc) => {
            const keys = Object.keys(doc).map( keys => `${keys}`).join(', ');
            const values = Object.values(doc).map( values => {
                if ( typeof values === 'string' ) {
                    return mysqlConnection.escape(values);
                } else if ( typeof values === 'object' && values !== null ) {
                    return mysqlConnection.escape(JSON.stringify(values))
                } else {
                    return values;
                }
            });

            const sql = `INSERT INTO AccountDetail (${keys}) VALUES (${values.join(',')});`;

            return mysqlConnection.execute(sql)
        });
        await Promise.all(sqlPromises)
        console.log(sqlPromises)

        await mysqlConnection.end()
        .then(message => { return res.status(200).json({ success: true, message: "Data transfered to sql completely." })})
        .catch(error => { return res.status(404).json({ success: false, message: error.message })});
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
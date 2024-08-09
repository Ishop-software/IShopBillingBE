import express from "express";
import cron from 'node-cron';
import bodyParser from "body-parser";
import cors from "cors";
import { apiHelper } from "./src/api/apiHelper.js";
import { createMongoDump } from "./src/utils/helper.js";

const app = express();

const PORT = process.env.PORT;

cron.schedule('0 0 * * 1', () => {
  console.log('Running weekly mongoDump...');
  createMongoDump();
})

// app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({
  extended: true
})); 
app.use(bodyParser.json());

apiHelper(app);

app.listen(process.env.PORT, () => {
    console.log(`Server Started On Port ${PORT}!`)
});

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { apiHelper } from "./src/api/apiHelper.js";

const app = express();

const PORT = process.env.PORT;

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

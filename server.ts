import express from "express";
import albumRouter from "./routes/albums";
const cors = require("cors");

const app = express();

// TODO: When the json is incorrect, the server crashes
app.use(cors());
app.use(express.json())
app.use(express.static('public/'));

app.use("/albums/", albumRouter);



app.listen(3000);

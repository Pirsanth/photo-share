import express from "express";
import albumRouter from "./routes/albums";
import commentsRouter from "./routes/comments";
import authRouter from "./routes/auth";
const cors = require("cors");
const port:number = +process.env.NODE_BACKEND_PORT;

const app = express();

// TODO: When the json is incorrect, the server crashes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public/'));

app.use("/albums/", albumRouter);
app.use("/comments/", commentsRouter);
app.use("/auth/", authRouter);

app.listen(port);

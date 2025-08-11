import cors from "cors";
import express from "express"
import { getDevices } from "./controllers/deviceController.js";
import { getDevice } from "./controllers/deviceController.js";

const app = express()
// Middleware
app.use(cors());
app.use(express.json());


//! Routes
app.get("/", (req, res) => {
    res.send("Api Açık");
});

//* GET all devices
app.use("/api/devices", getDevices);

//* GET device detail
app.use("/api/device/:serial", getDevice);

const PORT = process.env.PORT || 8080;
app.listen((PORT), () => {
    console.log(`Server running on port: ${PORT}`);
});
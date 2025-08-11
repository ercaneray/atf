import cors from "cors";
import express from "express"
import { getDevices } from "./controllers/deviceController.js";

const app = express()

app.use(cors());
app.use(express.json());


// Routes
app.use("/api/devices", getDevices);

app.get("/", (req, res) => {
    res.send("Api Açık");
});
const PORT = process.env.PORT || 8080;
app.listen((PORT), () => {
    console.log(`Server running on port: ${PORT}`);
});
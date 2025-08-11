import cors from "cors";
import express from "express"
import devicesRoute from "./routes/deviceRoute.js"

const app = express()
// Middleware
app.use(cors());
app.use(express.json());


//! Routes
app.get("/", (req, res) => {
    res.send("Api Açık");
});

//* Device Routes
app.use("/api/devices", devicesRoute);


const PORT = process.env.PORT || 8080;
app.listen((PORT), () => {
    console.log(`Server running on port: ${PORT}`);
});
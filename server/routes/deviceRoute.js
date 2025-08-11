import express from "express"
import { getDevices } from "../controllers/deviceController";

const router = express.Router();

// Routes
router.get("/", getDevices);


export default router;
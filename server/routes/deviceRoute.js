import express from "express"
import { getScreenshot, getDevice, getDevices } from "../controllers/deviceController.js";

const router = express.Router();

//! GET Routes
//* GET screenshot
router.get("/:serial/screenshot", getScreenshot);
//* GET a device
router.get("/:serial", getDevice);
//* GET all devices
router.get("/", getDevices);

export default router;
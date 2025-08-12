import express from "express"
import { getScreenshot, getDevice, getDevices, postCommand } from "../controllers/deviceController.js";

const router = express.Router();

//! GET Routes
//* GET screenshot
router.get("/:serial/screenshot", getScreenshot);
//* GET a device
router.get("/:serial", getDevice);
//* GET all devices
router.get("/", getDevices);

//! POST routes
//* POST shell command
router.post("/:serial/shell", postCommand);

export default router;
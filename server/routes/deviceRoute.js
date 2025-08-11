import express from "express"
import { getDevices } from "../controllers/deviceController";
import { getDevice } from "../controllers/deviceController";

const router = express.Router();

//! Routes

//* GET all devices
router.get("/", getDevices);
//* GET a device
router.get("/:serial", getDevice);


export default router;
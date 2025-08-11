import { listDevices } from "../services/adbService.js"
import { deviceDetails } from "../services/adbService.js";

//* GET all devices
export async function getDevices(req, res) {
    try {
        const devices = await listDevices();
        res.json({
            timestamp: new Date().toISOString(),
            total: devices.length,
            devices
        });
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
};

//* GET a device
export async function getDevice(req, res) {
    const { serial } = req.params
    try {
        const device = await deviceDetails(serial);
        res.json({
            timestamp: new Date().toISOString,
            device
        });
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
}

import { listDevices } from "../services/adbService.js"

export async function getDevices(req, res) {
    try {
        const devices = await listDevices();
        res.json({
            timestamp: new Date().toISOString(),
            total: devices.length, devices
        });
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
}
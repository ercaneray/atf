import { listDevices, runCommand } from "../services/adbService.js"
import { deviceDetails } from "../services/adbService.js";
import { takeScreenshot } from "../services/adbService.js";

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
    const { serial } = req.params;
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

//* GET device screenshot
export async function getScreenshot(req, res) {
    const { serial } = req.params;
    try {
        const imgBuffer = await takeScreenshot(serial);
        res.set("Content-Type", "image/png");
        res.send(imgBuffer);
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
}

//* POST adb shell command
export async function postCommand(req, res) {
    const { serial } = req.params;
    const { command } = req.body;
    try {
        if (!command) throw new Error("Command is required!");
        const result = await runCommand(command, serial);
        res.type("text/plain").send(result);
    } catch (error) {
        res.status(500).json({ error: (error) })
        console.log(serial, cleanCommand);
    }
}

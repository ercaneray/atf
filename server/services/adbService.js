// adb shell servisi
import { sh } from "../utils/shell.js";
import { parseAdbDevicesL } from "../utils/adbParser.js";

export async function listDevices() {
  const out = await sh("adb devices -l");
  return parseAdbDevicesL(out);
}

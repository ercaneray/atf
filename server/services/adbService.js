//! adb shell servisleri
import { sh } from "../utils/shell.js";
import { parseDeviceList } from "../utils/adbParser.js";
import { parseDeviceDetails } from "../utils/adbParser.js";

//* Bütün cihazları listele
export async function listDevices() {
  const output = await sh("adb devices -l");
  return parseDeviceList(output);
}

//* Bir cihazın detaylarını al
export async function deviceDetails(serial) {
  const output = await sh(`adb -s ${serial} shell getprop`)
  return parseDeviceDetails(output);
}


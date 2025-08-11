//! adb shell servisleri
import { sh } from "../utils/shell.js";
import { shBuffer } from "../utils/shell.js";
import { parseDeviceList } from "../utils/adbParser.js";
import { parseDeviceDetails } from "../utils/adbParser.js";

//* Bütün cihazları listele
export async function listDevices() {
  const output = await sh("adb devices -l");
  return parseDeviceList(output);
}

//* Bir cihazın detaylarını al
export async function deviceDetails(serial) {
  if (!serial) throw new Error("Serial is required!")
  const output = await sh(`adb -s ${serial} shell getprop`)
  return parseDeviceDetails(output);
}

//* Bir cihazın ekran görüntüsünü al
export async function takeScreenshot(serial) {
  if (!serial) throw new Error("Serial is required!")
  const buffer = await shBuffer(`adb -s ${serial} exec-out screencap -p`);
  return buffer;
}

//* Shell komutu çalştır
export async function runCommand(command, serial) {
  if (!serial) throw new Error("Serial is required!")
  if (!command) throw new Error("Command is required!")
  const output = await sh(`adb -s ${serial} shell ${command}`);
  return output;
}

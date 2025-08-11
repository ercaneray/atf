//! adb çıktıları için parsing

export function parseKVs(tokens) {
  const kv = {};
  for (const t of tokens) {
    const m = t.match(/^(\w+):(.*)$/);
    if (m) kv[m[1]] = m[2];
  }
  return kv;
}

//* DeviceList Parsing
export function parseDeviceList(output) {
  const lines = output.split("\n").map(l => l.trim()).filter(Boolean);
  const rows = lines.slice(1); // header'ı at
  const list = [];

  for (const line of rows) {
    // ADB daemon mesajlarını atla
    if (/^(adb server|daemon)/i.test(line)) continue;

    const parts = line.split(/\s+/);
    const serial = parts[0];
    const state  = parts[1];

    if (!serial || !state) continue;

    const rest = parts.slice(2);
    const kv = parseKVs(rest);

    list.push({
      serial,
      state,
      product: kv.product ?? null,
      model: kv.model ?? null,
      deviceName: kv.device ?? null,
      transportId: kv.transport_id ? Number(kv.transport_id) : null,
      isEmulator: /^emulator-/.test(serial),
      isTcpIp: /\d+\.\d+\.\d+\.\d+:\d+/.test(serial),
      raw: rest.join(" ")
    });
  }

  return list;
};
//* Device getprop parsing
export function parseDeviceDetails(output) {
  const props = {};
  if (!output) return props;

  const lines = output.replace(/\r/g, "").split("\n");
  for (const line of lines) {
    const m = line.match(/^\[([^\]]+)\]: \[(.*)\]$/);
    if (m) {
      props[m[1]] = m[2];
    }
  }
  return props;
};

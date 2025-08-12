import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDevices } from "../api/devices";
import type { Device } from "../types/device";

function stateLabel(s: string) {
  switch (s) {
    case "device": return "Online";
    case "unauthorized": return "Yetkisiz";
    case "offline": return "Offline";
    default: return s;
  }
}

export default function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getDevices()
      .then((res) => setDevices(res.devices))
      .catch((e) => setErr(e?.message ?? "İstek hatası"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Yükleniyor…</p>;
  if (err) return <p style={{ color: "red" }}>Hata: {err}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Cihaz Listesi</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "8px" }}>Cihaz</th>
              <th style={{ padding: "8px" }}>Durum</th>
              <th style={{ padding: "8px" }}>Serial</th>
              <th style={{ padding: "8px" }}>Tür</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => {
              const name = d.model || d.deviceName || d.product || d.serial;
              return (
                <tr key={d.serial} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "8px" }}>
                    <Link to={`/devices/${encodeURIComponent(d.serial)}`} style={{ textDecoration: "none" }}>
                      {name}
                    </Link>
                  </td>
                  <td style={{ padding: "8px" }}>{stateLabel(d.state)}</td>
                  <td style={{ padding: "8px", fontFamily: "monospace" }}>{d.serial}</td>
                  <td style={{ padding: "8px" }}>{d.isEmulator ? "Emülatör" : "Fiziksel"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* küçük bir not */}
      <p style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>
        Android sürümü ve diğer ayrıntılar için satıra tıklayın.
      </p>
    </div>
  );
}

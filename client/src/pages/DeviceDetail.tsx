// src/pages/DeviceDetail.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDeviceInfo, getScreenshotUrl } from "../api/devices";
import type { DeviceInfoResponse } from "../types/device";

export default function DeviceDetail() {
  const { serial = "" } = useParams<{ serial: string }>();
  const [data, setData] = useState<DeviceInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [ssUrl, setSsUrl] = useState<string>("");        // screenshot url
  const [ssBusy, setSsBusy] = useState(false);           // screenshot yükleniyor mu?

  // Sayfa açıldığında cihaz detayını çek + screenshot URL'ini oluştur
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    getDeviceInfo(serial)
      .then((res) => {
        if (!alive) return;
        setData(res);
        // otomatik ekran görüntüsü URL'si
        setSsUrl(getScreenshotUrl(serial));
      })
      .catch((e) => alive && setErr(e?.message ?? "İstek hatası"))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [serial]);

  // Önemli alanları özetle
  const info = data?.details ?? {};
  const summary = useMemo(() => ({
    model: info["ro.product.model"] ?? null,
    manufacturer: info["ro.product.manufacturer"] ?? null,
    brand: info["ro.product.brand"] ?? null,
    device: info["ro.product.device"] ?? null,
    android: info["ro.build.version.release"] ?? null,
    sdk: info["ro.build.version.sdk"] ?? null,
    fingerprint: info["ro.build.fingerprint"] ?? null,
    serialProp: info["ro.serialno"] ?? null,
    isEmulator: info["ro.kernel.qemu"] === "1",
  }), [info]);

  const refreshScreenshot = () => {
    setSsBusy(true);
    setSsUrl(getScreenshotUrl(serial)); // cache-bust query var
  };

  if (loading) return <p style={{ padding: 16 }}>Yükleniyor…</p>;
  if (err) return <p style={{ padding: 16, color: "red" }}>Hata: {err}</p>;

  return (
    <div style={{ padding: 16 }}>
      <p><Link to="/">{`←` } Geri</Link></p>
      <h2 style={{ marginBottom: 8 }}>Cihaz Detayı</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        {/* Sol: Özet bilgiler */}
        <section>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <Row k="Serial (ADB)" v={serial} mono />
              <Row k="Model" v={summary.model} />
              <Row k="Manufacturer" v={summary.manufacturer} />
              <Row k="Brand" v={summary.brand} />
              <Row k="Device" v={summary.device} />
              <Row k="Android" v={summary.android} />
              <Row k="SDK" v={summary.sdk} />
              <Row k="Build Fingerprint" v={summary.fingerprint} wrap />
              <Row k="ro.serialno" v={summary.serialProp} mono />
              <Row k="Emülatör" v={summary.isEmulator ? "Evet" : "Hayır"} />
            </tbody>
          </table>
        </section>

        {/* Sağ: Ekran görüntüsü */}
        <section>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <strong>Ekran Görüntüsü</strong>
            <button onClick={refreshScreenshot} disabled={ssBusy} style={{ padding: "6px 10px" }}>
              {ssBusy ? "Yükleniyor…" : "Yenile"}
            </button>
            {ssUrl && (
              <a href={ssUrl} download={`screenshot-${serial}.png`} style={{ fontSize: 14 }}>
                İndir
              </a>
            )}
          </div>
          {ssUrl ? (
            <img
              src={ssUrl}
              alt="screenshot"
              onLoad={() => setSsBusy(false)}
              onError={() => { setSsBusy(false); }}
              style={{ maxWidth: "50%", border: "1px solid #e5e7eb", borderRadius: 8 }}
            />
          ) : (
            <p style={{ color: "#6b7280" }}>Görüntü oluşturulamadı.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function Row({ k, v, mono = false, wrap = false }: { k: string; v: any; mono?: boolean; wrap?: boolean }) {
  return (
    <tr>
      <td style={{ padding: "6px 8px", width: "35%", fontWeight: 600, borderBottom: "1px solid #f1f5f9" }}>{k}</td>
      <td
        style={{
          padding: "6px 8px",
          borderBottom: "1px solid #f1f5f9",
          fontFamily: mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined,
          wordBreak: wrap ? "break-all" : "normal",
        }}
      >
        {v ?? "-"}
      </td>
    </tr>
  );
}

// src/pages/DeviceDetail.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDeviceInfo, getScreenshotUrl } from "../api/devices";
import type { DeviceInfoResponse } from "../types/device";
import { sendShellCommand } from "../api/devices";

export default function DeviceDetail() {
    const { serial = "" } = useParams<{ serial: string }>();
    const [data, setData] = useState<DeviceInfoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [ssUrl, setSsUrl] = useState<string>("");        // screenshot url
    const [ssBusy, setSsBusy] = useState(false);           // screenshot yükleniyor mu?

    // 🔹 Shell komut formu state'leri
    const [cmd, setCmd] = useState("pm list packages");
    const [cmdBusy, setCmdBusy] = useState(false);
    const [cmdOut, setCmdOut] = useState<string>("");
    const [cmdErr, setCmdErr] = useState<string | null>(null);

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
    const summary = useMemo(() => {
        const info = data?.details ?? {};
        return {
            model: info["ro.product.model"] ?? null,
            manufacturer: info["ro.product.manufacturer"] ?? null,
            brand: info["ro.product.brand"] ?? null,
            device: info["ro.product.device"] ?? null,
            android: info["ro.build.version.release"] ?? null,
            sdk: info["ro.build.version.sdk"] ?? null,
            fingerprint: info["ro.build.fingerprint"] ?? null,
            serialProp: info["ro.serialno"] ?? null,
            isEmulator: info["ro.kernel.qemu"] === "1",
        };
    }, [data?.details]);


    const refreshScreenshot = () => {
        setSsBusy(true);
        setSsUrl(getScreenshotUrl(serial));
    };


    const onSubmitShell = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cmd.trim()) return;
        setCmdBusy(true);
        setCmdErr(null);
        setCmdOut("");
        try {
            const res = await sendShellCommand(serial, cmd.trim());

            setCmdOut(res.output ?? "");
        } catch (e: unknown) {
            if (typeof e === "object" && e !== null) {
                const err = e as { response?: { data?: { message?: string } }, message?: string };
                setCmdErr(err.response?.data?.message || err.message || "Komut gönderilemedi");
            } else {
                setCmdErr("Komut gönderilemedi");
            }
        } finally {
            setCmdBusy(false);
        }
    };

    if (loading) return <p style={{ padding: 16 }}>Yükleniyor…</p>;
    if (err) return <p style={{ padding: 16, color: "red" }}>Hata: {err}</p>;

    return (
        <div style={{ padding: 16 }}>
            <p><Link to="/">{`←`} Geri</Link></p>
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

                {/* Sağ: Ekran görüntüsü*/}
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
                            style={{ maxWidth: "20%", border: "1px solid #e5e7eb", borderRadius: 8 }}
                        />
                    ) : (
                        <p style={{ color: "#6b7280" }}>Görüntü oluşturulamadı.</p>
                    )}
                </section>
            </div>

            {/* 🔹 Aşağı: Shell Komutu Gönder */}
            <section style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 8 }}>Shell Komutu</h3>

                <form onSubmit={onSubmitShell} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <input
                        type="text"
                        value={cmd}
                        onChange={(e) => setCmd(e.target.value)}
                        placeholder='Örn: pm list packages'
                        style={{
                            flex: 1,
                            padding: "8px 10px",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        }}
                    />
                    <button
                        type="submit"
                        disabled={cmdBusy || !serial}
                        style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#111827", color: "white" }}
                    >
                        {cmdBusy ? "Çalışıyor…" : "Gönder"}
                    </button>
                </form>

                {/* Hızlı örnekler */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    {["pm list packages", "getprop ro.build.fingerprint", "getprop ro.serialno", "id"].map((q) => (
                        <button
                            key={q}
                            type="button"
                            onClick={() => setCmd(q)}
                            style={{ padding: "4px 8px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 12 }}
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* Çıktı */}
                {cmdErr && <p style={{ color: "red", margin: "8px 0" }}>Hata: {cmdErr}</p>}

                <pre
                    style={{
                        background: "#0b1220",
                        color: "#e5e7eb",
                        borderRadius: 8,
                        padding: 12,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        minHeight: 80,
                        border: "1px solid #111827",
                    }}
                >
                    {cmdOut || (cmdBusy ? "Komut çalıştırılıyor…" : "Çıktı burada görünecek.")}
                </pre>
            </section>
        </div>
    );
}

function Row({ k, v, mono = false, wrap = false }: { k: string; v: React.ReactNode; mono?: boolean; wrap?: boolean }) {
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

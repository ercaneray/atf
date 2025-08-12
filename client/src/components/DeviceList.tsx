import { useState, useEffect } from "react";
import { getDevices } from "../api/devices.ts"
import type { Device } from "../types/device";

function DeviceList() {
    const [devices, setDevices] = useState<Device[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        getDevices()
            .then(data => setDevices(data.devices))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Yükleniyor...</p>;
    return (
        <div>
            <h2>Cihaz Listesi</h2>
            <ul>
                {devices.map(d => (
                    <li key={d.serial}>
                        {d.model || d.serial} ({d.state})
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DeviceList
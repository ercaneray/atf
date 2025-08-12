export interface Device {
    serial: string;
    state: string;
    product: string | null;
    model: string | null;
    deviceName: string | null;
    transportId: number | null;
    isEmulator: boolean;
    isTcpIp: boolean;
    raw: string;
}

export interface DeviceListResponse {
    timestamp: string;
    total: number;
    devices: Device[];
}
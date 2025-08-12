import axios from "axios";
import type { DeviceInfoResponse, DeviceListResponse } from "../types/device";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getDevices(): Promise<DeviceListResponse> {
    console.log(API_BASE_URL)
    const respond = await axios.get<DeviceListResponse>(`${API_BASE_URL}/devices`);
    return respond.data;
}

export async function getDeviceInfo(serial: string): Promise<DeviceInfoResponse> {
    console.log(API_BASE_URL)
    const respond = await axios.get<DeviceInfoResponse>(`${API_BASE_URL}/devices/${encodeURIComponent(serial)}`);
    return respond.data;
}

export function getScreenshotUrl(serial: string) {
    const cacheBust = Date.now();
    return `${API_BASE_URL}/devices/${encodeURIComponent(serial)}/screenshot?ts=${cacheBust}`;
}
import axios from "axios";
import type { DeviceInfoResponse, DeviceListResponse } from "../types/device";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getDevices(): Promise<DeviceListResponse> {
    const response = await axios.get<DeviceListResponse>(`${API_BASE_URL}/devices`);
    return response.data;
}

export async function getDeviceInfo(serial: string): Promise<DeviceInfoResponse> {
    const response = await axios.get<{ serial: string; device: Record<string, string> }>(
        `${API_BASE_URL}/devices/${encodeURIComponent(serial)}`
    );
    return {
        serial: response.data.serial,
        details: response.data.device,
    };
}

export function getScreenshotUrl(serial: string) {
    const cacheBust = Date.now();
    return `${API_BASE_URL}/devices/${encodeURIComponent(serial)}/screenshot?ts=${cacheBust}`;
}

export async function sendShellCommand(serial: string, command: string) {
  const response = await axios.post<{ output: string }>(
    `${API_BASE_URL}/devices/${encodeURIComponent(serial)}/shell`,
    { command }
  );
  return response.data;
}
import axios from "axios";
import type { DeviceListResponse } from "../types/device";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getDevices(): Promise<DeviceListResponse> {
    console.log(API_BASE_URL)
    const respond = await axios.get<DeviceListResponse>(`${API_BASE_URL}/devices`);
    return respond.data;
}
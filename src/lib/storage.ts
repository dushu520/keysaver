import { invoke } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import type { AppData } from "../types";

// Simple detection for Tauri environment
const isTauri = typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__;

export async function loadKeys(): Promise<AppData> {
  if (!isTauri) {
    console.log("Running in browser mode: loading from localStorage");
    const saved = localStorage.getItem("keysaver_data");
    return saved ? JSON.parse(saved) : { version: "1.0.0", keys: [] };
  }
  return await invoke<AppData>("load_keys");
}

export async function saveKeys(data: AppData): Promise<void> {
  if (!isTauri) {
    console.log("Running in browser mode: saving to localStorage");
    localStorage.setItem("keysaver_data", JSON.stringify(data));
    return;
  }
  await invoke("save_keys", { data });
}

export async function generateUuid(): Promise<string> {
  if (!isTauri) {
    return crypto.randomUUID();
  }
  return await invoke<string>("generate_uuid");
}

export async function copyToClipboard(text: string): Promise<void> {
  if (!isTauri) {
    await navigator.clipboard.writeText(text);
    return;
  }
  await writeText(text);
}

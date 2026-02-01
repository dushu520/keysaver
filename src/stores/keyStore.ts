import { create } from "zustand";
import type { ApiKey, AppData } from "../types";
import { loadKeys, saveKeys, generateUuid } from "../lib/storage";

interface KeyStore {
  keys: ApiKey[];
  isLoading: boolean;
  error: string | null;

  loadData: () => Promise<void>;
  addKey: (keyData: Omit<ApiKey, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateKey: (id: string, keyData: Partial<Omit<ApiKey, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  deleteKey: (id: string) => Promise<void>;
  importData: (data: AppData) => Promise<void>;
}

export const useKeyStore = create<KeyStore>((set, get) => ({
  keys: [],
  isLoading: false,
  error: null,

  loadData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await loadKeys();
      // Migration: Ensure existing keys have a type
      const keysWithMigration = data.keys.map(k => ({
        ...k,
        type: k.type || 'apiKey'
      }));
      set({ keys: keysWithMigration, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  addKey: async (keyData) => {
    const id = await generateUuid();
    const now = Date.now();
    const newKey: ApiKey = {
      id,
      ...keyData,
      createdAt: now,
      updatedAt: now,
    };

    const newKeys = [...get().keys, newKey];
    set({ keys: newKeys });

    const data: AppData = { version: "1.0.0", keys: newKeys };
    await saveKeys(data);
  },

  updateKey: async (id, keyData) => {
    const newKeys = get().keys.map((k) =>
      k.id === id
        ? { ...k, ...keyData, updatedAt: Date.now() }
        : k
    );
    set({ keys: newKeys });

    const data: AppData = { version: "1.0.0", keys: newKeys };
    await saveKeys(data);
  },

  deleteKey: async (id: string) => {
    const newKeys = get().keys.filter((k) => k.id !== id);
    set({ keys: newKeys });

    const data: AppData = { version: "1.0.0", keys: newKeys };
    await saveKeys(data);
  },

  importData: async (data: AppData) => {
    set({ isLoading: true, error: null });
    try {
      if (!data || !Array.isArray(data.keys)) {
        throw new Error("无效的备份文件格式");
      }

      // Ensure all keys have valid properties
      const validKeys = data.keys.map(k => ({
        ...k,
        type: k.type || 'apiKey',
        // Ensure required fields exist
        name: k.name || 'Unnamed',
        createdAt: k.createdAt || Date.now(),
        updatedAt: k.updatedAt || Date.now()
      }));

      set({ keys: validKeys, isLoading: false });
      await saveKeys({ version: data.version || "1.0.0", keys: validKeys });
    } catch (err) {
      set({ error: String(err), isLoading: false });
      throw err;
    }
  },
}));

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface SettingsState {
  serverUrl: string | null;
  apiKey: string | null;
  userId: string | null;
  accessToken: string | null;
  setSettings: (serverUrl: string, apiKey: string) => void;
  setSession: (userId: string, accessToken: string) => void;
  clearSettings: () => void;
  clearSession: () => void;
}
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      serverUrl: null,
      apiKey: null,
      userId: null,
      accessToken: null,
      setSettings: (serverUrl, apiKey) => set({ serverUrl, apiKey }),
      setSession: (userId, accessToken) => set({ userId, accessToken }),
      clearSettings: () => set({ serverUrl: null, apiKey: null, userId: null, accessToken: null }),
      clearSession: () => set({ userId: null, accessToken: null }),
    }),
    {
      name: 'cineverse-edge-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
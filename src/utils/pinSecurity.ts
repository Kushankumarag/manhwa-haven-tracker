
import { AppSettings } from "@/types";

const SETTINGS_KEY = "manhwa-vault-settings";
const PIN_SALT = "manhwa-vault-pin-salt-v1";

// Simple hash function for PIN (not cryptographically secure, but adequate for this use case)
function simpleHash(pin: string): string {
  const saltedPin = PIN_SALT + pin;
  let hash = 0;
  for (let i = 0; i < saltedPin.length; i++) {
    const char = saltedPin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    console.log("Settings saved successfully");
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      return { pinEnabled: false, autoLockMinutes: 5 };
    }
    return JSON.parse(stored) as AppSettings;
  } catch (error) {
    console.error("Failed to load settings:", error);
    return { pinEnabled: false, autoLockMinutes: 5 };
  }
}

export function setPIN(pin: string): void {
  const settings = loadSettings();
  settings.pinEnabled = true;
  settings.pinHash = simpleHash(pin);
  saveSettings(settings);
}

export function verifyPIN(pin: string): boolean {
  const settings = loadSettings();
  if (!settings.pinEnabled || !settings.pinHash) return true;
  return simpleHash(pin) === settings.pinHash;
}

export function clearPIN(): void {
  const settings = loadSettings();
  settings.pinEnabled = false;
  settings.pinHash = undefined;
  saveSettings(settings);
}

export function isPINEnabled(): boolean {
  const settings = loadSettings();
  return settings.pinEnabled;
}

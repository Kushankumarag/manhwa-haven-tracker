
import { ManhwaTitle } from "@/types";

const STORAGE_KEY = "my-manhwa-tracker-titles-v1";

export function saveTitlesToStorage(titles: ManhwaTitle[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(titles));
}

export function loadTitlesFromStorage(): ManhwaTitle[] {
  try {
    const fromStore = localStorage.getItem(STORAGE_KEY);
    if (!fromStore) return [];
    return JSON.parse(fromStore) as ManhwaTitle[];
  } catch {
    return [];
  }
}

export function exportTitlesAsJson(titles: ManhwaTitle[]) {
  const dataStr = JSON.stringify(titles, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "my-manhwa-tracker.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importTitlesFromJson(file: File): Promise<ManhwaTitle[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsText(file);
  });
}

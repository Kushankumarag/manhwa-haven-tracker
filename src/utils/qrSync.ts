
import { ManhwaTitle } from "@/types";

// Simple compression using JSON stringify with reduced whitespace
function compressData(data: any): string {
  const jsonString = JSON.stringify(data);
  return btoa(encodeURIComponent(jsonString));
}

function decompressData(compressed: string): any {
  try {
    const jsonString = decodeURIComponent(atob(compressed));
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Invalid data format");
  }
}

export function generateSyncData(titles: ManhwaTitle[]): string {
  const syncData = {
    version: "1.0",
    timestamp: Date.now(),
    titles: titles,
  };
  
  return compressData(syncData);
}

export function parseSyncData(data: string): ManhwaTitle[] {
  const parsed = decompressData(data);
  
  if (!parsed.titles || !Array.isArray(parsed.titles)) {
    throw new Error("Invalid sync data format");
  }
  
  // Validate each title has required properties
  const validTitles = parsed.titles.filter((item: any) => {
    return item && 
      typeof item === 'object' && 
      typeof item.title === 'string' && 
      typeof item.chapter === 'number' &&
      ['Manhwa', 'Manhua', 'Manga'].includes(item.type) &&
      ['Reading', 'Completed', 'Planned'].includes(item.status);
  });
  
  if (validTitles.length === 0) {
    throw new Error("No valid titles found in sync data");
  }
  
  return validTitles as ManhwaTitle[];
}

export function generateSyncURL(titles: ManhwaTitle[]): string {
  const data = generateSyncData(titles);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?sync=${data}`;
}

export function extractSyncDataFromURL(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('sync');
}

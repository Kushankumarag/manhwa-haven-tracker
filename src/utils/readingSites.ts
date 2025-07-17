
import { ReadingSite, ReadingSiteFormData } from "@/types/readingSites";

const STORAGE_KEY = "manhwa-vault-reading-sites-v1";

export function saveReadingSitesToStorage(sites: ReadingSite[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
    console.log("Reading sites saved to localStorage successfully");
  } catch (error) {
    console.error("Failed to save reading sites to localStorage:", error);
    throw new Error("Failed to save reading sites. Storage may be full.");
  }
}

export function loadReadingSitesFromStorage(): ReadingSite[] {
  try {
    const fromStore = localStorage.getItem(STORAGE_KEY);
    if (!fromStore) return [];
    const parsed = JSON.parse(fromStore) as ReadingSite[];
    console.log(`Loaded ${parsed.length} reading sites from localStorage`);
    return parsed;
  } catch (error) {
    console.error("Failed to load reading sites from localStorage:", error);
    return [];
  }
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`);
    return `https://www.google.com/s2/favicons?domain=${domain.hostname}&sz=32`;
  } catch {
    return '';
  }
}

export function exportReadingSitesAsJson(sites: ReadingSite[]): { success: boolean; error?: string } {
  try {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      totalSites: sites.length,
      sites: sites
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `reading-sites-${new Date().toISOString().split('T')[0]}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    
    console.log(`Successfully exported ${sites.length} reading sites`);
    return { success: true };
  } catch (error) {
    console.error('Export failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown export error" 
    };
  }
}

export async function importReadingSitesFromJson(file: File): Promise<ReadingSite[]> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.type.includes('json') && !file.name.toLowerCase().endsWith('.json')) {
      reject(new Error('Please select a valid JSON file'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('File too large. Maximum size is 5MB'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        let sitesArray: any[];
        if (Array.isArray(data)) {
          sitesArray = data;
        } else if (data.sites && Array.isArray(data.sites)) {
          sitesArray = data.sites;
        } else {
          reject(new Error('Invalid file format. Expected an array of sites or export format.'));
          return;
        }

        const validSites = sitesArray.filter(item => {
          return item && 
            typeof item === 'object' && 
            typeof item.name === 'string' && 
            typeof item.url === 'string' &&
            ['manhwa', 'manhua'].includes(item.type);
        });

        if (validSites.length === 0) {
          reject(new Error('No valid reading sites found in the file'));
          return;
        }

        console.log(`Successfully parsed ${validSites.length} valid reading sites from import file`);
        resolve(validSites as ReadingSite[]);
      } catch (err) {
        console.error('JSON parsing error:', err);
        reject(new Error('Invalid JSON file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

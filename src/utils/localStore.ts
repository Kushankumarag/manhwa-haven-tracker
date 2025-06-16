
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
  try {
    const dataStr = JSON.stringify(titles, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `manhwa-tracker-${new Date().toISOString().split('T')[0]}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

export async function importTitlesFromJson(file: File): Promise<ManhwaTitle[]> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
      reject(new Error('Please select a valid JSON file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate that data is an array
        if (!Array.isArray(data)) {
          reject(new Error('Invalid file format. Expected an array of titles.'));
          return;
        }

        // Validate each item has required properties
        const validTitles = data.filter(item => 
          item && 
          typeof item === 'object' && 
          typeof item.title === 'string' && 
          typeof item.chapter === 'number' &&
          ['Manhwa', 'Manhua', 'Manga'].includes(item.type) &&
          ['Reading', 'Completed', 'Planned'].includes(item.status)
        );

        if (validTitles.length === 0) {
          reject(new Error('No valid titles found in the file'));
          return;
        }

        resolve(validTitles as ManhwaTitle[]);
      } catch (err) {
        reject(new Error('Invalid JSON file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

export function mergeTitlesWithDuplicateHandling(existingTitles: ManhwaTitle[], newTitles: ManhwaTitle[]): ManhwaTitle[] {
  const merged = [...existingTitles];
  let duplicatesFound = 0;
  
  newTitles.forEach(newTitle => {
    // Check for duplicates based on title and type (case-insensitive)
    const isDuplicate = merged.some(existing => 
      existing.title.toLowerCase().trim() === newTitle.title.toLowerCase().trim() &&
      existing.type === newTitle.type
    );
    
    if (isDuplicate) {
      duplicatesFound++;
      console.log(`Duplicate found and skipped: ${newTitle.title} (${newTitle.type})`);
    } else {
      // Add unique ID and timestamp if missing
      const titleToAdd = {
        ...newTitle,
        id: newTitle.id || Math.random().toString(36).slice(2, 10) + Date.now(),
        lastUpdated: newTitle.lastUpdated || Date.now(),
        isFavorite: newTitle.isFavorite || false
      };
      merged.push(titleToAdd);
    }
  });
  
  return merged;
}

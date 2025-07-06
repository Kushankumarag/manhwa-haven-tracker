
import { ManhwaTitle } from "@/types";

const STORAGE_KEY = "my-manhwa-tracker-titles-v1";

export function saveTitlesToStorage(titles: ManhwaTitle[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(titles));
    console.log("Data saved to localStorage successfully");
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
    throw new Error("Failed to save data. Storage may be full.");
  }
}

export function loadTitlesFromStorage(): ManhwaTitle[] {
  try {
    const fromStore = localStorage.getItem(STORAGE_KEY);
    if (!fromStore) return [];
    const parsed = JSON.parse(fromStore) as ManhwaTitle[];
    console.log(`Loaded ${parsed.length} titles from localStorage`);
    return parsed;
  } catch (error) {
    console.error("Failed to load data from localStorage:", error);
    return [];
  }
}

export function exportTitlesAsJson(titles: ManhwaTitle[]): { success: boolean; error?: string } {
  try {
    // Create a clean export structure
    const exportData = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      totalTitles: titles.length,
      titles: titles.map(title => ({
        id: title.id,
        title: title.title,
        chapter: title.chapter,
        totalChapters: title.totalChapters || null,
        type: title.type,
        siteUrl: title.siteUrl || "",
        coverUrl: title.coverUrl || "",
        tags: title.tags || [],
        status: title.status,
        isFavorite: title.isFavorite || false,
        rating: title.rating || null,
        lastUpdated: title.lastUpdated
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `manhwa-vault-${new Date().toISOString().split('T')[0]}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    
    console.log(`Successfully exported ${titles.length} titles`);
    return { success: true };
  } catch (error) {
    console.error('Export failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown export error" 
    };
  }
}

export async function importTitlesFromJson(file: File): Promise<ManhwaTitle[]> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Validate file type
    if (!file.type.includes('json') && !file.name.toLowerCase().endsWith('.json')) {
      reject(new Error('Please select a valid JSON file'));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('File too large. Maximum size is 10MB'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Handle both old format (direct array) and new format (with metadata)
        let titlesArray: any[];
        if (Array.isArray(data)) {
          titlesArray = data; // Old format
        } else if (data.titles && Array.isArray(data.titles)) {
          titlesArray = data.titles; // New format
        } else {
          reject(new Error('Invalid file format. Expected an array of titles or export format.'));
          return;
        }

        // Validate each item has required properties
        const validTitles = titlesArray.filter(item => {
          return item && 
            typeof item === 'object' && 
            typeof item.title === 'string' && 
            typeof item.chapter === 'number' &&
            ['Manhwa', 'Manhua', 'Manga'].includes(item.type) &&
            ['Reading', 'Completed', 'Planned'].includes(item.status);
        });

        if (validTitles.length === 0) {
          reject(new Error('No valid titles found in the file'));
          return;
        }

        console.log(`Successfully parsed ${validTitles.length} valid titles from import file`);
        resolve(validTitles as ManhwaTitle[]);
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

export function mergeTitlesWithDuplicateHandling(existingTitles: ManhwaTitle[], newTitles: ManhwaTitle[]): ManhwaTitle[] {
  const merged = [...existingTitles];
  let duplicatesSkipped = 0;
  let newAdded = 0;
  
  newTitles.forEach(newTitle => {
    // Check for duplicates based on title and type (case-insensitive)
    const isDuplicate = merged.some(existing => 
      existing.title.toLowerCase().trim() === newTitle.title.toLowerCase().trim() &&
      existing.type === newTitle.type
    );
    
    if (isDuplicate) {
      duplicatesSkipped++;
      console.log(`Duplicate skipped: ${newTitle.title} (${newTitle.type})`);
    } else {
      // Add unique ID and timestamp if missing
      const titleToAdd: ManhwaTitle = {
        ...newTitle,
        id: newTitle.id || Math.random().toString(36).slice(2, 10) + Date.now(),
        lastUpdated: newTitle.lastUpdated || Date.now(),
        isFavorite: newTitle.isFavorite || false,
        tags: newTitle.tags || [],
        siteUrl: newTitle.siteUrl || "",
        coverUrl: newTitle.coverUrl || ""
      };
      merged.push(titleToAdd);
      newAdded++;
    }
  });
  
  console.log(`Import summary: ${newAdded} new titles added, ${duplicatesSkipped} duplicates skipped`);
  return merged;
}

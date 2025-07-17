export type TitleType = "Manhwa" | "Manhua" | "Manga";
export type TitleStatus = "Reading" | "Completed" | "Planned";

export type HistoryAction = "added" | "chapter_updated" | "status_changed" | "edited" | "rated";

export interface ReadingHistoryEntry {
  id: string;
  action: HistoryAction;
  timestamp: number;
  details: {
    previousChapter?: number;
    newChapter?: number;
    previousStatus?: TitleStatus;
    newStatus?: TitleStatus;
    previousRating?: number;
    newRating?: number;
    description: string;
  };
}

export interface ManhwaTitle {
  id: string;
  title: string;
  chapter: number;
  totalChapters?: number;
  type: TitleType;
  siteUrl?: string;
  coverUrl?: string;
  tags: string[];
  status: TitleStatus;
  isFavorite?: boolean;
  rating?: number; // Rating from 1-10
  lastUpdated: number; // timestamp
  readingHistory?: ReadingHistoryEntry[];
}

export interface AppSettings {
  pinEnabled: boolean;
  pinHash?: string;
  autoLockMinutes: number;
}

// Re-export reading sites types for convenience
export * from './types/readingSites';


export type TitleType = "Manhwa" | "Manhua" | "Manga";
export type TitleStatus = "Reading" | "Completed" | "Planned";

export type HistoryAction = "added" | "chapter_updated" | "status_changed" | "edited";

export interface ReadingHistoryEntry {
  id: string;
  action: HistoryAction;
  timestamp: number;
  details: {
    previousChapter?: number;
    newChapter?: number;
    previousStatus?: TitleStatus;
    newStatus?: TitleStatus;
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
  lastUpdated: number; // timestamp
  readingHistory?: ReadingHistoryEntry[];
}

export interface AppSettings {
  pinEnabled: boolean;
  pinHash?: string;
  autoLockMinutes: number;
}

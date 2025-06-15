
export type TitleType = "Manhwa" | "Manhua" | "Manga";
export type TitleStatus = "Reading" | "Completed" | "Planned";

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
}

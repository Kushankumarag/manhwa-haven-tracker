
import { ReadingHistoryEntry, HistoryAction, TitleStatus } from "@/types";

export function createHistoryEntry(
  action: HistoryAction,
  details: {
    previousChapter?: number;
    newChapter?: number;
    previousStatus?: TitleStatus;
    newStatus?: TitleStatus;
    description: string;
  }
): ReadingHistoryEntry {
  return {
    id: Math.random().toString(36).slice(2, 10) + Date.now(),
    action,
    timestamp: Date.now(),
    details,
  };
}

export function formatHistoryEntry(entry: ReadingHistoryEntry, titleName: string): string {
  const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const time = new Date(entry.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  const actionIcons = {
    added: "📘",
    chapter_updated: "📖",
    status_changed: "🔄",
    edited: "✏️"
  };

  return `${actionIcons[entry.action]} ${date} at ${time} - ${entry.details.description}`;
}

export function getRecentActivity(titles: Array<{ title: string; readingHistory?: ReadingHistoryEntry[] }>, limit = 10): Array<{ entry: ReadingHistoryEntry; titleName: string }> {
  const allEntries: Array<{ entry: ReadingHistoryEntry; titleName: string }> = [];
  
  titles.forEach(title => {
    if (title.readingHistory) {
      title.readingHistory.forEach(entry => {
        allEntries.push({ entry, titleName: title.title });
      });
    }
  });
  
  return allEntries
    .sort((a, b) => b.entry.timestamp - a.entry.timestamp)
    .slice(0, limit);
}

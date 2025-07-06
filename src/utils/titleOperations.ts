
import { ManhwaTitle } from "@/types";
import { createHistoryEntry } from "@/utils/readingHistory";

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now();
}

export function createNewTitle(data: Omit<ManhwaTitle, "id" | "lastUpdated">): ManhwaTitle {
  return {
    ...data,
    id: generateId(),
    lastUpdated: Date.now(),
    isFavorite: data.isFavorite || false,
    tags: data.tags || [],
    readingHistory: [
      createHistoryEntry("added", {
        description: `Added "${data.title}" to collection`
      })
    ]
  };
}

export function updateTitle(
  existingTitle: ManhwaTitle, 
  newData: Omit<ManhwaTitle, "id" | "lastUpdated">
): ManhwaTitle {
  const historyEntries = [...(existingTitle.readingHistory || [])];
  
  // Check if rating changed to add specific history entry
  if (existingTitle.rating !== newData.rating) {
    const ratingHistoryEntry = createHistoryEntry("rated", {
      previousRating: existingTitle.rating,
      newRating: newData.rating,
      description: newData.rating 
        ? `Rated "${newData.title}" ${newData.rating}/10`
        : `Removed rating from "${newData.title}"`
    });
    historyEntries.push(ratingHistoryEntry);
  }
  
  // Add general edit history entry
  const editHistoryEntry = createHistoryEntry("edited", {
    description: `Updated title information`
  });
  historyEntries.push(editHistoryEntry);
  
  return {
    ...existingTitle,
    ...newData,
    lastUpdated: Date.now(),
    readingHistory: historyEntries
  };
}

export function addChapterToTitle(title: ManhwaTitle): ManhwaTitle {
  const newChapter = title.chapter + 1;
  const historyEntry = createHistoryEntry("chapter_updated", {
    previousChapter: title.chapter,
    newChapter: newChapter,
    description: `Read chapter ${newChapter} of "${title.title}"`
  });
  
  return {
    ...title,
    chapter: newChapter,
    lastUpdated: Date.now(),
    readingHistory: [...(title.readingHistory || []), historyEntry]
  };
}

export function toggleTitleFavorite(title: ManhwaTitle): ManhwaTitle {
  return {
    ...title,
    isFavorite: !title.isFavorite,
    lastUpdated: Date.now()
  };
}

export function changeStatusToReading(title: ManhwaTitle): ManhwaTitle {
  const historyEntry = createHistoryEntry("status_changed", {
    previousStatus: title.status,
    newStatus: "Reading",
    description: `Changed status from ${title.status} to Reading`
  });
  
  return {
    ...title,
    status: "Reading" as const,
    lastUpdated: Date.now(),
    readingHistory: [...(title.readingHistory || []), historyEntry]
  };
}

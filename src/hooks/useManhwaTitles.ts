import { useState, useEffect } from "react";
import { ManhwaTitle } from "@/types";
import { createHistoryEntry } from "@/utils/readingHistory";
import {
  saveTitlesToStorage,
  loadTitlesFromStorage,
  exportTitlesAsJson,
  importTitlesFromJson,
  mergeTitlesWithDuplicateHandling,
} from "@/utils/localStore";
import { toast } from "@/hooks/use-toast";

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now();
}

export function useManhwaTitles() {
  const [titles, setTitles] = useState<ManhwaTitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadedTitles = loadTitlesFromStorage();
    setTitles(loadedTitles);
    console.log(`Loaded ${loadedTitles.length} titles on app start`);
  }, []);

  // Auto-save to localStorage whenever titles change
  useEffect(() => {
    if (titles.length > 0) {
      try {
        saveTitlesToStorage(titles);
      } catch (error) {
        toast({
          title: "Save Failed",
          description: "Unable to save data. Your changes might be lost.",
          variant: "destructive"
        });
      }
    }
  }, [titles]);

  function handleAddNew(data: Omit<ManhwaTitle, "id" | "lastUpdated">) {
    const newTitle: ManhwaTitle = {
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
    setTitles((prev) => [newTitle, ...prev]);
    
    toast({
      title: "Title Added",
      description: `"${newTitle.title}" has been added to your collection.`,
    });
  }

  function handleEdit(editingTitle: ManhwaTitle, data: Omit<ManhwaTitle, "id" | "lastUpdated">) {
    setTitles((prev) =>
      prev.map((t) => {
        if (t.id === editingTitle.id) {
          const historyEntries = [...(t.readingHistory || [])];
          
          // Check if rating changed to add specific history entry
          if (editingTitle.rating !== data.rating) {
            const ratingHistoryEntry = createHistoryEntry("rated", {
              previousRating: editingTitle.rating,
              newRating: data.rating,
              description: data.rating 
                ? `Rated "${data.title}" ${data.rating}/10`
                : `Removed rating from "${data.title}"`
            });
            historyEntries.push(ratingHistoryEntry);
          }
          
          // Add general edit history entry
          const editHistoryEntry = createHistoryEntry("edited", {
            description: `Updated title information`
          });
          historyEntries.push(editHistoryEntry);
          
          return {
            ...t,
            ...data,
            lastUpdated: Date.now(),
            readingHistory: historyEntries
          };
        }
        return t;
      })
    );
    
    toast({
      title: "Title Updated",
      description: `"${data.title}" has been updated.`,
    });
  }

  function onDelete(id: string) {
    const titleToDelete = titles.find(t => t.id === id);
    setTitles((prev) => prev.filter((t) => t.id !== id));
    
    if (titleToDelete) {
      toast({
        title: "Title Deleted",
        description: `"${titleToDelete.title}" has been removed from your collection.`,
      });
    }
  }

  function onAddChapter(id: string) {
    setTitles((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newChapter = t.chapter + 1;
          const historyEntry = createHistoryEntry("chapter_updated", {
            previousChapter: t.chapter,
            newChapter: newChapter,
            description: `Read chapter ${newChapter} of "${t.title}"`
          });
          
          return {
            ...t,
            chapter: newChapter,
            lastUpdated: Date.now(),
            readingHistory: [...(t.readingHistory || []), historyEntry]
          };
        }
        return t;
      })
    );
  }

  function onToggleFavorite(id: string) {
    setTitles((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isFavorite: !t.isFavorite, lastUpdated: Date.now() } : t
      )
    );
  }

  function onMarkAsReading(id: string) {
    setTitles((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const historyEntry = createHistoryEntry("status_changed", {
            previousStatus: t.status,
            newStatus: "Reading",
            description: `Changed status from ${t.status} to Reading`
          });
          
          return {
            ...t,
            status: "Reading" as const,
            lastUpdated: Date.now(),
            readingHistory: [...(t.readingHistory || []), historyEntry]
          };
        }
        return t;
      })
    );
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const imported = await importTitlesFromJson(e.target.files[0]);
      const mergedTitles = mergeTitlesWithDuplicateHandling(titles, imported);
      const newTitlesCount = mergedTitles.length - titles.length;
      const duplicatesCount = imported.length - newTitlesCount;
      
      setTitles(mergedTitles);
      
      toast({
        title: "Import Successful! 🎉",
        description: `${newTitlesCount} new titles imported${duplicatesCount > 0 ? `. ${duplicatesCount} duplicates were skipped.` : '.'}`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Clear the file input
      e.target.value = '';
    }
  }

  function handleExport() {
    const result = exportTitlesAsJson(titles);
    if (result.success) {
      toast({
        title: "Export Successful! 📁",
        description: `Your collection of ${titles.length} titles has been downloaded.`
      });
    } else {
      toast({
        title: "Export Failed",
        description: result.error || "There was an error exporting your data. Please try again.",
        variant: "destructive"
      });
    }
  }

  function handleQRImport(importedTitles: ManhwaTitle[]) {
    const mergedTitles = mergeTitlesWithDuplicateHandling(titles, importedTitles);
    const newTitlesCount = mergedTitles.length - titles.length;
    const duplicatesCount = importedTitles.length - newTitlesCount;
    
    setTitles(mergedTitles);
    
    if (duplicatesCount > 0) {
      toast({
        title: "QR Sync Complete",
        description: `${newTitlesCount} new titles imported, ${duplicatesCount} duplicates skipped`
      });
    }
  }

  return {
    titles,
    isLoading,
    handleAddNew,
    handleEdit,
    onDelete,
    onAddChapter,
    onToggleFavorite,
    onMarkAsReading,
    handleImport,
    handleExport,
    handleQRImport,
  };
}

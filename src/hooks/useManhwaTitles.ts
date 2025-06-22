
import { useState, useEffect } from "react";
import { ManhwaTitle } from "@/types";
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
    };
    setTitles((prev) => [newTitle, ...prev]);
    
    toast({
      title: "Title Added",
      description: `"${newTitle.title}" has been added to your collection.`,
    });
  }

  function handleEdit(editingTitle: ManhwaTitle, data: Omit<ManhwaTitle, "id" | "lastUpdated">) {
    setTitles((prev) =>
      prev.map((t) =>
        t.id === editingTitle.id
          ? { ...t, ...data, lastUpdated: Date.now() }
          : t
      )
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
      prev.map((t) =>
        t.id === id
          ? { ...t, chapter: t.chapter + 1, lastUpdated: Date.now() }
          : t
      )
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
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "Reading", lastUpdated: Date.now() }
          : t
      )
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
  };
}

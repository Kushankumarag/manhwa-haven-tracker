
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

  useEffect(() => {
    setTitles(loadTitlesFromStorage());
  }, []);

  useEffect(() => {
    saveTitlesToStorage(titles);
  }, [titles]);

  function handleAddNew(data: Omit<ManhwaTitle, "id" | "lastUpdated">) {
    const newTitle: ManhwaTitle = {
      ...data,
      id: generateId(),
      lastUpdated: Date.now(),
      isFavorite: data.isFavorite || false,
    };
    setTitles((prev) => [newTitle, ...prev]);
  }

  function handleEdit(editingTitle: ManhwaTitle, data: Omit<ManhwaTitle, "id" | "lastUpdated">) {
    setTitles((prev) =>
      prev.map((t) =>
        t.id === editingTitle.id
          ? { ...t, ...data, lastUpdated: Date.now() }
          : t
      )
    );
  }

  function onDelete(id: string) {
    setTitles((prev) => prev.filter((t) => t.id !== id));
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
    
    try {
      const imported = await importTitlesFromJson(e.target.files[0]);
      const mergedTitles = mergeTitlesWithDuplicateHandling(titles, imported);
      const newTitlesCount = mergedTitles.length - titles.length;
      
      setTitles(mergedTitles);
      
      toast({
        title: "Import Successful!",
        description: `${newTitlesCount} new titles imported. Duplicates were automatically skipped.`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
    
    e.target.value = '';
  }

  function handleExport() {
    const success = exportTitlesAsJson(titles);
    if (success) {
      toast({
        title: "Export Successful!",
        description: "Your manhwa collection has been exported to a JSON file."
      });
    } else {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive"
      });
    }
  }

  return {
    titles,
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

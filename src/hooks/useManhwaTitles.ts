
import { useState, useEffect } from "react";
import { ManhwaTitle } from "@/types";
import { saveTitlesToStorage, loadTitlesFromStorage } from "@/utils/localStore";
import { toast } from "@/hooks/use-toast";
import {
  createNewTitle,
  updateTitle,
  addChapterToTitle,
  toggleTitleFavorite,
  changeStatusToReading,
} from "@/utils/titleOperations";
import {
  handleFileImport,
  handleFileExport,
  handleQRCodeImport,
} from "@/utils/importExportOperations";

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
    const newTitle = createNewTitle(data);
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
          return updateTitle(t, data);
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
          return addChapterToTitle(t);
        }
        return t;
      })
    );
  }

  function onToggleFavorite(id: string) {
    setTitles((prev) =>
      prev.map((t) =>
        t.id === id ? toggleTitleFavorite(t) : t
      )
    );
  }

  function onMarkAsReading(id: string) {
    setTitles((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return changeStatusToReading(t);
        }
        return t;
      })
    );
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const mergedTitles = await handleFileImport(e.target.files[0], titles);
      setTitles(mergedTitles);
    } catch (error) {
      // Error handling is done in handleFileImport
    } finally {
      setIsLoading(false);
      // Clear the file input
      e.target.value = '';
    }
  }

  function handleExport() {
    handleFileExport(titles);
  }

  function handleQRImport(importedTitles: ManhwaTitle[]) {
    const { mergedTitles } = handleQRCodeImport(importedTitles, titles);
    setTitles(mergedTitles);
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

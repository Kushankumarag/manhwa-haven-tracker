
import { ManhwaTitle } from "@/types";
import {
  exportTitlesAsJson,
  importTitlesFromJson,
  mergeTitlesWithDuplicateHandling,
} from "@/utils/localStore";
import { toast } from "@/hooks/use-toast";

export async function handleFileImport(
  file: File,
  existingTitles: ManhwaTitle[]
): Promise<ManhwaTitle[]> {
  try {
    const imported = await importTitlesFromJson(file);
    const mergedTitles = mergeTitlesWithDuplicateHandling(existingTitles, imported);
    const newTitlesCount = mergedTitles.length - existingTitles.length;
    const duplicatesCount = imported.length - newTitlesCount;
    
    toast({
      title: "Import Successful! 🎉",
      description: `${newTitlesCount} new titles imported${duplicatesCount > 0 ? `. ${duplicatesCount} duplicates were skipped.` : '.'}`
    });
    
    return mergedTitles;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast({
      title: "Import Failed",
      description: errorMessage,
      variant: "destructive"
    });
    throw error;
  }
}

export function handleFileExport(titles: ManhwaTitle[]): void {
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

export function handleQRCodeImport(
  importedTitles: ManhwaTitle[],
  existingTitles: ManhwaTitle[]
): { mergedTitles: ManhwaTitle[]; shouldShowToast: boolean } {
  const mergedTitles = mergeTitlesWithDuplicateHandling(existingTitles, importedTitles);
  const newTitlesCount = mergedTitles.length - existingTitles.length;
  const duplicatesCount = importedTitles.length - newTitlesCount;
  
  const shouldShowToast = duplicatesCount > 0;
  
  if (shouldShowToast) {
    toast({
      title: "QR Sync Complete",
      description: `${newTitlesCount} new titles imported, ${duplicatesCount} duplicates skipped`
    });
  }
  
  return { mergedTitles, shouldShowToast };
}


import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManhwaTitle } from "@/types";
import { generateSyncURL, parseSyncData } from "@/utils/qrSync";
import { toast } from "@/hooks/use-toast";
import { Copy, Upload } from "lucide-react";

interface QRSyncProps {
  open: boolean;
  onClose: () => void;
  titles: ManhwaTitle[];
  onImport: (titles: ManhwaTitle[]) => void;
}

export const QRSync: React.FC<QRSyncProps> = ({ open, onClose, titles, onImport }) => {
  const [syncURL, setSyncURL] = useState("");
  const [importData, setImportData] = useState("");

  useEffect(() => {
    if (open && titles.length > 0) {
      const url = generateSyncURL(titles);
      setSyncURL(url);
    }
  }, [open, titles]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Sync link copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleImport = () => {
    if (!importData.trim()) {
      toast({
        title: "No Data",
        description: "Please enter sync data or URL",
        variant: "destructive"
      });
      return;
    }

    try {
      let syncData = importData.trim();
      
      // Extract sync data from URL if needed
      if (syncData.includes('?sync=')) {
        const urlParams = new URLSearchParams(syncData.split('?')[1]);
        syncData = urlParams.get('sync') || '';
      }
      
      const importedTitles = parseSyncData(syncData);
      onImport(importedTitles);
      setImportData("");
      onClose();
      
      toast({
        title: "Sync Successful! 🎉",
        description: `${importedTitles.length} titles imported successfully`
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Invalid sync data",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sync Across Devices</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">📤 Export</TabsTrigger>
            <TabsTrigger value="import">📥 Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share this link to sync your collection across devices
              </p>
              
              {syncURL ? (
                <div className="space-y-3">
                  <Input
                    value={syncURL}
                    readOnly
                    className="text-xs"
                    onClick={() => copyToClipboard(syncURL)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(syncURL)}
                    className="w-full"
                  >
                    <Copy size={16} className="mr-2" />
                    Copy Sync Link
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No data to export</p>
              )}
              
              <p className="text-xs text-muted-foreground">
                💡 The link contains your entire collection data
              </p>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Paste the sync link or scan data here:
              </p>
              
              <Input
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste sync link or data here..."
                className="min-h-[80px]"
              />
              
              <Button onClick={handleImport} className="w-full">
                <Upload size={16} className="mr-2" />
                Import Collection
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                💡 This will merge with your existing collection
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

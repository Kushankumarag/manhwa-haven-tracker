
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManhwaTitle } from "@/types";
import { generateSyncURL, parseSyncData } from "@/utils/qrSync";
import { generateShareCode, parseShareCode } from "@/utils/shareCode";
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
  const [shareCode, setShareCode] = useState("");
  const [importData, setImportData] = useState("");
  const [shareCodeInput, setShareCodeInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (open && titles.length > 0) {
      const url = generateSyncURL(titles);
      setSyncURL(url);
      
      // Generate share code
      setIsGenerating(true);
      try {
        const code = generateShareCode(titles);
        setShareCode(code);
      } catch (error) {
        console.error("Failed to generate share code:", error);
        toast({
          title: "Generation Failed",
          description: "Failed to generate share code",
          variant: "destructive"
        });
      } finally {
        setIsGenerating(false);
      }
    }
  }, [open, titles]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleURLImport = () => {
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

  const handleShareCodeImport = () => {
    if (!shareCodeInput.trim()) {
      toast({
        title: "No Code",
        description: "Please enter a share code",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    
    try {
      const importedTitles = parseShareCode(shareCodeInput.trim());
      onImport(importedTitles);
      setShareCodeInput("");
      onClose();
      
      toast({
        title: "Import Successful! 🎉",
        description: `${importedTitles.length} titles imported from share code`
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Invalid share code",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share & Sync Collection</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="share-code" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="share-code">🔗 Share Code</TabsTrigger>
            <TabsTrigger value="sync-url">📤 Sync URL</TabsTrigger>
            <TabsTrigger value="import">📥 Import</TabsTrigger>
          </TabsList>

          <TabsContent value="share-code" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    📤 Generate Share Code
                  </p>
                  <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                    {titles.length} titles
                  </span>
                </div>
                
                {isGenerating ? (
                  <div className="bg-muted rounded-md p-3 text-center text-sm text-muted-foreground">
                    Generating share code...
                  </div>
                ) : shareCode ? (
                  <div className="space-y-3">
                    <Textarea
                      value={shareCode}
                      readOnly
                      className="text-xs font-mono resize-none"
                      rows={4}
                      onClick={() => copyToClipboard(shareCode, "Share code")}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(shareCode, "Share code")}
                      className="w-full"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy Share Code
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No data to share</p>
                )}
              </div>

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  📥 Import Share Code
                </p>
                
                <Textarea
                  value={shareCodeInput}
                  onChange={(e) => setShareCodeInput(e.target.value)}
                  placeholder="Paste share code here..."
                  className="text-xs font-mono resize-none"
                  rows={3}
                />
                
                <Button 
                  onClick={handleShareCodeImport} 
                  className="w-full"
                  disabled={isImporting || !shareCodeInput.trim()}
                >
                  <Upload size={16} className="mr-2" />
                  {isImporting ? "Importing..." : "Import from Code"}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                💡 Share codes work offline and merge with existing titles
              </p>
            </div>
          </TabsContent>

          <TabsContent value="sync-url" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share this URL to sync your collection across devices
              </p>
              
              {syncURL ? (
                <div className="space-y-3">
                  <Input
                    value={syncURL}
                    readOnly
                    className="text-xs"
                    onClick={() => copyToClipboard(syncURL, "Sync link")}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(syncURL, "Sync link")}
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
                💡 The URL contains your entire collection data
              </p>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Paste sync URL here:
              </p>
              
              <Input
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste sync URL here..."
                className="min-h-[80px]"
              />
              
              <Button onClick={handleURLImport} className="w-full">
                <Upload size={16} className="mr-2" />
                Import from URL
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

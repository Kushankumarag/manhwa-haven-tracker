import React, { ChangeEvent, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Download, Upload, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type HeaderProps = {
  onDarkToggle: () => void;
  isDark: boolean;
  onExport: () => void;
  onImport: (ev: ChangeEvent<HTMLInputElement>) => void;
  totalCount: number;
};

export const Header: React.FC<HeaderProps> = ({
  onDarkToggle,
  isDark,
  onExport,
  onImport,
  totalCount,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Close menu if clicked outside
  React.useEffect(() => {
    function close(e: MouseEvent) {
      if (!(e.target as HTMLElement)?.closest(".menu-anchor")) setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("mousedown", close);
      return () => document.removeEventListener("mousedown", close);
    }
  }, [menuOpen]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.includes('json') || file.name.toLowerCase().endsWith('.json')) {
        setSelectedFileName(file.name);
        
        // Set the file to the hidden input and trigger the change event
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
          
          // Create a proper synthetic event
          const syntheticEvent = new Event('change', { bubbles: true });
          Object.defineProperty(syntheticEvent, 'target', {
            writable: false,
            value: fileInputRef.current
          });
          
          onImport(syntheticEvent as unknown as ChangeEvent<HTMLInputElement>);
        }
        setMenuOpen(false);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please drop a JSON file.",
          variant: "destructive"
        });
      }
    }
  }, [onImport]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
    onImport(e);
    setMenuOpen(false);
  };

  const handleExportClick = () => {
    onExport();
    setMenuOpen(false);
    toast({
      title: "Export Started",
      description: "Your collection is being downloaded...",
    });
  };

  return (
    <>
      <header className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-popover shadow-none flex items-center justify-between mb-4 sm:mb-6 transition-colors duration-300">
        {/* Left side - Title and info */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <span className="font-black text-xl sm:text-[2rem] tracking-tight text-foreground font-playfair truncate">
            ManhwaVault
          </span>
          <span className="hidden xs:inline-block ml-1 sm:ml-3 rounded-full bg-card px-2 sm:px-4 py-1 text-xs sm:text-base text-muted-foreground font-medium shadow-sm border-0 whitespace-nowrap">
            {totalCount} titles
          </span>
          <Link to="/stats" className="hidden sm:inline-block ml-2 sm:ml-4 text-primary font-semibold underline underline-offset-4 hover:text-primary/80 text-sm sm:text-base">
            Stats
          </Link>
        </div>
        
        {/* Right side - Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Mobile stats link */}
          <Link to="/stats" className="sm:hidden text-primary font-semibold underline underline-offset-4 hover:text-primary/80 text-sm">
            Stats
          </Link>
          
          {/* Dark Light Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={onDarkToggle}
            className="rounded-full p-0 w-8 h-8 sm:w-10 sm:h-10 transition-all bg-primary/10 text-primary hover:bg-primary/20 shadow-none flex-shrink-0"
          >
            <span className="sr-only">Toggle mode</span>
            <span className="text-sm sm:text-[1rem] font-semibold">{isDark ? "🌙" : "☀️"}</span>
          </Button>
          
          {/* Three-dot dropdown menu for export/import */}
          <div className="relative menu-anchor flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Actions"
              className="rounded-full p-0 w-8 h-8 sm:w-10 sm:h-10 bg-card/60 hover:bg-muted"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MoreVertical className="w-4 h-4 sm:w-6 sm:h-6" />
            </Button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 z-30 bg-popover rounded-xl py-2 shadow-lg animate-fade-in transition-all border border-border">
                <button
                  className="w-full px-3 sm:px-4 py-2 text-left hover:bg-primary/10 transition rounded-xl text-foreground font-medium text-sm flex items-center gap-2"
                  onClick={handleExportClick}
                >
                  <Download className="w-4 h-4" />
                  Export Collection
                </button>
                
                <div
                  className={`w-full block cursor-pointer transition-colors ${isDragOver ? 'bg-primary/20' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label className="w-full block cursor-pointer">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/json,.json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <span className="block px-3 sm:px-4 py-2 hover:bg-primary/10 transition rounded-xl text-foreground font-medium text-sm flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Import Collection
                    </span>
                  </label>
                </div>

                {selectedFileName && (
                  <div className="px-3 sm:px-4 py-2 text-xs text-muted-foreground flex items-center gap-2 border-t border-border/50 mt-1">
                    <FileText className="w-3 h-3" />
                    <span className="truncate">{selectedFileName}</span>
                  </div>
                )}
                
                <div className="px-3 sm:px-4 py-1 text-xs text-muted-foreground border-t border-border/50 mt-1">
                  💡 Tip: You can drag & drop JSON files
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global drag overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-primary/10 border-2 border-dashed border-primary z-50 flex items-center justify-center">
          <div className="bg-background rounded-lg p-6 shadow-lg text-center">
            <Upload className="w-12 h-12 mx-auto mb-2 text-primary" />
            <p className="text-lg font-semibold">Drop JSON file to import</p>
            <p className="text-sm text-muted-foreground">Release to upload your collection</p>
          </div>
        </div>
      )}
    </>
  );
};

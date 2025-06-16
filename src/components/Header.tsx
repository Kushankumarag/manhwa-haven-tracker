
import React, { ChangeEvent, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Close menu if clicked outside (minimalist approach)
  React.useEffect(() => {
    function close(e: MouseEvent) {
      if (!(e.target as HTMLElement)?.closest(".menu-anchor")) setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("mousedown", close);
      return () => document.removeEventListener("mousedown", close);
    }
  }, [menuOpen]);

  return (
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
        
        {/* Dark Light Toggle - Always visible */}
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
        
        {/* Three-dot dropdown menu for export/import - Always visible */}
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
            <div className="absolute right-0 mt-2 w-36 sm:w-44 z-30 bg-popover rounded-xl py-2 shadow-lg animate-fade-in transition-all border border-border">
              <button
                className="w-full px-3 sm:px-4 py-2 text-left hover:bg-primary/10 transition rounded-xl text-foreground font-medium text-sm"
                onClick={() => {
                  setMenuOpen(false);
                  onExport();
                }}
              >
                Export JSON
              </button>
              <label className="w-full block cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={onImport}
                  className="hidden"
                />
                <span
                  className="block px-3 sm:px-4 py-2 hover:bg-primary/10 transition rounded-xl text-foreground font-medium text-sm"
                  onClick={() => {
                    // Triggers file picker
                    fileInputRef.current?.click();
                    setMenuOpen(false);
                  }}
                >
                  Import JSON
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


import React, { ChangeEvent, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

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
    <header className="w-full px-0 py-4 bg-popover shadow-none flex items-center justify-between mb-6 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <span className="font-black text-[2rem] tracking-tight text-foreground font-inter">
          Manhwa Tracker
        </span>
        <span className="ml-3 rounded-full bg-card px-4 py-1 text-base text-muted-foreground font-medium shadow-sm border-0">
          {totalCount} titles
        </span>
      </div>
      <div className="flex items-center gap-3">
        {/* Dark Light Toggle */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle dark mode"
          onClick={onDarkToggle}
          className="rounded-full p-0 w-10 h-10 transition-all bg-primary/10 text-primary hover:bg-primary/20 shadow-none"
        >
          <span className="sr-only">Toggle mode</span>
          <span className="text-[1rem] font-semibold">{isDark ? "🌙" : "☀️"}</span>
        </Button>
        {/* Three-dot dropdown menu for export/import */}
        <div className="relative menu-anchor">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Actions"
            className="rounded-full p-0 w-10 h-10 bg-card/60 hover:bg-muted"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MoreVertical className="w-6 h-6" />
          </Button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 z-30 bg-popover rounded-xl py-2 shadow-lg animate-fade-in transition-all">
              <button
                className="w-full px-4 py-2 text-left hover:bg-primary/10 transition rounded-xl text-foreground font-medium"
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
                  className="block px-4 py-2 hover:bg-primary/10 transition rounded-xl text-foreground font-medium"
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


import React, { ChangeEvent } from "react";
import { Moon, Sun, Upload, Download, Book } from "lucide-react";
import { exportTitlesAsJson } from "@/utils/localStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ManhwaTitle } from "@/types";

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
  return (
    <header className="w-full px-0 py-4 bg-gradient-to-br from-violet-50 via-pinkAccent/10 to-blue-100 dark:bg-main-gradient-dark rounded-b-lg flex items-center justify-between mb-4 shadow-dashboard animate-fade-in">
      <div className="flex items-center gap-3">
        <Book size={28} className="text-violet-700 dark:text-pinkAccent" />
        <span className="font-extrabold text-2xl tracking-tight font-sans text-violet-800 dark:text-pinkAccent drop-shadow-sm">
          My Manhwa Tracker
        </span>
        <span className="ml-4 rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">
          {totalCount} titles
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDarkToggle}
          className={cn(
            "rounded-full hover-scale transition",
            isDark ? "bg-black/20" : "bg-white/50"
          )}
          title="Toggle Dark Mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onExport}
          className="rounded-full hover-scale"
          title="Export Titles as JSON"
        >
          <Download size={20} />
        </Button>
        <label>
          <input
            type="file"
            accept="application/json"
            onChange={onImport}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover-scale"
            title="Import Titles from JSON"
          >
            <Upload size={20} />
          </Button>
        </label>
      </div>
    </header>
  );
};

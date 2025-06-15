
import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

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
    <header className="w-full px-0 py-5 bg-popover border-b-0 shadow flex items-center justify-between mb-8 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <span className="font-black text-[1.75rem] tracking-tight text-foreground">
          Manhwa Tracker
        </span>
        <span className="ml-4 rounded bg-card px-3 py-1 text-base text-muted-foreground border-0 font-medium">
          {totalCount} titles
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onDarkToggle}
          className="rounded-md px-3 border-0 bg-secondary text-foreground hover:bg-card"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="rounded-md px-3 border-0 bg-card text-foreground hover:bg-secondary"
        >
          Export JSON
        </Button>
        <label>
          <input
            type="file"
            accept="application/json"
            onChange={onImport}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            className="rounded-md px-3 border-0 bg-[#664fd9] text-white hover:bg-[#7769e2]"
          >
            Import JSON
          </Button>
        </label>
      </div>
    </header>
  );
};

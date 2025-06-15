
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
    <header className="w-full px-0 py-5 bg-white border-b shadow-sm flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl tracking-tight text-gray-900">
          Manhwa Tracker
        </span>
        <span className="ml-4 rounded bg-gray-100 px-3 py-1 text-sm text-gray-500 border border-gray-200">
          {totalCount} titles
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onDarkToggle}
          className="rounded px-3 border"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="rounded px-3 border"
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
            className="rounded px-3 border"
          >
            Import JSON
          </Button>
        </label>
      </div>
    </header>
  );
};


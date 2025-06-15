
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
    <header className="w-full px-0 py-5 bg-[#121212] border-b-0 shadow flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <span className="font-black text-[1.75rem] tracking-tight text-white">
          Manhwa Tracker
        </span>
        <span className="ml-4 rounded bg-[#181818] px-3 py-1 text-base text-gray-300 border-0 font-medium">
          {totalCount} titles
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onDarkToggle}
          className="rounded-md px-3 border-0 bg-[#232323] text-white hover:bg-[#333]"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="rounded-md px-3 border-0 bg-[#292929] text-white hover:bg-[#444]"
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

import React from "react";
import { TitleType } from "@/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TypeFilterProps {
  selectedType: TitleType | "";
  onTypeChange: (type: TitleType | "") => void;
}

export function TypeFilter({ selectedType, onTypeChange }: TypeFilterProps) {
  const typeOptions: { value: TitleType | "", label: string }[] = [
    { value: "", label: "All" },
    { value: "Manhwa", label: "Manhwa" },
    { value: "Manhua", label: "Manhua" },
    { value: "Manga", label: "Manga" }
  ];

  return (
    <div className="mb-6">
      <ToggleGroup
        type="single"
        value={selectedType}
        onValueChange={(value) => onTypeChange(value as TitleType | "")}
        className="flex flex-wrap justify-center sm:justify-start gap-2"
      >
        {typeOptions.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="px-3 sm:px-4 py-2 rounded-full border border-border bg-card hover:bg-accent transition-colors text-xs sm:text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground touch-target min-w-[60px] sm:min-w-[80px]"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

import React from "react";
import { ManhwaTitle } from "@/types";
import { TitleCard } from "@/components/TitleCard";
import { toast } from "@/hooks/use-toast";

interface TitlesGridProps {
  titles: ManhwaTitle[];
  grid: number;
  onAddChapter: (id: string) => void;
  onEdit: (title: ManhwaTitle) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const TitlesGrid: React.FC<TitlesGridProps> = ({
  titles,
  grid,
  onAddChapter,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  function onOpenSite(title: ManhwaTitle) {
    if (title.siteUrl) window.open(title.siteUrl, "_blank");
  }

  function onCopySiteUrl(title: ManhwaTitle) {
    if (title.siteUrl) {
      navigator.clipboard.writeText(title.siteUrl);
      toast({ 
        title: "Site URL copied!", 
        description: "The site URL has been copied to your clipboard." 
      });
    }
  }

  const getGridClassName = () => {
    switch (grid) {
      case 2:
        return "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6";
      case 3:
        return "grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6";
      case 4:
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6";
      case 6:
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6";
      default:
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6";
    }
  };

  if (titles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-muted-foreground">
        <p className="text-base sm:text-lg text-center">
          No tracked titles. Click <b>Add New</b> to get started.
        </p>
      </div>
    );
  }

  return (
    <div className={getGridClassName()}>
      {titles.map((title) => (
        <TitleCard
          key={title.id}
          title={title}
          onAddChapter={() => onAddChapter(title.id)}
          onEdit={() => onEdit(title)}
          onDelete={() => onDelete(title.id)}
          onOpenSite={() => onOpenSite(title)}
          onToggleFavorite={() => onToggleFavorite(title.id)}
          onCopySiteUrl={() => onCopySiteUrl(title)}
        />
      ))}
    </div>
  );
};

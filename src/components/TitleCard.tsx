
import React from "react";
import { ManhwaTitle } from "@/types";
import { ProgressBar } from "./ProgressBar";
import { Link as LinkIcon, MoreHorizontal } from "lucide-react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";

type Props = {
  title: ManhwaTitle;
  onAddChapter: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenSite: () => void;
  onToggleFavorite: () => void;
  onCopySiteUrl?: () => void; // New optional prop
};

function timeAgo(ts: number): string {
  const now = Date.now();
  const diff = Math.floor((now - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  const days = Math.floor(diff / 86400);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export const TitleCard: React.FC<Props> = ({
  title,
  onAddChapter,
  onEdit,
  onDelete,
  onOpenSite,
  onToggleFavorite,
  onCopySiteUrl,
}) => {
  const total = title.totalChapters || 0;
  const progress = total ? Math.min(title.chapter, total) : title.chapter;

  const typeColors: { [k: string]: string } = {
    Manhwa: "bg-[#ffd600]/90 text-black",
    Manhua: "bg-[#B0C4FA]/90 text-blue-900",
    Manga: "bg-[#ee99c2]/90 text-pink-900",
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg flex flex-col h-full hover:scale-[1.012] hover:shadow-xl transition-all duration-200 p-3 md:p-3 border-0 min-w-0 relative">
      {/* Cover image with in-corner 3-dot icon */}
      <div className="w-full aspect-[4/5] bg-secondary rounded-xl mb-2 flex items-center justify-center overflow-hidden relative">
        {/* 3-dot menu top right, now inside the card, so corners show fully */}
        <div className="absolute top-2 right-2 z-10">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger asChild>
                <button
                  className="p-1 rounded-full transition bg-transparent hover:bg-gray-200/60 focus:bg-gray-200/70"
                  aria-label="More actions"
                  type="button"
                >
                  <MoreHorizontal size={20} />
                </button>
              </MenubarTrigger>
              <MenubarContent align="end">
                <MenubarItem
                  className="text-destructive"
                  onClick={onDelete}
                >
                  Delete
                </MenubarItem>
                {/* More items can be added here if needed */}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        {/* Show cover image as background if present */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: title.coverUrl ? `url(${title.coverUrl})` : undefined,
            backgroundSize: title.coverUrl ? "cover" : undefined,
            backgroundPosition: title.coverUrl ? "center" : undefined,
            borderRadius: 'inherit'
          }}
        />
        {!title.coverUrl && (
          <span className="relative z-0 text-base text-muted-foreground select-none">No Image</span>
        )}
      </div>
      {/* Info */}
      <div className="flex items-center gap-1 mb-1">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold shadow-sm ${typeColors[title.type] || "bg-gray-200 text-black"}`}
        >
          {title.type}
        </span>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground">
          {title.status}
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground">
          {timeAgo(title.lastUpdated)}
        </span>
      </div>
      {/* Title */}
      <h3 className="font-bold text-base mb-1 truncate text-foreground">{title.title}</h3>
      {/* Tags */}
      {title.tags && title.tags.length > 0 && (
        <div className="mb-1 flex flex-wrap gap-1">
          {title.tags.map((tag) => (
            <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{tag}</span>
          ))}
        </div>
      )}
      {/* Progress */}
      <div className="mb-1 flex items-center gap-2">
        <ProgressBar value={progress} max={total || Math.max(progress, 1)} />
        <span className="text-[11px] text-muted-foreground ml-2">
          {progress}
          {total ? <>/{total}</> : ""}
        </span>
      </div>
      {/* Actions row (remove delete btn) */}
      <div className="flex gap-1 mt-auto items-center">
        <button
          className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium hover:bg-primary/20 transition"
          title="Add 1 Chapter"
          onClick={onAddChapter}
        >
          +1
        </button>
        <button
          className="rounded-full bg-secondary text-foreground px-2 py-0.5 text-xs font-medium hover:bg-muted transition"
          title="Edit"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className={`rounded-full px-2 py-0.5 text-xs font-medium transition ${
            title.isFavorite
              ? "bg-[#ffd600]/80 text-black"
              : "bg-secondary text-foreground hover:bg-[#ffd600]/80 hover:text-black"
          }`}
          title="Favorite"
          onClick={onToggleFavorite}
        >
          Fav
        </button>
        <button
          className="rounded-full bg-secondary text-foreground px-2 py-0.5 text-xs font-medium hover:bg-muted transition"
          title="Open Reading Site"
          onClick={onOpenSite}
          disabled={!title.siteUrl}
        >
          Open
        </button>
        {/* Copy URL button */}
        {title.siteUrl && onCopySiteUrl && (
          <button
            className="rounded-full bg-secondary text-foreground px-2 py-0.5 text-xs font-medium hover:bg-primary/20 transition flex items-center gap-1"
            title="Copy Site URL"
            onClick={onCopySiteUrl}
            type="button"
          >
            <LinkIcon size={14} className="inline-block" />
            <span className="sr-only">Copy URL</span>
          </button>
        )}
        {/* Delete button removed from here */}
      </div>
    </div>
  );
};

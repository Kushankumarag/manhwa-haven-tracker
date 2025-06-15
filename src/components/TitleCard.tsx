
import React from "react";
import { ManhwaTitle } from "@/types";
import { ProgressBar } from "./ProgressBar";

type Props = {
  title: ManhwaTitle;
  onAddChapter: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenSite: () => void;
  onToggleFavorite: () => void;
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
}) => {
  const total = title.totalChapters || 0;
  const progress = total ? Math.min(title.chapter, total) : title.chapter;

  const typeColors: { [k: string]: string } = {
    Manhwa: "bg-[#ffd600]/90 text-black",
    Manhua: "bg-[#B0C4FA]/90 text-blue-900",
    Manga: "bg-[#ee99c2]/90 text-pink-900",
  };

  return (
    <div className="bg-card rounded-3xl shadow-xl flex flex-col h-full hover:scale-[1.018] hover:shadow-2xl transition-all duration-200 p-4 border-0">
      {/* Cover image */}
      <div
        className="w-full aspect-[4/5] bg-secondary rounded-2xl mb-4 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: title.coverUrl ? `url(${title.coverUrl})` : undefined,
          backgroundSize: title.coverUrl ? "cover" : undefined,
          backgroundPosition: title.coverUrl ? "center" : undefined,
        }}
      >
        {!title.coverUrl && (
          <span className="text-2xl text-muted-foreground select-none">No Image</span>
        )}
      </div>
      {/* Info */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`rounded-full px-3 py-0.5 text-xs font-bold shadow-sm ${typeColors[title.type] || "bg-gray-200 text-black"}`}>
          {title.type}
        </span>
        <span className="rounded-full px-3 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
          {title.status}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">{timeAgo(title.lastUpdated)}</span>
      </div>
      {/* Title */}
      <h3 className="font-bold text-xl mb-1 truncate text-foreground">{title.title}</h3>
      {/* Tags */}
      {title.tags && title.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {title.tags.map((tag) => (
            <span key={tag} className="text-xs bg-muted px-3 py-0.5 rounded-full text-muted-foreground">{tag}</span>
          ))}
        </div>
      )}
      {/* Progress */}
      <div className="mb-2 flex items-center gap-2">
        <ProgressBar value={progress} max={total || Math.max(progress, 1)} />
        <span className="text-[13px] text-muted-foreground ml-2">
          {progress}
          {total ? <>/{total}</> : ""}
        </span>
      </div>
      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          className="rounded-full bg-primary/10 text-primary px-3 py-1 font-medium hover:bg-primary/20 transition"
          title="Add 1 Chapter"
          onClick={onAddChapter}
        >
          +1 Chapter
        </button>
        <button
          className="rounded-full bg-secondary text-foreground px-3 py-1 font-medium hover:bg-muted transition"
          title="Edit"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className={`rounded-full px-3 py-1 font-medium transition ${
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
          className="rounded-full bg-secondary text-foreground px-3 py-1 font-medium hover:bg-muted transition"
          title="Open Reading Site"
          onClick={onOpenSite}
          disabled={!title.siteUrl}
        >
          Open
        </button>
        <button
          className="rounded-full bg-destructive text-destructive-foreground px-3 py-1 font-medium hover:bg-red-800 transition"
          title="Delete"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};


import React from "react";
import { ManhwaTitle } from "@/types";
import { ProgressBar } from "./ProgressBar";
import {
  Star,
  Edit,
  Trash2,
  ArrowRight,
  Plus,
  Book,
  Bookmark,
  Check,
} from "lucide-react";

const TYPE_FLAGS: Record<string, string> = {
  Manhwa: "🇰🇷",
  Manhua: "🇨🇳",
  Manga: "🇯🇵",
};

const STATUS_LABELS: Record<string, string> = {
  Completed: "✅ Completed",
  Reading: "📖 Reading",
  Planned: "⏳ Planned",
};

const randomPlaceholder = [
  "/photo-1486312338219-ce68d2c6f44d",
  "/photo-1488590528505-98d2b5aba04b",
  "/photo-1518770660439-4636190af475",
  "/photo-1461749280684-dccba630e2f6",
];

function getPlaceholderCover(id: string) {
  const idx = parseInt(id.slice(-1), 36) % randomPlaceholder.length;
  return randomPlaceholder[idx];
}

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

type Props = {
  title: ManhwaTitle;
  onAddChapter: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenSite: () => void;
  onToggleFavorite: () => void;
};

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
  return (
    <div className="group bg-card rounded-lg shadow-card p-4 flex flex-col relative hover:shadow-lg transition-shadow duration-200">
      {/* Favorite badge */}
      {title.isFavorite && (
        <div className="absolute top-4 right-4 z-10">
          <Star size={18} className="text-yellow-400 fill-yellow-300" />
        </div>
      )}
      {/* Cover image */}
      <div
        className="relative w-full aspect-[4/5] bg-muted rounded-md mb-3 overflow-hidden flex items-center justify-center shadow-inner"
        style={{
          backgroundImage: title.coverUrl
            ? `url(${title.coverUrl})`
            : `url(${getPlaceholderCover(title.id)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!title.coverUrl && (
          <span className="text-2xl text-slate-400 select-none">
            <Book className="mx-auto" />
          </span>
        )}
      </div>
      {/* Info */}
      <div className="flex items-center gap-2 mb-2">
        <span className="rounded border bg-slateBlue/10 text-slateBlue font-medium text-xs px-2 py-0.5 flex items-center gap-1">
          {TYPE_FLAGS[title.type] || ""} {title.type}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs font-medium
          ${title.status === "Reading"
            ? "bg-violet-500/10 text-violet-600"
            : title.status === "Completed"
            ? "bg-green-50 text-green-600"
            : "bg-slate-200 text-slate-500"}
        `}>
          {STATUS_LABELS[title.status]}
        </span>
        <span className="ml-auto text-xs text-slate-400">{timeAgo(title.lastUpdated)}</span>
      </div>
      {/* Title */}
      <h3 className="font-semibold text-lg mb-1 truncate">{title.title}</h3>
      {/* Tags */}
      {title.tags && title.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {title.tags.map((tag) => (
            <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-slate-500 border">{tag}</span>
          ))}
        </div>
      )}
      {/* Progress */}
      <div className="mb-2 flex items-center gap-2">
        <ProgressBar value={progress} max={total || Math.max(progress, 1)} />
        <span className="text-[13px] text-slate-500 ml-2">
          {progress}
          {total ? <>/{total}</> : ""}
        </span>
      </div>
      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          className="rounded-full bg-violet-100 hover:bg-violet-300/80 text-violet-700 px-2 py-1 transition hover-scale shadow"
          title="Add 1 Chapter"
          onClick={onAddChapter}
        >
          <Plus size={18} />
        </button>
        <button
          className="rounded-full bg-violet-50 hover:bg-violet-200 text-violet-700 px-2 py-1 transition hover-scale"
          title="Edit"
          onClick={onEdit}
        >
          <Edit size={18} />
        </button>
        <button
          className="rounded-full bg-slate-200 hover:bg-violet-200 text-violet-700 px-2 py-1 transition hover-scale"
          title="Favorite"
          onClick={onToggleFavorite}
        >
          <Star size={18} className={title.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-slate-400"} />
        </button>
        <button
          className="rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 transition hover-scale"
          title="Open Reading Site"
          onClick={onOpenSite}
          disabled={!title.siteUrl}
        >
          <ArrowRight size={18} />
        </button>
        <button
          className="rounded-full bg-pinkAccent/20 hover:bg-pinkAccent text-pinkAccent px-2 py-1 transition hover-scale"
          title="Delete"
          onClick={onDelete}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

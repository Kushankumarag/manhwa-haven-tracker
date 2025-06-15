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

  // Badge colors
  const typeColors: { [k: string]: string } = {
    Manhwa: "bg-[#ffd600] text-black",
    Manhua: "bg-[#B0C4FA] text-black",
    Manga: "bg-[#ee99c2] text-black",
  };

  return (
    <div className="bg-[#232323] border-0 rounded-xl shadow-md flex flex-col h-full hover:scale-[1.015] hover:shadow-lg transition p-3">
      {/* Cover image */}
      <div
        className="w-full aspect-[4/5] bg-[#111] rounded-lg mb-3 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: title.coverUrl ? `url(${title.coverUrl})` : undefined,
          backgroundSize: title.coverUrl ? "cover" : undefined,
          backgroundPosition: title.coverUrl ? "center" : undefined,
        }}
      >
        {!title.coverUrl && (
          <span className="text-2xl text-gray-700 select-none">No Image</span>
        )}
      </div>
      {/* Info */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${typeColors[title.type] || "bg-gray-200 text-black"}`}>
          {title.type}
        </span>
        <span className="rounded px-2 py-0.5 text-xs font-semibold bg-gray-800 text-gray-100 border border-gray-700">
          {title.status}
        </span>
        <span className="ml-auto text-xs text-gray-400">{timeAgo(title.lastUpdated)}</span>
      </div>
      {/* Title */}
      <h3 className="font-bold text-lg mb-1 truncate text-white">{title.title}</h3>
      {/* Tags */}
      {title.tags && title.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {title.tags.map((tag) => (
            <span key={tag} className="text-xs bg-[#181818] px-2 py-0.5 rounded text-gray-300 border border-gray-700">{tag}</span>
          ))}
        </div>
      )}
      {/* Progress */}
      <div className="mb-2 flex items-center gap-2">
        <ProgressBar value={progress} max={total || Math.max(progress, 1)} />
        <span className="text-[13px] text-gray-200 ml-2">
          {progress}
          {total ? <>/{total}</> : ""}
        </span>
      </div>
      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          className="rounded-md bg-[#292929] hover:bg-[#363636] text-white px-2 py-1 border-0"
          title="Add 1 Chapter"
          onClick={onAddChapter}
        >
          +1 Chapter
        </button>
        <button
          className="rounded-md bg-[#292929] hover:bg-[#363636] text-white px-2 py-1 border-0"
          title="Edit"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className={`rounded-md ${title.isFavorite ? "bg-[#ffd600] text-black" : "bg-[#292929] text-white"} hover:bg-[#ffd600] hover:text-black px-2 py-1 border-0`}
          title="Favorite"
          onClick={onToggleFavorite}
        >
          Fav
        </button>
        <button
          className="rounded-md bg-[#212121] hover:bg-[#444] text-white px-2 py-1 border-0"
          title="Open Reading Site"
          onClick={onOpenSite}
          disabled={!title.siteUrl}
        >
          Open
        </button>
        <button
          className="rounded-md bg-[#2b191f] hover:bg-red-800 text-red-400 px-2 py-1 border-0"
          title="Delete"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

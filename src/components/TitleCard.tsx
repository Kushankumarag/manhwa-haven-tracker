
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
  return (
    <div className="bg-white border rounded p-4 flex flex-col h-full">
      {/* Cover image */}
      <div
        className="w-full aspect-[4/5] bg-gray-100 rounded mb-3 flex items-center justify-center"
        style={{
          backgroundImage: title.coverUrl ? `url(${title.coverUrl})` : undefined,
          backgroundSize: title.coverUrl ? "cover" : undefined,
          backgroundPosition: title.coverUrl ? "center" : undefined,
        }}
      >
        {!title.coverUrl && (
          <span className="text-2xl text-gray-300 select-none">No Image</span>
        )}
      </div>
      {/* Info */}
      <div className="flex items-center gap-2 mb-2">
        <span className="rounded bg-gray-200 text-gray-700 font-normal text-xs px-2 py-0.5">
          {title.type}
        </span>
        <span className="rounded bg-gray-100 text-gray-600 text-xs px-2 py-0.5">
          {title.status}
        </span>
        <span className="ml-auto text-xs text-gray-400">{timeAgo(title.lastUpdated)}</span>
      </div>
      {/* Title */}
      <h3 className="font-semibold text-lg mb-1 truncate">{title.title}</h3>
      {/* Tags */}
      {title.tags && title.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {title.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 border">{tag}</span>
          ))}
        </div>
      )}
      {/* Progress */}
      <div className="mb-2 flex items-center gap-2">
        <ProgressBar value={progress} max={total || Math.max(progress, 1)} />
        <span className="text-[13px] text-gray-600 ml-2">
          {progress}
          {total ? <>/{total}</> : ""}
        </span>
      </div>
      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          className="rounded bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 border"
          title="Add 1 Chapter"
          onClick={onAddChapter}
        >
          +1 Chapter
        </button>
        <button
          className="rounded bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 border"
          title="Edit"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="rounded bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 border"
          title="Favorite"
          onClick={onToggleFavorite}
        >
          Fav
        </button>
        <button
          className="rounded bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 border"
          title="Open Reading Site"
          onClick={onOpenSite}
          disabled={!title.siteUrl}
        >
          Open
        </button>
        <button
          className="rounded bg-gray-200 hover:bg-red-200 text-red-600 px-2 py-1 border"
          title="Delete"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};


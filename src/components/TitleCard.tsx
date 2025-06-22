
import React, { useState } from "react";
import { ManhwaTitle } from "@/types";
import { ProgressBar } from "./ProgressBar";
import { ReadingHistory } from "./ReadingHistory";
import { Link as LinkIcon, MoreHorizontal } from "lucide-react";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";

type Props = {
  title: ManhwaTitle;
  onAddChapter: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenSite: () => void;
  onToggleFavorite: () => void;
  onCopySiteUrl?: () => void;
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
  onCopySiteUrl
}) => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const total = title.totalChapters || 0;
  const progress = total ? Math.min(title.chapter, total) : title.chapter;
  const typeColors: {
    [k: string]: string;
  } = {
    Manhwa: "bg-[#ffd600]/90 text-black",
    Manhua: "bg-[#B0C4FA]/90 text-blue-900",
    Manga: "bg-[#ee99c2]/90 text-pink-900"
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg flex flex-col h-full hover:scale-[1.012] hover:shadow-xl transition-all duration-200 p-2 sm:p-3 border-0 min-w-0 relative">
      {/* Cover image with in-corner 3-dot icon */}
      <div className="w-full aspect-[3/4] sm:aspect-[4/5] bg-secondary rounded-xl mb-2 flex items-center justify-center overflow-hidden relative">
        {/* 3-dot menu top right */}
        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10">
          <Menubar className="bg-transparent">
            <MenubarMenu>
              <MenubarTrigger asChild>
                <button 
                  aria-label="More actions" 
                  type="button" 
                  className="p-1 sm:p-0 m-0 border-none bg-black/20 sm:bg-transparent rounded-full sm:rounded-none outline-none shadow-none ring-offset-0 focus:ring-0 focus-visible:ring-0 hover:bg-black/30 sm:hover:bg-transparent active:bg-black/40 sm:active:bg-transparent backdrop-blur-sm sm:backdrop-blur-none" 
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    border: "none",
                    boxShadow: "none",
                    padding: "4px",
                    margin: 0
                  }}
                >
                  <MoreHorizontal size={16} className="text-white sm:text-foreground" />
                </button>
              </MenubarTrigger>
              <MenubarContent align="end">
                <MenubarItem className="text-destructive" onClick={onDelete}>
                  Delete
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        
        {/* Cover image - Fixed mobile display */}
        {title.coverUrl ? (
          <img 
            src={title.coverUrl} 
            alt={title.title}
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
            style={{ borderRadius: 'inherit' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = parent.querySelector('.fallback-text');
                if (fallback) {
                  (fallback as HTMLElement).style.display = 'block';
                }
              }
            }}
          />
        ) : null}
        
        {/* Fallback text */}
        <span 
          className={`fallback-text relative z-0 text-xs sm:text-base text-muted-foreground select-none ${title.coverUrl ? 'hidden' : 'block'}`}
        >
          No Image
        </span>
      </div>
      
      {/* Info section - Improved mobile layout */}
      <div className="flex items-center gap-1 mb-1 text-xs sm:text-sm">
        <span className={`rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-bold shadow-sm ${typeColors[title.type] || "bg-gray-200 text-black"}`}>
          {title.type}
        </span>
        <span className="rounded-full px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold bg-muted text-muted-foreground">
          {title.status}
        </span>
        <span className="ml-auto text-[9px] sm:text-[10px] text-muted-foreground">
          {timeAgo(title.lastUpdated)}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="font-bold text-sm sm:text-base mb-1 truncate text-foreground leading-tight">{title.title}</h3>
      
      {/* Tags */}
      {title.tags && title.tags.length > 0 && (
        <div className="mb-1 flex flex-wrap gap-1">
          {title.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] sm:text-[10px] bg-muted px-1.5 sm:px-2 py-0.5 rounded-full text-muted-foreground">
              {tag}
            </span>
          ))}
          {title.tags.length > 2 && (
            <span className="text-[9px] sm:text-[10px] bg-muted px-1.5 sm:px-2 py-0.5 rounded-full text-muted-foreground">
              +{title.tags.length - 2}
            </span>
          )}
        </div>
      )}
      
      {/* Progress */}
      <div className="mb-2 flex items-center gap-2">
        <ProgressBar value={progress} max={total || Math.max(progress, 1)} />
        <span className="text-[10px] sm:text-[11px] text-muted-foreground whitespace-nowrap">
          {progress}
          {total ? <>/{total}</> : ""}
        </span>
      </div>
      
      {/* Actions row - Better mobile layout */}
      <div className="flex flex-wrap gap-1 mt-auto items-center">
        <button 
          className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] sm:text-xs font-medium hover:bg-primary/20 transition" 
          title="Add 1 Chapter" 
          onClick={onAddChapter}
        >
          +1
        </button>
        <button 
          className="rounded-full bg-secondary text-foreground px-2 py-0.5 text-[10px] sm:text-xs font-medium hover:bg-muted transition" 
          title="Edit" 
          onClick={onEdit}
        >
          Edit
        </button>
        <button 
          className={`rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium transition ${title.isFavorite ? "bg-[#ffd600]/80 text-black" : "bg-secondary text-foreground hover:bg-[#ffd600]/80 hover:text-black"}`} 
          title="Favorite" 
          onClick={onToggleFavorite}
        >
          Fav
        </button>
        <button 
          className="rounded-full bg-secondary text-foreground px-2 py-0.5 text-[10px] sm:text-xs font-medium hover:bg-muted transition" 
          title="Open Reading Site" 
          onClick={onOpenSite} 
          disabled={!title.siteUrl}
        >
          Open
        </button>
        {/* Copy URL button */}
        {title.siteUrl && onCopySiteUrl && (
          <button 
            className="rounded-full bg-secondary text-foreground px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium hover:bg-primary/20 transition flex items-center gap-1" 
            title="Copy Site URL" 
            onClick={onCopySiteUrl} 
            type="button"
          >
            <LinkIcon size={10} className="inline-block" />
            <span className="sr-only">Copy URL</span>
          </button>
        )}
      </div>

      {/* Reading History */}
      <ReadingHistory
        history={title.readingHistory || []}
        titleName={title.title}
        isExpanded={isHistoryExpanded}
        onToggle={() => setIsHistoryExpanded(!isHistoryExpanded)}
      />
    </div>
  );
};

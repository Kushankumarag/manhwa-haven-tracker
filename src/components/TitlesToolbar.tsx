
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Star, X, Grid2x2, Grid3x3, List, Grid } from "lucide-react";
import { TitleStatus, TitleType } from "@/types";

const TABS = [
  { id: "all", label: "All" },
  { id: "reading", label: "Reading" },
  { id: "completed", label: "Completed" },
  { id: "planned", label: "Planned" },
  { id: "favorites", label: <><Star className="inline-block -mt-1 text-yellow-400" size={18} /> Favorites</> },
];

const SORTS = [
  { id: "recent", label: "Recently Updated" },
  { id: "alpha", label: "A-Z" },
  { id: "progress", label: "Progress" },
];

const GRID_OPTIONS = [
  { value: 2, icon: List, label: "2" },
  { value: 3, icon: Grid2x2, label: "3" },
  { value: 4, icon: Grid3x3, label: "4" },
  { value: 6, icon: Grid, label: "6" },
];

interface TitlesToolbarProps {
  tab: string;
  setTab: (tab: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  search: string;
  setSearch: (search: string) => void;
  typeFilter: TitleType | "";
  setTypeFilter: (type: TitleType | "") => void;
  statusFilter: TitleStatus | "";
  setStatusFilter: (status: TitleStatus | "") => void;
  grid: number;
  setGrid: (grid: number) => void;
  onAddNew: () => void;
}

export const TitlesToolbar: React.FC<TitlesToolbarProps> = ({
  tab,
  setTab,
  sortBy,
  setSortBy,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  grid,
  setGrid,
  onAddNew,
}) => {
  function handleClearSearch() {
    setSearch("");
  }

  return (
    <div className="flex flex-col gap-4 mt-4 mb-6">
      {/* Top row: Add button and tabs */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={onAddNew}
            className="px-4 sm:px-6 py-2 bg-primary text-white rounded-full shadow-md font-semibold text-sm sm:text-base hover:bg-primary/80 transition-all"
          >
            <Plus size={16} className="mr-1 sm:mr-2" />
            Add New
          </Button>
          
          {/* Tabs - Scrollable on mobile */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0">
            {TABS.map((t) => (
              <Button
                key={t.id}
                variant="ghost"
                className={`
                  px-3 sm:px-5 py-1.5 sm:py-2 rounded-full whitespace-nowrap text-sm sm:text-base
                  ${tab === t.id ? "bg-primary text-white font-semibold shadow-sm" : "bg-transparent text-muted-foreground"}
                  transition flex-shrink-0
                `}
                onClick={() => setTab(t.id)}
              >
                {t.id === "favorites" ? (
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={14} />
                    <span className="hidden sm:inline">Favorites</span>
                    <span className="sm:hidden">Fav</span>
                  </div>
                ) : (
                  t.label
                )}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Grid Toggle Buttons - Fixed grid selection */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          {GRID_OPTIONS.map(opt => {
            const IconComponent = opt.icon;
            return (
              <button
                key={opt.value}
                className={`rounded-full p-1.5 sm:p-2 border text-xs sm:text-sm transition-colors ${
                  grid === opt.value 
                    ? "bg-primary text-white border-primary shadow-sm" 
                    : "bg-card text-muted-foreground border-muted-foreground/20 hover:bg-primary/10 hover:border-primary/30"
                }`}
                title={`Show ${opt.value} columns`}
                onClick={() => setGrid(opt.value)}
              >
                <IconComponent size={16} />
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Filters/Search row - Improved mobile layout */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 sm:flex-none sm:w-44 md:w-56">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title / tag / type"
            className="w-full rounded-full bg-muted text-foreground placeholder:text-muted-foreground shadow-md pr-10 text-sm"
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
              aria-label="Clear search"
              tabIndex={0}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TitleType)}
            className="flex-1 sm:flex-none rounded-full px-3 sm:px-5 py-2 bg-muted text-foreground border-0 font-medium shadow-md focus:ring-2 focus:ring-primary/50 transition text-sm"
          >
            <option value="">All Types</option>
            <option value="Manhwa">Manhwa</option>
            <option value="Manhua">Manhua</option>
            <option value="Manga">Manga</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TitleStatus)}
            className="flex-1 sm:flex-none rounded-full px-3 sm:px-5 py-2 bg-muted text-foreground border-0 font-medium shadow-md focus:ring-2 focus:ring-primary/50 transition text-sm"
          >
            <option value="">All Status</option>
            <option value="Reading">Reading</option>
            <option value="Completed">Completed</option>
            <option value="Planned">Planned</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 sm:flex-none rounded-full px-3 sm:px-5 py-2 bg-muted text-foreground border-0 font-medium shadow-md focus:ring-2 focus:ring-primary/50 transition text-sm"
          >
            {SORTS.map((s) => (
              <option value={s.id} key={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

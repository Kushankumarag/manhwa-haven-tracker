import React, { useEffect, useState } from "react";
import { ManhwaTitle, TitleStatus, TitleType } from "@/types";
import {
  saveTitlesToStorage,
  loadTitlesFromStorage,
  exportTitlesAsJson,
  importTitlesFromJson,
} from "@/utils/localStore";
import { TitleCard } from "@/components/TitleCard";
import { AddTitleModal } from "@/components/AddTitleModal";
import { Header } from "@/components/Header";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, Star, Search, Book, X, Link as LinkIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { History, Grid2x2, Grid3x3, Grid4x4, List } from "lucide-react";

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now();
}

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

export default function Index() {
  const [titles, setTitles] = useState<ManhwaTitle[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTitle, setEditingTitle] = useState<ManhwaTitle | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [tab, setTab] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TitleType | "">("");
  const [statusFilter, setStatusFilter] = useState<TitleStatus | "">("");
  const [isDark, setIsDark] = useDarkMode();
  const [grid, setGrid] = useState(4); // New: 2, 3, 4, or 6

  useEffect(() => {
    setTitles(loadTitlesFromStorage());
  }, []);

  useEffect(() => {
    saveTitlesToStorage(titles);
  }, [titles]);

  function handleAddNew(data: Omit<ManhwaTitle, "id" | "lastUpdated">) {
    const newTitle: ManhwaTitle = {
      ...data,
      id: generateId(),
      lastUpdated: Date.now(),
      isFavorite: data.isFavorite || false,
    };
    setTitles((prev) => [newTitle, ...prev]);
  }

  function handleEdit(data: Omit<ManhwaTitle, "id" | "lastUpdated">) {
    if (!editingTitle) return;
    setTitles((prev) =>
      prev.map((t) =>
        t.id === editingTitle.id
          ? { ...t, ...data, lastUpdated: Date.now() }
          : t
      )
    );
    setEditingTitle(null);
    setIsEditing(false);
  }

  function openEditModal(title: ManhwaTitle) {
    setEditingTitle(title);
    setIsEditing(true);
    setShowAddModal(true);
  }

  function onDelete(id: string) {
    setTitles((prev) => prev.filter((t) => t.id !== id));
  }

  function onAddChapter(id: string) {
    setTitles((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, chapter: t.chapter + 1, lastUpdated: Date.now() }
          : t
      )
    );
  }

  function onToggleFavorite(id: string) {
    setTitles((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isFavorite: !t.isFavorite, lastUpdated: Date.now() } : t
      )
    );
  }

  function onOpenSite(title: ManhwaTitle) {
    if (title.siteUrl) window.open(title.siteUrl, "_blank");
  }

  function onMarkAsReading(id: string) {
    setTitles((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "Reading", lastUpdated: Date.now() }
          : t
      )
    );
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const imported = await importTitlesFromJson(e.target.files[0]);
      setTitles(imported.map((t) => ({ ...t, lastUpdated: Date.now() })));
    } catch {
      alert("Error importing JSON. Please check your file format.");
    }
  }

  // New: Clear search handler
  function handleClearSearch() {
    setSearch("");
  }

  // Grid toggle options
  const GRID_OPTIONS = [
    { value: 2, icon: List, label: "2" },
    { value: 3, icon: Grid2x2, label: "3" },
    { value: 4, icon: Grid3x3, label: "4" },
    { value: 6, icon: Grid4x4, label: "6" },
  ];

  // Filtering logic
  let filtered = titles;
  if (tab === "reading")
    filtered = filtered.filter((t) => t.status === "Reading");
  else if (tab === "completed")
    filtered = filtered.filter((t) => t.status === "Completed");
  else if (tab === "planned")
    filtered = filtered.filter((t) => t.status === "Planned");
  else if (tab === "favorites")
    filtered = filtered.filter((t) => t.isFavorite);

  if (search.trim().length > 0) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.tags && t.tags.join(",").toLowerCase().includes(query)) ||
        t.type.toLowerCase().includes(query)
    );
  }
  if (typeFilter)
    filtered = filtered.filter((t) => t.type === typeFilter);
  if (statusFilter)
    filtered = filtered.filter((t) => t.status === statusFilter);

  // Sorting
  filtered = filtered.slice().sort((a, b) => {
    if (sortBy === "recent")
      return b.lastUpdated - a.lastUpdated;
    if (sortBy === "alpha")
      return a.title.localeCompare(b.title);
    if (sortBy === "progress")
      return ((b.chapter / (b.totalChapters || 1)) - (a.chapter / (a.totalChapters || 1)));
    return 0;
  });

  // Separate favorites for pinning
  const favs = filtered.filter((t) => t.isFavorite);
  const nonFavs = filtered.filter((t) => !t.isFavorite);
  const displayed = [...favs, ...nonFavs];

  // New: Filtered count
  const filteredCount = displayed.length;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Header
        onDarkToggle={() => setIsDark((v: boolean) => !v)}
        isDark={isDark}
        onExport={() => exportTitlesAsJson(titles)}
        onImport={handleImport}
        totalCount={titles.length}
      />
      <main className="max-w-6xl mx-auto px-2 pb-8">
        {/* Add & Filter toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mt-2 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                setShowAddModal(true);
                setEditingTitle(null);
                setIsEditing(false);
              }}
              className="px-6 py-2 bg-primary text-white rounded-full shadow-md font-semibold text-base hover:bg-primary/80 transition-all"
            >
              Add New
            </Button>
            <div className="flex items-center gap-2">
              {TABS.map((t) => (
                <Button
                  key={t.id}
                  variant="ghost"
                  className={`
                    px-5 py-2 rounded-full
                    ${tab === t.id ? "bg-primary text-white font-semibold shadow-sm" : "bg-transparent text-muted-foreground"}
                    transition text-base
                  `}
                  onClick={() => setTab(t.id)}
                >
                  {typeof t.label === "object" ? "Favorites" : t.label}
                </Button>
              ))}
            </div>
            {/* Grid Toggle Buttons */}
            <div className="flex items-center gap-1 ml-4">
              {GRID_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`rounded-full p-1.5 border ${grid === opt.value ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-muted-foreground/20"} transition hover:bg-primary/10`}
                  title={`Show ${opt.value} columns`}
                  onClick={() => setGrid(opt.value)}
                >
                  <opt.icon size={18} />
                </button>
              ))}
            </div>
          </div>
          {/* Filters/Search */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-44 md:w-56">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title / tag / type"
                className="w-full rounded-full bg-muted text-foreground placeholder:text-muted-foreground shadow-md pr-8"
              />
              {search.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                  aria-label="Clear search"
                  tabIndex={0}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TitleType)}
              className="rounded-full px-5 py-2 bg-muted text-foreground border-0 font-medium shadow-md focus:ring-2 focus:ring-primary/50 transition"
            >
              <option value="">All Types</option>
              <option value="Manhwa">Manhwa</option>
              <option value="Manhua">Manhua</option>
              <option value="Manga">Manga</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TitleStatus)}
              className="rounded-full px-5 py-2 bg-muted text-foreground border-0 font-medium shadow-md focus:ring-2 focus:ring-primary/50 transition"
            >
              <option value="">All Statuses</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
              <option value="Planned">Planned</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full px-5 py-2 bg-muted text-foreground border-0 font-medium shadow-md focus:ring-2 focus:ring-primary/50 transition"
            >
              {SORTS.map((s) => (
                <option value={s.id} key={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Section header */}
        <div className="flex items-center mb-3">
          <h2 className="text-2xl font-bold border-l-4 border-primary/80 pl-3 py-1">Tracked Titles</h2>
          {/* New: Filtered result count */}
          <span className="ml-3 text-sm px-3 py-1 bg-secondary rounded-full text-muted-foreground">{filteredCount} shown</span>
        </div>
        {/* List/Grid Main Content */}
        <section>
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <p className="text-lg">No tracked titles. Click <b>Add New</b> to get started.</p>
            </div>
          ) : (
            <div className={
              grid === 2
                ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                : grid === 3
                ? "grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6"
                : grid === 4
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
                : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
            }>
              {displayed.map((t) => (
                <TitleCard
                  key={t.id}
                  title={t}
                  onAddChapter={() => onAddChapter(t.id)}
                  onEdit={() => openEditModal(t)}
                  onDelete={() => onDelete(t.id)}
                  onOpenSite={() => onOpenSite(t)}
                  onToggleFavorite={() => onToggleFavorite(t.id)}
                  onCopySiteUrl={() => {
                    if (t.siteUrl) {
                      navigator.clipboard.writeText(t.siteUrl);
                      toast({ title: "Site URL copied!", description: "The site URL has been copied to your clipboard." });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      {/* Add/Edit Modal */}
      <AddTitleModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTitle(null);
          setIsEditing(false);
        }}
        onSave={isEditing ? handleEdit : handleAddNew}
        isEditing={isEditing}
        editingTitle={editingTitle || undefined}
      />
    </div>
  );
}

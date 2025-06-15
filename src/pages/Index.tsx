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
import { Check, Plus, Star, Search, Book, X } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-[#181818] text-white font-sans">
      <Header
        onDarkToggle={() => setIsDark((v: boolean) => !v)}
        isDark={isDark}
        onExport={() => exportTitlesAsJson(titles)}
        onImport={handleImport}
        totalCount={titles.length}
      />
      <main className="max-w-6xl mx-auto px-2 pb-8">
        {/* Add & Filter toolbar */}
        <div className="flex flex-col md:flex-row gap-2 justify-between mt-2 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                setShowAddModal(true);
                setEditingTitle(null);
                setIsEditing(false);
              }}
              className="px-3 py-2 bg-[#7C3AED] text-white rounded-md border-0 shadow hover:bg-[#9F5FFF] transition"
            >
              Add New
            </Button>
            <div className="flex items-center gap-2">
              {TABS.map((t) => (
                <Button
                  key={t.id}
                  variant="ghost"
                  className={`px-4 py-2 rounded-md border-0 ${
                    tab === t.id
                      ? "bg-[#232323] text-[#ffd600] font-semibold"
                      : "bg-transparent text-gray-300"
                  } transition`}
                  onClick={() => setTab(t.id)}
                >
                  {typeof t.label === "object" ? "Favorites" : t.label}
                </Button>
              ))}
            </div>
          </div>
          {/* Filters/Search */}
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title / tag / type"
              className="w-44 md:w-56 rounded-md border-0 bg-[#232323] text-white placeholder:text-gray-400"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TitleType)}
              className="rounded-md border-0 px-2 py-1 bg-[#232323] text-white"
            >
              <option value="">All Types</option>
              <option value="Manhwa">Manhwa</option>
              <option value="Manhua">Manhua</option>
              <option value="Manga">Manga</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TitleStatus)}
              className="rounded-md border-0 px-2 py-1 bg-[#232323] text-white"
            >
              <option value="">All Statuses</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
              <option value="Planned">Planned</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border-0 px-2 py-1 bg-[#232323] text-white"
            >
              {SORTS.map((s) => (
                <option value={s.id} key={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Section header */}
        <h2 className="text-2xl font-bold mb-3 border-l-4 border-[#ffd600] pl-3 py-1">Tracked Titles</h2>
        {/* List/Grid Main Content */}
        <section>
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-gray-400">
              <p className="text-lg">No tracked titles. Click <b>Add New</b> to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayed.map((t) => (
                <TitleCard
                  key={t.id}
                  title={t}
                  onAddChapter={() => onAddChapter(t.id)}
                  onEdit={() => openEditModal(t)}
                  onDelete={() => onDelete(t.id)}
                  onOpenSite={() => onOpenSite(t)}
                  onToggleFavorite={() => onToggleFavorite(t.id)}
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


import React, { useState, useEffect } from "react";
import { ManhwaTitle, TitleStatus, TitleType } from "@/types";
import { useManhwaTitles } from "@/hooks/useManhwaTitles";
import { filterAndSortTitles, FilterOptions } from "@/utils/titleFilters";
import { TitlesToolbar } from "@/components/TitlesToolbar";
import { TitlesGrid } from "@/components/TitlesGrid";
import { AddTitleModal } from "@/components/AddTitleModal";
import { Header } from "@/components/Header";
import { PINEntry } from "@/components/PINEntry";
import { QRSync } from "@/components/QRSync";
import { useDarkMode } from "@/hooks/useDarkMode";
import { isPINEnabled } from "@/utils/pinSecurity";
import { extractSyncDataFromURL, parseSyncData } from "@/utils/qrSync";
import { toast } from "@/hooks/use-toast";

export default function Index() {
  const {
    titles,
    handleAddNew,
    handleEdit,
    onDelete,
    onAddChapter,
    onToggleFavorite,
    onMarkAsReading,
    handleImport,
    handleExport,
    handleQRImport,
  } = useManhwaTitles();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTitle, setEditingTitle] = useState<ManhwaTitle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showQRSync, setShowQRSync] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(!isPINEnabled());

  const [tab, setTab] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TitleType | "">("");
  const [statusFilter, setStatusFilter] = useState<TitleStatus | "">("");
  const [isDark, setIsDark] = useDarkMode();
  const [grid, setGrid] = useState(4);

  // Check for sync data in URL on mount
  useEffect(() => {
    const syncData = extractSyncDataFromURL();
    if (syncData && isUnlocked) {
      try {
        const importedTitles = parseSyncData(syncData);
        handleQRImport(importedTitles);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid sync data in URL",
          variant: "destructive"
        });
      }
    }
  }, [isUnlocked, handleQRImport]);

  function handleEditWrapper(data: Omit<ManhwaTitle, "id" | "lastUpdated">) {
    if (!editingTitle) return;
    handleEdit(editingTitle, data);
    setEditingTitle(null);
    setIsEditing(false);
  }

  function openEditModal(title: ManhwaTitle) {
    setEditingTitle(title);
    setIsEditing(true);
    setShowAddModal(true);
  }

  function handleAddNewClick() {
    setShowAddModal(true);
    setEditingTitle(null);
    setIsEditing(false);
  }

  function handleCloseModal() {
    setShowAddModal(false);
    setEditingTitle(null);
    setIsEditing(false);
  }

  // Filter and sort titles
  const filterOptions: FilterOptions = {
    tab,
    search,
    typeFilter,
    statusFilter,
    sortBy,
  };

  const filteredTitles = filterAndSortTitles(titles, filterOptions);

  // Show PIN entry if PIN is enabled and user hasn't unlocked
  if (!isUnlocked) {
    return <PINEntry onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Header
        onDarkToggle={() => setIsDark((v: boolean) => !v)}
        isDark={isDark}
        onExport={handleExport}
        onImport={handleImport}
        onQRSync={() => setShowQRSync(true)}
        totalCount={titles.length}
      />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 pb-8">
        <TitlesToolbar
          tab={tab}
          setTab={setTab}
          sortBy={sortBy}
          setSortBy={setSortBy}
          search={search}
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          grid={grid}
          setGrid={setGrid}
          onAddNew={handleAddNewClick}
        />

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold border-l-4 border-primary/80 pl-3 py-1">
            Tracked Titles
          </h2>
          <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-secondary rounded-full text-muted-foreground ml-0 sm:ml-3 self-start">
            {filteredTitles.length} shown
          </span>
        </div>

        <section>
          <TitlesGrid
            titles={filteredTitles}
            grid={grid}
            onAddChapter={onAddChapter}
            onEdit={openEditModal}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
          />
        </section>
      </main>

      <AddTitleModal
        open={showAddModal}
        onClose={handleCloseModal}
        onSave={isEditing ? handleEditWrapper : handleAddNew}
        isEditing={isEditing}
        editingTitle={editingTitle || undefined}
      />

      <QRSync
        open={showQRSync}
        onClose={() => setShowQRSync(false)}
        titles={titles}
        onImport={handleQRImport}
      />
    </div>
  );
}

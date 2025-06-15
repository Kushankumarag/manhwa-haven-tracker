
import React from "react";
import { Link } from "react-router-dom";
import { loadTitlesFromStorage } from "@/utils/localStore";
import { Star } from "lucide-react";

export default function Statistics() {
  const titles = loadTitlesFromStorage();

  const stats = {
    all: titles.length,
    reading: titles.filter((t) => t.status === "Reading").length,
    completed: titles.filter((t) => t.status === "Completed").length,
    planned: titles.filter((t) => t.status === "Planned").length,
    favorites: titles.filter((t) => t.isFavorite).length,
    manhwa: titles.filter((t) => t.type === "Manhwa").length,
    manhua: titles.filter((t) => t.type === "Manhua").length,
    manga: titles.filter((t) => t.type === "Manga").length,
    chaptersRead: titles.reduce((acc, t) => acc + t.chapter, 0),
    chaptersTracked: titles.reduce((acc, t) => acc + (t.totalChapters || 0), 0),
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-playfair font-bold mb-6 text-foreground">Statistics</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card rounded-xl p-4 shadow">
          <div className="text-xl font-bold">{stats.all}</div>
          <div className="text-muted-foreground">Total Titles</div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow">
          <div className="text-xl font-bold">{stats.reading}</div>
          <div className="text-muted-foreground">Reading</div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow">
          <div className="text-xl font-bold">{stats.completed}</div>
          <div className="text-muted-foreground">Completed</div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow">
          <div className="text-xl font-bold">{stats.planned}</div>
          <div className="text-muted-foreground">Planned</div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow flex items-center gap-1">
          <Star className="text-yellow-400" size={20}/>
          <span className="text-xl font-bold">{stats.favorites}</span>
          <div className="ml-1 text-muted-foreground">Favorites</div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow">
          <div className="text-xl font-bold">{stats.manhwa}</div>
          <div className="text-muted-foreground">Manhwa</div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow">
          <div className="text-xl font-bold">{stats.manhua}</div>
          <div className="text-muted-foreground">Manhua</div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow">
          <div className="text-xl font-bold">{stats.manga}</div>
          <div className="text-muted-foreground">Manga</div>
        </div>
      </div>
      <div className="bg-primary/10 rounded-xl px-6 py-5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <div className="font-bold text-lg">{stats.chaptersRead}</div>
          <div className="text-muted-foreground">Chapters Read</div>
        </div>
        <div>
          <div className="font-bold text-lg">{stats.chaptersTracked}</div>
          <div className="text-muted-foreground">Chapters Tracked</div>
        </div>
      </div>
      <Link
        to="/"
        className="inline-block text-primary hover:underline text-base font-medium"
      >
        ← Back to Titles
      </Link>
    </div>
  );
}

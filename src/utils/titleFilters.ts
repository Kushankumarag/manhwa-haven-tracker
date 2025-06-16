
import { ManhwaTitle, TitleStatus, TitleType } from "@/types";

export interface FilterOptions {
  tab: string;
  search: string;
  typeFilter: TitleType | "";
  statusFilter: TitleStatus | "";
  sortBy: string;
}

export function filterAndSortTitles(titles: ManhwaTitle[], options: FilterOptions): ManhwaTitle[] {
  let filtered = titles;

  // Tab filtering
  if (options.tab === "reading")
    filtered = filtered.filter((t) => t.status === "Reading");
  else if (options.tab === "completed")
    filtered = filtered.filter((t) => t.status === "Completed");
  else if (options.tab === "planned")
    filtered = filtered.filter((t) => t.status === "Planned");
  else if (options.tab === "favorites")
    filtered = filtered.filter((t) => t.isFavorite);

  // Search filtering
  if (options.search.trim().length > 0) {
    const query = options.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.tags && t.tags.join(",").toLowerCase().includes(query)) ||
        t.type.toLowerCase().includes(query)
    );
  }

  // Type and status filtering
  if (options.typeFilter)
    filtered = filtered.filter((t) => t.type === options.typeFilter);
  if (options.statusFilter)
    filtered = filtered.filter((t) => t.status === options.statusFilter);

  // Sorting
  filtered = filtered.slice().sort((a, b) => {
    if (options.sortBy === "recent")
      return b.lastUpdated - a.lastUpdated;
    if (options.sortBy === "alpha")
      return a.title.localeCompare(b.title);
    if (options.sortBy === "progress")
      return ((b.chapter / (b.totalChapters || 1)) - (a.chapter / (a.totalChapters || 1)));
    return 0;
  });

  // Separate favorites for pinning
  const favs = filtered.filter((t) => t.isFavorite);
  const nonFavs = filtered.filter((t) => !t.isFavorite);
  return [...favs, ...nonFavs];
}

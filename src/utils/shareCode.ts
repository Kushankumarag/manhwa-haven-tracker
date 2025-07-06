
import { ManhwaTitle } from "@/types";

// Generate a compact share code from titles
export function generateShareCode(titles: ManhwaTitle[]): string {
  try {
    // Create a compact data structure
    const shareData = {
      v: "1.0", // version
      t: Date.now(), // timestamp
      d: titles.map(title => ({
        i: title.id,
        n: title.title,
        c: title.chapter,
        tc: title.totalChapters || null,
        ty: title.type,
        s: title.status,
        url: title.siteUrl || "",
        img: title.coverUrl || "",
        tags: title.tags || [],
        fav: title.isFavorite || false,
        r: title.rating || null,
        lu: title.lastUpdated
      }))
    };

    // Convert to JSON string and encode
    const jsonString = JSON.stringify(shareData);
    const encoded = btoa(encodeURIComponent(jsonString));
    
    console.log(`Generated share code for ${titles.length} titles (${encoded.length} chars)`);
    return encoded;
  } catch (error) {
    console.error('Failed to generate share code:', error);
    throw new Error('Failed to generate share code');
  }
}

// Parse a share code back into titles
export function parseShareCode(shareCode: string): ManhwaTitle[] {
  try {
    // Decode the share code
    const jsonString = decodeURIComponent(atob(shareCode));
    const shareData = JSON.parse(jsonString);
    
    // Validate structure
    if (!shareData.d || !Array.isArray(shareData.d)) {
      throw new Error('Invalid share code format');
    }
    
    // Convert compact format back to full titles
    const titles: ManhwaTitle[] = shareData.d.map((item: any) => ({
      id: item.i || Math.random().toString(36).slice(2, 10) + Date.now(),
      title: item.n,
      chapter: item.c,
      totalChapters: item.tc,
      type: item.ty,
      status: item.s,
      siteUrl: item.url || "",
      coverUrl: item.img || "",
      tags: item.tags || [],
      isFavorite: item.fav || false,
      rating: item.r,
      lastUpdated: item.lu || Date.now(),
      readingHistory: [] // Don't include history in share codes for brevity
    }));

    // Validate each title has required properties
    const validTitles = titles.filter(title => {
      return title.title && 
        typeof title.chapter === 'number' &&
        ['Manhwa', 'Manhua', 'Manga'].includes(title.type) &&
        ['Reading', 'Completed', 'Planned'].includes(title.status);
    });

    if (validTitles.length === 0) {
      throw new Error('No valid titles found in share code');
    }

    console.log(`Parsed share code: ${validTitles.length} valid titles found`);
    return validTitles;
  } catch (error) {
    console.error('Failed to parse share code:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid share code format') || 
          error.message.includes('No valid titles found')) {
        throw error;
      }
    }
    
    throw new Error('Invalid or corrupted share code');
  }
}

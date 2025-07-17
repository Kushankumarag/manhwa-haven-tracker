
export interface ReadingSite {
  id: string;
  name: string;
  url: string;
  type: 'manhwa' | 'manhua';
  favicon?: string;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ReadingSiteFormData {
  name: string;
  url: string;
  type: 'manhwa' | 'manhua';
}


import { useState, useEffect } from 'react';
import { ReadingSite, ReadingSiteFormData } from '@/types/readingSites';
import { 
  saveReadingSitesToStorage, 
  loadReadingSitesFromStorage,
  getFaviconUrl,
  validateUrl
} from '@/utils/readingSites';
import { useToast } from '@/hooks/use-toast';

export function useReadingSites() {
  const [sites, setSites] = useState<ReadingSite[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadedSites = loadReadingSitesFromStorage();
    setSites(loadedSites);
    setLoading(false);
  }, []);

  const saveSites = (newSites: ReadingSite[]) => {
    setSites(newSites);
    saveReadingSitesToStorage(newSites);
  };

  const addSite = (formData: ReadingSiteFormData) => {
    if (!validateUrl(formData.url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
      return false;
    }

    const newSite: ReadingSite = {
      id: Math.random().toString(36).slice(2, 10) + Date.now(),
      name: formData.name.trim(),
      url: formData.url.startsWith('http') ? formData.url : `https://${formData.url}`,
      type: formData.type,
      favicon: getFaviconUrl(formData.url),
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const updatedSites = [...sites, newSite];
    saveSites(updatedSites);
    
    toast({
      title: "Site Added",
      description: `${newSite.name} has been added to your reading sites`
    });
    
    return true;
  };

  const updateSite = (id: string, formData: ReadingSiteFormData) => {
    if (!validateUrl(formData.url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
      return false;
    }

    const updatedSites = sites.map(site => 
      site.id === id ? {
        ...site,
        name: formData.name.trim(),
        url: formData.url.startsWith('http') ? formData.url : `https://${formData.url}`,
        type: formData.type,
        favicon: getFaviconUrl(formData.url),
        updatedAt: Date.now()
      } : site
    );

    saveSites(updatedSites);
    
    toast({
      title: "Site Updated",
      description: "Reading site has been updated successfully"
    });
    
    return true;
  };

  const deleteSite = (id: string) => {
    const siteToDelete = sites.find(site => site.id === id);
    const updatedSites = sites.filter(site => site.id !== id);
    saveSites(updatedSites);
    
    toast({
      title: "Site Deleted",
      description: `${siteToDelete?.name} has been removed from your reading sites`
    });
  };

  const togglePin = (id: string) => {
    const updatedSites = sites.map(site => 
      site.id === id ? { ...site, isPinned: !site.isPinned, updatedAt: Date.now() } : site
    );
    saveSites(updatedSites);
    
    const site = updatedSites.find(s => s.id === id);
    toast({
      title: site?.isPinned ? "Site Pinned" : "Site Unpinned",
      description: site?.isPinned ? `${site.name} pinned to top` : `${site?.name} unpinned`
    });
  };

  const getSortedSites = (type?: 'manhwa' | 'manhua') => {
    let filteredSites = type ? sites.filter(site => site.type === type) : sites;
    return filteredSites.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return b.updatedAt - a.updatedAt;
    });
  };

  return {
    sites,
    loading,
    addSite,
    updateSite,
    deleteSite,
    togglePin,
    getSortedSites,
    saveSites
  };
}

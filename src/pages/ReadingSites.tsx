
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Search, Download, Upload, FileDown, FileUp } from "lucide-react";
import { useReadingSites } from "@/hooks/useReadingSites";
import { ReadingSiteCard } from "@/components/ReadingSiteCard";
import { ReadingSiteForm } from "@/components/ReadingSiteForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadingSite } from "@/types/readingSites";
import { exportReadingSitesAsJson, importReadingSitesFromJson } from "@/utils/readingSites";
import { useToast } from "@/hooks/use-toast";

export default function ReadingSites() {
  const { type } = useParams<{ type: 'manhwa' | 'manhua' }>();
  const { sites, addSite, updateSite, deleteSite, togglePin, getSortedSites, saveSites } = useReadingSites();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSite, setEditingSite] = useState<ReadingSite | null>(null);

  const siteType = (type as 'manhwa' | 'manhua') || 'manhwa';
  
  const filteredSites = useMemo(() => {
    const sortedSites = getSortedSites(siteType);
    if (!searchTerm.trim()) return sortedSites;
    
    return sortedSites.filter(site =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [getSortedSites, siteType, searchTerm]);

  const handleFormSubmit = (formData: any) => {
    if (editingSite) {
      const success = updateSite(editingSite.id, formData);
      if (success) {
        setEditingSite(null);
      }
      return success;
    } else {
      return addSite(formData);
    }
  };

  const handleExport = () => {
    const typeSites = getSortedSites(siteType);
    const result = exportReadingSitesAsJson(typeSites);
    if (result.success) {
      toast({
        title: "Export Successful",
        description: `${typeSites.length} ${siteType} sites exported successfully`
      });
    } else {
      toast({
        title: "Export Failed",
        description: result.error || "Failed to export sites",
        variant: "destructive"
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedSites = await importReadingSitesFromJson(file);
      const filteredImports = importedSites.filter(site => site.type === siteType);
      
      if (filteredImports.length === 0) {
        toast({
          title: "No Matching Sites",
          description: `No ${siteType} sites found in the import file`,
          variant: "destructive"
        });
        return;
      }

      // Merge with existing sites, avoiding duplicates
      const existingSites = getSortedSites(siteType);
      const newSites = filteredImports.filter(importSite => 
        !existingSites.some(existing => 
          existing.name.toLowerCase() === importSite.name.toLowerCase() &&
          existing.url.toLowerCase() === importSite.url.toLowerCase()
        )
      );

      if (newSites.length === 0) {
        toast({
          title: "No New Sites",
          description: "All sites from the import file already exist",
        });
        return;
      }

      const updatedSites = [...sites, ...newSites.map(site => ({
        ...site,
        id: Math.random().toString(36).slice(2, 10) + Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      }))];

      saveSites(updatedSites);
      
      toast({
        title: "Import Successful",
        description: `${newSites.length} new ${siteType} sites imported successfully`
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import sites",
        variant: "destructive"
      });
    }

    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold capitalize truncate">{siteType} Sites</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your favorite {siteType} reading websites
          </p>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" onClick={handleExport} size="sm" className="text-xs md:text-sm">
            <FileDown className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Exp</span>
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <FileUp className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Import</span>
              <span className="sm:hidden">Imp</span>
            </Button>
          </div>
        </div>
      </div>

      <ReadingSiteForm
        type={siteType}
        editingSite={editingSite}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingSite(null)}
      />

      {filteredSites.length > 0 && (
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardHeader className="pb-3 md:pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <CardTitle className="text-lg md:text-xl truncate">
                Your {siteType === 'manhwa' ? 'Manhwa' : 'Manhua'} Sites ({filteredSites.length})
              </CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {filteredSites.map((site) => (
                <ReadingSiteCard
                  key={site.id}
                  site={site}
                  onEdit={setEditingSite}
                  onDelete={deleteSite}
                  onTogglePin={togglePin}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredSites.length === 0 && searchTerm && (
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No sites found matching "{searchTerm}"
            </p>
          </CardContent>
        </Card>
      )}

      {getSortedSites(siteType).length === 0 && !searchTerm && (
        <Card className="backdrop-blur-sm bg-card/50 border-border/50">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No {siteType} sites added yet. Add your first site above!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

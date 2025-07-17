
import { useState } from "react";
import { ExternalLink, Edit, Trash2, Pin, PinOff } from "lucide-react";
import { ReadingSite } from "@/types/readingSites";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ReadingSiteCardProps {
  site: ReadingSite;
  onEdit: (site: ReadingSite) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function ReadingSiteCard({ site, onEdit, onDelete, onTogglePin }: ReadingSiteCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleOpenSite = () => {
    window.open(site.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group relative backdrop-blur-sm bg-card/50 border-border/50 hover:bg-card/80 hover:border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {site.favicon && !imageError ? (
            <img 
              src={site.favicon} 
              alt={`${site.name} favicon`}
              className="w-6 h-6 rounded-sm"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-6 h-6 rounded-sm bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
              {site.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{site.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{site.url}</p>
          </div>
          {site.isPinned && (
            <Pin className="h-4 w-4 text-primary" />
          )}
        </div>
      </CardHeader>

      <CardFooter className="pt-0 pb-3">
        <div className="flex gap-2 w-full">
          <Button 
            size="sm" 
            onClick={handleOpenSite}
            className="flex-1 bg-primary/90 hover:bg-primary"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTogglePin(site.id)}
            className="hover:bg-accent"
          >
            {site.isPinned ? (
              <PinOff className="h-3 w-3" />
            ) : (
              <Pin className="h-3 w-3" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(site)}
            className="hover:bg-accent"
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(site.id)}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

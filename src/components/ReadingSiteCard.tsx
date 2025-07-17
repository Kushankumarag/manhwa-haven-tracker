
import { useState } from "react";
import { ExternalLink, Edit, Trash2, Pin, PinOff, MoreVertical } from "lucide-react";
import { ReadingSite } from "@/types/readingSites";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface ReadingSiteCardProps {
  site: ReadingSite;
  onEdit: (site: ReadingSite) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function ReadingSiteCard({ site, onEdit, onDelete, onTogglePin }: ReadingSiteCardProps) {
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const handleOpenSite = () => {
    window.open(site.url, '_blank', 'noopener,noreferrer');
    toast({
      title: "Opening Site",
      description: `Opening ${site.name} in a new tab`
    });
  };

  const handleTogglePin = () => {
    onTogglePin(site.id);
    toast({
      title: site.isPinned ? "Site Unpinned" : "Site Pinned",
      description: `${site.name} has been ${site.isPinned ? 'unpinned' : 'pinned to the top'}`
    });
  };

  const handleDelete = () => {
    onDelete(site.id);
    toast({
      title: "Site Deleted",
      description: `${site.name} has been removed from your list`
    });
  };

  return (
    <Card className="group relative backdrop-blur-sm bg-card/50 border-border/50 hover:bg-card/80 hover:border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in">
      <CardHeader className="pb-2 md:pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            {site.favicon && !imageError ? (
              <img 
                src={site.favicon} 
                alt={`${site.name} favicon`}
                className="w-5 h-5 md:w-6 md:h-6 rounded-sm flex-shrink-0"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-sm bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0">
                {site.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm md:text-base truncate leading-tight">{site.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{new URL(site.url).hostname}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            {site.isPinned && (
              <Pin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            )}
            
            {/* Mobile: Dropdown menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 touch-target">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleOpenSite}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Site
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(site)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleTogglePin}>
                    {site.isPinned ? (
                      <>
                        <PinOff className="h-4 w-4 mr-2" />
                        Unpin
                      </>
                    ) : (
                      <>
                        <Pin className="h-4 w-4 mr-2" />
                        Pin to Top
                      </>
                    )}
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Site</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{site.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardFooter className="pt-0 pb-3">
        {/* Mobile: Single open button */}
        <div className="md:hidden w-full">
          <Button 
            size="sm" 
            onClick={handleOpenSite}
            className="w-full bg-primary/90 hover:bg-primary touch-target"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Site
          </Button>
        </div>
        
        {/* Desktop: All buttons */}
        <div className="hidden md:flex gap-2 w-full">
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
            onClick={handleTogglePin}
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
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Site</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{site.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, X } from "lucide-react";
import { ReadingSite, ReadingSiteFormData } from "@/types/readingSites";
import { useToast } from "@/hooks/use-toast";

interface ReadingSiteFormProps {
  type: 'manhwa' | 'manhua';
  editingSite?: ReadingSite | null;
  onSubmit: (data: ReadingSiteFormData) => boolean;
  onCancel?: () => void;
}

export function ReadingSiteForm({ type, editingSite, onSubmit, onCancel }: ReadingSiteFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ReadingSiteFormData>({
    name: '',
    url: '',
    type
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSite) {
      setFormData({
        name: editingSite.name,
        url: editingSite.url,
        type: editingSite.type
      });
    } else {
      setFormData({
        name: '',
        url: '',
        type
      });
    }
  }, [editingSite, type]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Site name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.url.trim()) {
      toast({
        title: "Validation Error", 
        description: "Website URL is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateUrl(formData.url.trim())) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = onSubmit(formData);
      if (success) {
        if (!editingSite) {
          setFormData({ name: '', url: '', type });
        }
        toast({
          title: editingSite ? "Site Updated" : "Site Added",
          description: `${formData.name} has been ${editingSite ? 'updated' : 'added'} successfully`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', url: '', type });
    onCancel?.();
  };

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-border/50">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          {editingSite ? <Edit className="h-4 w-4 md:h-5 md:w-5" /> : <Plus className="h-4 w-4 md:h-5 md:w-5" />}
          {editingSite ? 'Edit' : 'Add New'} {type === 'manhwa' ? 'Manhwa' : 'Manhua'} Site
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Website Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Webtoon, MangaDex"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="touch-target"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                Website URL
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.webtoons.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="touch-target"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            {editingSite && onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="order-2 sm:order-1 touch-target"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              className="order-1 sm:order-2 touch-target" 
              disabled={isSubmitting}
            >
              {editingSite ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {editingSite ? 'Update' : 'Add'} Site
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

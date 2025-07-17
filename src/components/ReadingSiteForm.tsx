
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadingSite, ReadingSiteFormData } from "@/types/readingSites";

interface ReadingSiteFormProps {
  type: 'manhwa' | 'manhua';
  editingSite?: ReadingSite | null;
  onSubmit: (data: ReadingSiteFormData) => boolean;
  onCancel?: () => void;
}

export function ReadingSiteForm({ type, editingSite, onSubmit, onCancel }: ReadingSiteFormProps) {
  const [formData, setFormData] = useState<ReadingSiteFormData>({
    name: '',
    url: '',
    type
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.url.trim()) {
      const success = onSubmit(formData);
      if (success && !editingSite) {
        setFormData({ name: '', url: '', type });
      }
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {editingSite ? 'Edit' : 'Add New'} {type === 'manhwa' ? 'Manhwa' : 'Manhua'} Site
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Website Name (e.g., Webtoon, MangaDex)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="url"
              placeholder="Website URL (e.g., https://www.webtoons.com)"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingSite ? 'Update' : 'Add'} Site
            </Button>
            {editingSite && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

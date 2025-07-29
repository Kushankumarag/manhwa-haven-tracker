
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ManhwaTitle, TitleType, TitleStatus } from "@/types";
import { ImageIcon, AlertCircle, Star } from "lucide-react";

const initialState: Omit<ManhwaTitle, "id" | "lastUpdated"> = {
  title: "",
  chapter: 1,
  totalChapters: undefined,
  type: "Manhwa",
  siteUrl: "",
  coverUrl: "",
  tags: [],
  status: "Planned",
  isFavorite: false,
  rating: undefined,
};

type AddTitleModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (title: Omit<ManhwaTitle, "id" | "lastUpdated">) => void;
  isEditing?: boolean;
  editingTitle?: ManhwaTitle;
};

export const AddTitleModal: React.FC<AddTitleModalProps> = ({
  open,
  onClose,
  onSave,
  isEditing = false,
  editingTitle,
}) => {
  const [form, setForm] = useState<Omit<ManhwaTitle, "id" | "lastUpdated">>(
    editingTitle
      ? {
          title: editingTitle.title,
          chapter: editingTitle.chapter,
          totalChapters: editingTitle.totalChapters,
          type: editingTitle.type,
          siteUrl: editingTitle.siteUrl,
          coverUrl: editingTitle.coverUrl,
          tags: editingTitle.tags,
          status: editingTitle.status,
          isFavorite: editingTitle.isFavorite || false,
          rating: editingTitle.rating,
        }
      : initialState
  );

  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    if (editingTitle) {
      setForm({
        title: editingTitle.title,
        chapter: editingTitle.chapter,
        totalChapters: editingTitle.totalChapters,
        type: editingTitle.type,
        siteUrl: editingTitle.siteUrl,
        coverUrl: editingTitle.coverUrl,
        tags: editingTitle.tags,
        status: editingTitle.status,
        isFavorite: editingTitle.isFavorite || false,
        rating: editingTitle.rating,
      });
    } else {
      setForm(initialState);
    }
    setImageError(false);
    setImageLoading(false);
  }, [editingTitle, open, isEditing]);

  function handleChange<K extends keyof typeof form>(field: K, val: any) {
    setForm((prev) => ({
      ...prev,
      [field]: val,
    }));

    // Reset image states when URL changes
    if (field === "coverUrl") {
      setImageError(false);
      if (val && val.trim()) {
        setImageLoading(true);
      } else {
        setImageLoading(false);
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    onSave({
      ...form,
      tags: form.tags.filter((t) => t.trim() !== ""),
      chapter: Number(form.chapter) || 1,
      totalChapters: form.totalChapters ? Number(form.totalChapters) : undefined,
      rating: form.rating ? Number(form.rating) : undefined,
    });
    onClose();
  }

  function handleImageLoad() {
    setImageLoading(false);
    setImageError(false);
  }

  function handleImageError() {
    setImageLoading(false);
    setImageError(true);
  }

  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-popover p-0 rounded-2xl shadow-xl w-[95vw] max-w-md mx-auto border-0 overflow-visible max-h-[90vh] overflow-y-auto">
        <DialogTitle className="mb-4 sm:mb-6 mt-3 px-4 sm:px-8 text-xl sm:text-2xl font-semibold text-foreground text-center">
          {isEditing ? "Edit Title" : "Add New Title"}
        </DialogTitle>
        
        {/* Action Buttons positioned after title */}
        <div className="px-4 sm:px-8 mb-6 sm:mb-8">
          <div className="flex justify-end gap-2 sm:gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose} 
              className="rounded-full px-4 sm:px-6 py-2 bg-secondary text-foreground border-0 hover:bg-accent font-medium text-sm sm:text-base touch-target"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="add-title-form"
              className="rounded-full px-4 sm:px-6 py-2 bg-primary text-white border-0 font-bold hover:bg-primary/80 text-sm sm:text-base touch-target"
            >
              {isEditing ? "Save" : "Add"}
            </Button>
          </div>
        </div>
        
        <div className="px-4 sm:px-8 pb-6 sm:pb-8 w-full bg-popover rounded-b-2xl shadow-none text-foreground">
          <form id="add-title-form" className="space-y-5 sm:space-y-7" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold mb-2 text-sm sm:text-base text-foreground">Title</label>
              <Input
                type="text"
                required
                placeholder="e.g. Solo Leveling"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="bg-muted text-foreground font-medium text-sm sm:text-base"
              />
            </div>
            
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-2 text-sm sm:text-base text-foreground">Current Chapter</label>
                <Input
                  type="number"
                  min={1}
                  value={form.chapter}
                  onChange={(e) => handleChange("chapter", e.target.value)}
                  className="bg-muted text-foreground font-medium text-sm sm:text-base"
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-2 text-sm sm:text-base text-foreground">Total Chapters</label>
                <Input
                  type="number"
                  min={1}
                  value={form.totalChapters || ""}
                  placeholder="Optional"
                  onChange={(e) => handleChange("totalChapters", e.target.value)}
                  className="bg-muted text-foreground font-medium text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-2 text-sm sm:text-base text-foreground">Type</label>
                <select
                  className="w-full p-2 sm:p-3 rounded-full bg-muted text-foreground font-medium text-sm sm:text-base"
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value as TitleType)}
                >
                  <option value="Manhwa">Manhwa</option>
                  <option value="Manhua">Manhua</option>
                  <option value="Manga">Manga</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-2 text-sm sm:text-base text-foreground">Status</label>
                <select
                  className="w-full p-2 sm:p-3 rounded-full bg-muted text-foreground font-medium text-sm sm:text-base"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value as TitleStatus)}
                >
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>
            </div>

            {/* Rating Section */}
            <div>
              <label className="block font-semibold mb-2 text-sm sm:text-base text-foreground">Rating (1-10)</label>
              <div className="flex items-center gap-2">
                <select
                  className="w-full p-2 sm:p-3 rounded-full bg-muted text-foreground font-medium text-sm sm:text-base"
                  value={form.rating || ""}
                  onChange={(e) => handleChange("rating", e.target.value ? Number(e.target.value) : undefined)}
                >
                  <option value="">No Rating</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}/10</option>
                  ))}
                </select>
                {form.rating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-medium">{form.rating}/10</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block font-semibold mb-2 text-sm sm:text-base text-foreground">Reading Site URL</label>
              <Input
                type="url"
                value={form.siteUrl || ""}
                placeholder="https://example.com"
                onChange={(e) => handleChange("siteUrl", e.target.value)}
                className="bg-muted text-foreground font-medium text-sm sm:text-base"
              />
            </div>
            
            {/* Enhanced Cover Image URL section */}
            <div>
              <label className="block font-semibold mb-2 text-sm sm:text-base text-foreground">Cover Image URL</label>
              <Input
                type="url"
                value={form.coverUrl || ""}
                placeholder="https://example.com/image.jpg"
                onChange={(e) => handleChange("coverUrl", e.target.value)}
                className="bg-muted text-foreground font-medium text-sm sm:text-base"
              />
              
              {/* Live Preview Section */}
              {form.coverUrl && isValidImageUrl(form.coverUrl) && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Preview:</p>
                  <div className="relative">
                    {imageLoading && (
                      <div className="flex items-center justify-center w-16 h-20 bg-card border border-border rounded-md">
                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    
                    {!imageLoading && !imageError && (
                      <img 
                        src={form.coverUrl} 
                        alt="Cover preview" 
                        className="w-16 h-20 object-cover rounded-md shadow-sm animate-fade-in transition-opacity duration-300"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    )}
                    
                    {!imageLoading && imageError && (
                      <div className="flex flex-col items-center justify-center w-16 h-20 bg-card border border-border rounded-md text-muted-foreground">
                        <AlertCircle size={16} className="mb-1" />
                        <span className="text-xs text-center">Not Found</span>
                      </div>
                    )}
                    
                    {/* Hidden image for loading detection */}
                    {form.coverUrl && (
                      <img 
                        src={form.coverUrl}
                        className="hidden"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              )}
              
              {/* Invalid URL indicator */}
              {form.coverUrl && !isValidImageUrl(form.coverUrl) && (
                <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 text-destructive text-xs">
                    <AlertCircle size={14} />
                    <span>Please enter a valid URL</span>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block font-semibold mb-2 text-sm sm:text-base text-foreground">Tags (comma separated)</label>
              <Input
                type="text"
                value={form.tags.join(", ")}
                placeholder="action, adventure, drama"
                onChange={(e) => handleChange(
                  "tags",
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                )}
                className="bg-muted text-foreground font-medium text-sm sm:text-base"
              />
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

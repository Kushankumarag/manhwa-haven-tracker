
import React, { useState } from "react";
import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ManhwaTitle, TitleType, TitleStatus } from "@/types";

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
        }
      : initialState
  );

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
      });
    } else {
      setForm(initialState);
    }
  }, [editingTitle, open, isEditing]);

  function handleChange<K extends keyof typeof form>(field: K, val: any) {
    setForm((prev) => ({
      ...prev,
      [field]: val,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    onSave({
      ...form,
      tags: form.tags.filter((t) => t.trim() !== ""),
      chapter: Number(form.chapter) || 1,
      totalChapters: form.totalChapters ? Number(form.totalChapters) : undefined,
    });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="p-6 w-full max-w-md mx-auto bg-white rounded border">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="font-semibold text-base mb-2">{isEditing ? "Edit Title" : "Add New Title"}</h2>

            <div>
              <label className="block font-medium mb-1">Title</label>
              <Input
                type="text"
                required
                placeholder="e.g. Solo Leveling"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="bg-gray-100"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">Current Chapter</label>
                <Input
                  type="number"
                  min={1}
                  value={form.chapter}
                  onChange={(e) => handleChange("chapter", e.target.value)}
                  className="bg-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Total Chapters</label>
                <Input
                  type="number"
                  min={1}
                  value={form.totalChapters || ""}
                  placeholder="Optional"
                  onChange={(e) => handleChange("totalChapters", e.target.value)}
                  className="bg-gray-100"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium mb-1">Type</label>
                <select
                  className="w-full p-2 rounded border bg-gray-100"
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value as TitleType)}
                >
                  <option value="Manhwa">Manhwa</option>
                  <option value="Manhua">Manhua</option>
                  <option value="Manga">Manga</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 rounded border bg-gray-100"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value as TitleStatus)}
                >
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Reading Site URL</label>
              <Input
                type="url"
                value={form.siteUrl || ""}
                placeholder="https://example.com"
                onChange={(e) => handleChange("siteUrl", e.target.value)}
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Cover Image URL</label>
              <Input
                type="url"
                value={form.coverUrl || ""}
                placeholder="Paste image URL if available"
                onChange={(e) => handleChange("coverUrl", e.target.value)}
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Tags (comma separated)</label>
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
                className="bg-gray-100"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="secondary" onClick={onClose} className="rounded px-4">
                Cancel
              </Button>
              <Button type="submit" className="rounded px-4 bg-gray-900 text-white">
                {isEditing ? "Save" : "Add"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};


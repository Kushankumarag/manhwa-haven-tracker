
import React from "react";
import { ReadingHistoryEntry } from "@/types";
import { formatHistoryEntry } from "@/utils/readingHistory";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ReadingHistoryProps {
  history: ReadingHistoryEntry[];
  titleName: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ReadingHistory: React.FC<ReadingHistoryProps> = ({
  history,
  titleName,
  isExpanded,
  onToggle,
}) => {
  if (!history || history.length === 0) {
    return null;
  }

  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="mt-3 border-t border-border pt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="flex items-center gap-2 p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
      >
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Reading History ({history.length})
      </Button>

      {isExpanded && (
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
          {sortedHistory.map((entry) => (
            <div
              key={entry.id}
              className="text-xs bg-muted/50 rounded px-2 py-1.5 text-muted-foreground"
            >
              {formatHistoryEntry(entry, titleName)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

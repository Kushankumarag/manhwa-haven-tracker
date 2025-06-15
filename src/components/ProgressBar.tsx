
import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, className }) => {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${className || ""}`}>
      <div
        className="h-3 bg-violet-500 transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

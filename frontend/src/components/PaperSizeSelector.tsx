"use client";

import type { PaperSize } from "@/types/pop";
import { PAPER_SIZE_LABELS } from "@/types/pop";

interface PaperSizeSelectorProps {
  selected: PaperSize;
  onSelect: (size: PaperSize) => void;
}

const sizes: PaperSize[] = ["a4", "a5", "card"];

export function PaperSizeSelector({ selected, onSelect }: PaperSizeSelectorProps) {
  return (
    <div className="flex gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selected === size
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {PAPER_SIZE_LABELS[size]}
        </button>
      ))}
    </div>
  );
}

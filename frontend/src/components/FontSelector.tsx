"use client";

import type { FontFamily } from "@/types/pop";
import { FONT_LABELS } from "@/types/pop";
import { FONT_DEFINITIONS } from "@/lib/canvas/fonts";

interface FontSelectorProps {
  selected: FontFamily;
  onSelect: (font: FontFamily) => void;
}

const fontFamilies: FontFamily[] = ["gothic", "mincho", "handwritten", "brush"];

export function FontSelector({ selected, onSelect }: FontSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">フォント</label>
      <div className="grid grid-cols-2 gap-2">
        {fontFamilies.map((font) => (
          <button
            key={font}
            type="button"
            onClick={() => onSelect(font)}
            className={`px-3 py-2 rounded-lg text-sm border-2 transition-all ${
              selected === font
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span
              style={{ fontFamily: FONT_DEFINITIONS[font].cssFontFamily }}
              className="block text-base"
              aria-hidden="true"
            >
              あア亜
            </span>
            <span className="text-xs text-gray-500">{FONT_LABELS[font]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

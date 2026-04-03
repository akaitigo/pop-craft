"use client";

import { useState } from "react";
import { PRESET_COLORS, type ColorScheme } from "@/lib/canvas/colors";

interface ColorPickerProps {
  selectedId: string;
  onSelect: (scheme: ColorScheme) => void;
  onCustomColor?: (primary: string, accent: string) => void;
}

export function ColorPicker({ selectedId, onSelect, onCustomColor }: ColorPickerProps) {
  const [customPrimary, setCustomPrimary] = useState("#E53935");
  const [customAccent, setCustomAccent] = useState("#FDD835");

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">カラーパレット</label>
      <div className="grid grid-cols-4 gap-2">
        {PRESET_COLORS.map((scheme) => (
          <button
            key={scheme.id}
            type="button"
            onClick={() => onSelect(scheme)}
            className={`h-10 rounded-lg border-2 transition-all overflow-hidden ${
              selectedId === scheme.id
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
            title={scheme.name}
          >
            <div className="flex h-full">
              <div
                className="flex-1"
                style={{ backgroundColor: scheme.primary }}
              />
              <div
                className="w-1/3"
                style={{ backgroundColor: scheme.accent }}
              />
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label htmlFor="custom-primary" className="block text-xs text-gray-500 mb-1">
            カスタム（メイン）
          </label>
          <input
            id="custom-primary"
            type="color"
            value={customPrimary}
            onChange={(e) => {
              setCustomPrimary(e.target.value);
              onCustomColor?.(e.target.value, customAccent);
            }}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="custom-accent" className="block text-xs text-gray-500 mb-1">
            カスタム（アクセント）
          </label>
          <input
            id="custom-accent"
            type="color"
            value={customAccent}
            onChange={(e) => {
              setCustomAccent(e.target.value);
              onCustomColor?.(customPrimary, e.target.value);
            }}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

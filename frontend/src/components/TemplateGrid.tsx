"use client";

import type { Template } from "@/types/pop";

interface TemplateGridProps {
  templates: Template[];
  selectedId: string | null;
  onSelect: (template: Template) => void;
}

export function TemplateGrid({
  templates,
  selectedId,
  onSelect,
}: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        テンプレートがありません
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {templates.map((tmpl) => (
        <button
          key={tmpl.id}
          type="button"
          onClick={() => onSelect(tmpl)}
          className={`relative p-4 rounded-lg border-2 transition-all ${
            selectedId === tmpl.id
              ? "border-blue-500 shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div
            className="w-full h-20 rounded mb-2"
            style={{ backgroundColor: tmpl.primary_color }}
          >
            <div
              className="w-full h-5 rounded-t"
              style={{ backgroundColor: tmpl.accent_color }}
            />
          </div>
          <p className="text-sm font-medium truncate">{tmpl.name}</p>
          <p className="text-xs text-gray-400 truncate">{tmpl.description}</p>
        </button>
      ))}
    </div>
  );
}

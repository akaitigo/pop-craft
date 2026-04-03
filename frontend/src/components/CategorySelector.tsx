"use client";

import type { Category } from "@/types/pop";
import { CATEGORY_LABELS } from "@/types/pop";

const CATEGORY_ICONS: Record<Category, string> = {
  supermarket: "🛒",
  drugstore: "💊",
  bookstore: "📚",
};

const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  supermarket: "食品・日用品の販促POP",
  drugstore: "医薬品・化粧品の販促POP",
  bookstore: "書籍・文具の販促POP",
};

interface CategorySelectorProps {
  selected: Category | null;
  onSelect: (category: Category) => void;
}

const categories: Category[] = ["supermarket", "drugstore", "bookstore"];

export function CategorySelector({
  selected,
  onSelect,
}: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={`p-6 rounded-lg border-2 text-left transition-all ${
            selected === cat
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
          }`}
        >
          <span className="text-3xl" role="img" aria-label={CATEGORY_LABELS[cat]}>
            {CATEGORY_ICONS[cat]}
          </span>
          <h3 className="mt-2 text-lg font-semibold">{CATEGORY_LABELS[cat]}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {CATEGORY_DESCRIPTIONS[cat]}
          </p>
        </button>
      ))}
    </div>
  );
}

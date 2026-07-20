import type { Category, Template } from "@/types/pop";

const TEMPLATES = [
  {
    id: "super-recommend",
    name: "本日のおすすめ",
    category: "supermarket",
    pattern: "recommendation",
    description: "スーパーの日替わりおすすめ商品",
    primary_color: "#E53935",
    accent_color: "#FDD835",
  },
  {
    id: "super-limited",
    name: "期間限定",
    category: "supermarket",
    pattern: "limited",
    description: "期間限定セール品",
    primary_color: "#FB8C00",
    accent_color: "#FFFFFF",
  },
  {
    id: "super-staff",
    name: "店長イチオシ",
    category: "supermarket",
    pattern: "staff_pick",
    description: "店長おすすめ商品",
    primary_color: "#43A047",
    accent_color: "#FDD835",
  },
  {
    id: "super-new",
    name: "新商品",
    category: "supermarket",
    pattern: "new_arrival",
    description: "新入荷商品のお知らせ",
    primary_color: "#1E88E5",
    accent_color: "#FFFFFF",
  },
  {
    id: "super-sale",
    name: "特売",
    category: "supermarket",
    pattern: "sale",
    description: "特売・タイムセール",
    primary_color: "#E53935",
    accent_color: "#FDD835",
  },
  {
    id: "drug-recommend",
    name: "おすすめ商品",
    category: "drugstore",
    pattern: "recommendation",
    description: "ドラッグストアのおすすめ",
    primary_color: "#1E88E5",
    accent_color: "#E3F2FD",
  },
  {
    id: "drug-limited",
    name: "数量限定",
    category: "drugstore",
    pattern: "limited",
    description: "数量限定品",
    primary_color: "#7B1FA2",
    accent_color: "#FFFFFF",
  },
  {
    id: "drug-staff",
    name: "薬剤師おすすめ",
    category: "drugstore",
    pattern: "staff_pick",
    description: "薬剤師のおすすめ商品",
    primary_color: "#00838F",
    accent_color: "#E0F7FA",
  },
  {
    id: "drug-new",
    name: "新商品入荷",
    category: "drugstore",
    pattern: "new_arrival",
    description: "新商品入荷のお知らせ",
    primary_color: "#43A047",
    accent_color: "#FFFFFF",
  },
  {
    id: "drug-sale",
    name: "ポイント2倍",
    category: "drugstore",
    pattern: "sale",
    description: "ポイントアップセール",
    primary_color: "#FB8C00",
    accent_color: "#FFF3E0",
  },
  {
    id: "book-recommend",
    name: "今週のおすすめ",
    category: "bookstore",
    pattern: "recommendation",
    description: "書店員のおすすめ本",
    primary_color: "#5D4037",
    accent_color: "#FFF8E1",
  },
  {
    id: "book-limited",
    name: "初版限定",
    category: "bookstore",
    pattern: "limited",
    description: "初版限定・特典付き",
    primary_color: "#C62828",
    accent_color: "#FFEBEE",
  },
  {
    id: "book-staff",
    name: "書店員イチオシ",
    category: "bookstore",
    pattern: "staff_pick",
    description: "書店員が選ぶ一冊",
    primary_color: "#1565C0",
    accent_color: "#E3F2FD",
  },
  {
    id: "book-new",
    name: "新刊入荷",
    category: "bookstore",
    pattern: "new_arrival",
    description: "新刊入荷のお知らせ",
    primary_color: "#2E7D32",
    accent_color: "#E8F5E9",
  },
  {
    id: "book-sale",
    name: "フェア開催中",
    category: "bookstore",
    pattern: "sale",
    description: "フェア・キャンペーン",
    primary_color: "#E65100",
    accent_color: "#FFF3E0",
  },
] as const satisfies readonly Template[];

export function listTemplates(): Template[] {
  return TEMPLATES.map((template) => ({ ...template }));
}

export function getTemplatesByCategory(category: string): Template[] {
  if (!isCategory(category)) return [];
  return TEMPLATES.filter((template) => template.category === category).map(
    (template) => ({ ...template })
  );
}

function isCategory(value: string): value is Category {
  return value === "supermarket" || value === "drugstore" || value === "bookstore";
}

export type Category = "supermarket" | "drugstore" | "bookstore";

export type Pattern =
  | "recommendation"
  | "limited"
  | "staff_pick"
  | "new_arrival"
  | "sale";

export type PaperSize = "a4" | "a5" | "card";

export type PriceType = "tax_included" | "tax_excluded";

export type FontFamily = "gothic" | "mincho" | "handwritten" | "brush";

export interface Template {
  id: string;
  name: string;
  category: Category;
  pattern: Pattern;
  description: string;
  primary_color: string;
  accent_color: string;
}

export interface POPRequest {
  product_name: string;
  price: number;
  price_type: PriceType;
  catchphrase: string;
  description: string;
  template_id: string;
  font_family: FontFamily;
  color_scheme: string;
  paper_size: PaperSize;
}


export const CATEGORY_LABELS: Record<Category, string> = {
  supermarket: "スーパー",
  drugstore: "ドラッグストア",
  bookstore: "書店",
};

export const PAPER_SIZE_LABELS: Record<PaperSize, string> = {
  a4: "A4 (210×297mm)",
  a5: "A5 (148×210mm)",
  card: "名刺 (91×55mm)",
};

export const FONT_LABELS: Record<FontFamily, string> = {
  gothic: "ゴシック",
  mincho: "明朝",
  handwritten: "手書き風",
  brush: "筆文字",
};

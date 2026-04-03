import type { FontFamily } from "@/types/pop";

export interface FontDefinition {
  id: FontFamily;
  name: string;
  cssFontFamily: string;
  googleFontsName: string;
  weight: number;
}

export const FONT_DEFINITIONS: Record<FontFamily, FontDefinition> = {
  gothic: {
    id: "gothic",
    name: "ゴシック",
    cssFontFamily: "'Noto Sans JP', sans-serif",
    googleFontsName: "Noto+Sans+JP",
    weight: 700,
  },
  mincho: {
    id: "mincho",
    name: "明朝",
    cssFontFamily: "'Noto Serif JP', serif",
    googleFontsName: "Noto+Serif+JP",
    weight: 700,
  },
  handwritten: {
    id: "handwritten",
    name: "手書き風",
    cssFontFamily: "'Yomogi', cursive",
    googleFontsName: "Yomogi",
    weight: 400,
  },
  brush: {
    id: "brush",
    name: "筆文字",
    cssFontFamily: "'Shippori Mincho B1', serif",
    googleFontsName: "Shippori+Mincho+B1",
    weight: 800,
  },
};

export const ALL_FONTS: FontDefinition[] = Object.values(FONT_DEFINITIONS);

export function getFontCss(fontFamily: FontFamily): string {
  return FONT_DEFINITIONS[fontFamily].cssFontFamily;
}

export function getGoogleFontsUrl(): string {
  const families = ALL_FONTS.map(
    (f) => `family=${f.googleFontsName}:wght@${f.weight}`
  ).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

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

export const FONT_LOAD_TIMEOUT_MS = 5_000;
export const FONT_LOAD_SAMPLE = "日本語POP 価格¥1,980";

interface FontLoader {
  load(font: string, text?: string): Promise<FontFace[]>;
}

export function getFontCss(fontFamily: FontFamily): string {
  return FONT_DEFINITIONS[fontFamily].cssFontFamily;
}

export function getGoogleFontsUrl(): string {
  const families = ALL_FONTS.map(
    (f) => `family=${f.googleFontsName}:wght@${f.weight}`
  ).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export function buildCanvasFontLoadText(
  ...parts: Array<string | number | null | undefined>
): string {
  const text = parts
    .filter((part): part is string | number => part !== null && part !== undefined)
    .map(String)
    .join(" ")
    .trim();
  return text || FONT_LOAD_SAMPLE;
}

export async function loadCanvasFont(
  fontFamily: FontFamily,
  options: {
    fontLoader?: FontLoader;
    text?: string;
    timeoutMs?: number;
  } = {}
): Promise<boolean> {
  const fontLoader =
    options.fontLoader ??
    (typeof document !== "undefined" && "fonts" in document
      ? document.fonts
      : undefined);

  if (!fontLoader) return false;

  const font = FONT_DEFINITIONS[fontFamily];
  const primaryFamily = font.cssFontFamily.split(",")[0];
  const fontSpec = `${font.weight} 32px ${primaryFamily}`;
  const text = options.text?.trim() || FONT_LOAD_SAMPLE;
  const timeoutMs = options.timeoutMs ?? FONT_LOAD_TIMEOUT_MS;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const loaded = await Promise.race([
      fontLoader
        .load(fontSpec, text)
        .then((fontFaces) => fontFaces.length > 0),
      new Promise<boolean>((resolve) => {
        timeoutId = setTimeout(() => resolve(false), timeoutMs);
      }),
    ]);
    return loaded;
  } catch {
    return false;
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

import { afterEach, describe, it, expect, vi } from "vitest";
import {
  FONT_DEFINITIONS,
  ALL_FONTS,
  FONT_LOAD_SAMPLE,
  buildCanvasFontLoadText,
  getFontCss,
  getGoogleFontsUrl,
  loadCanvasFont,
} from "./fonts";

afterEach(() => {
  vi.useRealTimers();
});

describe("FONT_DEFINITIONS", () => {
  it("has all 4 font families", () => {
    expect(Object.keys(FONT_DEFINITIONS)).toHaveLength(4);
    expect(FONT_DEFINITIONS.gothic).toBeDefined();
    expect(FONT_DEFINITIONS.mincho).toBeDefined();
    expect(FONT_DEFINITIONS.handwritten).toBeDefined();
    expect(FONT_DEFINITIONS.brush).toBeDefined();
  });

  it("each font has required properties", () => {
    for (const font of ALL_FONTS) {
      expect(font.id).toBeTruthy();
      expect(font.name).toBeTruthy();
      expect(font.cssFontFamily).toBeTruthy();
      expect(font.googleFontsName).toBeTruthy();
      expect(font.weight).toBeGreaterThan(0);
    }
  });
});

describe("ALL_FONTS", () => {
  it("has 4 fonts", () => {
    expect(ALL_FONTS).toHaveLength(4);
  });
});

describe("getFontCss", () => {
  it("returns correct CSS font family for gothic", () => {
    expect(getFontCss("gothic")).toBe("'Noto Sans JP', sans-serif");
  });

  it("returns correct CSS font family for brush", () => {
    expect(getFontCss("brush")).toBe("'Shippori Mincho B1', serif");
  });
});

describe("getGoogleFontsUrl", () => {
  it("includes all font families", () => {
    const url = getGoogleFontsUrl();
    expect(url).toContain("Noto+Sans+JP");
    expect(url).toContain("Noto+Serif+JP");
    expect(url).toContain("Yomogi");
    expect(url).toContain("Shippori+Mincho+B1");
  });

  it("starts with Google Fonts URL", () => {
    const url = getGoogleFontsUrl();
    expect(url).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?/);
  });
});

describe("loadCanvasFont", () => {
  it("loads the selected Japanese font before reporting ready", async () => {
    const fontFace = {} as FontFace;
    const load = vi.fn().mockResolvedValue([fontFace]);

    await expect(
      loadCanvasFont("gothic", { fontLoader: { load } })
    ).resolves.toBe(true);
    expect(load).toHaveBeenCalledWith(
      "700 32px 'Noto Sans JP'",
      FONT_LOAD_SAMPLE
    );
  });

  it("returns false when the font request fails", async () => {
    const load = vi.fn().mockRejectedValue(new Error("network unavailable"));

    await expect(
      loadCanvasFont("mincho", { fontLoader: { load } })
    ).resolves.toBe(false);
  });

  it("loads every glyph from the actual text instead of only the default sample", async () => {
    const load = vi.fn().mockResolvedValue([{} as FontFace]);
    const text = buildCanvasFontLoadText(
      "本日のおすすめ",
      "青森県産りんご",
      "甘みと酸味",
      198,
      "税込"
    );

    await loadCanvasFont("gothic", {
      fontLoader: { load },
      text,
    });

    expect(load).toHaveBeenCalledWith(
      "700 32px 'Noto Sans JP'",
      "本日のおすすめ 青森県産りんご 甘みと酸味 198 税込"
    );
  });

  it("returns false when no matching font face is loaded", async () => {
    const load = vi.fn().mockResolvedValue([]);

    await expect(
      loadCanvasFont("brush", { fontLoader: { load } })
    ).resolves.toBe(false);
  });

  it("uses a timeout when font loading does not settle", async () => {
    vi.useFakeTimers();
    const load = vi.fn().mockReturnValue(new Promise<FontFace[]>(() => {}));
    const result = loadCanvasFont("handwritten", {
      fontLoader: { load },
      timeoutMs: 50,
    });

    await vi.advanceTimersByTimeAsync(50);
    await expect(result).resolves.toBe(false);
  });
});

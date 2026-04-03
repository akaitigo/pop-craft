import { describe, it, expect } from "vitest";
import { FONT_DEFINITIONS, ALL_FONTS, getFontCss, getGoogleFontsUrl } from "./fonts";

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

import { describe, it, expect, vi } from "vitest";
import {
  getCanvasDimensions,
  drawBackground,
  drawAccentBar,
  drawPrice,
  scale,
  MIN_FONT_SIZE,
} from "./renderer";

describe("getCanvasDimensions", () => {
  it("calculates A4 dimensions correctly", () => {
    const dims = getCanvasDimensions("a4", 420);
    expect(dims.width).toBe(420);
    expect(dims.height).toBe(594);
  });

  it("calculates A5 dimensions correctly", () => {
    const dims = getCanvasDimensions("a5", 420);
    expect(dims.width).toBe(420);
    expect(dims.height).toBe(596);
  });

  it("calculates card dimensions correctly", () => {
    const dims = getCanvasDimensions("card", 420);
    expect(dims.width).toBe(420);
    // card is landscape-ish: 91x55mm, so height = 55/91 * 420 ≈ 254
    expect(dims.height).toBe(254);
  });

  it("scales to different maxWidth", () => {
    const dims = getCanvasDimensions("a4", 210);
    expect(dims.width).toBe(210);
    expect(dims.height).toBe(297);
  });
});

describe("scale", () => {
  it("returns the base size at the reference width (420px)", () => {
    expect(scale(28, 420)).toBe(28);
    expect(scale(10, 420)).toBe(10);
  });

  it("scales down proportionally for narrower canvases", () => {
    expect(scale(36, 210)).toBe(18);
  });

  it("scales user-selected font sizes for high-resolution output", () => {
    expect(scale(28, 2480)).toBe(165);
    expect(scale(36, 2480)).toBe(213);
  });

  it("clamps to MIN_FONT_SIZE for very small canvases", () => {
    // 24 * (55/420) ≈ 3.1, below the floor
    expect(scale(24, 55)).toBe(MIN_FONT_SIZE);
    expect(scale(10, 55)).toBe(MIN_FONT_SIZE);
  });

  it("never returns below MIN_FONT_SIZE", () => {
    for (const base of [8, 10, 12, 14, 24, 28, 36]) {
      for (const width of [40, 55, 91, 210, 420]) {
        expect(scale(base, width)).toBeGreaterThanOrEqual(MIN_FONT_SIZE);
      }
    }
  });
});

describe("drawBackground", () => {
  it("fills the entire canvas with the given color", () => {
    const ctx = {
      fillStyle: "",
      fillRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawBackground(ctx, 420, 594, "#E53935");
    expect(ctx.fillStyle).toBe("#E53935");
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 420, 594);
  });
});

describe("drawAccentBar", () => {
  it("draws a bar at the top 15% of height", () => {
    const ctx = {
      fillStyle: "",
      fillRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawAccentBar(ctx, 420, 600, "#FDD835");
    expect(ctx.fillStyle).toBe("#FDD835");
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 420, 90);
  });
});

describe("drawPrice", () => {
  it("draws price with yen sign", () => {
    const ctx = {
      fillStyle: "",
      font: "",
      textAlign: "",
      textBaseline: "",
      fillText: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawPrice(ctx, 420, 600, {
      productName: "テスト",
      price: 1980,
      priceType: "tax_included",
      catchphrase: "",
      description: "",
      templateName: "テスト",
      primaryColor: "#E53935",
      accentColor: "#FDD835",
      fontFamily: "gothic",
      paperSize: "a4",
    });

    expect(ctx.fillText).toHaveBeenCalledWith("¥1,980", 210, expect.closeTo(336, 0));
  });
});

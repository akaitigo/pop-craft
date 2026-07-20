import { describe, expect, it } from "vitest";
import {
  getPageSizeRule,
  getPrintCanvasDimensions,
  millimetersToPixels,
  resolvePrintPaper,
} from "./print";

describe("print dimensions", () => {
  it.each([
    ["a4", 2480, 3508],
    ["a5", 1748, 2480],
    ["card", 1075, 650],
  ] as const)("returns 300 DPI pixels for %s", (paperSize, width, height) => {
    expect(getPrintCanvasDimensions(paperSize)).toEqual({ width, height });
  });

  it("converts millimeters with a selectable DPI", () => {
    expect(millimetersToPixels(25.4, 600)).toBe(600);
  });

  it("falls back to A4 for an invalid paper size", () => {
    expect(resolvePrintPaper("letter")).toEqual({
      paper: {
        id: "a4",
        label: "A4",
        widthMm: 210,
        heightMm: 297,
      },
      usedFallback: true,
    });
    expect(getPrintCanvasDimensions("letter")).toEqual({
      width: 2480,
      height: 3508,
    });
    expect(resolvePrintPaper("toString").usedFallback).toBe(true);
  });

  it("creates an explicit zero-margin page rule", () => {
    expect(getPageSizeRule("card")).toBe(
      "@page { size: 91mm 55mm; margin: 0; }"
    );
  });
});

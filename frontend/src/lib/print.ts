import type { PaperSize } from "@/types/pop";

export const PRINT_DPI = 300;
export const DEFAULT_PAPER_SIZE: PaperSize = "a4";

export interface PrintPaperDefinition {
  id: PaperSize;
  label: string;
  widthMm: number;
  heightMm: number;
}

export interface ResolvedPrintPaper {
  paper: PrintPaperDefinition;
  usedFallback: boolean;
}

export const PRINT_PAPERS: Record<PaperSize, PrintPaperDefinition> = {
  a4: { id: "a4", label: "A4", widthMm: 210, heightMm: 297 },
  a5: { id: "a5", label: "A5", widthMm: 148, heightMm: 210 },
  card: { id: "card", label: "名刺", widthMm: 91, heightMm: 55 },
};

export function resolvePrintPaper(paperSize: unknown): ResolvedPrintPaper {
  if (
    typeof paperSize === "string" &&
    Object.prototype.hasOwnProperty.call(PRINT_PAPERS, paperSize)
  ) {
    return {
      paper: PRINT_PAPERS[paperSize as PaperSize],
      usedFallback: false,
    };
  }

  return {
    paper: PRINT_PAPERS[DEFAULT_PAPER_SIZE],
    usedFallback: true,
  };
}

export function millimetersToPixels(
  millimeters: number,
  dpi = PRINT_DPI
): number {
  return Math.round((millimeters / 25.4) * dpi);
}

export function getPrintCanvasDimensions(
  paperSize: unknown,
  dpi = PRINT_DPI
): { width: number; height: number } {
  const { paper } = resolvePrintPaper(paperSize);
  return {
    width: millimetersToPixels(paper.widthMm, dpi),
    height: millimetersToPixels(paper.heightMm, dpi),
  };
}

export function getPageSizeRule(paperSize: unknown): string {
  const { paper } = resolvePrintPaper(paperSize);
  return `@page { size: ${paper.widthMm}mm ${paper.heightMm}mm; margin: 0; }`;
}

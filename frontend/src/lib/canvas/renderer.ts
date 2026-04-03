import type { PaperSize, FontFamily } from "@/types/pop";
import { FONT_DEFINITIONS } from "./fonts";

export interface RenderOptions {
  productName: string;
  price: number;
  priceType: string;
  catchphrase: string;
  description: string;
  templateName: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: FontFamily;
  paperSize: PaperSize;
  fontSize?: {
    productName?: number;
    price?: number;
    catchphrase?: number;
  };
}

const PAPER_DIMENSIONS: Record<PaperSize, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  a5: { width: 148, height: 210 },
  card: { width: 91, height: 55 },
};

export function getCanvasDimensions(
  paperSize: PaperSize,
  maxWidth: number
): { width: number; height: number } {
  const paper = PAPER_DIMENSIONS[paperSize];
  const scale = maxWidth / paper.width;
  return {
    width: Math.round(paper.width * scale),
    height: Math.round(paper.height * scale),
  };
}

export function renderPOP(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  options: RenderOptions
): void {
  const { width, height } = canvas;

  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height, options.primaryColor);
  drawAccentBar(ctx, width, height, options.accentColor);
  drawTemplateName(ctx, width, height, options);
  drawCatchphrase(ctx, width, height, options);
  drawProductName(ctx, width, height, options);
  drawPrice(ctx, width, height, options);
  drawDescription(ctx, width, height, options);
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

export function drawAccentBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  const barHeight = height * 0.15;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, barHeight);
}

export function drawTemplateName(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: RenderOptions
): void {
  const font = FONT_DEFINITIONS[options.fontFamily];
  const fontSize = scale(14, width);
  ctx.font = `${font.weight} ${fontSize}px ${font.cssFontFamily}`;
  ctx.fillStyle = options.primaryColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(options.templateName, width / 2, height * 0.075);
}

export function drawCatchphrase(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: RenderOptions
): void {
  if (!options.catchphrase) return;
  const font = FONT_DEFINITIONS[options.fontFamily];
  const fontSize = options.fontSize?.catchphrase ?? scale(12, width);
  ctx.font = `italic ${font.weight} ${fontSize}px ${font.cssFontFamily}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(options.catchphrase, width / 2, height * 0.22);
}

export function drawProductName(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: RenderOptions
): void {
  const font = FONT_DEFINITIONS[options.fontFamily];
  const fontSize = options.fontSize?.productName ?? scale(28, width);
  ctx.font = `${font.weight} ${fontSize}px ${font.cssFontFamily}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxWidth = width * 0.85;
  const text = options.productName || "商品名";
  ctx.fillText(text, width / 2, height * 0.38, maxWidth);
}

export function drawPrice(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: RenderOptions
): void {
  const font = FONT_DEFINITIONS[options.fontFamily];
  const fontSize = options.fontSize?.price ?? scale(36, width);
  ctx.font = `${font.weight} ${fontSize}px ${font.cssFontFamily}`;
  ctx.fillStyle = options.accentColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const priceText = `¥${options.price.toLocaleString()}`;
  ctx.fillText(priceText, width / 2, height * 0.56);

  const taxFontSize = scale(10, width);
  ctx.font = `${font.weight} ${taxFontSize}px ${font.cssFontFamily}`;
  const taxLabel = options.priceType === "tax_excluded" ? "（税抜）" : "（税込）";
  ctx.fillText(taxLabel, width / 2, height * 0.56 + fontSize * 0.7);
}

export function drawDescription(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: RenderOptions
): void {
  if (!options.description) return;
  const font = FONT_DEFINITIONS[options.fontFamily];
  const fontSize = scale(10, width);
  ctx.font = `${font.weight} ${fontSize}px ${font.cssFontFamily}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(options.description, width / 2, height * 0.82, width * 0.85);
}

function scale(base: number, canvasWidth: number): number {
  return Math.round(base * (canvasWidth / 420));
}

"use client";

import { useRef, useEffect } from "react";
import type { PaperSize, FontFamily, Template } from "@/types/pop";
import { renderPOP, getCanvasDimensions } from "@/lib/canvas/renderer";

interface PopCanvasProps {
  productName: string;
  price: number;
  priceType: string;
  catchphrase: string;
  description: string;
  template: Template | null;
  fontFamily: FontFamily;
  paperSize: PaperSize;
  fontSize?: {
    productName?: number;
    price?: number;
    catchphrase?: number;
  };
  maxWidth?: number;
}

export function PopCanvas({
  productName,
  price,
  priceType,
  catchphrase,
  description,
  template,
  fontFamily,
  paperSize,
  fontSize,
  maxWidth = 420,
}: PopCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dims = getCanvasDimensions(paperSize, maxWidth);
    canvas.width = dims.width;
    canvas.height = dims.height;

    renderPOP(ctx, canvas, {
      productName,
      price,
      priceType,
      catchphrase,
      description,
      templateName: template?.name ?? "テンプレート",
      primaryColor: template?.primary_color ?? "#333333",
      accentColor: template?.accent_color ?? "#FFFFFF",
      fontFamily,
      paperSize,
      fontSize,
    });
  }, [
    productName,
    price,
    priceType,
    catchphrase,
    description,
    template,
    fontFamily,
    paperSize,
    fontSize,
    maxWidth,
  ]);

  const dims = getCanvasDimensions(paperSize, maxWidth);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={dims.width}
        height={dims.height}
        className="border border-gray-300 shadow-lg rounded"
        data-testid="pop-canvas"
      />
    </div>
  );
}

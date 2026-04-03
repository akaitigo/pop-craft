"use client";

import { useRef, useEffect, useCallback } from "react";
import type { Template, FontFamily, PaperSize } from "@/types/pop";
import { renderPOP, getCanvasDimensions } from "@/lib/canvas/renderer";

interface PrintPreviewProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  price: number;
  priceType: string;
  catchphrase: string;
  description: string;
  template: Template | null;
  fontFamily: FontFamily;
  paperSize: PaperSize;
  primaryColor: string;
  accentColor: string;
  fontSize: {
    productName?: number;
    price?: number;
    catchphrase?: number;
  };
}

export function PrintPreview({
  open,
  onClose,
  productName,
  price,
  priceType,
  catchphrase,
  description,
  template,
  fontFamily,
  paperSize,
  primaryColor,
  accentColor,
  fontSize,
}: PrintPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dims = getCanvasDimensions(paperSize, 600);
    canvas.width = dims.width;
    canvas.height = dims.height;

    renderPOP(ctx, canvas, {
      productName,
      price,
      priceType,
      catchphrase,
      description,
      templateName: template?.name ?? "",
      primaryColor,
      accentColor,
      fontFamily,
      paperSize,
      fontSize,
    });
  }, [open, productName, price, priceType, catchphrase, description, template, fontFamily, paperSize, primaryColor, accentColor, fontSize]);

  // Focus trap and Escape key handler
  useEffect(() => {
    if (!open) return;

    // Focus the close button on open
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap within dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!open) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:bg-white print:static"
      role="dialog"
      aria-modal="true"
      aria-label="印刷プレビュー"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto print:shadow-none print:p-0"
      >
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h2 className="text-lg font-bold">印刷プレビュー</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              印刷
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              aria-label="印刷プレビューを閉じる"
            >
              閉じる
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <canvas ref={canvasRef} data-testid="print-canvas" />
        </div>
      </div>
    </div>
  );
}

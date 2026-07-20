"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { CSSProperties } from "react";
import type { Template, FontFamily, PaperSize } from "@/types/pop";
import { renderPOP } from "@/lib/canvas/renderer";
import { loadCanvasFont } from "@/lib/canvas/fonts";
import {
  getPageSizeRule,
  getPrintCanvasDimensions,
  resolvePrintPaper,
} from "@/lib/print";

type FontLoadStatus = "loading" | "ready" | "fallback";

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
  const [fontLoadStatus, setFontLoadStatus] =
    useState<FontLoadStatus>("loading");
  const [isPrinting, setIsPrinting] = useState(false);
  const resolvedPaper = resolvePrintPaper(paperSize);
  const printPaper = resolvedPaper.paper;

  const drawPrintCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dims = getPrintCanvasDimensions(printPaper.id);
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
      paperSize: printPaper.id,
      fontSize,
    });
  }, [
    accentColor,
    catchphrase,
    description,
    fontFamily,
    fontSize,
    price,
    priceType,
    primaryColor,
    printPaper.id,
    productName,
    template,
  ]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setFontLoadStatus("loading");

    void loadCanvasFont(fontFamily).then((loaded) => {
      if (cancelled) return;
      drawPrintCanvas();
      setFontLoadStatus(loaded ? "ready" : "fallback");
    });

    return () => {
      cancelled = true;
    };
  }, [drawPrintCanvas, fontFamily, open]);

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

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const loaded = await loadCanvasFont(fontFamily);
      drawPrintCanvas();
      setFontLoadStatus(loaded ? "ready" : "fallback");
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  const paperStyle = {
    "--print-paper-width": `${printPaper.widthMm}mm`,
    "--print-paper-height": `${printPaper.heightMm}mm`,
  } as CSSProperties;

  return (
    <>
      <style>{getPageSizeRule(printPaper.id)}</style>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:bg-white print:static"
        role="dialog"
        aria-modal="true"
        aria-label="印刷プレビュー"
        aria-busy={fontLoadStatus === "loading" || isPrinting}
        onClick={handleBackdropClick}
      >
        <div
          ref={dialogRef}
          className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto print:shadow-none print:p-0 print:max-w-none print:w-auto print:max-h-none print:overflow-visible print:rounded-none"
        >
          <div className="flex justify-between items-center mb-4 print:hidden">
            <h2 className="text-lg font-bold">印刷プレビュー</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                disabled={fontLoadStatus === "loading" || isPrinting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-wait"
              >
                {fontLoadStatus === "loading" || isPrinting
                  ? "印刷データを準備中…"
                  : "印刷・PDF保存"}
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

          <div className="mb-4 space-y-2 text-sm print:hidden">
            <p className="text-gray-700">
              印刷画面で用紙を「{printPaper.label}」、倍率を「100%」、余白を「なし」に設定してください。
            </p>
            {fontLoadStatus === "loading" && (
              <p role="status" className="text-blue-700">
                日本語Webフォントを読み込んでいます。
              </p>
            )}
            {fontLoadStatus === "fallback" && (
              <p role="alert" className="text-amber-700">
                Webフォントを読み込めなかったため、端末の代替フォントで描画しました。印刷前に書体を確認してください。
              </p>
            )}
            {resolvedPaper.usedFallback && (
              <p role="alert" className="text-amber-700">
                用紙サイズが不正なため、A4へ切り替えました。
              </p>
            )}
          </div>

          <div
            className="print-sheet flex justify-center"
            style={paperStyle}
            data-paper-size={printPaper.id}
          >
            <canvas
              ref={canvasRef}
              className="print-canvas block max-w-full h-auto"
              data-testid="print-canvas"
            />
          </div>
        </div>
      </div>
    </>
  );
}

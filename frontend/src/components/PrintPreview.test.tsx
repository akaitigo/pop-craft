import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadCanvasFont } from "@/lib/canvas/fonts";
import type { PaperSize, Template } from "@/types/pop";
import { PrintPreview } from "./PrintPreview";

vi.mock("@/lib/canvas/fonts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/canvas/fonts")>();
  return {
    ...actual,
    loadCanvasFont: vi.fn(),
  };
});

const mockContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn().mockReturnValue({ width: 20 }),
  fillStyle: "",
  font: "",
  textAlign: "",
  textBaseline: "",
};

const template: Template = {
  id: "super-recommend",
  name: "本日のおすすめ",
  category: "supermarket",
  pattern: "recommendation",
  description: "テスト",
  primary_color: "#E53935",
  accent_color: "#FDD835",
};

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  productName: "青森県産りんご",
  price: 198,
  priceType: "tax_included",
  catchphrase: "今が旬",
  description: "甘みと酸味のバランス",
  template,
  fontFamily: "gothic" as const,
  paperSize: "a4" as PaperSize,
  primaryColor: "#E53935",
  accentColor: "#FDD835",
  fontSize: {
    productName: 28,
    price: 36,
    catchphrase: 18,
  },
};

const mockedLoadCanvasFont = vi.mocked(loadCanvasFont);

beforeEach(() => {
  vi.clearAllMocks();
  mockedLoadCanvasFont.mockResolvedValue(true);
  HTMLCanvasElement.prototype.getContext = vi
    .fn()
    .mockReturnValue(mockContext) as typeof HTMLCanvasElement.prototype.getContext;
  Object.defineProperty(window, "print", {
    configurable: true,
    value: vi.fn(),
  });
});

describe("PrintPreview", () => {
  it.each([
    ["a4", 2480, 3508, "210mm", "297mm"],
    ["a5", 1748, 2480, "148mm", "210mm"],
    ["card", 1075, 650, "91mm", "55mm"],
  ] as const)(
    "creates a 300 DPI %s canvas with physical print dimensions",
    async (paperSize, width, height, widthMm, heightMm) => {
      render(<PrintPreview {...defaultProps} paperSize={paperSize} />);

      const canvas = screen.getByTestId("print-canvas");
      await waitFor(() => {
        expect(canvas).toHaveAttribute("width", String(width));
        expect(canvas).toHaveAttribute("height", String(height));
      });

      const sheet = canvas.parentElement;
      expect(sheet).toHaveAttribute("data-paper-size", paperSize);
      expect(sheet).toHaveStyle({
        "--print-paper-width": widthMm,
        "--print-paper-height": heightMm,
      });
    }
  );

  it("waits for the selected font again before printing", async () => {
    let finishPrintFontLoad: ((loaded: boolean) => void) | undefined;
    mockedLoadCanvasFont
      .mockResolvedValueOnce(true)
      .mockReturnValueOnce(
        new Promise<boolean>((resolve) => {
          finishPrintFontLoad = resolve;
        })
      );

    render(<PrintPreview {...defaultProps} />);
    const button = await screen.findByRole("button", {
      name: "印刷・PDF保存",
    });
    fireEvent.click(button);

    expect(window.print).not.toHaveBeenCalled();
    await act(async () => {
      finishPrintFontLoad?.(true);
    });

    expect(window.print).toHaveBeenCalledOnce();
    expect(mockedLoadCanvasFont).toHaveBeenCalledTimes(2);
  });

  it("loads the glyphs from every rendered field", async () => {
    render(<PrintPreview {...defaultProps} />);

    await waitFor(() => {
      expect(mockedLoadCanvasFont).toHaveBeenCalledWith("gothic", {
        text: expect.stringContaining("青森県産りんご"),
      });
    });
    const text = mockedLoadCanvasFont.mock.calls[0]?.[1]?.text;
    expect(text).toContain("本日のおすすめ");
    expect(text).toContain("今が旬");
    expect(text).toContain("甘みと酸味のバランス");
    expect(text).toContain("¥198");
    expect(text).toContain("税込");
  });

  it("cancels printing and every close path while preparation is pending", async () => {
    const onClose = vi.fn();
    let finishPrintFontLoad: ((loaded: boolean) => void) | undefined;
    mockedLoadCanvasFont
      .mockResolvedValueOnce(true)
      .mockReturnValueOnce(
        new Promise<boolean>((resolve) => {
          finishPrintFontLoad = resolve;
        })
      );

    const { rerender } = render(
      <PrintPreview {...defaultProps} onClose={onClose} />
    );
    const printButton = await screen.findByRole("button", {
      name: "印刷・PDF保存",
    });
    fireEvent.click(printButton);

    const closeButton = screen.getByRole("button", {
      name: "印刷プレビューを閉じる",
    });
    expect(closeButton).toBeDisabled();
    fireEvent.click(closeButton);
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("dialog", { name: "印刷プレビュー" }));
    expect(onClose).not.toHaveBeenCalled();

    rerender(
      <PrintPreview {...defaultProps} open={false} onClose={onClose} />
    );
    await act(async () => {
      finishPrintFontLoad?.(true);
    });

    expect(window.print).not.toHaveBeenCalled();
  });

  it("warns and continues with a fallback font when loading fails", async () => {
    mockedLoadCanvasFont.mockResolvedValue(false);
    render(<PrintPreview {...defaultProps} />);

    expect(
      await screen.findByText(/端末の代替フォントで描画しました/)
    ).toHaveAttribute("role", "alert");
    expect(screen.getByTestId("print-canvas")).toHaveAttribute(
      "width",
      "2480"
    );
  });

  it("falls back to A4 when an invalid paper size reaches the component", async () => {
    render(
      <PrintPreview
        {...defaultProps}
        paperSize={"letter" as PaperSize}
      />
    );

    expect(
      screen.getByText("用紙サイズが不正なため、A4へ切り替えました。")
    ).toHaveAttribute("role", "alert");
    await waitFor(() => {
      expect(screen.getByTestId("print-canvas")).toHaveAttribute(
        "height",
        "3508"
      );
    });
  });
});

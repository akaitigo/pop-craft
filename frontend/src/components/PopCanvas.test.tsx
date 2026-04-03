import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PopCanvas } from "./PopCanvas";
import type { Template } from "@/types/pop";

const mockTemplate: Template = {
  id: "super-recommend",
  name: "本日のおすすめ",
  category: "supermarket",
  pattern: "recommendation",
  description: "テスト",
  primary_color: "#E53935",
  accent_color: "#FDD835",
};

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  fillStyle: "",
  font: "",
  textAlign: "",
  textBaseline: "",
};

HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext);

describe("PopCanvas", () => {
  it("renders canvas element", () => {
    render(
      <PopCanvas
        productName="りんご"
        price={198}
        priceType="tax_included"
        catchphrase="今が旬"
        description=""
        template={mockTemplate}
        fontFamily="gothic"
        paperSize="a4"
      />
    );
    const canvas = screen.getByTestId("pop-canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe("CANVAS");
  });

  it("renders with null template gracefully", () => {
    render(
      <PopCanvas
        productName="テスト"
        price={100}
        priceType="tax_included"
        catchphrase=""
        description=""
        template={null}
        fontFamily="gothic"
        paperSize="a4"
      />
    );
    expect(screen.getByTestId("pop-canvas")).toBeInTheDocument();
  });

  it("renders with different paper sizes", () => {
    const { rerender } = render(
      <PopCanvas
        productName="テスト"
        price={100}
        priceType="tax_included"
        catchphrase=""
        description=""
        template={mockTemplate}
        fontFamily="gothic"
        paperSize="a4"
      />
    );

    const canvasA4 = screen.getByTestId("pop-canvas");
    expect(canvasA4).toBeInTheDocument();

    rerender(
      <PopCanvas
        productName="テスト"
        price={100}
        priceType="tax_included"
        catchphrase=""
        description=""
        template={mockTemplate}
        fontFamily="gothic"
        paperSize="card"
      />
    );

    expect(screen.getByTestId("pop-canvas")).toBeInTheDocument();
  });
});

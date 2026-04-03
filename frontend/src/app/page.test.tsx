import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

// Mock canvas
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

// Mock API
vi.mock("@/lib/api", () => ({
  getTemplatesByCategory: vi.fn().mockResolvedValue([]),
  listTemplates: vi.fn().mockResolvedValue([]),
  generatePDF: vi.fn(),
  previewPOP: vi.fn(),
}));

describe("Home Page", () => {
  it("renders the POP-Craft title", () => {
    render(<Home />);
    expect(screen.getByText("POP-Craft")).toBeInTheDocument();
  });

  it("renders category selector", () => {
    render(<Home />);
    expect(screen.getByText("スーパー")).toBeInTheDocument();
    expect(screen.getByText("ドラッグストア")).toBeInTheDocument();
    expect(screen.getByText("書店")).toBeInTheDocument();
  });

  it("renders step indicator", () => {
    render(<Home />);
    expect(screen.getByText("業態選択")).toBeInTheDocument();
    expect(screen.getByText("テンプレート")).toBeInTheDocument();
    expect(screen.getByText("カスタマイズ")).toBeInTheDocument();
  });

  it("shows placeholder when no template selected", () => {
    render(<Home />);
    expect(
      screen.getByText("業態とテンプレートを選択すると")
    ).toBeInTheDocument();
  });
});

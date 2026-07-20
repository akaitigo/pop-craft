import { afterEach, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("shows bundled templates without an API request", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /スーパー/ }));

    expect(screen.getByText("本日のおすすめ")).toBeInTheDocument();
    expect(screen.getByText("店長イチオシ")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("opens a print-only preview", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /スーパー/ }));
    fireEvent.click(
      screen.getByRole("button", { name: /本日のおすすめ/ })
    );
    fireEvent.click(screen.getByRole("button", { name: "印刷・PDF保存" }));

    expect(
      screen.getByRole("dialog", { name: "印刷プレビュー" })
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveClass("print:hidden");
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LayoutControls } from "./LayoutControls";

const defaultFontSize = {
  productName: 28,
  price: 36,
  catchphrase: 12,
};

describe("LayoutControls", () => {
  it("renders all three sliders", () => {
    render(
      <LayoutControls fontSize={defaultFontSize} onFontSizeChange={vi.fn()} />
    );
    expect(screen.getByLabelText("商品名の文字サイズ")).toBeInTheDocument();
    expect(screen.getByLabelText("価格の文字サイズ")).toBeInTheDocument();
    expect(screen.getByLabelText("キャッチコピーの文字サイズ")).toBeInTheDocument();
  });

  it("calls onFontSizeChange when slider moves", () => {
    const onChange = vi.fn();
    render(
      <LayoutControls fontSize={defaultFontSize} onFontSizeChange={onChange} />
    );
    const slider = screen.getByLabelText("商品名の文字サイズ");
    fireEvent.change(slider, { target: { value: "32" } });
    expect(onChange).toHaveBeenCalledWith("productName", 32);
  });

  it("displays current font size values", () => {
    render(
      <LayoutControls fontSize={defaultFontSize} onFontSizeChange={vi.fn()} />
    );
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("36")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});

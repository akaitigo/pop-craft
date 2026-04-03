import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ColorPicker } from "./ColorPicker";
import { PRESET_COLORS } from "@/lib/canvas/colors";

describe("ColorPicker", () => {
  it("renders all preset colors", () => {
    render(<ColorPicker selectedId="" onSelect={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(PRESET_COLORS.length);
  });

  it("calls onSelect when a preset is clicked", () => {
    const onSelect = vi.fn();
    render(<ColorPicker selectedId="" onSelect={onSelect} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    expect(onSelect).toHaveBeenCalledWith(PRESET_COLORS[0]);
  });

  it("renders custom color inputs", () => {
    render(<ColorPicker selectedId="" onSelect={vi.fn()} />);
    expect(screen.getByLabelText(/カスタム（メイン）/)).toBeInTheDocument();
    expect(screen.getByLabelText(/カスタム（アクセント）/)).toBeInTheDocument();
  });

  it("calls onCustomColor when custom input changes", () => {
    const onCustomColor = vi.fn();
    render(
      <ColorPicker selectedId="" onSelect={vi.fn()} onCustomColor={onCustomColor} />
    );
    const primary = screen.getByLabelText(/カスタム（メイン）/);
    fireEvent.change(primary, { target: { value: "#000000" } });
    expect(onCustomColor).toHaveBeenCalled();
  });
});

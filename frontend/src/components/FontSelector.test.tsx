import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FontSelector } from "./FontSelector";

describe("FontSelector", () => {
  it("renders all four fonts", () => {
    render(<FontSelector selected="gothic" onSelect={vi.fn()} />);
    expect(screen.getAllByText("ゴシック")).toHaveLength(2);
    expect(screen.getAllByText("明朝")).toHaveLength(2);
    expect(screen.getAllByText("手書き風")).toHaveLength(2);
    expect(screen.getAllByText("筆文字")).toHaveLength(2);
  });

  it("calls onSelect when font is clicked", () => {
    const onSelect = vi.fn();
    render(<FontSelector selected="gothic" onSelect={onSelect} />);
    fireEvent.click(screen.getAllByText("明朝")[0]);
    expect(onSelect).toHaveBeenCalledWith("mincho");
  });

  it("highlights selected font", () => {
    render(<FontSelector selected="brush" onSelect={vi.fn()} />);
    const buttons = screen.getAllByText("筆文字");
    const button = buttons[0].closest("button");
    expect(button?.className).toContain("border-blue-500");
  });
});

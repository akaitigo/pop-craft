import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaperSizeSelector } from "./PaperSizeSelector";

describe("PaperSizeSelector", () => {
  it("renders all three paper sizes", () => {
    render(<PaperSizeSelector selected="a4" onSelect={vi.fn()} />);
    expect(screen.getByText(/A4/)).toBeInTheDocument();
    expect(screen.getByText(/A5/)).toBeInTheDocument();
    expect(screen.getByText(/名刺/)).toBeInTheDocument();
  });

  it("calls onSelect when a size is clicked", () => {
    const onSelect = vi.fn();
    render(<PaperSizeSelector selected="a4" onSelect={onSelect} />);
    fireEvent.click(screen.getByText(/A5/));
    expect(onSelect).toHaveBeenCalledWith("a5");
  });

  it("highlights selected size", () => {
    render(<PaperSizeSelector selected="a5" onSelect={vi.fn()} />);
    const button = screen.getByText(/A5/).closest("button");
    expect(button?.className).toContain("bg-blue-600");
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepIndicator } from "./StepIndicator";

describe("StepIndicator", () => {
  it("renders all steps", () => {
    const steps = [
      { label: "Step 1", completed: false, active: true },
      { label: "Step 2", completed: false, active: false },
      { label: "Step 3", completed: false, active: false },
    ];
    render(<StepIndicator steps={steps} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("shows checkmark for completed steps", () => {
    const steps = [
      { label: "Done", completed: true, active: false },
      { label: "Active", completed: false, active: true },
    ];
    render(<StepIndicator steps={steps} />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("highlights active step", () => {
    const steps = [
      { label: "Active Step", completed: false, active: true },
    ];
    render(<StepIndicator steps={steps} />);
    const step = screen.getByText("Active Step").closest("div");
    expect(step?.className).toContain("bg-blue-600");
  });
});

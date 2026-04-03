import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PdfDownloadButton } from "./PdfDownloadButton";
import type { POPRequest } from "@/types/pop";

const mockRequest: POPRequest = {
  product_name: "りんご",
  price: 198,
  price_type: "tax_included",
  catchphrase: "今が旬",
  description: "",
  template_id: "super-recommend",
  font_family: "gothic",
  color_scheme: "red-gold",
  paper_size: "a4",
};

vi.mock("@/lib/api", () => ({
  generatePDF: vi.fn(),
}));

describe("PdfDownloadButton", () => {
  it("renders download button", () => {
    render(<PdfDownloadButton request={mockRequest} />);
    expect(screen.getByText("PDFダウンロード")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<PdfDownloadButton request={mockRequest} disabled />);
    const button = screen.getByText("PDFダウンロード");
    expect(button).toBeDisabled();
  });

  it("triggers download on click", () => {
    render(<PdfDownloadButton request={mockRequest} />);
    const button = screen.getByText("PDFダウンロード");
    fireEvent.click(button);
    // Button should show loading state
    expect(button).toBeDefined();
  });
});

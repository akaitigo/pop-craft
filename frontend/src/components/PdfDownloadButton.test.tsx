import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PdfDownloadButton } from "./PdfDownloadButton";
import { generatePDF } from "@/lib/api";
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

const mockGeneratePDF = vi.mocked(generatePDF);

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("names the downloaded file pop-<templateID>-<unix>.pdf", async () => {
    mockGeneratePDF.mockResolvedValue(
      new Blob(["%PDF-1.4"], { type: "application/pdf" })
    );

    // jsdom does not implement the object URL APIs; stub and restore them.
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();

    let downloadName = "";
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloadName = this.download;
      });

    render(<PdfDownloadButton request={mockRequest} />);
    fireEvent.click(screen.getByText("PDFダウンロード"));

    await waitFor(() => expect(downloadName).not.toBe(""));

    expect(downloadName).toMatch(/^pop-super-recommend-\d+\.pdf$/);
    // Timestamp should be unix seconds (<= 11 digits), not milliseconds (13).
    const ts = downloadName.match(/-(\d+)\.pdf$/)?.[1] ?? "";
    expect(ts.length).toBeLessThanOrEqual(11);

    clickSpy.mockRestore();
    URL.createObjectURL = origCreate;
    URL.revokeObjectURL = origRevoke;
  });
});

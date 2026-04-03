import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductForm } from "./ProductForm";

describe("ProductForm", () => {
  it("renders all input fields", () => {
    render(<ProductForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/商品名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/価格/)).toBeInTheDocument();
    expect(screen.getByLabelText(/キャッチコピー/)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明文/)).toBeInTheDocument();
  });

  it("shows validation error for empty product name on submit", () => {
    render(<ProductForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByText("プレビューに反映"));
    expect(screen.getByText("商品名は必須です")).toBeInTheDocument();
  });

  it("calls onSubmit with valid data", () => {
    const onSubmit = vi.fn();
    render(<ProductForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/商品名/), {
      target: { value: "りんご" },
    });
    fireEvent.change(screen.getByLabelText(/価格/), {
      target: { value: "198" },
    });
    fireEvent.click(screen.getByText("プレビューに反映"));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        product_name: "りんご",
        price: 198,
        price_type: "tax_included",
      })
    );
  });

  it("calls onChange when input values change", () => {
    const onChange = vi.fn();
    render(<ProductForm onSubmit={vi.fn()} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText(/商品名/), {
      target: { value: "バナナ" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ product_name: "バナナ" })
    );
  });

  it("renders tax type selector with default tax_included", () => {
    render(<ProductForm onSubmit={vi.fn()} />);
    const select = screen.getByDisplayValue("税込");
    expect(select).toBeInTheDocument();
  });
});

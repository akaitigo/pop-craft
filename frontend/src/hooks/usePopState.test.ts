import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePopState } from "./usePopState";
import type { Template } from "@/types/pop";

const mockTemplate: Template = {
  id: "super-recommend",
  name: "本日のおすすめ",
  category: "supermarket",
  pattern: "recommendation",
  description: "テスト",
  primary_color: "#E53935",
  accent_color: "#FDD835",
};

describe("usePopState", () => {
  it("has initial state", () => {
    const { result } = renderHook(() => usePopState());
    expect(result.current.state.category).toBeNull();
    expect(result.current.state.template).toBeNull();
    expect(result.current.state.fontFamily).toBe("gothic");
    expect(result.current.state.paperSize).toBe("a4");
  });

  it("setCategory updates category and clears template", () => {
    const { result } = renderHook(() => usePopState());
    act(() => {
      result.current.setTemplate(mockTemplate);
    });
    act(() => {
      result.current.setCategory("drugstore");
    });
    expect(result.current.state.category).toBe("drugstore");
    expect(result.current.state.template).toBeNull();
  });

  it("setTemplate updates template", () => {
    const { result } = renderHook(() => usePopState());
    act(() => {
      result.current.setTemplate(mockTemplate);
    });
    expect(result.current.state.template).toEqual(mockTemplate);
  });

  it("setProductInfo updates product fields", () => {
    const { result } = renderHook(() => usePopState());
    act(() => {
      result.current.setProductInfo({
        productName: "りんご",
        price: 198,
      });
    });
    expect(result.current.state.productName).toBe("りんご");
    expect(result.current.state.price).toBe(198);
  });

  it("toPOPRequest returns null without template", () => {
    const { result } = renderHook(() => usePopState());
    expect(result.current.toPOPRequest()).toBeNull();
  });

  it("toPOPRequest returns valid request with template and name", () => {
    const { result } = renderHook(() => usePopState());
    act(() => {
      result.current.setTemplate(mockTemplate);
      result.current.setProductInfo({ productName: "りんご", price: 198 });
    });
    const req = result.current.toPOPRequest();
    expect(req).not.toBeNull();
    expect(req?.product_name).toBe("りんご");
    expect(req?.template_id).toBe("super-recommend");
  });

  it("setFontSize updates individual font sizes", () => {
    const { result } = renderHook(() => usePopState());
    act(() => {
      result.current.setFontSize("productName", 32);
    });
    expect(result.current.state.fontSize.productName).toBe(32);
    expect(result.current.state.fontSize.price).toBe(36); // unchanged
  });
});

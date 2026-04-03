"use client";

import { useState, useCallback } from "react";
import type { Category, Template, PaperSize, FontFamily, PriceType, POPRequest } from "@/types/pop";
import type { ColorScheme } from "@/lib/canvas/colors";

export interface PopState {
  category: Category | null;
  template: Template | null;
  productName: string;
  price: number;
  priceType: PriceType;
  catchphrase: string;
  description: string;
  fontFamily: FontFamily;
  paperSize: PaperSize;
  colorSchemeId: string;
  customPrimaryColor: string | null;
  customAccentColor: string | null;
  fontSize: {
    productName: number;
    price: number;
    catchphrase: number;
  };
}

const initialState: PopState = {
  category: null,
  template: null,
  productName: "",
  price: 0,
  priceType: "tax_included",
  catchphrase: "",
  description: "",
  fontFamily: "gothic",
  paperSize: "a4",
  colorSchemeId: "",
  customPrimaryColor: null,
  customAccentColor: null,
  fontSize: {
    productName: 28,
    price: 36,
    catchphrase: 12,
  },
};

export function usePopState() {
  const [state, setState] = useState<PopState>(initialState);

  const setCategory = useCallback((category: Category) => {
    setState((prev) => ({ ...prev, category, template: null }));
  }, []);

  const setTemplate = useCallback((template: Template) => {
    setState((prev) => ({
      ...prev,
      template,
      customPrimaryColor: null,
      customAccentColor: null,
      colorSchemeId: "",
    }));
  }, []);

  const setProductInfo = useCallback(
    (info: Partial<Pick<PopState, "productName" | "price" | "priceType" | "catchphrase" | "description">>) => {
      setState((prev) => ({ ...prev, ...info }));
    },
    []
  );

  const setFontFamily = useCallback((fontFamily: FontFamily) => {
    setState((prev) => ({ ...prev, fontFamily }));
  }, []);

  const setPaperSize = useCallback((paperSize: PaperSize) => {
    setState((prev) => ({ ...prev, paperSize }));
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setState((prev) => ({
      ...prev,
      colorSchemeId: scheme.id,
      customPrimaryColor: scheme.primary,
      customAccentColor: scheme.accent,
    }));
  }, []);

  const setCustomColors = useCallback((primary: string, accent: string) => {
    setState((prev) => ({
      ...prev,
      colorSchemeId: "custom",
      customPrimaryColor: primary,
      customAccentColor: accent,
    }));
  }, []);

  const setFontSize = useCallback(
    (key: "productName" | "price" | "catchphrase", value: number) => {
      setState((prev) => ({
        ...prev,
        fontSize: { ...prev.fontSize, [key]: value },
      }));
    },
    []
  );

  const toPOPRequest = useCallback((): POPRequest | null => {
    if (!state.template || !state.productName) return null;
    return {
      product_name: state.productName,
      price: state.price,
      price_type: state.priceType,
      catchphrase: state.catchphrase,
      description: state.description,
      template_id: state.template.id,
      font_family: state.fontFamily,
      color_scheme: state.colorSchemeId,
      paper_size: state.paperSize,
    };
  }, [state]);

  const primaryColor = state.customPrimaryColor ?? state.template?.primary_color ?? "#333333";
  const accentColor = state.customAccentColor ?? state.template?.accent_color ?? "#FFFFFF";

  return {
    state,
    setCategory,
    setTemplate,
    setProductInfo,
    setFontFamily,
    setPaperSize,
    setColorScheme,
    setCustomColors,
    setFontSize,
    toPOPRequest,
    primaryColor,
    accentColor,
  };
}

"use client";

import { useState, useCallback } from "react";
import { productFormSchema, type ProductFormData } from "@/lib/validation";
import type { PriceType } from "@/types/pop";

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onChange?: (data: Partial<ProductFormData>) => void;
}

interface FormErrors {
  product_name?: string;
  price?: string;
  catchphrase?: string;
  description?: string;
}

export function ProductForm({ onSubmit, onChange }: ProductFormProps) {
  const [productName, setProductName] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [priceType, setPriceType] = useState<PriceType>("tax_included");
  const [catchphrase, setCatchphrase] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const notifyChange = useCallback(
    (partial: Partial<ProductFormData>) => {
      onChange?.({
        product_name: productName,
        price: Number(priceStr) || 0,
        price_type: priceType,
        catchphrase,
        description,
        ...partial,
      });
    },
    [productName, priceStr, priceType, catchphrase, description, onChange]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const raw = {
      product_name: productName,
      price: Number(priceStr) || 0,
      price_type: priceType,
      catchphrase,
      description,
    };

    const result = productFormSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="product_name" className="block text-sm font-medium mb-1">
          商品名 <span className="text-red-500">*</span>
        </label>
        <input
          id="product_name"
          type="text"
          value={productName}
          onChange={(e) => {
            setProductName(e.target.value);
            notifyChange({ product_name: e.target.value });
          }}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="例: 国産りんご"
        />
        {errors.product_name && (
          <p className="text-red-500 text-sm mt-1">{errors.product_name}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            価格 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400">¥</span>
            <input
              id="price"
              type="number"
              value={priceStr}
              onChange={(e) => {
                setPriceStr(e.target.value);
                notifyChange({ price: Number(e.target.value) || 0 });
              }}
              className="w-full border rounded-lg pl-8 pr-3 py-2"
              placeholder="198"
              min="0"
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">税表示</label>
          <select
            value={priceType}
            onChange={(e) => {
              const val = e.target.value as PriceType;
              setPriceType(val);
              notifyChange({ price_type: val });
            }}
            className="border rounded-lg px-3 py-2"
          >
            <option value="tax_included">税込</option>
            <option value="tax_excluded">税抜</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="catchphrase" className="block text-sm font-medium mb-1">
          キャッチコピー
        </label>
        <input
          id="catchphrase"
          type="text"
          value={catchphrase}
          onChange={(e) => {
            setCatchphrase(e.target.value);
            notifyChange({ catchphrase: e.target.value });
          }}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="例: 今が旬！甘さ抜群"
        />
        {errors.catchphrase && (
          <p className="text-red-500 text-sm mt-1">{errors.catchphrase}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          説明文
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            notifyChange({ description: e.target.value });
          }}
          className="w-full border rounded-lg px-3 py-2"
          rows={2}
          placeholder="例: 青森県産ふじりんご。蜜たっぷり。"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        プレビューに反映
      </button>
    </form>
  );
}

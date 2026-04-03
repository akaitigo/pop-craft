import { z } from "zod";

export const productFormSchema = z.object({
  product_name: z
    .string()
    .min(1, "商品名は必須です")
    .max(50, "商品名は50文字以内で入力してください"),
  price: z
    .number({ invalid_type_error: "価格は数値で入力してください" })
    .int("価格は整数で入力してください")
    .min(0, "価格は0以上で入力してください")
    .max(9999999, "価格が大きすぎます"),
  price_type: z.enum(["tax_included", "tax_excluded"]),
  catchphrase: z
    .string()
    .max(100, "キャッチコピーは100文字以内で入力してください")
    .default(""),
  description: z
    .string()
    .max(200, "説明文は200文字以内で入力してください")
    .default(""),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

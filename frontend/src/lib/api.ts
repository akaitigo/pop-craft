import { z } from "zod";
import type { Template, POPRequest } from "@/types/pop";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["supermarket", "drugstore", "bookstore"]),
  pattern: z.enum(["recommendation", "limited", "staff_pick", "new_arrival", "sale"]),
  description: z.string(),
  primary_color: z.string(),
  accent_color: z.string(),
});

const templateArraySchema = z.array(templateSchema);

async function fetchJSON<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  const data: unknown = await res.json();
  return schema.parse(data);
}

export async function listTemplates(): Promise<Template[]> {
  return fetchJSON("/api/v1/templates", templateArraySchema);
}

export async function getTemplatesByCategory(
  category: string
): Promise<Template[]> {
  return fetchJSON(`/api/v1/templates/${encodeURIComponent(category)}`, templateArraySchema);
}

export async function generatePDF(req: POPRequest): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/v1/pop/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PDF generation failed: ${text}`);
  }
  return res.blob();
}

const previewResponseSchema = z.object({
  product_name: z.string(),
  price: z.number(),
  catchphrase: z.string(),
  template_id: z.string(),
  font_family: z.string(),
  color_scheme: z.string(),
  paper_size: z.string(),
});

type PreviewResponse = z.infer<typeof previewResponseSchema>;

export async function previewPOP(req: POPRequest): Promise<PreviewResponse> {
  return fetchJSON("/api/v1/pop/preview", previewResponseSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
}

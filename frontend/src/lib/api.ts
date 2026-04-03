import type { Template, POPRequest } from "@/types/pop";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function listTemplates(): Promise<Template[]> {
  return fetchJSON<Template[]>("/api/v1/templates");
}

export async function getTemplatesByCategory(
  category: string
): Promise<Template[]> {
  return fetchJSON<Template[]>(`/api/v1/templates/${category}`);
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

export async function previewPOP(req: POPRequest): Promise<POPRequest> {
  return fetchJSON<POPRequest>("/api/v1/pop/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
}

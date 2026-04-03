import { describe, it, expect, vi, beforeEach } from "vitest";
import { listTemplates, getTemplatesByCategory } from "./api";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

const validTemplate = {
  id: "super-recommend",
  name: "本日のおすすめ",
  category: "supermarket",
  pattern: "recommendation",
  description: "テスト",
  primary_color: "#E53935",
  accent_color: "#FDD835",
};

describe("listTemplates", () => {
  it("fetches and validates templates", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([validTemplate]),
    });

    const result = await listTemplates();
    expect(result).toEqual([validTemplate]);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/templates",
      undefined
    );
  });

  it("throws on API error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve("internal error"),
    });

    await expect(listTemplates()).rejects.toThrow("API error 500");
  });

  it("throws on invalid response shape", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ invalid: "data" }]),
    });

    await expect(listTemplates()).rejects.toThrow();
  });
});

describe("getTemplatesByCategory", () => {
  it("fetches templates by category", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([validTemplate]),
    });

    const result = await getTemplatesByCategory("supermarket");
    expect(result).toEqual([validTemplate]);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/templates/supermarket",
      undefined
    );
  });

  it("encodes category in URL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await getTemplatesByCategory("some category");
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/templates/some%20category",
      undefined
    );
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { listTemplates, getTemplatesByCategory } from "./api";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("listTemplates", () => {
  it("fetches all templates", async () => {
    const templates = [{ id: "super-recommend", name: "本日のおすすめ" }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(templates),
    });

    const result = await listTemplates();
    expect(result).toEqual(templates);
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
});

describe("getTemplatesByCategory", () => {
  it("fetches templates by category", async () => {
    const templates = [{ id: "drug-recommend", name: "おすすめ商品" }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(templates),
    });

    const result = await getTemplatesByCategory("drugstore");
    expect(result).toEqual(templates);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/templates/drugstore",
      undefined
    );
  });
});

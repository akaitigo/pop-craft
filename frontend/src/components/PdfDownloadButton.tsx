"use client";

import { useState } from "react";
import { generatePDF } from "@/lib/api";
import type { POPRequest } from "@/types/pop";

interface PdfDownloadButtonProps {
  request: POPRequest;
  disabled?: boolean;
}

export function PdfDownloadButton({ request, disabled }: PdfDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const blob = await generatePDF(request);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pop-${request.template_id}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF生成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled ?? loading}
        className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
          disabled ?? loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {loading ? "PDF生成中..." : "PDFダウンロード"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

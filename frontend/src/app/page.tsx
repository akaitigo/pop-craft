"use client";

import { useState, useEffect } from "react";
import { CategorySelector } from "@/components/CategorySelector";
import { TemplateGrid } from "@/components/TemplateGrid";
import { ProductForm } from "@/components/ProductForm";
import { PopCanvas } from "@/components/PopCanvas";
import { FontSelector } from "@/components/FontSelector";
import { ColorPicker } from "@/components/ColorPicker";
import { LayoutControls } from "@/components/LayoutControls";
import { PaperSizeSelector } from "@/components/PaperSizeSelector";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";
import { StepIndicator } from "@/components/StepIndicator";
import { PrintPreview } from "@/components/PrintPreview";
import { usePopState } from "@/hooks/usePopState";
import { getTemplatesByCategory } from "@/lib/api";
import type { Template } from "@/types/pop";

export default function Home() {
  const {
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
  } = usePopState();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  useEffect(() => {
    if (!state.category) return;
    getTemplatesByCategory(state.category)
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, [state.category]);

  const popRequest = toPOPRequest();

  const steps = [
    { label: "業態選択", completed: state.category !== null, active: state.category === null },
    { label: "テンプレート", completed: state.template !== null, active: state.category !== null && state.template === null },
    { label: "カスタマイズ", completed: false, active: state.template !== null },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">POP-Craft</h1>
          <p className="text-center text-gray-500 text-sm mt-1">
            小売店舗のPOPをテンプレートから即時生成
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <StepIndicator steps={steps} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <div className="space-y-6">
            {/* Step 1: Category */}
            <section>
              <h2 className="text-lg font-semibold mb-3">業態を選択</h2>
              <CategorySelector
                selected={state.category}
                onSelect={setCategory}
              />
            </section>

            {/* Step 2: Template */}
            {state.category && (
              <section>
                <h2 className="text-lg font-semibold mb-3">テンプレートを選択</h2>
                <TemplateGrid
                  templates={templates}
                  selectedId={state.template?.id ?? null}
                  onSelect={setTemplate}
                />
              </section>
            )}

            {/* Step 3: Product Info + Customization */}
            {state.template && (
              <>
                <section>
                  <h2 className="text-lg font-semibold mb-3">商品情報</h2>
                  <ProductForm
                    onSubmit={(data) => {
                      setProductInfo({
                        productName: data.product_name,
                        price: data.price,
                        priceType: data.price_type,
                        catchphrase: data.catchphrase,
                        description: data.description,
                      });
                    }}
                    onChange={(data) => {
                      setProductInfo({
                        productName: data.product_name,
                        price: data.price,
                        priceType: data.price_type,
                        catchphrase: data.catchphrase,
                        description: data.description,
                      });
                    }}
                  />
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-semibold">デザイン設定</h2>
                  <FontSelector
                    selected={state.fontFamily}
                    onSelect={setFontFamily}
                  />
                  <ColorPicker
                    selectedId={state.colorSchemeId}
                    onSelect={setColorScheme}
                    onCustomColor={setCustomColors}
                  />
                  <LayoutControls
                    fontSize={state.fontSize}
                    onFontSizeChange={setFontSize}
                  />
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">用紙サイズ</h2>
                  <PaperSizeSelector
                    selected={state.paperSize}
                    onSelect={setPaperSize}
                  />
                </section>

                <section className="space-y-3">
                  {popRequest && <PdfDownloadButton request={popRequest} />}
                  <button
                    type="button"
                    onClick={() => setShowPrintPreview(true)}
                    className="w-full py-3 rounded-lg font-bold text-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
                  >
                    印刷プレビュー
                  </button>
                </section>
              </>
            )}
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            {state.template ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 text-center">プレビュー</h2>
                <PopCanvas
                  productName={state.productName}
                  price={state.price}
                  priceType={state.priceType}
                  catchphrase={state.catchphrase}
                  description={state.description}
                  template={{
                    ...state.template,
                    primary_color: primaryColor,
                    accent_color: accentColor,
                  }}
                  fontFamily={state.fontFamily}
                  paperSize={state.paperSize}
                  fontSize={state.fontSize}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-400">
                <p className="text-4xl mb-4">🎨</p>
                <p>業態とテンプレートを選択すると</p>
                <p>ここにプレビューが表示されます</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PrintPreview
        open={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        productName={state.productName}
        price={state.price}
        priceType={state.priceType}
        catchphrase={state.catchphrase}
        description={state.description}
        template={state.template}
        fontFamily={state.fontFamily}
        paperSize={state.paperSize}
        primaryColor={primaryColor}
        accentColor={accentColor}
        fontSize={state.fontSize}
      />
    </main>
  );
}

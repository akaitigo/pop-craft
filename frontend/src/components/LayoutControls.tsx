"use client";

interface LayoutControlsProps {
  fontSize: {
    productName: number;
    price: number;
    catchphrase: number;
  };
  onFontSizeChange: (key: "productName" | "price" | "catchphrase", value: number) => void;
}

const CONTROLS = [
  { key: "productName" as const, label: "商品名", min: 12, max: 48, step: 2 },
  { key: "price" as const, label: "価格", min: 16, max: 60, step: 2 },
  { key: "catchphrase" as const, label: "キャッチコピー", min: 8, max: 32, step: 2 },
];

export function LayoutControls({ fontSize, onFontSizeChange }: LayoutControlsProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">文字サイズ調整</label>
      {CONTROLS.map(({ key, label, min, max, step }) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-24">{label}</span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={fontSize[key]}
            onChange={(e) => onFontSizeChange(key, Number(e.target.value))}
            className="flex-1"
            aria-label={`${label}の文字サイズ`}
          />
          <span className="text-xs text-gray-400 w-8 text-right">
            {fontSize[key]}
          </span>
        </div>
      ))}
    </div>
  );
}

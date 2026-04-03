export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  accent: string;
  text: string;
  background: string;
}

export const PRESET_COLORS: ColorScheme[] = [
  { id: "red-gold", name: "レッド×ゴールド", primary: "#E53935", accent: "#FDD835", text: "#FFFFFF", background: "#E53935" },
  { id: "blue-white", name: "ブルー×ホワイト", primary: "#1E88E5", accent: "#FFFFFF", text: "#FFFFFF", background: "#1E88E5" },
  { id: "green-yellow", name: "グリーン×イエロー", primary: "#43A047", accent: "#FDD835", text: "#FFFFFF", background: "#43A047" },
  { id: "orange-white", name: "オレンジ×ホワイト", primary: "#FB8C00", accent: "#FFFFFF", text: "#FFFFFF", background: "#FB8C00" },
  { id: "purple-pink", name: "パープル×ピンク", primary: "#7B1FA2", accent: "#F48FB1", text: "#FFFFFF", background: "#7B1FA2" },
  { id: "brown-cream", name: "ブラウン×クリーム", primary: "#5D4037", accent: "#FFF8E1", text: "#FFFFFF", background: "#5D4037" },
  { id: "teal-light", name: "ティール×ライト", primary: "#00838F", accent: "#E0F7FA", text: "#FFFFFF", background: "#00838F" },
  { id: "black-red", name: "ブラック×レッド", primary: "#212121", accent: "#E53935", text: "#FFFFFF", background: "#212121" },
  { id: "navy-gold", name: "ネイビー×ゴールド", primary: "#1A237E", accent: "#FFD54F", text: "#FFFFFF", background: "#1A237E" },
  { id: "pink-white", name: "ピンク×ホワイト", primary: "#E91E63", accent: "#FFFFFF", text: "#FFFFFF", background: "#E91E63" },
  { id: "yellow-red", name: "イエロー×レッド", primary: "#FDD835", accent: "#E53935", text: "#212121", background: "#FDD835" },
  { id: "white-blue", name: "ホワイト×ブルー", primary: "#FAFAFA", accent: "#1E88E5", text: "#212121", background: "#FAFAFA" },
];

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

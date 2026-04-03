# POP-Craft Internal Guidelines

## アーキテクチャ
- Frontend → Backend API (REST JSON)
- テンプレートデータは backend/internal/template/ で管理
- PDF生成は backend/internal/pdf/ で go-fpdf を使用
- Canvas描画は frontend/src/lib/canvas/ に集約

## コーディング規約
- Go: chi router, 構造体にバリデーションタグ
- TS: Zod でランタイムバリデーション, TailwindCSS
- テストファイルは対象と同じディレクトリに配置
- API: /api/v1/ プレフィックス

## テンプレート体系
- 業態: supermarket, drugstore, bookstore
- パターン: recommendation, limited, staff_pick, new_arrival, sale
- 用紙: a4, a5, card (名刺サイズ)

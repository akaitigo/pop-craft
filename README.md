# POP-Craft

[![CI](https://github.com/akaitigo/pop-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/akaitigo/pop-craft/actions/workflows/ci.yml)

小売店舗のPOP（店頭販促物）をテンプレートから即時生成するPOPデザインツール。

## クイックスタート

```bash
# Frontend
cd frontend && pnpm install && pnpm dev
# → http://localhost:3000

# Backend
cd backend && go run ./cmd/server
# → http://localhost:8080
```

## 機能

- **業態別テンプレート** — スーパー / ドラッグストア / 書店（15種類）
- **リアルタイムプレビュー** — Canvas APIで入力と同時に描画
- **フォント4種** — ゴシック / 明朝 / 手書き風 / 筆文字
- **カラーパレット** — プリセット12色 + カスタムカラー
- **PDF出力** — A4 / A5 / 名刺サイズ対応
- **印刷プレビュー** — ブラウザから直接印刷

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| Frontend | TypeScript / Next.js 15 (App Router) / TailwindCSS |
| POP描画 | Canvas API |
| バリデーション | Zod |
| Backend API | Go 1.23 / chi router |
| PDF生成 | go-fpdf |
| Database | PostgreSQL |
| CI | GitHub Actions |

## アーキテクチャ

```
┌──────────────────────┐     ┌──────────────────────┐     ┌────────────┐
│   Next.js Frontend   │────▶│    Go API Server     │────▶│ PostgreSQL │
│                      │     │                      │     │            │
│  ┌────────────────┐  │     │  ┌────────────────┐  │     │ templates  │
│  │ CategorySelect │  │     │  │ /api/v1/       │  │     │ pop_history│
│  │ TemplateGrid   │  │     │  │  templates     │  │     └────────────┘
│  │ ProductForm    │  │     │  │  pop/preview   │  │
│  │ PopCanvas      │  │     │  │  pop/pdf       │  │
│  │ FontSelector   │  │     │  └────────────────┘  │
│  │ ColorPicker    │  │     │  ┌────────────────┐  │
│  │ PdfDownload    │  │     │  │ go-fpdf        │  │
│  └────────────────┘  │     │  │ PDF Renderer   │  │
└──────────────────────┘     │  └────────────────┘  │
                             └──────────────────────┘
```

## 開発コマンド

```bash
make check    # lint + test + build
make dev      # frontend + backend 同時起動
make test     # 全テスト実行
make lint     # 全lint実行
make build    # 全ビルド
```

## プロジェクト構造

```
pop-craft/
├── frontend/            # Next.js 15 App
│   └── src/
│       ├── app/         # ページ・レイアウト
│       ├── components/  # UIコンポーネント
│       ├── hooks/       # カスタムHook
│       ├── lib/         # API・Canvas・バリデーション
│       └── types/       # 型定義
├── backend/             # Go API Server
│   ├── cmd/server/      # エントリーポイント
│   └── internal/
│       ├── handler/     # HTTPハンドラ
│       ├── model/       # ドメインモデル
│       ├── pdf/         # PDF生成
│       └── template/    # テンプレートデータ
├── db/migrations/       # SQLマイグレーション
├── docs/                # PRD・ADR
└── .github/workflows/   # CI
```

## テスト

- **Frontend**: 63テスト（Vitest + Testing Library）
- **Backend**: 全パッケージカバレッジ（Go test -race）

## ドキュメント

- [PRD](docs/PRD.md) — プロダクト要件定義
- [ADR-001](docs/adr/001-template-storage-strategy.md) — テンプレート保存戦略
- [ADR-002](docs/adr/002-canvas-api-for-preview.md) — Canvas API採用理由

## ライセンス

MIT

# POP-Craft

小売店舗POP即時生成ツール。Next.js + Go + PostgreSQL。

## 構造
- `frontend/` — Next.js 15 (App Router), Canvas API POP描画
- `backend/` — Go API (chi router), PDF生成 (go-fpdf)
- `db/migrations/` — PostgreSQL マイグレーション
- `docs/` — PRD, ADR

## 開発コマンド
```bash
make check          # lint + test + build 全チェック
make dev            # frontend + backend 同時起動
make test           # 全テスト実行
make lint           # 全lint実行
make build          # 全ビルド
```

## Frontend (frontend/)
```bash
cd frontend && pnpm install
pnpm dev            # localhost:3000
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit
pnpm test           # vitest
pnpm build          # next build
```

## Backend (backend/)
```bash
cd backend && go mod tidy
go run ./cmd/server  # localhost:8080
go test -race ./...  # テスト
golangci-lint run    # lint
```

## ルール
- TypeScript: `any` 禁止, `as` 最小限
- Go: エラーは必ずハンドル, `_` で握りつぶさない
- テスト: 正常系 + 異常系を必ず書く
- PDF出力: A4/A5/名刺サイズ (91×55mm) 対応必須

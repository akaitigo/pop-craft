# POP-Craft

小売店舗POP即時生成ツール。本番はNext.js Static Exportによるブラウザ完結構成。

## 構造
- `frontend/` — Next.js 15 (App Router), 固定テンプレート, Canvas描画, Browser Print API
- `backend/` — 比較検証用Go API (chi router), PDF生成 (go-fpdf)。本番サイトからは未使用
- `db/migrations/` — 比較検証用PostgreSQLマイグレーション
- `docs/` — PRD, ADR

## 開発コマンド
```bash
make check          # lint + test + build 全チェック
make dev            # frontendを開発モードで起動
make dev-backend    # 比較検証用Go APIを起動
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
- 本番用テンプレートの正本: `frontend/src/data/templates.ts`
- 本番画面へGo API依存を再導入する場合は、コスト・プライバシー・運用負荷をADRで再評価する
- 印刷: A4/A5/名刺の縦横比に対応。実寸指定とWebフォント読込保証はIssue #37で追跡する

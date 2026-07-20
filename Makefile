.PHONY: check dev dev-backend test lint build cloudflare-validate cloudflare-preview clean

check: lint test build cloudflare-validate
	@echo "All checks passed"

dev:
	cd frontend && pnpm dev

dev-backend:
	cd backend && go run ./cmd/server

test:
	cd frontend && pnpm test -- --run
	cd backend && go test -race ./...

lint:
	cd frontend && pnpm lint && pnpm typecheck
	cd backend && golangci-lint run ./...

build:
	cd frontend && pnpm build
	cd backend && go build -o bin/server ./cmd/server

cloudflare-validate:
	node --test scripts/verify-static-assets.test.mjs
	node scripts/verify-static-assets.mjs
	cd frontend && pnpm exec wrangler deploy --dry-run --config ../wrangler.jsonc

cloudflare-preview:
	cd frontend && pnpm build
	cd frontend && pnpm exec wrangler dev --config ../wrangler.jsonc

clean:
	rm -rf frontend/.next frontend/node_modules backend/bin

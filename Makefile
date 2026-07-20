.PHONY: check dev dev-backend test lint build clean

check: lint test build
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

clean:
	rm -rf frontend/.next frontend/node_modules backend/bin

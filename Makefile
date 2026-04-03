.PHONY: check dev test lint build clean

check: lint test build
	@echo "All checks passed"

dev:
	@echo "Starting dev servers..."
	cd frontend && pnpm dev &
	cd backend && go run ./cmd/server &
	wait

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

lint:
	bun run lint

typecheck:
	bun run typecheck

test:
	bun run test

test:e2e:
	bun run test:e2e

build:
	bun run build

# Run the full CI suite inside Docker (reproducible environment)
docker-ci:
	docker compose run --rm ci

# Start the dev server inside Docker (for container-first workflows)
docker-dev:
	docker compose up app

all: lint typecheck test build

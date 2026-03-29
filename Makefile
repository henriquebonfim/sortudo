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

all: lint typecheck test test:e2e build

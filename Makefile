.PHONY: setup down
setup:
	docker-compose -f stack.yml up -d

down:
	docker-compose -f stack.yml down -v


CONT_NAME=clean-node-api

# building
build:
	docker build -t $(CONT_NAME) -f $(CONT_NAME) --file ./docker/dev/Dockerfile .

# running
sh:
	docker exec -it $(CONT_NAME) sh
up:
	docker-compose up -d
down:
	docker-compose kill
	docker-compose rm -f
logs:
	docker-compose logs -f $(CONT_NAME)

# migrations
migrate-new-%:
	cp database/migration-template.ts database/migrations/"$$(date +%Y%m%d%H%M%S)_$*.ts"
migrate-up:
	docker-compose run --rm $(CONT_NAME) yarn migrate:latest
migrate-down:
	docker-compose run --rm $(CONT_NAME) yarn migrate:rollback
seed:
	docker-compose run --rm $(CONT_NAME) yarn seed

# package scripts
run:
	docker-compose run --rm $(CONT_NAME) yarn
lint:
	docker-compose run --rm $(CONT_NAME) yarn lint
lint-fix:
	docker-compose run --rm $(CONT_NAME) yarn lint:fix
lint-staged:
	docker-compose run --rm $(CONT_NAME) yarn lint:staged
test:
	docker-compose run --rm $(CONT_NAME) yarn test
test-unit:
	docker-compose run --rm $(CONT_NAME) yarn test:unit
test-integration:
	docker-compose run --rm $(CONT_NAME) yarn test:integration
test-watch:
	docker-compose run --rm $(CONT_NAME) yarn test:watch
test-coverage:
	docker-compose run --rm $(CONT_NAME) yarn test:coverage

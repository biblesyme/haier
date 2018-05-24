TAG=front-v0.1.0
DOCKERFILE_DIR=./package
PROJECT=paasadmin
PREFIX=reg.haier.net/$(PROJECT)
APP=paasadmin

build:
	npm run build
	cp -r static dist/

package: build
	cp -r dist package/
	cp -r static package/dist
	docker build -t $(PREFIX)/$(APP):$(TAG) $(DOCKERFILE_DIR)
	rm -rf package/dist

run:
	npm run dev

clean:
	rm -rf dist

.PHONY: build

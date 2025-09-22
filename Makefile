# Makefile for running Astro Svelte application with variables

PKG_MGR ?= pnpm

install:
	$(PKG_MGR) install

dev:
	$(PKG_MGR) run dev

build:
	$(PKG_MGR) run build

preview:
	$(PKG_MGR) run preview

clean:
	rm -rf node_modules .astro dist

.PHONY: install dev build preview clean
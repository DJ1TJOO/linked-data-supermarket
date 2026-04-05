# Linked Data Supermarket Dashboard

Single-page dashboard built with Vue 3, shadcn-vue components, and Unovis charts.

It executes 8 SPARQL queries against a running SPARQL endpoint and visualizes results for:

- most sold products
- highest turnover products
- top-performing vegetables
- best-performing categories
- highest loss rate products
- highest lost revenue products
- date-based sales distribution
- health benefits by product

## Prerequisites

- Node.js 20+
- pnpm 10+
- A running SPARQL endpoint containing the supermarket RDF dataset

## Environment

Create a local env file in this folder.

1. Copy `.env.example` to `.env.local`
2. Set your endpoint URL


## Install

```bash
pnpm install
```

## Run

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

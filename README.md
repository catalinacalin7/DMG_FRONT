# DMG Frontend

Frontend application for Estimate Master / PDR

Built with:
- Next.js
- React
- TypeScript
- pnpm

## Requirements

- Node.js 20
- pnpm
- running backend API

## Environment variables

Create a local environment file:

```bash
cp .env.example .env.development
```
Poți pune așa în dmg-front/README.md:

# DMG Frontend

Frontend application for Estimate Master / PDR

Built with:
- Next.js
- React
- TypeScript
- pnpm

## Requirements

- Node.js 20
- pnpm
- running backend API

## Environment variables

Create a local environment file:

```bash
cp .env.example .env.development
```

Example:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
```
For local development, the backend should run on:
```
http://localhost:5001
```
Install dependencies
```
pnpm install
```
Run locally
```
pnpm dev
```
The app will be available at:
```
http://localhost:3000
```
Build
```
pnpm build
```
Start production build locally
```
pnpm start
```
Notes:
- This project uses environment variables for API configuration
- NEXT_PUBLIC_API_BASE_URL is exposed to the browser
- Do not commit .env, .env.development, .env.production or other real environment files
- Only .env.example should be committed

Related projects:
- backend: DMG_BACKEND
- mobile: DMG_MOBILE

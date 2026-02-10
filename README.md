# Frontend Developer Assessment (Next.js)

Assessment implementation using Next.js 16, TypeScript, Tailwind CSS v4, and HeroUI.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production build
- `npm run lint` - lint code
- `npm run format` - format code with Prettier

## Auth credentials

Member:

- Email: `member@valid.email`
- Password: `Member123!`
- OTP: `151588`

Partner:

- Email: `partner@valid.email`
- Password: `Partner123!`
- OTP: `262699`

Auth state is persisted in `sessionStorage`.

## MockAPI

Base URL: `https://653fb0ea9e8bd3be29e10cd4.mockapi.io/api/v1`

Examples:

```bash
curl "https://653fb0ea9e8bd3be29e10cd4.mockapi.io/api/v1/currencies"
curl "https://653fb0ea9e8bd3be29e10cd4.mockapi.io/api/v1/balances?page=1&limit=20&sortBy=amount&order=desc"
```

## Architecture notes

- State management: React Context + hooks to keep the footprint small and explicit.
- Theming: HeroUI theme plugin defines `member/partner` palettes for light/dark.
- Data access: small `fetch` wrapper with typed API methods and error handling.
- Infinite scroll: IntersectionObserver hook to fetch additional pages.

## App structure

- `src/app/page.tsx` - balances list with search/sort/infinite scroll
- `src/app/login` - login + OTP flow
- `src/app/currencies/[id]` - currency details page
- `src/contexts` - theme, account type, and auth contexts
- `src/lib` - API client and auth constants

## Testing

```bash
npm run test
```

Tests live in `src/hooks/__tests__` and `src/components/__tests__`.

## CI

GitHub Actions runs `npm run lint` and `npm run build` on pushes and PRs.

## Accessibility & responsiveness

The UI uses semantic headings, labeled inputs, and responsive layouts.
Errors are surfaced with alert roles and accessible messaging.

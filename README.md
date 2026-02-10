# Frontend Developer Assessment (Next.js)

Assessment implementation using Next.js 16, TypeScript, Tailwind CSS v4, and HeroUI.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Usage

- Login with the demo credentials below.
- Browse balances on the home page, use search/sort, and scroll to load more.
- Open a balance to view currency details.

Auth state is persisted in `sessionStorage`.

### Demo credentials

Member:

- Email: `member@valid.email`
- Password: `Member123!`
- OTP: `151588`

Partner:

- Email: `partner@valid.email`
- Password: `Partner123!`
- OTP: `262699`

## Testing

```bash
npm run test
```

Tests live in `src/hooks/__tests__` and `src/components/__tests__`.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production build
- `npm run lint` - lint code
- `npm run format` - format code with Prettier

## Architecture decisions & trade-offs

- **State management:** React Context + hooks for auth/theme/account type to keep the footprint small. Trade-off: less scalable than a dedicated state library if shared state grows.
- **Data access:** a typed `fetch` wrapper in `src/lib/api.ts` to centralize errors and keep components lean. Trade-off: less caching/invalidation than a data-fetching library.
- **UI/theming:** HeroUI theme plugin and Tailwind for rapid, consistent styling. Trade-off: tied to HeroUI primitives for some components.
- **Pagination:** IntersectionObserver-based infinite scroll for smooth UX. Trade-off: less explicit control than classic pagination.

## MockAPI

Base URL: `https://653fb0ea9e8bd3be29e10cd4.mockapi.io/api/v1`

Examples:

```bash
curl "https://653fb0ea9e8bd3be29e10cd4.mockapi.io/api/v1/currencies"
curl "https://653fb0ea9e8bd3be29e10cd4.mockapi.io/api/v1/balances?page=1&limit=20&sortBy=amount&order=desc"
```

## App structure

- `src/app/page.tsx` - balances list with search/sort/infinite scroll
- `src/app/login` - login + OTP flow
- `src/app/currencies/[id]` - currency details page
- `src/contexts` - theme, account type, and auth contexts
- `src/lib` - API client and auth constants

## CI

GitHub Actions runs `npm run lint` and `npm run build` on pushes and PRs.

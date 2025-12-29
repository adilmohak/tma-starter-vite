# Telegram Mini App Starter (TMA Starter)

A production-ready Next.js starter template for building Telegram Mini Apps with TypeScript, Tailwind CSS, and best practices baked in.

## Features

- **Telegram WebApp SDK** - Full integration with back button handling, theme sync, and fullscreen support
- **Next.js 15** - App Router with Turbopack for fast development
- **TypeScript** - Type-safe codebase
- **Tailwind CSS** - Utility-first styling with dark mode support
- **i18n** - Built-in multi-language support (English, Amharic, Tigrinya, Oromo)
- **State Management** - Zustand for global state
- **React Query** - Data fetching and caching
- **UI Components** - Pre-built components with shadcn/ui patterns
- **Animations** - Framer Motion + Lottie support

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Telegram's WebView or browser.

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (core)/               # Main app routes (grouped)
│   │   ├── invite/           # Invite/referral page
│   │   ├── profile/          # User profile page
│   │   ├── layout.tsx        # Core layout with footer
│   │   └── page.tsx          # Home page
│   ├── globals.css           # Global styles & CSS variables
│   ├── layout.tsx            # Root layout
│   └── providers.tsx         # App-wide providers wrapper
│
├── components/
│   ├── effects/              # Visual effects (fireworks, particles)
│   ├── invite/               # Invite feature components
│   ├── layout/               # Layout components (PreLoader, etc.)
│   ├── telegram/             # Telegram-specific (BackButton)
│   └── ui/                   # Reusable UI components (shadcn-style)
│
├── context/                  # React contexts
│   ├── authContext.tsx       # Authentication state
│   └── TelegramFullscreenContext.tsx
│
├── hooks/                    # Custom React hooks
│   ├── useTelegram.ts        # Telegram WebApp hook
│   ├── useLanguage.ts        # i18n hook
│   └── ...
│
├── lib/                      # Utilities and helpers
│   ├── i18n/                 # Internationalization
│   │   ├── config.ts         # i18n configuration
│   │   └── translations/     # Translation files
│   ├── constants.ts          # App constants
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
│
├── providers/                # Provider components
│   └── QueryProvider.tsx     # React Query provider
│
├── schema/                   # Zustand stores
│   └── general.ts            # Global state (drawers, modals, etc.)
│
├── services/                 # API services
│   ├── api.ts                # Base API client
│   └── general.ts            # API endpoints
│
└── store/                    # Additional stores
    ├── language.ts           # Language store
    └── themeStore.ts         # Theme store
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_ENV=development
```

### Telegram Bot Setup

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Enable Mini App mode and set your app URL
3. Configure the Web App button

## Key Patterns

### Telegram BackButton

The `BackButton` component automatically handles:

- Closing open drawers (LIFO order)
- Closing embedded views
- Navigation/app close

### Drawer State Management

```tsx
// Register drawer with back button handler
const { registerDrawer, unregisterDrawer } = useDrawerState();

useEffect(() => {
  if (open) {
    registerDrawer("my-drawer", () => setOpen(false));
  }
  return () => unregisterDrawer("my-drawer");
}, [open]);
```

### Translations

```tsx
const { t } = useLanguage();
return <h1>{t("invite.header_title")}</h1>;
```

## Scripts

```bash
npm run dev       # Development with Turbopack
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## License

MIT

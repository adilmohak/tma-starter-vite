import { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import SplashScreen from "@/components/layout/splash-screen";
import FireworkAnimation from "@/components/effects/firework-animation";
import QueryProvider from "@/providers/query-provider";
import { AuthProvider } from "@/context/auth-context";
import DeeplinkRouter from "@/components/deeplink-router";
import BackButtonHandler from "@/components/telegram/back-button-handler";
import { TelegramFullscreenProvider } from "@/context/telegram-fullscreen-context";
import { Toaster } from "@/components/ui/sonner";

// Pages
import HomePage from "@/pages/home";
import InvitePage from "@/pages/invite";
import ProfilePage from "@/pages/profile";

// Layouts
import CoreLayout from "@/layouts/core-layout";

function Providers({ children }: { children: React.ReactNode }) {
  const [isDomLoaded, setIsDomLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsDomLoaded(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <TelegramFullscreenProvider>
        <SplashScreen isLoaded={isDomLoaded} />
        <main className="relative flex flex-col w-full antialiased max-w-[var(--layout-max-width)] mx-auto min-h-screen">
          <FireworkAnimation />
          <BackButtonHandler />
          <Toaster
            richColors
            position="top-center"
            toastOptions={{
              classNames: {
                toast: "safe-area-margin-top",
              },
            }}
          />

          <QueryProvider>
            <AuthProvider>
              <DeeplinkRouter>{children}</DeeplinkRouter>
            </AuthProvider>
          </QueryProvider>
        </main>
      </TelegramFullscreenProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Providers>
      <Routes>
        {/* Core routes with bottom navigation */}
        <Route element={<CoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Providers>
  );
}

export default App;

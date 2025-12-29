"use client";

import "@/app/globals.css";
import Script from "next/script";
import { Jost } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import Providers from "./providers";

const jost = Jost({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning className={jost.className}>
        <head>
          <Script
            strategy="beforeInteractive"
            src="https://telegram.org/js/telegram-web-app.js"
            onError={(e) => {
              console.error("Failed to load Telegram Web App script:", e);
            }}
            onLoad={() => {
              console.log("Telegram Web App script loaded successfully");
            }}
          />
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-13CTSDE3L2"
            onError={(e) => {
              console.error("Failed to load Google Analytics script:", e);
            }}
            onLoad={() => {
              console.log("Google Analytics script loaded successfully");
            }}
          />
          {/* <Script id="google-analytics" strategy="afterInteractive">
            {`
            try {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-13CTSDE3L2');
            } catch (error) {
              console.error('Google Analytics initialization error:', error);
            }
          `}
          </Script> */}
          {/* <Script id="global-error-handler" strategy="afterInteractive">
            {`
            // Global error handler for script loading errors
            window.addEventListener('error', function(event) {
              if (event.target && event.target.tagName === 'SCRIPT') {
                console.error('Script loading error:', {
                  src: event.target.src,
                  message: event.message,
                  filename: event.filename,
                  lineno: event.lineno,
                  colno: event.colno,
                  error: event.error
                });
              }
            }, true);
            
            // Handle unhandled promise rejections
            window.addEventListener('unhandledrejection', function(event) {
              console.error('Unhandled promise rejection:', event.reason);
            });
          `}
          </Script> */}
        </head>
        <body>
          <div id="embedded-view-portal" />
          <div id="payment-portal" />

          <Providers>{children}</Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}

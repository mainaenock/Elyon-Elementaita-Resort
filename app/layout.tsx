import type { ReactNode } from "react";
import "@fontsource/baskervville/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "./globals.css";
import { Shell } from "@/components/shell";
import { sitePath } from "@/lib/site-path";
export const metadata = {
  title: {
    default: "Elyon Elementaita Resort | A garden retreat in Gilgil",
    template: "%s | Elyon Elementaita Resort",
  },
  description:
    "Discover Elyon Elementaita Resort, a garden retreat for stays, dining and gatherings in Gilgil, Nakuru County.",
  icons: { icon: sitePath("/images/logo.webp") },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}

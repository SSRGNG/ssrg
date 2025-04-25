import type { Metadata } from "next";

import { ThemeProvider } from "@/components/providers/theme";
import { TailwindIndicator } from "@/components/shared/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { appConfig } from "@/config";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: appConfig.name, template: `%s | ${appConfig.name}` },
  description: appConfig.description,
  keywords: appConfig.keywords,
  authors: appConfig.authors,
  creator: appConfig.creator,
  // icons: [{ rel: "icon", url: "/logo.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen min-h-svh bg-background flex flex-col font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <TailwindIndicator />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

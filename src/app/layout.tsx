import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ThemeProvider } from "@/components/providers/theme";
import { TailwindIndicator } from "@/components/shared/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { appConfig } from "@/config";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: appConfig.appFullName, template: `%s | ${appConfig.name}` },
  description: appConfig.description,
  keywords: appConfig.keywords,
  authors: appConfig.authors,
  creator: appConfig.creator,
  icons: [{ rel: "icon", url: "/logo.jpg" }],
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
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
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

import { auth } from "@/auth";
import { appConfig } from "@/config";
import {
  apiAuthPrefix,
  protectedAuthRoutes,
  protectedRoutes,
  publicAuthRoutes,
} from "@/config/routes";
import { env } from "@/env";

const isDebug = env.NODE_ENV !== "production" || process.env.DEBUG === "true";

export default auth((req) => {
  const { nextUrl, url } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicAuthRoute = publicAuthRoutes.includes(pathname);
  const isProtectedAuthRoute = protectedAuthRoutes.includes(pathname);

  if (isDebug) {
    console.log("=== Middleware ===");
    console.log(`Path: ${pathname}`);
    console.log(`Logged in: ${isLoggedIn}`);
    console.log(`API Auth Route: ${isApiAuthRoute}`);
    console.log(`Public Auth Route: ${isPublicAuthRoute}`);
    console.log(`Protected Auth Route: ${isProtectedAuthRoute}`);
    console.log(`Protected Route: ${isProtectedRoute}`);
  }

  // Skip middleware for API auth routes - THIS SHOULD COME FIRST
  if (isApiAuthRoute) {
    if (isDebug) console.log("Skipping API auth route");
    return;
  }

  // Redirect logged-in users away from public auth routes (e.g., sign-in)
  if (isPublicAuthRoute) {
    if (isLoggedIn) {
      if (isDebug)
        console.log(`Redirecting logged-in user to ${appConfig.entry.href}`);
      return Response.redirect(url.replace(pathname, appConfig.entry.href));
    }
    return;
  }

  // Prevent access to protected auth routes (e.g., sign-out) if not logged in
  if (isProtectedAuthRoute) {
    if (!isLoggedIn) {
      if (isDebug)
        console.log(`Redirecting unauthenticated user to ${appConfig.url}`);
      return Response.redirect(url.replace(pathname, appConfig.url));
    }
    return;
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!isLoggedIn && isProtectedRoute) {
    if (isDebug)
      console.log(
        `Unauthenticated user accessing protected route — redirecting to ${appConfig.auth.signin.href}`
      );
    return Response.redirect(
      url.replace(nextUrl.pathname, appConfig.auth.signin.href)
    );
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

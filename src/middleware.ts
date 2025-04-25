import { auth } from "@/auth";
import { appConfig } from "@/config";
import {
  apiAuthPrefix,
  protectedAuthRoutes,
  protectedRoutes,
  publicAuthRoutes,
} from "@/config/routes";

export default auth((req) => {
  const { nextUrl, url } = req;
  const isLoggedIn = !!req.auth;

  console.log("=== MIDDLEWARE RUNNING ===");
  console.log(`Path: ${nextUrl.pathname}`);
  console.log(`Is logged in: ${isLoggedIn}`);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
  const isPublicAuthRoute = publicAuthRoutes.includes(nextUrl.pathname);
  const isProtectedAuthRoute = protectedAuthRoutes.includes(nextUrl.pathname);

  console.log(`Is API auth route: ${isApiAuthRoute}`);
  console.log(`Is protected route: ${isProtectedRoute}`);
  console.log(`Is public auth route: ${isPublicAuthRoute}`);
  console.log(`Is protected auth route: ${isProtectedAuthRoute}`);

  // // if (isApiAuthRoute) return;
  // if (isApiAuthRoute) {
  //   console.log("Skipping middleware for API auth route");
  //   return;
  // }

  // // For public auth routes like sign-in, sign-up, redirect if logged in
  // if (isPublicAuthRoute) {
  //   if (isLoggedIn)
  //     return Response.redirect(
  //       url.replace(nextUrl.pathname, appConfig.entry.href)
  //     );
  //   return;
  // }
  // // For protected auth routes like sign-out, user must be logged in
  // if (isProtectedAuthRoute) {
  //   if (!isLoggedIn) {
  //     return Response.redirect(url.replace(nextUrl.pathname, appConfig.url));
  //   }
  //   return;
  // }
  // // For non-public routes, redirect to sign-in if not logged in
  // if (!isLoggedIn && !isPublicRoute)
  //   return Response.redirect(
  //     url.replace(nextUrl.pathname, appConfig.auth.signin.href)
  //   );
  // return;

  // Skip middleware for API auth routes - THIS SHOULD COME FIRST
  if (isApiAuthRoute) {
    console.log("Skipping middleware for API auth route");
    return;
  }

  // For public auth routes like sign-in, sign-up, redirect if logged in
  if (isPublicAuthRoute) {
    console.log("Checking public auth route");
    if (isLoggedIn) {
      console.log(`Redirecting to ${appConfig.entry.href}`);
      return Response.redirect(
        url.replace(nextUrl.pathname, appConfig.entry.href)
      );
    }
    console.log("Allowing access to public auth route");
    return;
  }

  // For protected auth routes like sign-out, user must be logged in
  if (isProtectedAuthRoute) {
    console.log("Checking protected auth route");
    if (!isLoggedIn) {
      console.log(`Redirecting to ${appConfig.url}`);
      return Response.redirect(url.replace(nextUrl.pathname, appConfig.url));
    }
    console.log("Allowing access to protected auth route");
    return;
  }

  // For non-public routes, redirect to sign-in if not logged in
  if (!isLoggedIn && isProtectedRoute) {
    console.log(
      `Not logged in for protected route, redirecting to ${appConfig.auth.signin.href}`
    );
    return Response.redirect(
      url.replace(nextUrl.pathname, appConfig.auth.signin.href)
    );
  }

  console.log("Middleware completed - allowing request");
  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

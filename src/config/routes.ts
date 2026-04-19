import { appConfig } from "@/config";

/**
 * Array of routes that are not accessible to the public
 * Authentication required
 * @type {string[]}
 */
export const protectedRoutes = ["/portal", "/admin"];

/**
 * Array of routes that are used for authentication
 * Authenticated users will be redirected
 * @type {string[]}
 */
export const publicAuthRoutes = [
  appConfig.auth.signin.href, // /auth/sign-in
  appConfig.auth.signup.href, // /careers/sign-up
  appConfig.auth.error.href, // /auth/error
  appConfig.auth.reset.href, // /auth/reset-password  (forgot-password form)
  appConfig.auth.newPassword.href, // /auth/new-password    (token → new password form)
  appConfig.auth.verification.href, // /auth/verification    (magic-link check-your-inbox)
];

/**
 * Array of routes that are used for authentication
 * Unauthenticated users will be redirected
 * @type {string[]}
 */
export const protectedAuthRoutes = [appConfig.auth.signout.href];

/**
 * Prefix for API authentication
 * Used for authentication
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

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
  appConfig.auth.signin.href,
  appConfig.auth.signup.href,
  appConfig.auth.error.href,
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

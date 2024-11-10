/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/studio(/.*)?",

  "/search(/.*)?",
  "/category(/.*)?",
  "/tag(/.*)?",
  "/item(/.*)?",
  "/blog(/.*)?",
  "/pricing(/.*)?",

  "/about(/.*)?",
  "/terms(/.*)?",
  "/privacy(/.*)?",
  "/changelog(/.*)?",

  // user clicks verification link from email
  "/auth/new-verification",

  // unsubscribe
  "/unsubscribe(/.*)?",

  // stripe webhook must be public, otherwise can not receive stripe events
  "/api/webhook",

  // og images
  "/api/og",

  // draft mode
  "/api/draft",

  // test pages
  "/shadcn(/.*)?",
  "/loading(/.*)?",
  "/landing(/.*)?",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

import bcrypt from "bcryptjs";

/**
 * verify password
 *
 * move this function out of auth.config.ts to avoid error:
 * ./node_modules/.pnpm/bcryptjs@2.4.3/node_modules/bcryptjs/dist/bcrypt.js
 * A Node.js API is used (process.nextTick at line: 351) which is not supported in the Edge Runtime.
 * Learn more: https://nextjs.org/docs/api-reference/edge-runtime
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

import { handlers } from "@/auth";
import { NextRequest } from "next/server";

/**
 * https://authjs.dev/getting-started/installation?framework=Next.js
 */
export const { GET, POST } = handlers;

/**
 * in case you want to debug the auth process
 */
// const handler = async (request: NextRequest) => {
//     console.log('Handling auth request:', request.url);
//     // console.log('Request cookies:', request.headers.get('cookie'));

//     const result = await handlers.GET(request);

//     // console.log('Auth response:', result);
//     // const setCookieHeader = result.headers?.get('Set-Cookie');
//     // if (setCookieHeader) {
//     //     console.log('Set-Cookie header:', setCookieHeader);
//     // } else {
//     //     console.log('No Set-Cookie header found');
//     // }

//     return result;
// };
// export { handler as GET, handler as POST };

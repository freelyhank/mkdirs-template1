/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    // Configure `pageExtensions` to include markdown and MDX files
    // https://nextjs.org/docs/pages/building-your-application/configuring/mdx
    // pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

    images: {
        // https://vercel.com/docs/image-optimization/managing-image-optimization-costs#minimizing-image-optimization-costs
        // vercel has limits on image optimization, 1000 images per month
        unoptimized: true,
        // https://medium.com/@niniroula/nextjs-upgrade-next-image-and-dangerouslyallowsvg-c934060d79f8
        // The requested resource "https://cdn.sanity.io/images/58a2mkbj/preview/xxx.svg?fit=max&auto=format" has type "image/svg+xml" 
        // but dangerouslyAllowSVG is disabled
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "randomuser.me",
            },
            {
                protocol: "https",
                hostname: "cdn.sanity.io", // https://www.sanity.io/learn/course/day-one-with-sanity-studio/bringing-content-to-a-next-js-front-end
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com", // https://www.sanity.io/learn/course/day-one-with-sanity-studio/bringing-content-to-a-next-js-front-end
            },
        ],
    },
};

export default nextConfig;
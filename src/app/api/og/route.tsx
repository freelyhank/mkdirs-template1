import { ogImageSchema } from "@/lib/schemas";
import { ImageResponse } from "next/og";

// export const runtime = "edge";

/**
 * og image route
 *
 * 1. official doc
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 *
 * 2. related articles
 * https://dev.to/paulund/auto-generate-open-graph-images-in-nextjs-41cm
 * https://stronglytyped.uk/articles/open-graph-images-nextjs-app-router
 *
 * 3. test url
 * http://localhost:3000/api/og?title=Lifestyle&description=blog+category+of+lifestyle&type=Blog+Category
 */
export function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parsedValues = ogImageSchema.parse(
      Object.fromEntries(url.searchParams),
    );

    const { mode, title, description, type } = parsedValues;
    const paint = mode === "dark" ? "#fff" : "#000";
    // console.log('og image', { title, description, type });

    return new ImageResponse(
      <div
        tw="w-[1200px] h-[630px] size-full flex flex-col items-center justify-center"
        style={{
          color: paint,
          background:
            mode === "dark"
              ? "linear-gradient(90deg, #000 0%, #111 100%)"
              : "white",
        }}
      >
        <div
          tw="size-full flex flex-col items-center justify-center"
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {type ? (
            <div tw="px-8 text-xl font-medium uppercase leading-tight tracking-tight dark:text-zinc-50">
              {type}
            </div>
          ) : null}
          <div tw="px-8 text-5xl font-bold leading-tight tracking-tight dark:text-zinc-50">
            {title}
          </div>
          {description ? (
            <div tw="mt-5 px-20 text-center text-3xl font-normal leading-tight tracking-tight text-zinc-400">
              {description}
            </div>
          ) : null}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    error instanceof Error
      ? console.log(`${error.message}`)
      : console.log(error);
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}

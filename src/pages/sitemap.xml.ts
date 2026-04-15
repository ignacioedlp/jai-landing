import { getCollection } from "astro:content";

function sitemapXml(urls: Array<{ loc: string; lastmod?: string }>): string {
  const body = urls
    .map(
      (url) =>
        `<url><loc>${url.loc}</loc>${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}</url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

export async function GET(context: { site: URL | undefined }) {
  const site = context.site ?? new URL("https://jai.studio");
  const staticUrls = [
    "/",
    "/en/",
    "/es/",
    "/en/blog/",
    "/es/blog/",
  ];

  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const postUrls = posts.map((post) => ({
    loc: new URL(`/${post.data.locale}/blog/${post.slug}/`, site).toString(),
    lastmod: (post.data.updatedDate ?? post.data.publishDate).toISOString(),
  }));

  const urls = [
    ...staticUrls.map((path) => ({
      loc: new URL(path, site).toString(),
    })),
    ...postUrls,
  ];

  return new Response(sitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

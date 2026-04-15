import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site: URL | undefined }) {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );

  return rss({
    title: "JAI Studio Blog",
    description:
      "Bilingual product, design, and engineering insights from JAI Studio.",
    site: context.site ?? new URL("https://jai-studio.vercel.app"),
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/${post.data.locale}/blog/${post.slug}/`,
    })),
  });
}

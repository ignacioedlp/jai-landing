import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/config";

export type BlogEntry = CollectionEntry<"blog">;

export async function getPublishedPostsByLocale(locale: Locale): Promise<BlogEntry[]> {
  const posts = await getCollection(
    "blog",
    ({ data }) => !data.draft && data.locale === locale,
  );

  return posts.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );
}

export function getRelatedPosts(
  currentPost: BlogEntry,
  posts: BlogEntry[],
  max = 2,
): BlogEntry[] {
  const ensureTags = (post: BlogEntry): string[] => post.data.tags ?? [];
  const currentTags = new Set(
    ensureTags(currentPost).map((tag) => tag.toLowerCase()),
  );

  return posts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => {
      const score = ensureTags(post).reduce((acc, tag) => {
        return acc + (currentTags.has(tag.toLowerCase()) ? 1 : 0);
      }, 0);
      return { post, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((item) => item.post);
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 220;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

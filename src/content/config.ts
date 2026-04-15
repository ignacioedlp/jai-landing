import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string().min(8),
      description: z.string().min(24),
      locale: z.enum(["en", "es"]),
      category: z.string().optional(),
      publishDate: z.date(),
      updatedDate: z.date().optional(),
      image: image(),
      imageAlt: z.string(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
      author: z.string().optional(),
    }),
});

export const collections = {
  blog,
};

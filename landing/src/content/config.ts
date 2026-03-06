import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const metadataDefinition = () =>
  z
    .object({
      canonical: z.string().url().optional(),
      description: z.string().optional(),

      ignoreTitleTemplate: z.boolean().optional(),

      openGraph: z
        .object({
          images: z
            .array(
              z.object({
                height: z.number().optional(),
                url: z.string(),
                width: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          siteName: z.string().optional(),
          type: z.string().optional(),
          url: z.string().optional(),
        })
        .optional(),

      robots: z
        .object({
          follow: z.boolean().optional(),
          index: z.boolean().optional(),
        })
        .optional(),

      title: z.string().optional(),

      twitter: z
        .object({
          cardType: z.string().optional(),
          handle: z.string().optional(),
          site: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ base: "src/data/post", pattern: ["*.md", "*.mdx"] }),
  schema: z.object({
    author: z.string().optional(),
    category: z.string().optional(),
    draft: z.boolean().optional(),

    excerpt: z.string().optional(),
    image: z.string().optional(),
    metadata: metadataDefinition(),

    publishDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
    title: z.string(),

    updateDate: z.date().optional(),
  }),
});

export const collections = {
  post: postCollection,
};

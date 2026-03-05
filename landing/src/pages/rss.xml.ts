import { getRssString } from "@astrojs/rss";
import { APP_BLOG, METADATA, SITE } from "astrowind:config";

import { fetchPosts } from "~/utils/blog";
import { getPermalink } from "~/utils/permalinks";

export const GET = async () => {
  if (!APP_BLOG.isEnabled) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const posts = await fetchPosts();

  const rss = await getRssString({
    description: METADATA?.description || "",
    items: posts.map(post => ({
      description: post.excerpt,
      link: getPermalink(post.permalink, "post"),
      pubDate: post.publishDate,
      title: post.title,
    })),
    site: import.meta.env.SITE,

    title: `${SITE.name}’s Blog`,

    trailingSlash: SITE.trailingSlash,
  });

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};

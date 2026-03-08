import type { PaginateFunction } from "astro";
import type { CollectionEntry } from "astro:content";

import { getCollection, render } from "astro:content";
import compact from "lodash/compact";
import find from "lodash/find";
import flatMap from "lodash/flatMap";
import intersection from "lodash/intersection";
import keyBy from "lodash/keyBy";
import orderBy from "lodash/orderBy";
import take from "lodash/take";
import { APP_BLOG } from "unimetrics:config";

import type { Post } from "~/types";

import {
  BLOG_BASE,
  CATEGORY_BASE,
  cleanSlug,
  POST_PERMALINK_PATTERN,
  TAG_BASE,
  trimSlash,
} from "./permalinks";

const generatePermalink = async ({
  category,
  id,
  publishDate,
  slug,
}: {
  category: string | undefined;
  id: string;
  publishDate: Date;
  slug: string;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, "0");
  const month = String(publishDate.getMonth() + 1).padStart(2, "0");
  const day = String(publishDate.getDate()).padStart(2, "0");
  const hour = String(publishDate.getHours()).padStart(2, "0");
  const minute = String(publishDate.getMinutes()).padStart(2, "0");
  const second = String(publishDate.getSeconds()).padStart(2, "0");

  const permalink = POST_PERMALINK_PATTERN.replace("%slug%", slug)
    .replace("%id%", id)
    .replace("%category%", category || "")
    .replace("%year%", year)
    .replace("%month%", month)
    .replace("%day%", day)
    .replace("%hour%", hour)
    .replace("%minute%", minute)
    .replace("%second%", second);

  return permalink
    .split("/")
    .map(el => trimSlash(el))
    .filter(el => !!el)
    .join("/");
};

const getNormalizedPost = async (post: CollectionEntry<"post">): Promise<Post> => {
  const { data, id } = post;
  const { Content, remarkPluginFrontmatter } = await render(post);

  const {
    author,
    category: rawCategory,
    draft = false,
    excerpt,
    image,
    metadata = {},
    publishDate: rawPublishDate = new Date(),
    tags: rawTags = [],
    title,
    updateDate: rawUpdateDate,
  } = data;

  const slug = cleanSlug(id);
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  const category = rawCategory
    ? {
        slug: cleanSlug(rawCategory),
        title: rawCategory,
      }
    : undefined;

  const tags = rawTags.map((tag: string) => ({
    slug: cleanSlug(tag),
    title: tag,
  }));

  return {
    author: author,
    category: category,
    Content: Content,

    draft: draft,
    excerpt: excerpt,

    id: id,
    image: image,
    metadata,

    permalink: await generatePermalink({
      category: category?.slug,
      id,
      publishDate,
      slug,
    }),
    publishDate: publishDate,
    readingTime: remarkPluginFrontmatter?.readingTime,

    slug: slug,

    tags: tags,

    title: title,
    // or 'content' in case you consume from API

    updateDate: updateDate,
  };
};

const load = async function (): Promise<Array<Post>> {
  const posts = await getCollection("post");
  const normalizedPosts = posts.map(async post => await getNormalizedPost(post));

  const normalizedResults = await Promise.all(normalizedPosts);
  const results = normalizedResults
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter(post => !post.draft);

  return results;
};

let _posts: Array<Post>;

/** */
export const isBlogEnabled = APP_BLOG.isEnabled;
export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;
export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;

export const blogListRobots = APP_BLOG.list.robots;
export const blogPostRobots = APP_BLOG.post.robots;
export const blogCategoryRobots = APP_BLOG.category.robots;
export const blogTagRobots = APP_BLOG.tag.robots;

export const blogPostsPerPage = APP_BLOG?.postsPerPage;

/** */
export const fetchPosts = async (): Promise<Array<Post>> => {
  if (!_posts) {
    _posts = await load();
  }

  return _posts;
};

/** */
export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(slugs)) return [];

  const posts = await fetchPosts();

  return compact(slugs.map(slug => find(posts, post => slug === post.slug)));
};

/** */
export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchPosts();

  return compact(ids.map(id => find(posts, post => id === post.id)));
};

/** */
export const findLatestPosts = async ({
  count,
}: {
  count?: number;
}): Promise<Array<Post>> => {
  const _count = count || 4;
  const posts = await fetchPosts();

  return take(posts, _count);
};

/** */
export const getStaticPathsBlogList = async ({
  paginate,
}: {
  paginate: PaginateFunction;
}) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];
  return paginate(await fetchPosts(), {
    pageSize: blogPostsPerPage,
    params: { blog: BLOG_BASE || undefined },
  });
};

/** */
export const getStaticPathsBlogPost = async () => {
  if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
  const posts = await fetchPosts();
  return flatMap(posts, post => ({
    params: {
      blog: post.permalink,
    },
    props: { post },
  }));
};

/** */
export const getStaticPathsBlogCategory = async ({
  paginate,
}: {
  paginate: PaginateFunction;
}) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = await fetchPosts();
  const categories = keyBy(compact(posts.map(post => post.category)), "slug");

  return flatMap(Object.keys(categories), categorySlug =>
    paginate(
      posts.filter(post => post.category?.slug && categorySlug === post.category?.slug),
      {
        pageSize: blogPostsPerPage,
        params: { blog: CATEGORY_BASE || undefined, category: categorySlug },
        props: { category: categories[categorySlug] },
      }
    )
  );
};

/** */
export const getStaticPathsBlogTag = async ({
  paginate,
}: {
  paginate: PaginateFunction;
}) => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];

  const posts = await fetchPosts();
  const tags = keyBy(
    flatMap(posts, post => (Array.isArray(post.tags) ? post.tags : [])),
    "slug"
  );

  return flatMap(Object.keys(tags), tagSlug =>
    paginate(
      posts.filter(
        post => Array.isArray(post.tags) && post.tags.find(elem => elem.slug === tagSlug)
      ),
      {
        pageSize: blogPostsPerPage,
        params: { blog: TAG_BASE || undefined, tag: tagSlug },
        props: { tag: tags[tagSlug] },
      }
    )
  );
};

/** */
export async function getRelatedPosts(
  originalPost: Post,
  maxResults: number = 4
): Promise<Post[]> {
  const allPosts = await fetchPosts();
  const originalTagSlugs = originalPost.tags
    ? originalPost.tags.map(tag => tag.slug)
    : [];

  const postsWithScores = allPosts
    .filter(iteratedPost => iteratedPost.slug !== originalPost.slug)
    .map(iteratedPost => {
      let score = 0;
      if (
        iteratedPost.category &&
        originalPost.category &&
        iteratedPost.category.slug === originalPost.category.slug
      ) {
        score += 5;
      }

      const iteratedTagSlugs = iteratedPost.tags
        ? iteratedPost.tags.map(tag => tag.slug)
        : [];
      score += intersection(iteratedTagSlugs, originalTagSlugs).length;

      return { post: iteratedPost, score };
    });

  return take(
    orderBy(postsWithScores, ["score"], ["desc"]).map(item => item.post),
    maxResults
  );
}

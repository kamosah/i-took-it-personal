// src/lib/contentful.ts
import { gql } from 'graphql-request';
import { contentfulGraphQLClient } from './contentful-client';

interface BlogPostResponse {
  blogPostCollection: {
    items: Array<{
      sys: {
        id: string;
        publishedAt: string;
      };
      title: string;
      slug: string;
      publicationDate: string;
      excerpt: string;
      seoTitle?: string;
      seoDescription?: string;
      canonicalUrl?: string;
      featuredImage?: {
        url: string;
        title: string;
        description?: string;
        width: number;
        height: number;
      };
      author?: {
        name: string;
        bio?: string;
        avatar?: {
          url: string;
        };
      };
      tagsCollection?: {
        items: Array<{
          name: string;
          slug: string;
        }>;
      };
      content?: {
        json: any;
        links: {
          assets: {
            block: Array<{
              sys: {
                id: string;
              };
              url: string;
              title: string;
              description?: string;
            }>;
          };
        };
      };
    }>;
  };
}

// Fetch a single blog post by slug
export async function fetchBlogPostBySlug(slug: string, preview = false) {
  const query = gql`
    query BlogPostBySlug($slug: String!) {
      blogPostCollection(where: { slug: $slug }, preview: ${preview}, limit: 1) {
        items {
          sys {
            id
            publishedAt
          }
          title
          slug
          publicationDate
          excerpt
          seoTitle
          seoDescription
          canonicalUrl
          featuredImage {
            url
            title
            description
            width
            height
          }
          author {
            name
            bio
            avatar {
              url
            }
          }
          tagsCollection {
            items {
              name
              slug
            }
          }
          content {
            json
            links {
              assets {
                block {
                  sys {
                    id
                  }
                  url
                  title
                  description
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await contentfulGraphQLClient<BlogPostResponse>(query, { slug }, preview);
    if (!data?.blogPostCollection?.items?.length) {
      return null;
    }

    const post = data.blogPostCollection.items[0];

    return {
      id: post.sys.id,
      title: post.seoTitle || post.title,
      originalTitle: post.title,
      description: post.seoDescription || post.excerpt,
      slug: post.slug,
      publishedDate: post.publicationDate,
      canonicalUrl: post.canonicalUrl,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage
        ? {
            url: post.featuredImage.url,
            width: post.featuredImage.width,
            height: post.featuredImage.height,
            alt:
              post.featuredImage.description ||
              post.featuredImage.title ||
              post.title,
          }
        : null,
      author: post.author ? {
        name: post.author.name,
        bio: post.author.bio,
        avatar: post.author.avatar?.url,
      } : null,
      tags: post.tagsCollection?.items?.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      })) || [],
      content: post.content?.json,
      contentLinks: post.content?.links,
      publicationDate: post.publicationDate,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
}

export const fetchBlogPosts = async ({
  tag,
  page = 1,
  limit = 10,
  preview = false,
}: {
  tag?: string | null;
  page?: number;
  limit?: number;
  preview?: boolean;
} = {}) => {
  const skip = (page - 1) * limit;

  const query = gql`
    query BlogPostCollection {
      blogPostCollection(order: publicationDate_DESC) {
        total
        items {
          sys {
            id
          }
          title
          slug
          publicationDate
          excerpt
          featuredImage {
            url
            title
            description
          }
          author {
            name
          }
          tagsCollection {
            items {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const data = await contentfulGraphQLClient(
    query,
    { limit, skip, tag },
    preview
  );

  const posts = data.blogPostCollection.items.map((post) => ({
    id: post.sys.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage
      ? {
          url: post.featuredImage.url,
          alt:
            post.featuredImage.description ||
            post.featuredImage.title ||
            post.title,
        }
      : null,
    author: {
      name: post.author.name,
    },
    tags: post.tagsCollection.items.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    })),
    publicationDate: post.publicationDate,
  }));

  return {
    posts,
    total: data.blogPostCollection.total,
    totalPages: Math.ceil(data.blogPostCollection.total / limit),
  };
};
import { gql } from 'graphql-request';

export const GET_BLOG_POSTS = gql`
  query GetBlogPosts {
    blogPostCollection {
      items {
        sys {
          id
        }
        title
        slug
        publicationDate
        excerpt
        content {
          json
        }
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

export const GET_BLOG_POST = gql`
  query GetBlogPost($slug: String!) {
    blogPostCollection(where: { slug: $slug }, limit: 1) {
      items {
        sys {
          id
        }
        title
        slug
        publicationDate
        excerpt
        content {
          json
        }
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

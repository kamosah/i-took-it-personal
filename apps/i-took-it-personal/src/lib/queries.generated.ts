import * as Types from '../types/contentful-types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchGraphQL } from './contentful-fetch';
export type GetBlogPostsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetBlogPostsQuery = { __typename?: 'Query', blogPostCollection?: { __typename?: 'BlogPostCollection', items: Array<{ __typename?: 'BlogPost', title?: string | null, slug?: string | null, publicationDate?: any | null, excerpt?: string | null, sys: { __typename?: 'Sys', id: string }, content?: { __typename?: 'BlogPostContent', json: any } | null, featuredImage?: { __typename?: 'Asset', url?: string | null, title?: string | null, description?: string | null } | null, author?: { __typename?: 'Author', name?: string | null } | null, tagsCollection?: { __typename?: 'BlogPostTagsCollection', items: Array<{ __typename?: 'Tag', name?: string | null, slug?: string | null } | null> } | null } | null> } | null };

export type GetBlogPostQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
}>;


export type GetBlogPostQuery = { __typename?: 'Query', blogPostCollection?: { __typename?: 'BlogPostCollection', items: Array<{ __typename?: 'BlogPost', title?: string | null, slug?: string | null, publicationDate?: any | null, excerpt?: string | null, sys: { __typename?: 'Sys', id: string }, content?: { __typename?: 'BlogPostContent', json: any } | null, featuredImage?: { __typename?: 'Asset', url?: string | null, title?: string | null, description?: string | null } | null, author?: { __typename?: 'Author', name?: string | null } | null, tagsCollection?: { __typename?: 'BlogPostTagsCollection', items: Array<{ __typename?: 'Tag', name?: string | null, slug?: string | null } | null> } | null } | null> } | null };



export const GetBlogPostsDocument = `
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

export const useGetBlogPostsQuery = <
      TData = GetBlogPostsQuery,
      TError = unknown
    >(
      variables?: GetBlogPostsQueryVariables,
      options?: Omit<UseQueryOptions<GetBlogPostsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetBlogPostsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetBlogPostsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetBlogPosts'] : ['GetBlogPosts', variables],
    queryFn: fetchGraphQL<GetBlogPostsQuery, GetBlogPostsQueryVariables>(GetBlogPostsDocument, variables),
    ...options
  }
    )};

export const GetBlogPostDocument = `
    query GetBlogPost($slug: String!) {
  blogPostCollection(where: {slug: $slug}, limit: 1) {
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

export const useGetBlogPostQuery = <
      TData = GetBlogPostQuery,
      TError = unknown
    >(
      variables: GetBlogPostQueryVariables,
      options?: Omit<UseQueryOptions<GetBlogPostQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetBlogPostQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetBlogPostQuery, TError, TData>(
      {
    queryKey: ['GetBlogPost', variables],
    queryFn: fetchGraphQL<GetBlogPostQuery, GetBlogPostQueryVariables>(GetBlogPostDocument, variables),
    ...options
  }
    )};

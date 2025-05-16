// src/lib/contentful-client.ts
import { createClient } from 'contentful';
import { request, gql } from 'graphql-request';

// Regular Contentful client
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// Preview client for draft content
export const contentfulPreviewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
  host: 'preview.contentful.com',
});

// Get the client based on preview mode
export function getClient(preview = false) {
  return preview ? contentfulPreviewClient : contentfulClient;
}

// GraphQL client for more efficient queries
export const contentfulGraphQLClient = async (
  query: string,
  variables = {},
  preview = false
) => {
  const url = `https://${
    preview ? 'preview' : 'graphql'
  }.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

  const token = preview
    ? process.env.CONTENTFUL_PREVIEW_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN;

  return request(url, query, variables, {
    Authorization: `Bearer ${token}`,
  });
};

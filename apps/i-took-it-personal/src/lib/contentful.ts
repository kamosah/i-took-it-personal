// src/lib/contentful.ts
import { createClient } from 'contentful';
import { request, gql } from 'graphql-request';

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export const contentfulGraphQLClient = async (
  query: string,
  variables = {}
) => {
  return request(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    query,
    variables,
    {
      Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
    }
  );
};

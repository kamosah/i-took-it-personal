import type { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';
dotenv.config();

const config: CodegenConfig = {
  schema: {
    [`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`]:
      {
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        },
      },
  },
  documents: ['apps/i-took-it-personal/src/**/*.{ts,tsx}'],
  generates: {
    './apps/i-took-it-personal/src/types/contentful-types.ts': {
      plugins: ['typescript'],
    },
    './apps/i-took-it-personal/src': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: 'types/contentful-types.ts',
      },
      plugins: ['typescript-operations', 'typescript-react-query'],
      config: {
        fetcher: './contentful-fetch#fetchGraphQL',
        reactQueryVersion: 5,
      },
    },
  },
};

export default config;

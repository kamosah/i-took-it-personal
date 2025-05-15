import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Heading, Text, Link, Box, Code, List, Image } from '@chakra-ui/react';

export function RichTextRenderer({ content }) {
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.CODE]: (text) => <Code>{text}</Code>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <Text mb={4}>{children}</Text>,
      [BLOCKS.HEADING_1]: (node, children) => (
        <Heading as="h1" size="2xl" mb={4} mt={8} id={createSlug(children)}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <Heading as="h2" size="xl" mb={4} mt={8} id={createSlug(children)}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <Heading as="h3" size="lg" mb={4} mt={6} id={createSlug(children)}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_4]: (node, children) => (
        <Heading as="h4" size="md" mb={4} mt={6} id={createSlug(children)}>
          {children}
        </Heading>
      ),
      [BLOCKS.UL_LIST]: (node, children) => (
        <List.Root mb={4}>{children}</List.Root>
      ),
      [BLOCKS.OL_LIST]: (node, children) => (
        <List.Root as="ol" mb={4}>
          {children}
        </List.Root>
      ),
      [BLOCKS.LIST_ITEM]: (node, children) => <List.Root>{children}</List.Root>,
      [BLOCKS.HR]: () => <Box divideY="6px" />,
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { title, description, file } = node.data.target.fields;
        return (
          <Box my={6}>
            <Image
              src={file.url}
              alt={description || title}
              borderRadius="md"
            />
            {description && (
              <Text fontSize="sm" color="gray.600" mt={2} textAlign="center">
                {description}
              </Text>
            )}
          </Box>
        );
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        // Handle embedded entries as needed
        return <Box>Embedded content</Box>;
      },
      [INLINES.HYPERLINK]: (node, children) => (
        <Link color="purple.500" href={node.data.uri} isExternal>
          {children}
        </Link>
      ),
      [BLOCKS.CODE]: (node) => {
        const { code, language = '' } = node;
        return (
          <Box my={6} borderRadius="md" overflow="hidden">
            <SyntaxHighlighter
              language={language.toLowerCase()}
              style={vscDarkPlus}
              showLineNumbers
              customStyle={{
                margin: 0,
                borderRadius: '0.375rem',
                fontSize: '0.9rem',
              }}
            >
              {code}
            </SyntaxHighlighter>
          </Box>
        );
      },
    },
  };

  return <>{documentToReactComponents(content, options)}</>;
}

// Helper to create slug from heading text
function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

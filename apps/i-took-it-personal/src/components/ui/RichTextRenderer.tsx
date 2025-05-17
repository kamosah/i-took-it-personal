// src/components/RichTextRenderer.tsx
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Link,
  Code,
} from '@chakra-ui/react';
import { Document } from '@contentful/rich-text-types';

interface RichTextRendererProps {
  content: Document;
  contentLinks?: {
    assets: {
      block: Array<{
        sys: { id: string };
        url: string;
        title: string;
        description?: string;
      }>;
    };
  };
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content }) => {
  const renderNode = (node: any) => {
    switch (node.nodeType) {
      case 'paragraph':
        return (
          <Text mb={4} key={node.data?.target?.sys?.id}>
            {node.content?.map((child: any) => renderNode(child))}
          </Text>
        );
      case 'heading-1':
        return (
          <Heading as="h1" size="xl" mb={4} key={node.data?.target?.sys?.id}>
            {node.content?.map((child: any) => renderNode(child))}
          </Heading>
        );
      case 'heading-2':
        return (
          <Heading as="h2" size="lg" mb={3} key={node.data?.target?.sys?.id}>
            {node.content?.map((child: any) => renderNode(child))}
          </Heading>
        );
      case 'heading-3':
        return (
          <Heading as="h3" size="md" mb={2} key={node.data?.target?.sys?.id}>
            {node.content?.map((child: any) => renderNode(child))}
          </Heading>
        );
      case 'unordered-list':
        return (
          <List.Root gap={2} mb={4} key={node.data?.target?.sys?.id}>
            {node.content?.map((child: any) => renderNode(child))}
          </List.Root>
        );
      case 'ordered-list':
        return (
          <List.Root as="ol" gap={2} mb={4} key={node.data?.target?.sys?.id}>
            {node.content?.map((child: any) => renderNode(child))}
          </List.Root>
        );
      case 'list-item':
        return (
          <ListItem key={node.data?.target?.sys?.id}>
            {node.content?.map((child: any) => renderNode(child))}
          </ListItem>
        );
      case 'hyperlink':
        return (
          <Link
            href={node.data?.uri}
            color="blue.500"
            textDecoration="underline"
            key={node.data?.target?.sys?.id}
          >
            {node.content?.map((child: any) => renderNode(child))}
          </Link>
        );
      case 'text':
        return (
          node.marks?.reduce((text: string, mark: any) => {
            switch (mark.type) {
              case 'bold':
                return (
                  <Text as="span" fontWeight="bold" key={mark.type}>
                    {text}
                  </Text>
                );
              case 'italic':
                return (
                  <Text as="span" fontStyle="italic" key={mark.type}>
                    {text}
                  </Text>
                );
              case 'underline':
                return (
                  <Text as="span" textDecoration="underline" key={mark.type}>
                    {text}
                    uu
                  </Text>
                );
              case 'code':
                return <Code key={mark.type}>{text}</Code>;
              default:
                return text;
            }
          }, node.value) || node.value
        );
      default:
        return null;
    }
  };

  return <Box>{content.content?.map((node) => renderNode(node))}</Box>;
};

export default RichTextRenderer;

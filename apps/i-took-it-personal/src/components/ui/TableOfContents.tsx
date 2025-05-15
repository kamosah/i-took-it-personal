// src/components/TableOfContents.tsx
'use client';

import { useEffect, useState } from 'react';
import { Box, Text, Link, List, ListItem } from '@chakra-ui/react';
import { BLOCKS } from '@contentful/rich-text-types';

export function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  // Extract headings from content
  useEffect(() => {
    const extractedHeadings = [];

    if (content && content.content) {
      content.content.forEach((node) => {
        if (
          node.nodeType === BLOCKS.HEADING_2 ||
          node.nodeType === BLOCKS.HEADING_3
        ) {
          const text = node.content[0].value;
          const slug = text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');

          extractedHeadings.push({
            id: slug,
            text,
            level: node.nodeType === BLOCKS.HEADING_2 ? 2 : 3,
          });
        }
      });
    }

    setHeadings(extractedHeadings);
  }, [content]);

  // Set active heading based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean);

      const headingPositions = headingElements.map((el) => ({
        id: el.id,
        top: el.getBoundingClientRect().top,
      }));

      const activeHeading = headingPositions
        .filter(({ top }) => top < 200)
        .slice(-1)[0];

      setActiveId(activeHeading?.id || '');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <Box
      p={5}
      bg="gray.50"
      borderRadius="md"
      borderWidth="1px"
      position="sticky"
      top="100px"
    >
      <Text fontWeight="bold" mb={4}>
        Table of Contents
      </Text>
      <List spacing={2}>
        {headings.map((heading) => (
          <ListItem
            key={heading.id}
            pl={heading.level === 3 ? 4 : 0}
            fontSize={heading.level === 3 ? 'sm' : 'md'}
          >
            <Link
              href={`#${heading.id}`}
              color={activeId === heading.id ? 'purple.500' : 'gray.700'}
              fontWeight={activeId === heading.id ? 'bold' : 'normal'}
              _hover={{ color: 'purple.500' }}
            >
              {heading.text}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

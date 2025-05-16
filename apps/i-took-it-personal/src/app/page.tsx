import { Metadata } from 'next';
import { Box, Heading, Text } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to my personal blog and portfolio',
};

export default function Index() {
  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <Box textAlign="center" py={10}>
        <Heading as="h1" size="2xl" mb={4}>
          Welcome to My Blog
        </Heading>
        <Text fontSize="xl" color="gray.600">
          Exploring technology, development, and personal growth
        </Text>
      </Box>
    </Box>
  );
}

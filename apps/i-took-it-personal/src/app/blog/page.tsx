import { Metadata } from 'next';
import Link from 'next/link';
import { fetchBlogPosts } from '@/lib/contentful';
import { Box, Heading, SimpleGrid, Flex, Tag, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { formatDate } from '@/lib/date';

// Generate static params for all possible combinations
export async function generateStaticParams() {
  const { total } = await fetchBlogPosts({ limit: 1 });
  const totalPages = Math.ceil(total / 10);

  // Generate all possible page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Generate all possible combinations of page and tag
  const params = pages.flatMap((page) => [
    { searchParams: { page: page.toString() } },
    { searchParams: { page: page.toString(), tag: 'technology' } },
    { searchParams: { page: page.toString(), tag: 'development' } },
    { searchParams: { page: page.toString(), tag: 'react' } },
    { searchParams: { page: page.toString(), tag: 'nextjs' } },
    { searchParams: { page: page.toString(), tag: 'typescript' } },
    { searchParams: { page: page.toString(), tag: 'javascript' } },
    { searchParams: { page: page.toString(), tag: 'nodejs' } },
    { searchParams: { page: page.toString(), tag: 'express' } },

    // Add more tags as needed
  ]);

  return params;
}

// This function will be called at build time for each static path
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { tag?: string; page?: string };
}): Promise<Metadata> {
  const params = await searchParams;
  const tag = params.tag;
  const page = Number(params.page) || 1;

  return {
    title: tag
      ? `${tag.charAt(0).toUpperCase() + tag.slice(1)} Posts | Page ${page}`
      : `Blog | Page ${page}`,
    description: tag
      ? `Explore our latest articles about ${tag} on page ${page}.`
      : `Explore our latest articles on page ${page}.`,
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { tag?: string; page?: string };
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const tag = params.tag || null;

  const { posts, totalPages } = await fetchBlogPosts({
    page,
    limit: 10,
    tag,
  });

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      <Heading as="h1" mb={8} fontSize="3xl">
        {tag ? `${tag.charAt(0).toUpperCase() + tag.slice(1)} Posts` : 'Blog'}
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} rowGap={8} columnGap={8}>
        {posts.map(
          (post: {
            slug: string;
            title: string;
            publicationDate: string;
            author: { name: string };
            excerpt: string;
            featuredImage?: { url: string; alt: string };
            tags: Array<{ name: string }>;
          }) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} passHref>
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-4px)' }}
              >
                {post.featuredImage && (
                  <Box position="relative" height="200px">
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt}
                      fill
                      sizes="(max-width: 768px) 100%, (max-width: 1200px) 100%, 100%"
                      priority
                      quality={90}
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                )}
                <Box p={5}>
                  <Heading
                    size="md"
                    mb={2}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {post.title}
                  </Heading>
                  <Text color="gray.600" fontSize="sm" mb={3}>
                    {formatDate(post.publicationDate)} • {post.author.name}
                  </Text>
                  <Text
                    mt={2}
                    mb={4}
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </Text>
                  <Flex gap={2}>
                    {post.tags.map((tag: { name: string }) => (
                      <Tag.Root key={tag.name} size="sm" colorScheme="purple">
                        <Tag.Label>{tag.name}</Tag.Label>
                      </Tag.Root>
                    ))}
                  </Flex>
                </Box>
              </Box>
            </Link>
          )
        )}
      </SimpleGrid>

      {/* Pagination */}
      <Flex justify="center" mt={8} gap={4}>
        {page > 1 && (
          <Link
            href={`/blog?page=${page - 1}${tag ? `&tag=${tag}` : ''}`}
            rel="prev"
          >
            Previous
          </Link>
        )}

        {page < totalPages && (
          <Link
            href={`/blog?page=${page + 1}${tag ? `&tag=${tag}` : ''}`}
            rel="next"
          >
            Next
          </Link>
        )}
      </Flex>
    </Box>
  );
}

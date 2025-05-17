// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/contentful';
import RichTextRenderer from '@/components/ui/RichTextRenderer';
import { Heading, Text } from '@chakra-ui/react/typography';
import { Box } from '@chakra-ui/react/box';
import { formatDate } from '@/lib/date';
// import BlogJsonLd from '@/components/BlogJsonLd';

export async function generateStaticParams() {
  // Fetch all blog posts for static generation
  const { posts } = await fetchBlogPosts({ limit: 100 });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await fetchBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    // Other metadata...
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const routeParams = await params;
  const post = await fetchBlogPostBySlug(routeParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <Box maxW="800px" mx="auto" p={4}>
      <Heading as="h1" mb={4}>
        {post.title}
      </Heading>

      <Text color="gray.600" mb={6}>
        {formatDate(post.publicationDate)} · {post.author?.name}
      </Text>

      {post.featuredImage && (
        <Box mb={6}>
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title || ''}
            width={800}
            height={400}
            style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
          />
        </Box>
      )}

      {post.content && (
        <Box className="blog-content">
          <RichTextRenderer
            content={post.content}
            contentLinks={post.contentLinks}
          />
        </Box>
      )}
    </Box>
  );
}

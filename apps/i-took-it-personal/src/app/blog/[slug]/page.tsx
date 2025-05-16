// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/contentful';
import RichTextRenderer from '@/components/ui/RichTextRenderer';
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
  const post = await fetchBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="blog-post">
      {/* <BlogJsonLd post={post} /> */}

      <h1>{post.originalTitle}</h1>

      {post.featuredImage && (
        <Image
          src={post.featuredImage.url}
          alt={post.featuredImage.alt}
          width={800}
          height={400}
          priority
          className="featured-image"
        />
      )}

      <div className="meta">
        <div className="author">By {post.author.name}</div>
        <time dateTime={post.publishedDate}>
          {new Date(post.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>

      <div className="tags">
        {post.tags.map((tag) => (
          <a href={`/blog/tag/${tag.slug}`} key={tag.slug} className="tag">
            {tag.name}
          </a>
        ))}
      </div>

      <div className="content">
        <RichTextRenderer
          content={post.content}
          contentLinks={post.contentLinks}
        />
      </div>
    </article>
  );
}

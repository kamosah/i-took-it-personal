interface BlogJsonLdProps {
  post: {
    id: string;
    title: string;
    description: string;
    slug: string;
    publishedDate: string;
    excerpt: string;
    featuredImage: {
      url: string;
      width: number;
      height: number;
      alt: string;
    } | null;
    author: { name: string; bio?: string; avatar?: string } | null;
  };
}

export default function BlogJsonLd({ post }: BlogJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.featuredImage?.url,
    datePublished: post.publishedDate,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
        }
      : undefined,
    url: `https://yourdomain.com/blog/${post.slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

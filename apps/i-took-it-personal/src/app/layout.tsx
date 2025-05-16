import { Providers } from '@/components/ui/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | I Took it Personal',
    default: 'I Took it Personal - Kwame Amosah', // TODO: Replace name with tagline here
  },
  description: 'My personal blog about my journey as a developer.',
  keywords: ['blog', 'nextjs', 'contentful', 'your keywords'],
  authors: [{ name: 'Kwame Amosah' }],
  creator: 'Kwame Amosah',
  publisher: 'Kwame Amosah',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourblog.com',
    siteName: 'I Took it Personal',
    // images: [
    //   {
    //     url: 'https://yourblog.com/images/og-image.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'I Took it Personal',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@kwame_amosah',
    site: '@kwame_amosah',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  // verification: {
  //   google: 'your-google-verification-code',
  // },
  // TODO: Add google verification code here
  alternates: {
    canonical: 'https://kwamedev.netlify.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers defaultTheme="system" enableSystem>
          {children}
        </Providers>
      </body>
    </html>
  );
}

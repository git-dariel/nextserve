import { Inter } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js TypeScript Template',
  description: 'A production-ready Next.js template with TypeScript, MongoDB, and Prisma',
  keywords: ['Next.js', 'TypeScript', 'MongoDB', 'Prisma', 'Tailwind CSS', 'Template'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Next.js TypeScript Template',
    description: 'A production-ready Next.js template with TypeScript, MongoDB, and Prisma',
    siteName: 'Next.js Template',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js TypeScript Template',
    description: 'A production-ready Next.js template with TypeScript, MongoDB, and Prisma',
    creator: '@yourusername',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen bg-background font-sans antialiased')}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

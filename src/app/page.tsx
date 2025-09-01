'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Code, Database, Shield, Zap, Users, Globe } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Code,
      title: 'TypeScript',
      description:
        'Fully typed with TypeScript for better development experience and fewer bugs.',
    },
    {
      icon: Database,
      title: 'MongoDB & Prisma',
      description:
        'Modern database setup with Prisma ORM and MongoDB for scalable data management.',
    },
    {
      icon: Shield,
      title: 'Authentication',
      description:
        'JWT-based authentication with role-based access control built-in.',
    },
    {
      icon: Zap,
      title: 'Performance',
      description:
        'Optimized for speed with Next.js 14, modern build tools, and best practices.',
    },
    {
      icon: Users,
      title: 'User Management',
      description:
        'Complete user management system with profiles, roles, and permissions.',
    },
    {
      icon: Globe,
      title: 'Production Ready',
      description:
        'Deployment-ready with Docker support, error handling, and monitoring.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Next.js TypeScript
            <span className="text-primary"> Template</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            A production-ready Next.js 14 template with TypeScript, MongoDB,
            Prisma, and modern development tools. Start building your next
            project today.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/posts">View Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Everything you need to build modern web apps
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            This template includes all the essential features and tools you need
            to build scalable, maintainable web applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Built with modern technologies
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
            This template leverages the latest and greatest tools in the web
            development ecosystem.
          </p>

          <div className="grid grid-cols-2 items-center justify-items-center gap-8 md:grid-cols-4">
            {[
              { name: 'Next.js 14', logo: '▲' },
              { name: 'TypeScript', logo: 'TS' },
              { name: 'MongoDB', logo: '🍃' },
              { name: 'Prisma', logo: '◊' },
              { name: 'Tailwind CSS', logo: '🎨' },
              { name: 'Zod', logo: 'Z' },
              { name: 'Jest', logo: '🃏' },
              { name: 'ESLint', logo: '⚡' },
            ].map((tech, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-background text-2xl font-bold">
                  {tech.logo}
                </div>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Ready to start building?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Get started with this template and have your next project up and
            running in minutes.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

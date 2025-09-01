'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/hooks/use-api';
import { Post, User } from '@/types/database';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { Search, Plus, User as UserIcon } from 'lucide-react';

interface PostWithAuthor extends Post {
  author: Pick<User, 'id' | 'name' | 'avatar'>;
  _count: {
    comments: number;
  };
}

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [publishedOnly, setPublishedOnly] = useState(true);

  const {
    data: posts,
    loading,
    error,
    refetch,
  } = useApi<PostWithAuthor[]>(
    `/api/posts?published=${publishedOnly}${searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : ''}`
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Posts</h1>
            <p className="text-muted-foreground">
              Discover articles and insights from our community
            </p>
          </div>
          <Button asChild>
            <Link href="/posts/create">
              <div className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </div>
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        <div className="mt-4 flex gap-2">
          <Button
            variant={publishedOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setPublishedOnly(true);
              refetch();
            }}
          >
            Published
          </Button>
          <Button
            variant={!publishedOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setPublishedOnly(false);
              refetch();
            }}
          >
            All Posts
          </Button>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-3/4 rounded bg-muted"></div>
                <div className="h-3 w-1/2 rounded bg-muted"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 rounded bg-muted"></div>
                  <div className="h-3 w-4/5 rounded bg-muted"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-muted-foreground">Failed to load posts</p>
              <Button onClick={refetch} variant="outline" className="mt-2">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : !posts || posts.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg font-medium">No posts found</p>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Be the first to create a post!'}
              </p>
              {!searchQuery && (
                <Button asChild className="mt-4">
                  <Link href="/posts/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Post
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <Card key={post.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="leading-tight">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title.length > 60
                          ? `${post.title.slice(0, 60)}...`
                          : post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="h-3 w-3" />
                        <span>{post.author.name}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(post.createdAt)}</span>
                      </div>
                    </CardDescription>
                  </div>
                  {!post.published && <Badge variant="outline">Draft</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  {post.content.slice(0, 150)}...
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{post._count.comments} comments</span>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

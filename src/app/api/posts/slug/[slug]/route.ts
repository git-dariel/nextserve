import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/services';
import { successResponse, errorResponse } from '@/lib/api';
import { ERROR_MESSAGES, HTTP_STATUS } from '@/lib/constants';

// GET /api/posts/slug/[slug] - Get post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  
  const url = new URL(request.url);
  const includeAuthor = url.searchParams.get('includeAuthor') === 'true';
  const includeComments = url.searchParams.get('includeComments') === 'true';

  const post = await PostService.getBySlug(slug, {
    includeAuthor,
    includeComments,
  });

  if (!post) {
    return NextResponse.json(
      errorResponse(ERROR_MESSAGES.POST_NOT_FOUND),
      { status: HTTP_STATUS.NOT_FOUND }
    );
  }

  return NextResponse.json(successResponse(post));
}

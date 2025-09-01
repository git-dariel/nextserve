# API Documentation

This document provides detailed information about the API endpoints available in the Next.js TypeScript template.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "meta": { ... } // For paginated responses
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

## Endpoints

### Health Check

#### GET /api/health
Check the health status of the API and database connection.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2023-12-25T12:00:00.000Z",
    "database": "connected",
    "version": "1.0.0",
    "environment": "development"
  }
}
```

---

## Authentication Endpoints

### POST /api/auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "USER",
      "avatar": "https://example.com/avatar.jpg"
    },
    "token": "jwt_token_here",
    "expiresIn": "7d"
  },
  "message": "Login successful"
}
```

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "age": 25
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "USER",
      "isActive": true
    },
    "token": "jwt_token_here",
    "expiresIn": "7d"
  },
  "message": "User created successfully"
}
```

### GET /api/auth/me
Get the current authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER",
    "avatar": "https://example.com/avatar.jpg",
    "isActive": true
  }
}
```

---

## User Management

### GET /api/users
List all users with pagination and filtering.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `query`: Search in name and email
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort direction (asc/desc, default: desc)
- `isActive`: Filter by active status (true/false)
- `role`: Filter by role (USER/MODERATOR/ADMIN)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2023-12-25T12:00:00.000Z",
      "_count": {
        "posts": 5,
        "comments": 12
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### POST /api/users
Create a new user.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "USER",
  "age": 28
}
```

### GET /api/users/[id]
Get a specific user by ID.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `includePosts`: Include user's posts (true/false)
- `includeComments`: Include user's comments (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER",
    "isActive": true,
    "posts": [], // If includePosts=true
    "comments": [] // If includeComments=true
  }
}
```

### PATCH /api/users/[id]
Update a user's information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "age": 26,
  "avatar": "https://example.com/new-avatar.jpg"
}
```

### DELETE /api/users/[id]
Delete a user account.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Query Parameters:**
- `hard`: Permanent deletion (true/false, default: false)

---

## Post Management

### GET /api/posts
List posts with pagination and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `query`: Search in title and content
- `published`: Filter by published status (true/false)
- `authorId`: Filter by author ID
- `tags`: Comma-separated list of tags

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "post_id",
      "title": "Post Title",
      "content": "Post content...",
      "slug": "post-title",
      "published": true,
      "publishedAt": "2023-12-25T12:00:00.000Z",
      "tags": ["nextjs", "typescript"],
      "author": {
        "id": "author_id",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "_count": {
        "comments": 5
      }
    }
  ],
  "meta": { ... }
}
```

### POST /api/posts
Create a new post.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "My New Post",
  "content": "This is the content of my post...",
  "slug": "my-new-post",
  "published": true,
  "tags": ["nextjs", "typescript"]
}
```

### GET /api/posts/[id]
Get a specific post by ID.

**Query Parameters:**
- `includeAuthor`: Include author information (true/false)
- `includeComments`: Include post comments (true/false)

### GET /api/posts/slug/[slug]
Get a specific post by slug.

**Query Parameters:**
- `includeAuthor`: Include author information (true/false)
- `includeComments`: Include post comments (true/false)

### PATCH /api/posts/[id]
Update a post.

**Headers:** `Authorization: Bearer <token>` (Author or Admin)

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "published": true,
  "tags": ["updated", "tags"]
}
```

### DELETE /api/posts/[id]
Delete a post.

**Headers:** `Authorization: Bearer <token>` (Author or Admin)

---

## Comment Management

### GET /api/comments
List comments with pagination and filtering.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `postId`: Filter by post ID
- `authorId`: Filter by author ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "comment_id",
      "content": "This is a comment",
      "createdAt": "2023-12-25T12:00:00.000Z",
      "author": {
        "id": "author_id",
        "name": "Jane Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "post": {
        "id": "post_id",
        "title": "Post Title",
        "slug": "post-title"
      }
    }
  ],
  "meta": { ... }
}
```

### POST /api/comments
Create a new comment.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "This is my comment",
  "postId": "post_id"
}
```

### GET /api/comments/[id]
Get a specific comment by ID.

### PATCH /api/comments/[id]
Update a comment.

**Headers:** `Authorization: Bearer <token>` (Author, Moderator, or Admin)

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

### DELETE /api/comments/[id]
Delete a comment.

**Headers:** `Authorization: Bearer <token>` (Author, Moderator, or Admin)

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per 15 minutes per IP
- General endpoints: 100 requests per minute per IP
- Authenticated endpoints: 1000 requests per hour per user

## Pagination

Paginated endpoints return metadata about the current page:

```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Validation

Request bodies are validated using Zod schemas. Validation errors return detailed field-level error messages:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

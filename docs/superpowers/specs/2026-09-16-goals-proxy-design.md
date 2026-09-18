# Goals API proxy

## Objective

Allow the dashboard to save and remove monthly goals when accessed through the Next.js app.

## Design

The Next.js rewrite configuration will proxy both `/goals` and `/goals/:path*` to the configured server URL, matching the existing `/entries` and `/categories` routes. No frontend request, API route, schema, or database change is needed.

## Data flow

The browser sends `PATCH /goals`. Next.js forwards it to the Hono server's `/goals` route, which validates the payload and upserts the authenticated user's monthly goals.

## Error handling and verification

The existing API validation and client error state remain unchanged. Verify the rewrite configuration with the project's type check and manually save a monthly goal through the running application.

import { defineMiddleware } from 'astro:middleware';

// Check if client accepts gzip encoding
function acceptsGzip(request: Request): boolean {
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  return acceptEncoding.includes('gzip');
}

// Compress response body with gzip
async function compressResponse(response: Response, headers: Headers): Promise<Response> {
  // Only compress if body exists and CompressionStream is available
  if (!response.body || typeof CompressionStream === 'undefined') {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  try {
    const compressedStream = response.body.pipeThrough(new CompressionStream('gzip'));
    headers.set('Content-Encoding', 'gzip');
    headers.delete('Content-Length'); // Length changes after compression

    return new Response(compressedStream, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch {
    // Fallback to uncompressed if compression fails
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Force WWW to non-WWW redirect (SEO best practice)
  if (url.hostname.startsWith('www.')) {
    const nonWwwUrl = `https://${url.hostname.replace('www.', '')}${url.pathname}${url.search}`;
    return Response.redirect(nonWwwUrl, 301);
  }

  // Force redirect from Railway URL to custom domain
  if (url.hostname.includes('railway.app')) {
    const redirectUrl = `https://placement.quest${url.pathname}${url.search}`;
    return Response.redirect(redirectUrl, 301);
  }

  // Check if client supports gzip
  const clientAcceptsGzip = acceptsGzip(context.request);

  // Continue to the next middleware/page
  const response = await next();

  // Only modify headers for HTML responses, preserve Content-Type for API routes
  const originalContentType = response.headers.get('Content-Type');
  const isHtmlResponse = !originalContentType ||
    originalContentType.includes('text/html') ||
    (!originalContentType.includes('application/') && !originalContentType.includes('text/plain') && !originalContentType.includes('text/xml'));

  if (isHtmlResponse) {
    const headers = new Headers(response.headers);
    headers.set('Content-Type', 'text/html; charset=UTF-8');
    headers.set('Vary', 'Accept-Encoding'); // Important for caching

    // Security Headers (Best Practices - improves Lighthouse score)
    // HSTS - enforce HTTPS for 1 year, include subdomains
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // X-Frame-Options - prevent clickjacking
    headers.set('X-Frame-Options', 'SAMEORIGIN');

    // X-Content-Type-Options - prevent MIME sniffing
    headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer-Policy - control referrer information
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions-Policy - restrict browser features
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Cross-Origin-Opener-Policy - isolate browsing context
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');

    // Cross-Origin-Resource-Policy
    headers.set('Cross-Origin-Resource-Policy', 'same-origin');

    // Content-Security-Policy - XSS protection
    // Note: 'unsafe-inline' required for Astro's hydration scripts and inline styles
    // Note: 'unsafe-eval' required for GSAP animations
    // Future improvement: Implement nonces for stricter CSP
    headers.set('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://*.mux.com https://unpkg.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: https: blob:; " +
      "media-src 'self' https://*.mux.com https://stream.mux.com blob:; " +
      "font-src 'self' data: https://fonts.gstatic.com; " +
      "connect-src 'self' https://*.mux.com https://*.neon.tech wss://*.neon.tech; " +
      "frame-ancestors 'self'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "worker-src 'self' blob:; " +
      "object-src 'none';"
    );

    // Apply gzip compression if client supports it (improves Seobility/Lighthouse scores)
    if (clientAcceptsGzip) {
      return compressResponse(response, headers);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  // Return response as-is for non-HTML content (XML, JSON, plain text, etc.)
  return response;
});

// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
// Cookie consent is now a simple inline component

// https://astro.build/config
export default defineConfig({
  site: 'https://placement.quest',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  compressHTML: true,

  // Redirects for old URL patterns (SEO)
  redirects: {
    // Redirect old /articles/* URLs to root /* (301 permanent for SEO)
    '/articles/[...slug]': {
      status: 301,
      destination: '/[...slug]',
    },
    // Redirect old /articles to new SEO-friendly news URL
    '/articles': {
      status: 301,
      destination: '/private-equity-placement-agent-news',
    },
    // Also handle /news as alias
    '/news': {
      status: 301,
      destination: '/private-equity-placement-agent-news',
    },
  },
  build: {
    inlineStylesheets: 'always', // Inline all CSS to avoid render-blocking
  },
  vite: {
    build: {
      cssCodeSplit: true, // Split CSS per page
      rollupOptions: {
        output: {
          manualChunks: undefined, // Prevent unnecessary chunking
        }
      }
    }
  },
  integrations: [
    tailwind({
      // Disable base styles injection - we only want utility classes for company pages
      applyBaseStyles: false,
    }),
  ],
  server: {
    host: true // Listen on all network interfaces (0.0.0.0)
  }
});

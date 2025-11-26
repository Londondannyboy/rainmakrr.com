// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import cookieconsent from '@jop-software/astro-cookieconsent';

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
    inlineStylesheets: 'auto', // Inline critical CSS
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
    tailwind(),
    cookieconsent({
      guiOptions: {
        consentModal: {
          layout: 'bar inline',
          position: 'bottom',
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
          equalWeightButtons: false,
          flipButtons: false
        }
      },
      categories: {
        necessary: {
          readOnly: true,
          enabled: true
        }
      },
      language: {
        default: 'en',
        autoDetect: 'browser',
        translations: {
          en: {
            consentModal: {
              title: '',
              description: 'We use essential cookies only.',
              acceptAllBtn: 'Accept',
              acceptNecessaryBtn: 'Decline'
            },
            preferencesModal: {
              title: 'Cookie Preferences',
              acceptAllBtn: 'Accept',
              acceptNecessaryBtn: 'Decline',
              savePreferencesBtn: 'Save',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Essential Cookies',
                  description: 'These cookies are required for the website to function properly.',
                  linkedCategory: 'necessary'
                }
              ]
            }
          }
        }
      }
    })
  ],
  server: {
    host: true // Listen on all network interfaces (0.0.0.0)
  }
});

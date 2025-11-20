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
          layout: 'cloud inline',
          position: 'bottom center',
          equalWeightButtons: false,
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
        },
        analytics: {
          enabled: false
        }
      },
      language: {
        default: 'en',
        autoDetect: 'browser',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies',
              description: 'This website uses essential cookies to ensure proper functionality and analytics cookies to understand how you interact with it. You can accept all cookies or customize your preferences.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences'
            },
            preferencesModal: {
              title: 'Cookie Preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Cookie Usage',
                  description: 'We use cookies to enhance your browsing experience and analyze our traffic. You can choose which cookies to accept.'
                },
                {
                  title: 'Strictly Necessary Cookies',
                  description: 'These cookies are essential for the website to function properly. They cannot be disabled.',
                  linkedCategory: 'necessary'
                },
                {
                  title: 'Analytics Cookies',
                  description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
                  linkedCategory: 'analytics'
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

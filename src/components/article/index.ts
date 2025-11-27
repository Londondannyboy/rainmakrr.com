/**
 * Placement Quest Article Components
 * Finance-themed components for article rendering
 *
 * Usage:
 *   import { HeroVideo, ChapterNav, FAQ } from '../components/article';
 *
 * Components:
 *   - HeroVideo: Full-width video hero with title overlay
 *   - EpisodicBar: Colored 4-act progress bar
 *   - ChapterNav: Chapter navigation with titles
 *   - TickerTape: 4-act video thumbnail grid
 *   - ActSection: Individual act/section with video header
 *   - Timeline: Vertical timeline of events
 *   - FAQ: Grid of FAQ cards
 *   - Callout: Pro tip or warning callout box
 *   - Comparison: Side-by-side comparison cards
 *   - StatHighlight: Key stats section
 *   - Sources: References grid
 *   - InvestmentDisclaimer: Required disclaimer for investment content
 *   - ArticleFooter: Author attribution and navigation
 */

// Note: In Astro, components are imported directly from .astro files
// This index is for documentation purposes

export const componentList = [
  'HeroVideo',
  'EpisodicBar',
  'ChapterNav',
  'TickerTape',
  'ActSection',
  'Timeline',
  'FAQ',
  'Callout',
  'Comparison',
  'StatHighlight',
  'Sources',
  'InvestmentDisclaimer',
  'ArticleFooter',
] as const;

export type ArticleComponent = typeof componentList[number];

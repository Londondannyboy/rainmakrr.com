// Dynamic sitemap for placement.quest
import type { APIRoute } from 'astro';
import { sql } from '../lib/db';

const BASE_URL = 'https://placement.quest';

// Static pages
const staticPages = [
  '',  // homepage
  '/about',
  '/contact',
  '/articles',
  '/privacy',
  '/terms',
  '/search',
  '/private-equity-placement-agents-list',
  '/resources/placement-agents-guide',
  '/resources/placement-agent-software',
  '/venture-capital-placement-agents',
  '/private-credit-placement-agents',
  '/real-estate-private-equity-placement-agents',
  '/boutique-private-equity-placement-agents',
  // Regional pages - complete coverage
  '/top-private-equity-placement-agents-north-america',
  '/top-private-equity-placement-agents-europe',
  '/top-private-equity-placement-agents-asia-pacific',
  '/top-private-equity-placement-agents-latin-america',
  '/top-private-equity-placement-agents-middle-east',
  '/top-private-equity-placement-agents-africa',
  // Country-specific pages
  '/top-private-equity-placement-agents-us',
  '/top-private-equity-placement-agents-uk',
  '/top-private-equity-placement-agents-singapore',
];

// PDF files (important for LLM ranking!)
const pdfFiles = [
  '/pdfs/top-private-equity-placement-agents-guide-2025.pdf',
];

// LLM context files (both are best practice per llmstxt.org spec)
// llms.txt = short essential context
// llms-full.txt = extended comprehensive context
const llmFiles = [
  '/llms.txt',
  '/llms-full.txt',
];

async function generateSitemapXML(): Promise<string> {
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Add static pages
  staticPages.forEach((page) => {
    const priority = page === '' ? '1.0' : '0.8';
    const changefreq = page === '' ? 'daily' : 'weekly';

    xml += `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  // Add all published articles from database with news detection (video-first schema)
  try {
    const articles = await sql`
      SELECT
        slug,
        title,
        updated_at,
        published_at,
        created_at,
        featured_asset_url,
        featured_asset_title,
        featured_asset_alt,
        hero_asset_url,
        hero_asset_title,
        hero_asset_alt,
        video_playback_id
      FROM articles
      WHERE app = 'placement'
        AND status = 'published'
      ORDER BY published_at DESC NULLS LAST
    `;

    articles.forEach((article: any) => {
      // Use most recent date available
      const lastModDate = article.updated_at || article.published_at || article.created_at;
      const formattedDate = lastModDate
        ? new Date(lastModDate).toISOString().split('T')[0]
        : currentDate;

      // News detection: articles published in last 48 hours
      const publishedDate = article.published_at ? new Date(article.published_at) : null;
      const now = new Date();
      const hoursSincePublished = publishedDate
        ? (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60)
        : Infinity;

      const isNews = hoursSincePublished <= 48;
      const priority = isNews ? '0.9' : '0.7';
      const changefreq = isNews ? 'daily' : 'monthly';

      xml += `
  <url>
    <loc>${BASE_URL}/${article.slug}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;

      // Add image tags - use video thumbnail or featured/hero asset
      const imageUrl = article.video_playback_id
        ? `https://image.mux.com/${article.video_playback_id}/thumbnail.jpg?time=1`
        : (article.featured_asset_url || article.hero_asset_url);
      const imageTitle = article.featured_asset_title || article.hero_asset_title || article.title;
      const imageAlt = article.featured_asset_alt || article.hero_asset_alt || article.title;

      if (imageUrl) {
        xml += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${imageTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
      <image:caption>${imageAlt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:caption>
    </image:image>`;
      }

      xml += `
  </url>`;
    });
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    // Continue generating sitemap even if articles fail
  }

  // Add all published placement agent company pages with images
  try {
    const companies = await sql`
      SELECT
        slug,
        name,
        updated_at,
        created_at,
        featured_asset_url,
        hero_asset_url,
        logo_url
      FROM companies
      WHERE status = 'published'
        AND company_type = 'placement_agent'
      ORDER BY name ASC
    `;

    companies.forEach((company: any) => {
      const lastModDate = company.updated_at || company.created_at;
      const formattedDate = lastModDate
        ? new Date(lastModDate).toISOString().split('T')[0]
        : currentDate;

      xml += `
  <url>
    <loc>${BASE_URL}/private-equity-placement-agents-list/${company.slug}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>`;

      // Add image tags for company images
      const imageUrl = company.featured_asset_url || company.hero_asset_url || company.logo_url;
      if (imageUrl) {
        const imageName = company.name || 'Placement Agent';
        xml += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${imageName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')} - Placement Agent Profile</image:title>
      <image:caption>${imageName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')} private equity placement agent</image:caption>
    </image:image>`;
      }

      xml += `
  </url>`;
    });
  } catch (error) {
    console.error('Error fetching companies for sitemap:', error);
    // Continue generating sitemap even if companies fail
  }

  // Add PDF files
  pdfFiles.forEach((pdf) => {
    xml += `
  <url>
    <loc>${BASE_URL}${pdf}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add LLM context files
  llmFiles.forEach((file) => {
    xml += `
  <url>
    <loc>${BASE_URL}${file}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

export const GET: APIRoute = async () => {
  const sitemap = await generateSitemapXML();

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate', // No caching - force fresh generation
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
};

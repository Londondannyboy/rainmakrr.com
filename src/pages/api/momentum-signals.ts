/**
 * Momentum Signals API
 *
 * Extracts market signals from news articles using NLP pattern matching.
 * Signals include: hiring, spinouts, fund launches, deals, partnerships, etc.
 */
import type { APIRoute } from 'astro';
import { sql } from '../../lib/db';

// Signal patterns for NLP extraction
const SIGNAL_PATTERNS = {
  hiring: [
    /(?:hired?|hires?|appointe?d?|recruite?d?|joins?|joined|bringing on|welcomes?)\s+(?:as\s+)?(?:new\s+)?(?:senior|managing|executive|partner|director|head|chief|vp|president|ceo|cfo|coo|cio)/i,
    /(?:senior|managing|executive|partner|director|head)\s+(?:from|formerly\s+(?:of|at|with))/i,
    /(?:expands?\s+team|builds?\s+out|strengthens?\s+(?:team|leadership))/i,
    /(?:new\s+(?:hire|hires|appointment|appointments))/i
  ],
  spinout: [
    /(?:launches?|launched|launching|spins?\s+out|spin-out|spinout|breaks?\s+away|leaves?\s+to\s+(?:form|start|launch))/i,
    /(?:former\s+(?:partner|director|head|md))\s+(?:launches?|starts?|forms?)/i,
    /(?:new\s+(?:firm|shop|boutique))\s+(?:launched|formed|started)/i
  ],
  fund_launch: [
    /(?:launches?|launched|launching|raising|raises?|debut|debuts?)\s+(?:new\s+)?(?:fund|vehicle|strategy|offering)/i,
    /(?:fund\s+(?:I|II|III|IV|V|VI|VII|VIII|IX|X|\d+))/i,
    /(?:first\s+(?:close|closing)|initial\s+close)/i,
    /(?:opens?\s+for\s+(?:investment|subscriptions))/i
  ],
  fund_close: [
    /(?:closes?|closed|closing|final\s+close|hard\s+cap)/i,
    /(?:above\s+target|exceeded\s+target|oversubscribed)/i,
    /(?:raised\s+\$?\d+(?:\.\d+)?\s*(?:billion|million|bn|mm|m|b))/i
  ],
  deal: [
    /(?:acquires?|acquired|acquisition|acquir)/i,
    /(?:invests?\s+in|invested|investment\s+in|backing|backs?)/i,
    /(?:exits?|exited|exit\s+from|sells?|sold|divestiture)/i,
    /(?:merger|merges?\s+with)/i,
    /(?:buyout|buy-out|lbo|mbo)/i
  ],
  expansion: [
    /(?:opens?\s+(?:new\s+)?(?:office|offices|branch|presence))/i,
    /(?:expands?\s+(?:to|into|in)|expansion\s+(?:to|into|in))/i,
    /(?:enters?\s+(?:new\s+)?(?:market|region|geography))/i
  ],
  personnel_change: [
    /(?:departs?|departed|departure|leaves?|left|stepping\s+down|retires?|retired)/i,
    /(?:promotes?|promoted|promotion|elevates?|elevated)/i,
    /(?:transition|succession|new\s+leadership)/i
  ],
  partnership: [
    /(?:partners?\s+with|partnership|teams?\s+up|collaborates?|collaboration|alliance)/i,
    /(?:joint\s+venture|jv)/i,
    /(?:strategic\s+(?:partnership|alliance|relationship))/i
  ],
  award: [
    /(?:wins?|won|awarded|receives?|received|named|recognized)/i,
    /(?:best|top|leading|premier)\s+(?:in\s+class|performer|placement\s+agent)/i
  ]
};

// Signal strength indicators
const STRENGTH_INDICATORS = {
  high: ['major', 'significant', 'landmark', 'record', 'billion', 'largest', 'unprecedented', 'exclusive'],
  medium: ['notable', 'key', 'important', 'million'],
  low: ['small', 'minor', 'modest']
};

// Extract signals from article text
function extractSignals(article: any): any[] {
  const signals: any[] = [];
  const text = `${article.title || ''} ${article.excerpt || ''} ${article.content || ''}`;

  for (const [signalType, patterns] of Object.entries(SIGNAL_PATTERNS)) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        // Extract context around the match
        const matchIndex = text.indexOf(match[0]);
        const start = Math.max(0, matchIndex - 100);
        const end = Math.min(text.length, matchIndex + match[0].length + 100);
        const excerpt = text.substring(start, end);

        // Determine signal strength
        let strength = 'medium';
        const lowerText = text.toLowerCase();
        if (STRENGTH_INDICATORS.high.some(w => lowerText.includes(w))) {
          strength = 'high';
        } else if (STRENGTH_INDICATORS.low.some(w => lowerText.includes(w))) {
          strength = 'low';
        }

        // Calculate confidence based on pattern specificity
        const confidence = pattern.source.length > 50 ? 0.9 : pattern.source.length > 30 ? 0.75 : 0.6;

        signals.push({
          article_id: article.id,
          signal_type: signalType,
          signal_strength: strength,
          headline: article.title,
          detail: article.excerpt,
          source_excerpt: excerpt.trim(),
          confidence,
          detected_at: new Date().toISOString()
        });

        // Only capture first match per signal type per article
        break;
      }
    }
  }

  return signals;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const signalType = url.searchParams.get('type');
    const days = parseInt(url.searchParams.get('days') || '30');

    // Fetch existing signals
    let signals;
    if (signalType) {
      signals = await sql`
        SELECT ms.*, a.title as article_title, a.slug as article_slug,
          c.name as company_name, c.slug as company_slug
        FROM momentum_signals ms
        LEFT JOIN articles a ON ms.article_id = a.id
        LEFT JOIN companies c ON ms.company_id = c.id
        WHERE ms.signal_type = ${signalType}
          AND ms.detected_at > NOW() - INTERVAL '${days} days'
        ORDER BY ms.detected_at DESC
        LIMIT ${limit}
      `;
    } else {
      signals = await sql`
        SELECT ms.*, a.title as article_title, a.slug as article_slug,
          c.name as company_name, c.slug as company_slug
        FROM momentum_signals ms
        LEFT JOIN articles a ON ms.article_id = a.id
        LEFT JOIN companies c ON ms.company_id = c.id
        WHERE ms.detected_at > NOW() - INTERVAL '30 days'
        ORDER BY ms.detected_at DESC
        LIMIT ${limit}
      `;
    }

    // Get signal type counts
    const counts = await sql`
      SELECT signal_type, COUNT(*) as count
      FROM momentum_signals
      WHERE detected_at > NOW() - INTERVAL '30 days'
      GROUP BY signal_type
      ORDER BY count DESC
    `;

    return new Response(JSON.stringify({
      signals,
      counts: counts.reduce((acc: any, row: any) => {
        acc[row.signal_type] = parseInt(row.count);
        return acc;
      }, {}),
      total: signals.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Momentum signals error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch signals' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { scan = false, articleId } = body;

    if (scan) {
      // Scan recent articles for signals
      const articles = await sql`
        SELECT id, title, excerpt, content, published_at
        FROM articles
        WHERE app = 'rainmakrr'
          AND status = 'published'
          AND id NOT IN (SELECT DISTINCT article_id FROM momentum_signals WHERE article_id IS NOT NULL)
        ORDER BY COALESCE(published_at, created_at) DESC
        LIMIT 50
      `;

      let insertedCount = 0;

      for (const article of articles) {
        const signals = extractSignals(article);

        for (const signal of signals) {
          await sql`
            INSERT INTO momentum_signals (
              article_id, signal_type, signal_strength, headline,
              detail, source_excerpt, confidence, detected_at
            ) VALUES (
              ${signal.article_id}, ${signal.signal_type}, ${signal.signal_strength},
              ${signal.headline}, ${signal.detail}, ${signal.source_excerpt},
              ${signal.confidence}, NOW()
            )
          `;
          insertedCount++;
        }
      }

      return new Response(JSON.stringify({
        success: true,
        scanned: articles.length,
        inserted: insertedCount
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Signal scan error:', error);
    return new Response(JSON.stringify({ error: 'Failed to scan for signals' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    // 1. Fetch active monitoring accounts from database[cite: 1]
    const { data: accounts, error: accError } = await supabase
      .from('political_accounts')
      .select('*')
      .eq('active', true);

    if (accError) throw accError;

    const twitterBearer = process.env.TWITTER_BEARER_TOKEN;
    const collectedPosts = [];

    // 2. Fetch from Official X API if token exists; failsafe otherwise[cite: 1]
    for (const acc of accounts) {
      if (!twitterBearer) {
        continue;
      }

      const response = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?query=from:${acc.x_handle}&tweet.fields=created_at,public_metrics`,
        {
          headers: { Authorization: `Bearer ${twitterBearer}` }
        }
      );

      if (response.ok) {
        const twitterData = await response.json();
        if (twitterData.data) {
          for (const tweet of twitterData.data) {
            collectedPosts.push({
              post_id: tweet.id,
              account_handle: acc.x_handle,
              author: acc.display_name,
              text: tweet.text,
              timestamp: tweet.created_at,
              post_url: `https://x.com/${acc.x_handle}/status/${tweet.id}`,
              engagement: tweet.public_metrics || {},
              classification: 'POLICY',
              claim_type: 'announcement',
              claim_status: 'UNVERIFIED', // Never auto-mark without human approval[cite: 1]
              editorial_status: 'HUMAN_REVIEW_REQUIRED' // Enforce human-in-the-loop approval[cite: 1]
            });
          }
        }
      }
    }

    // 3. Upsert deduplicated posts into database[cite: 1]
    if (collectedPosts.length > 0) {
      const { error: insertError } = await supabase
        .from('social_posts')
        .upsert(collectedPosts, { onConflict: 'post_id' });

      if (insertError) throw insertError;
    }

    return res.status(200).json({
      success: true,
      importedCount: collectedPosts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ingestion Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

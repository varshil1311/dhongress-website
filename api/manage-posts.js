import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { adminSecret, action, postId, updateData } = req.body;

  // Protect Admin Actions
  if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin PIN/Secret' });
  }

  try {
    if (action === 'APPROVE_PUBLISH') {
      const { data, error } = await supabase
        .from('social_posts')
        .update({
          editorial_status: 'PUBLISHED',
          claim_status: updateData.claim_status || 'VERIFIED',
          evidence_sources: updateData.evidence_sources || '',
          reviewed_by: 'Chief Editor',
          reviewed_at: new Date().toISOString()
        })
        .eq('post_id', postId);

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    if (action === 'REJECT') {
      const { data, error } = await supabase
        .from('social_posts')
        .update({ editorial_status: 'REJECTED' })
        .eq('post_id', postId);

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

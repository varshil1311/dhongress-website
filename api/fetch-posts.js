import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return res.status(200).json({ message: "Supabase credentials not configured yet." });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: accounts, error: accError } = await supabase
      .from('political_accounts')
      .select('*')
      .eq('active', true);

    if (accError) throw accError;

    return res.status(200).json({
      success: true,
      activeAccounts: accounts ? accounts.length : 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

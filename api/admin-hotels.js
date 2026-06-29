module.exports = async function(req, res) {
  const authHeader = req.headers.authorization;
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  
  if (!envHash || authHeader !== `Bearer ${envHash}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xykethxpdcwqdzlpnojm.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return res.status(500).json({ error: 'Server misconfiguration: Service Role Key missing' });
  }

  const headers = {
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    if (req.method === 'POST') {
      const resp = await fetch(`${supabaseUrl}/rest/v1/hotels`, {
        method: 'POST',
        headers,
        body: JSON.stringify(req.body)
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || JSON.stringify(data));
      return res.status(200).json(data);
    } 
    else if (req.method === 'PATCH' || req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      const resp = await fetch(`${supabaseUrl}/rest/v1/hotels?id=eq.${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData)
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || JSON.stringify(data));
      return res.status(200).json(data);
    }
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      const resp = await fetch(`${supabaseUrl}/rest/v1/hotels?id=eq.${id}`, {
        method: 'DELETE',
        headers
      });
      if (!resp.ok) {
         const data = await resp.json();
         throw new Error(data.message || JSON.stringify(data));
      }
      return res.status(200).json({ success: true });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

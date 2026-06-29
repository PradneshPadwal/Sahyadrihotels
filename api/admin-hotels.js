function isValidId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(id);
}

function cleanHotelPayload(payload = {}) {
  const allowed = [
    'slug',
    'name',
    'brand',
    'description',
    'location',
    'distance_from_temple',
    'price_per_night',
    'rating',
    'manual_rank',
    'maps_link',
    'amenities',
    'images',
    'is_active'
  ];
  return Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.includes(key)));
}

module.exports = async function(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const authHeader = req.headers.authorization;
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  
  if (!envHash || authHeader !== `Bearer ${envHash}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Server misconfiguration: Supabase credentials missing' });
  }

  const headers = {
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    if (req.method === 'POST') {
      const payload = cleanHotelPayload(req.body);
      if (!payload.name || !payload.slug) return res.status(400).json({ error: 'Name and slug are required' });
      const resp = await fetch(`${supabaseUrl}/rest/v1/hotels`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || JSON.stringify(data));
      return res.status(200).json(data);
    } 
    else if (req.method === 'PATCH' || req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      if (!isValidId(id)) return res.status(400).json({ error: 'Invalid hotel id' });
      const payload = cleanHotelPayload(updateData);
      const resp = await fetch(`${supabaseUrl}/rest/v1/hotels?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || JSON.stringify(data));
      return res.status(200).json(data);
    }
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!isValidId(id)) return res.status(400).json({ error: 'Invalid hotel id' });
      const resp = await fetch(`${supabaseUrl}/rest/v1/hotels?id=eq.${encodeURIComponent(id)}`, {
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
      res.setHeader('Allow', 'POST, PUT, PATCH, DELETE');
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

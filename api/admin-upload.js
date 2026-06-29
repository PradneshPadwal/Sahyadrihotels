module.exports = async function(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const authHeader = req.headers.authorization;
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (!envHash || authHeader !== `Bearer ${envHash}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xykethxpdcwqdzlpnojm.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const fileName = req.query.name;

  if (!serviceKey || !fileName) {
    return res.status(500).json({ error: 'Missing parameters or configuration' });
  }

  try {
    // Collect the binary stream
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const contentType = req.headers['content-type'] || 'application/octet-stream';
    
    // Upload to Supabase Storage
    const uploadUrl = `${supabaseUrl}/storage/v1/object/hotel-images/${fileName}`;
    const resp = await fetch(uploadUrl, {
      method: 'POST', // Use POST for upload
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': contentType
      },
      body: buffer
    });

    const data = await resp.json();
    if (!resp.ok) {
      // If it exists, try PUT to overwrite
      if (data.statusCode === '409' || data.error === 'Duplicate') {
        const resp2 = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
            'Content-Type': contentType
          },
          body: buffer
        });
        const data2 = await resp2.json();
        if (!resp2.ok) throw new Error(data2.message || JSON.stringify(data2));
      } else {
        throw new Error(data.message || JSON.stringify(data));
      }
    }
    
    // Return the public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/hotel-images/${fileName}`;
    res.status(200).json({ url: publicUrl });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

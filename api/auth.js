module.exports = function(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { hash } = req.body || {};
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  
  if (!envHash) {
    return res.status(500).json({ error: 'Server misconfiguration: ADMIN_PASSWORD_HASH not set in Vercel' });
  }
  
  if (hash === envHash) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
};

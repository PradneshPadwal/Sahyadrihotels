const crypto = require('crypto');

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

module.exports = function(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { hash } = req.body || {};
  const envHash = process.env.ADMIN_PASSWORD_HASH;

  if (!envHash) {
    return res.status(500).json({ error: 'Server misconfiguration: ADMIN_PASSWORD_HASH not set in Vercel' });
  }

  if (safeEqual(hash, envHash)) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'Invalid password' });
};

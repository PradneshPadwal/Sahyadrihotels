module.exports = function(req, res) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xykethxpdcwqdzlpnojm.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5a2V0aHhwZGN3cWR6bHBub2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1OTQ3MTAsImV4cCI6MjA5ODE3MDcxMH0.ExUCIIGlL7NCl7Ei2I2nY4mt9Mk37e0CI90CT82pBv4';
  
  const scriptContent = `
    window.SUPABASE_URL = "${supabaseUrl}";
    window.SUPABASE_ANON_KEY = "${supabaseAnonKey}";
  `;
  
  res.setHeader('Content-Type', 'application/javascript');
  res.status(200).send(scriptContent);
};

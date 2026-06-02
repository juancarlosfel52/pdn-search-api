/* ================================================================
   PASO DEL NORTE — Shared Config
   ================================================================ */
const PDN_CONFIG = {
  API_KEY:  window.__PDN_API_KEY__ || '',
  MODEL:    'claude-haiku-4-5-20251001',
  PHONE:    '(832) 555-0180',
  BIZ:      'Paso Del Norte: Truck & Equipment Sales',
  LOCATION: 'Houston, TX'
};

/* Shared Claude caller — used by all pages */
async function pdnClaude(system, user, maxTokens = 700) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': PDN_CONFIG.API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: PDN_CONFIG.MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }]
    })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API ${resp.status}`);
  }
  const data = await resp.json();
  return data.content[0].text;
}

import http from 'node:http';

const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

function send(res, status, body) {
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  let data = '';
  for await (const chunk of req) {
    data += chunk;
    if (data.length > 100_000) throw new Error('Request too large');
  }
  return JSON.parse(data || '{}');
}

async function askOpenAI(message) {
  if (!API_KEY) {
    return 'AI service is not configured yet. Please set OPENAI_API_KEY on the server.';
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + API_KEY,
    },
    body: JSON.stringify({
      model: MODEL,
      instructions:
        'You are DEEN AI, an educational Islamic learning assistant. Give careful, respectful answers. Do not invent Quran or Hadith quotations. When a question requires a religious ruling, clearly encourage verification with reliable sources or a qualified scholar. If you are uncertain, say so.',
      input: message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'OpenAI request failed');
  }

  return data.output_text || 'No answer was returned.';
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    return res.end();
  }

  if (req.method === 'GET' && req.url === '/health') {
    return send(res, 200, { ok: true, service: 'deen-ai' });
  }

  if (req.method === 'POST' && req.url === '/chat') {
    try {
      const body = await readBody(req);
      const message = typeof body.message === 'string' ? body.message.trim() : '';

      if (!message) return send(res, 400, { error: 'message is required' });
      if (message.length > 4000) {
        return send(res, 400, { error: 'message is too long' });
      }

      const reply = await askOpenAI(message);
      return send(res, 200, { reply });
    } catch (error) {
      return send(res, 500, {
        error: 'AI service error',
        detail: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return send(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log('DEEN AI server listening on port ' + PORT);
});

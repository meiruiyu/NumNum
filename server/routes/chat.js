// server/routes/chat.js
// Proxy endpoint for the chatbot. Talks to Groq's OpenAI-compatible LLM API.
//
//   url:    https://api.groq.com/openai/v1/chat/completions
//   key:    process.env.GROQ_API_KEY  (free at https://console.groq.com/keys)
//   model:  process.env.GROQ_MODEL    (default: "llama-3.3-70b-versatile")
//
// Frontend posts:
//   { system: string, messages: [{ role, content }] }
// We respond:
//   { reply: string, provider: "groq", model: string }

import { Router } from 'express';
import { HttpError } from '../utils/http.js';

const router = Router();

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const GROQ_TIMEOUT_MS = 12000;
const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postToGroq(payload, apiKey) {
  return fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
  });
}

async function fetchGroqWithRetry(payload, apiKey) {
  let attempt = 0;
  let lastError;
  while (attempt < 2) {
    attempt += 1;
    try {
      const response = await postToGroq(payload, apiKey);
      if (!RETRYABLE_STATUSES.has(response.status) || attempt === 2) {
        return response;
      }
      await sleep(200 * attempt);
    } catch (err) {
      lastError = err;
      if (attempt === 2) throw err;
      await sleep(200 * attempt);
    }
  }
  throw lastError ?? new Error('Groq request failed');
}

router.post('/', async (req, res, next) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || !apiKey.trim() || apiKey.includes('paste-your')) {
      throw new HttpError(
        500,
        'GROQ_API_KEY is not set. Get a free one at https://console.groq.com/keys, add it to .env, then restart the server with `npm run server`.',
      );
    }

    const { system, messages } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new HttpError(400, 'Field "messages" must be a non-empty array.');
    }

    const wireMessages = [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
        content: String(m.content ?? ''),
      })),
    ];

    const model = process.env.GROQ_MODEL ?? DEFAULT_MODEL;
    const requestPayload = {
      model,
      messages: wireMessages,
      temperature: 0.7,
      max_tokens: 400,
    };

    let upstream;
    try {
      upstream = await fetchGroqWithRetry(requestPayload, apiKey);
    } catch (err) {
      if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
        throw new HttpError(504, 'Groq request timed out. Please try again.');
      }
      throw new HttpError(502, 'Unable to reach Groq provider at the moment.');
    }

    const text = await upstream.text();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      throw new HttpError(502, 'Groq returned a non-JSON response.', text.slice(0, 500));
    }

    if (!upstream.ok) {
      const apiMsg = payload?.error?.message ?? `HTTP ${upstream.status}`;
      let friendly = `Groq: ${apiMsg}`;
      if (upstream.status === 401) {
        friendly = 'Groq: Invalid API key. Double-check the value in your .env file.';
      } else if (upstream.status === 429) {
        friendly = 'Groq: Rate limit hit. Wait a minute and try again.';
      }
      throw new HttpError(upstream.status, friendly, { provider: 'groq', detail: payload });
    }

    const reply =
      payload?.choices?.[0]?.message?.content?.trim?.() ??
      'Sorry, I had trouble generating a reply.';

    res.json({ reply, provider: 'groq', model });
  } catch (err) {
    next(err);
  }
});

export default router;

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { api, ApiError } from '../api/client';
import { getUser } from '../lib/auth';
import { getTheme } from '../lib/theme';

/* =========================================================================
 *  ChatBot
 *  Global floating chat button + sliding panel that talks to our backend's
 *  /api/chat endpoint, which proxies to Groq's chat completions API.
 *  Mounted once inside <Layout>, so it appears on every authenticated page.
 * ========================================================================= */

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT =
  'You are NumNum, a friendly NYC restaurant discovery assistant for the Asian community. ' +
  'You help users find restaurants, suggest dishes, explain cuisines, and recommend spots ' +
  'for occasions like date night, group dining, or quick lunches. Keep answers under 4 ' +
  'sentences unless the user asks for more detail. If unsure, suggest using the search or map.';

const INITIAL_GREETING: ChatMessage = {
  id: 'greet',
  role: 'assistant',
  content: 'Hi! I\'m NumNum AI 🍜 Ask me anything — best ramen near you, hot pot for 6, late-night bites, you name it.',
};

interface ChatResponse {
  reply: string;
  raw?: any;
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = getUser();
  const theme = getTheme(user?.school ?? 'guest');

  // Autoscroll to the latest message whenever the thread grows.
  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, sending]);

  // Focus the input when opening.
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setDraft('');
    setSending(true);
    setError(null);

    try {
      const res = await api.post<ChatResponse>('/api/chat', {
        system: SYSTEM_PROMPT,
        // Strip the local-only greeting from the wire payload.
        messages: next
          .filter((m) => m.id !== 'greet')
          .map(({ role, content }) => ({ role, content })),
      });
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: res.reply ?? '...' },
      ]);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? `${err.status} ${err.message}`
          : (err as Error)?.message ?? 'Network error';
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content:
            'Sorry — I couldn\'t reach the AI service. Make sure the backend is running and GROQ_API_KEY is set in .env.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // Suggested quick prompts to seed the conversation.
  const quickPrompts = [
    'Best ramen near Columbia',
    'Hot pot spots for 6 people',
    'Cheap eats in Flushing',
    'Where to take a date in K-town',
  ];

  return (
    <>
      {/* Floating launcher — always visible, bottom-right above the bottom nav */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 sm:right-6 z-40 size-12 sm:size-14 rounded-full text-white flex items-center justify-center shadow-lg shadow-black/20 hover:scale-105 transition-transform"
        style={{ backgroundColor: theme.primary }}
        aria-label="Open NumNum AI chat"
      >
        <MessageCircle className="size-5 sm:size-6" />
        <span className="absolute -top-1 -right-1 size-4 rounded-full bg-white flex items-center justify-center">
          <Sparkles className="size-2.5" style={{ color: theme.primary }} />
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center sm:justify-end"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:w-[420px] sm:mr-6 bg-white rounded-t-[20px] sm:rounded-2xl shadow-xl max-h-[85vh] sm:max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 text-white"
              style={{ backgroundColor: theme.primary }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold truncate">NumNum AI</div>
                  <div className="text-[10px] sm:text-[11px] opacity-80 truncate">
                    NYC restaurant assistant
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="size-8 rounded-full flex items-center justify-center hover:bg-white/15 flex-shrink-0"
                aria-label="Close chat"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Message thread */}
            <div
              ref={scrollerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDF6EE]"
            >
              {messages.map((m) => (
                <ChatBubble key={m.id} message={m} themeColor={theme.primary} />
              ))}
              {sending && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-2xl w-fit border border-[#F0EBE3]">
                  <span className="size-1.5 bg-[#8A8078] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="size-1.5 bg-[#8A8078] rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                  <span className="size-1.5 bg-[#8A8078] rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
                </div>
              )}
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && !sending && (
              <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide bg-[#FDF6EE]">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => setDraft(p)}
                    className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-white border border-[#F0EBE3] text-[#2C1A0E] hover:border-[var(--brand-primary,#E8603C)] transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <div className="p-3 border-t border-[#F0EBE3] flex items-end gap-2 bg-white">
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask NumNum anything…"
                className="flex-1 min-w-0 h-11 px-3 rounded-full border border-[#E0D8D0] outline-none text-sm text-[#2C1A0E] placeholder:text-[#B4B2A9] focus:border-[var(--brand-primary,#E8603C)]"
                disabled={sending}
              />
              <button
                onClick={send}
                disabled={!draft.trim() || sending}
                className="size-11 rounded-full text-white flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-40"
                style={{ backgroundColor: theme.primary }}
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </div>

            {error && (
              <div className="px-3 pb-2 text-[11px] text-[#993C1D]">{error}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ChatBubble({
  message,
  themeColor,
}: {
  message: ChatMessage;
  themeColor: string;
}) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[80%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
          isUser ? 'text-white' : 'text-[#2C1A0E] bg-white border border-[#F0EBE3]'
        }`}
        style={isUser ? { backgroundColor: themeColor } : undefined}
      >
        {message.content}
      </div>
    </div>
  );
}

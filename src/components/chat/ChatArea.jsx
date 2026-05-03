import { useEffect, useRef } from 'react'
import { Sparkles, MessageSquare } from 'lucide-react'
import { useChatStore } from '../../store/chatStore'
import MessageBubble, { TypingIndicator } from './MessageBubble'
import ChatInput from './ChatInput'
import Spinner from '../ui/Spinner'

/* ─── Global CSS ─────────────────────────────────────────────────────────
   All theme tokens live here as CSS variables.
   :root  = light mode defaults
   .dark  = dark mode overrides  (Tailwind class strategy)
   Works with ANY toggle that adds/removes the "dark" class on <html>.
────────────────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Light tokens ── */
  :root {
    --cr-bg-base:          #F4F2EF;
    --cr-bloom-red:        rgba(193,18,31,0.07);
    --cr-bloom-blue:       rgba(30,111,217,0.07);
    --cr-bloom-mid:        rgba(8,29,74,0.00);

    --cr-header-bg:        rgba(255,255,255,0.74);
    --cr-input-bg:         rgba(255,255,255,0.84);
    --cr-glass-edge:       rgba(0,0,0,0.08);
    --cr-shine-hi:         rgba(0,0,0,0.06);
    --cr-shine-lo:         rgba(0,0,0,0.06);

    --cr-top-line-red:     rgba(193,18,31,0.45);
    --cr-top-line-blue:    rgba(30,111,217,0.45);

    --cr-header-shadow:    0 1px 0 rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.07);
    --cr-input-shadow:     0 -1px 0 rgba(0,0,0,0.06), 0 -8px 28px rgba(193,18,31,0.04);

    --cr-text-hi:          #12111A;
    --cr-text-mid:         rgba(30,25,50,0.65);
    --cr-text-lo:          rgba(30,25,50,0.38);

    --cr-heading-from:     #12111A;
    --cr-heading-via:      #C1121F;
    --cr-heading-to:       #1E6FD9;

    --cr-icon-bg-red:      rgba(193,18,31,0.10);
    --cr-icon-bg-blue:     rgba(30,111,217,0.10);
    --cr-icon-border:      rgba(0,0,0,0.09);
    --cr-icon-glow-red:    rgba(193,18,31,0.10);
    --cr-icon-glow-blue:   rgba(30,111,217,0.07);

    --cr-card-bg:          rgba(255,255,255,0.72);
    --cr-card-border:      rgba(0,0,0,0.09);
    --cr-card-hover-b:     rgba(193,18,31,0.4);
    --cr-card-hover-c:     #12111A;

    --cr-dot-shadow:       0 0 7px rgba(193,18,31,0.55);

    --cr-skel-from:        rgba(0,0,0,0.05);
    --cr-skel-mid1:        rgba(193,18,31,0.07);
    --cr-skel-mid2:        rgba(30,111,217,0.07);
  }

  /* ── Dark tokens ── */
  .dark {
    --cr-bg-base:          #07091A;
    --cr-bloom-red:        rgba(193,18,31,0.18);
    --cr-bloom-blue:       rgba(30,111,217,0.18);
    --cr-bloom-mid:        rgba(8,29,74,0.22);

    --cr-header-bg:        rgba(7,9,26,0.62);
    --cr-input-bg:         rgba(7,9,26,0.78);
    --cr-glass-edge:       rgba(255,255,255,0.08);
    --cr-shine-hi:         rgba(255,255,255,0.04);
    --cr-shine-lo:         rgba(255,255,255,0.04);

    --cr-top-line-red:     rgba(193,18,31,0.70);
    --cr-top-line-blue:    rgba(30,111,217,0.70);

    --cr-header-shadow:    0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.5);
    --cr-input-shadow:     0 -1px 0 rgba(255,255,255,0.04), 0 -8px 32px rgba(193,18,31,0.07);

    --cr-text-hi:          #F0EEF8;
    --cr-text-mid:         rgba(220,215,240,0.65);
    --cr-text-lo:          rgba(200,195,225,0.35);

    --cr-heading-from:     #F0EEF8;
    --cr-heading-via:      #C1121F;
    --cr-heading-to:       #1E6FD9;

    --cr-icon-bg-red:      rgba(193,18,31,0.28);
    --cr-icon-bg-blue:     rgba(30,111,217,0.28);
    --cr-icon-border:      rgba(255,255,255,0.13);
    --cr-icon-glow-red:    rgba(193,18,31,0.22);
    --cr-icon-glow-blue:   rgba(30,111,217,0.13);

    --cr-card-bg:          rgba(255,255,255,0.03);
    --cr-card-border:      rgba(255,255,255,0.08);
    --cr-card-hover-b:     rgba(193,18,31,0.5);
    --cr-card-hover-c:     #F0EEF8;

    --cr-dot-shadow:       0 0 8px rgba(193,18,31,0.9);

    --cr-skel-from:        rgba(255,255,255,0.04);
    --cr-skel-mid1:        rgba(193,18,31,0.10);
    --cr-skel-mid2:        rgba(30,111,217,0.10);
  }

  /* ── Component styles ── */
  .chat-root {
    font-family: 'DM Sans', sans-serif;
    background:
      radial-gradient(ellipse 60% 50% at 10%   0%, var(--cr-bloom-red)  0%, transparent 65%),
      radial-gradient(ellipse 55% 45% at 90% 100%, var(--cr-bloom-blue) 0%, transparent 65%),
      radial-gradient(ellipse 40% 40% at 50%  50%, var(--cr-bloom-mid)  0%, transparent 80%),
      var(--cr-bg-base);
    transition: background 350ms ease;
  }

  .chat-top-line {
    background: linear-gradient(
      90deg,
      transparent,
      var(--cr-top-line-red)  30%,
      var(--cr-top-line-blue) 70%,
      transparent
    );
    transition: background 350ms ease;
  }

  .chat-header {
    background: var(--cr-header-bg);
    border-bottom: 1px solid var(--cr-glass-edge);
    box-shadow: var(--cr-header-shadow);
    transition: background 300ms ease;
  }

  .chat-header-label {
    background: linear-gradient(90deg, var(--cr-text-hi), var(--cr-text-mid));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .chat-input-bar {
    background: var(--cr-input-bg);
    border-top: 1px solid var(--cr-glass-edge);
    box-shadow: var(--cr-input-shadow);
    transition: background 300ms ease;
  }

  /* Scrollbar */
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #C1121F, #1E6FD9);
    border-radius: 99px;
  }

  /* Empty state */
  .chat-heading {
    background: linear-gradient(110deg,
      var(--cr-heading-from) 10%,
      var(--cr-heading-via)  55%,
      var(--cr-heading-to)   100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .chat-subtext { color: var(--cr-text-lo); }

  .chat-icon-box {
    background: linear-gradient(135deg, var(--cr-icon-bg-red) 0%, var(--cr-icon-bg-blue) 100%);
    border: 1px solid var(--cr-icon-border);
    box-shadow:
      0 0 28px var(--cr-icon-glow-red),
      0 0 56px var(--cr-icon-glow-blue);
  }

  /* Suggestion cards */
  .suggestion-card {
    position: relative; overflow: hidden; text-align: left;
    padding: 12px 16px; border-radius: 14px;
    border: 1px solid var(--cr-card-border);
    background: var(--cr-card-bg);
    color: var(--cr-text-mid);
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: border-color 200ms, color 200ms, transform 150ms, box-shadow 200ms;
    backdrop-filter: blur(12px);
  }
  .suggestion-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(193,18,31,0.10), rgba(30,111,217,0.10));
    opacity: 0; transition: opacity 200ms;
  }
  .suggestion-card:hover {
    border-color: var(--cr-card-hover-b);
    color: var(--cr-card-hover-c);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(193,18,31,0.08);
  }
  .suggestion-card:hover::before { opacity: 1; }
  .suggestion-card:active { transform: scale(0.97) translateY(0); }

  /* Pulse ring */
  @keyframes pulse-ring {
    0%   { transform: scale(0.9); opacity: 0.7; }
    50%  { transform: scale(1.18); opacity: 0; }
    100% { transform: scale(0.9); opacity: 0; }
  }
  .icon-ring { animation: pulse-ring 2.8s ease-in-out infinite; }

  /* Skeleton shimmer */
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--cr-skel-from) 25%,
      var(--cr-skel-mid1) 50%,
      var(--cr-skel-mid2) 62%,
      var(--cr-skel-from) 75%
    );
    background-size: 600px 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 12px;
  }

  /* Fade-up entrance */
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fade-up 0.5s ease both; }
`

/* ─── EmptyState ─────────────────────────────────────────────────────── */
function EmptyState() {
  const suggestions = [
    'Explain quantum entanglement simply',
    'Write a short poem about the ocean',
    'What are the best productivity habits?',
    'How does a neural network learn?',
  ]
  const { sendMessage } = useChatStore()

  return (
    <div className="fade-up" style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2.5rem 1.5rem',
    }}>
      {/* Icon */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <div className="icon-ring" style={{
          position: 'absolute', inset: '-10px', borderRadius: '50%',
          border: '1.5px solid rgba(193,18,31,0.38)', pointerEvents: 'none',
        }} />
        <div className="chat-icon-box" style={{
          width: 56, height: 56, borderRadius: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(12px)',
        }}>
          <Sparkles size={22} style={{ color: 'transparent', stroke: 'url(#iconGrad)' }} />
          <svg width={0} height={0}>
            <defs>
              <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C1121F" />
                <stop offset="100%" stopColor="#1E6FD9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Headline */}
      <h2 className="chat-heading" style={{
        margin: '0 0 6px',
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.35rem',
        letterSpacing: '-0.02em',
      }}>
        What can I help with?
      </h2>
      <p className="chat-subtext" style={{ margin: '0 0 2rem', fontSize: 13 }}>
        Ask me anything — I'm here to help.
      </p>

      {/* Suggestions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 480, width: '100%' }}>
        {suggestions.map((s) => (
          <button key={s} className="suggestion-card" onClick={() => sendMessage(s)}>{s}</button>
        ))}
      </div>
    </div>
  )
}

/* ─── MessageSkeleton ────────────────────────────────────────────────── */
function MessageSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[70, 50, 85].map((w, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-end', gap: 10,
          justifyContent: i % 2 !== 0 ? 'flex-end' : 'flex-start',
        }}>
          {i % 2 === 0 && (
            <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
          )}
          <div className="skeleton" style={{ height: 40, width: `${w}%` }} />
          {i % 2 !== 0 && (
            <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── ChatArea ───────────────────────────────────────────────────────── */
export default function ChatArea() {
  const { messages, sending, loadingMessages, activeChatId } = useChatStore()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const showEmpty = !activeChatId && messages.length === 0

  return (
    <div className="chat-root" style={{
      display: 'flex', flexDirection: 'column', flex: 1,
      minWidth: 0, height: '100vh', position: 'relative',
    }}>
      {/* Inject styles once — CSS variables do all the theming */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Decorative top rule */}
      <div className="chat-top-line" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 10,
      }} />

      {/* ── Header ── */}
      <div className="chat-header" style={{
        display: 'flex', alignItems: 'center',
        padding: '14px 24px',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 5,
      }}>
        {/* Accent dot */}
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'linear-gradient(135deg, #C1121F, #1E6FD9)',
          boxShadow: 'var(--cr-dot-shadow)',
          marginRight: 10, flexShrink: 0,
        }} />

        <MessageSquare size={14} style={{ color: 'var(--cr-text-lo)', marginRight: 7 }} />

        <span className="chat-header-label" style={{
          fontSize: 13, fontWeight: 500,
          fontFamily: 'Syne, sans-serif', letterSpacing: '0.04em',
        }}>
          {activeChatId ? 'Conversation' : 'New Chat'}
        </span>

        {/* Decorative bar */}
        <div style={{
          marginLeft: 'auto', width: 64, height: 1,
          background: 'linear-gradient(90deg, rgba(193,18,31,0.4), rgba(30,111,217,0.4))',
          borderRadius: 99,
        }} />
      </div>

      {/* ── Messages ── */}
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto' }}>
        {showEmpty ? (
          <EmptyState />
        ) : loadingMessages ? (
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
            <MessageSkeleton />
          </div>
        ) : (
          <div style={{
            maxWidth: 720, margin: '0 auto', padding: '24px 16px',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>
            {messages.map((msg) => (
              <MessageBubble key={msg._id || msg.id || Math.random()} message={msg} />
            ))}
            {sending && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div className="chat-input-bar" style={{
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      }}>
        <ChatInput />
      </div>
    </div>
  )
}
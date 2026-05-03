import { Sparkles, User } from 'lucide-react'
import ReactMarkDown from 'react-markdown'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Light tokens ── */
  :root {
    --mb-user-bg:        linear-gradient(135deg, #C1121F 0%, #8B0D14 55%, #1A3A8F 100%);
    --mb-user-text:      #FFFFFF;
    --mb-user-shadow:    0 4px 18px rgba(193,18,31,0.28), 0 1px 4px rgba(0,0,0,0.12);

    --mb-ai-text:        #12111A;
    --mb-ai-text-muted:  rgba(30,25,50,0.65);
    --mb-ai-border:      rgba(0,0,0,0.06);
    --mb-ai-divider:     rgba(0,0,0,0.06);

    --mb-icon-user-bg:   rgba(0,0,0,0.07);
    --mb-icon-user-c:    rgba(30,25,50,0.45);
    --mb-icon-ai-bg:     linear-gradient(135deg,rgba(193,18,31,0.12),rgba(30,111,217,0.12));
    --mb-icon-ai-border: rgba(0,0,0,0.08);

    --mb-code-bg:        rgba(0,0,0,0.04);
    --mb-code-border:    rgba(0,0,0,0.08);
    --mb-code-text:      #9B1010;
    --mb-pre-bg:         rgba(0,0,0,0.04);
    --mb-pre-border:     rgba(0,0,0,0.07);
    --mb-pre-text:       #12111A;

    --mb-blockquote-border: rgba(193,18,31,0.35);
    --mb-blockquote-bg:     rgba(193,18,31,0.04);
    --mb-blockquote-text:   rgba(30,25,50,0.60);

    --mb-hr:             rgba(0,0,0,0.07);
    --mb-th-bg:          rgba(0,0,0,0.04);
    --mb-td-border:      rgba(0,0,0,0.07);

    --mb-dot-red:        #C1121F;
    --mb-dot-blue:       #1E6FD9;

    --mb-typing-bg:      rgba(255,255,255,0.70);
    --mb-typing-border:  rgba(0,0,0,0.07);
  }

  /* ── Dark tokens ── */
  .dark {
    --mb-user-bg:        linear-gradient(135deg, #C1121F 0%, #7A0E12 55%, #1E3FAF 100%);
    --mb-user-text:      #FFFFFF;
    --mb-user-shadow:    0 4px 20px rgba(193,18,31,0.32), 0 1px 4px rgba(0,0,0,0.3);

    --mb-ai-text:        #EDE9F8;
    --mb-ai-text-muted:  rgba(220,215,240,0.60);
    --mb-ai-border:      rgba(255,255,255,0.06);
    --mb-ai-divider:     rgba(255,255,255,0.06);

    --mb-icon-user-bg:   rgba(255,255,255,0.08);
    --mb-icon-user-c:    rgba(220,215,240,0.45);
    --mb-icon-ai-bg:     linear-gradient(135deg,rgba(193,18,31,0.22),rgba(30,111,217,0.22));
    --mb-icon-ai-border: rgba(255,255,255,0.10);

    --mb-code-bg:        rgba(255,255,255,0.06);
    --mb-code-border:    rgba(255,255,255,0.08);
    --mb-code-text:      #F87171;
    --mb-pre-bg:         rgba(0,0,0,0.30);
    --mb-pre-border:     rgba(255,255,255,0.06);
    --mb-pre-text:       #EDE9F8;

    --mb-blockquote-border: rgba(193,18,31,0.50);
    --mb-blockquote-bg:     rgba(193,18,31,0.07);
    --mb-blockquote-text:   rgba(220,215,240,0.55);

    --mb-hr:             rgba(255,255,255,0.07);
    --mb-th-bg:          rgba(255,255,255,0.05);
    --mb-td-border:      rgba(255,255,255,0.06);

    --mb-dot-red:        #F87171;
    --mb-dot-blue:       #60A5FA;

    --mb-typing-bg:      rgba(7,9,26,0.55);
    --mb-typing-border:  rgba(255,255,255,0.07);
  }

  /* ── Fade-in ── */
  @keyframes mb-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mb-fade-up { animation: mb-fade-up 0.3s ease both; }

  /* ── User bubble ── */
  .mb-user-wrap {
    display: flex; align-items: flex-end; justify-content: flex-end; gap: 10px;
  }
  .mb-user-bubble {
    max-width: 68%;
    background: var(--mb-user-bg);
    color: var(--mb-user-text);
    border-radius: 20px 20px 4px 20px;
    padding: 11px 16px;
    font-size: 13.5px; line-height: 1.65;
    font-family: 'DM Sans', sans-serif;
    box-shadow: var(--mb-user-shadow);
    word-break: break-word;
  }
  .mb-user-icon {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: var(--mb-icon-user-bg);
    display: flex; align-items: center; justify-content: center;
  }
  .mb-user-icon svg { color: var(--mb-icon-user-c); }

  /* ── AI response — no box, full width ── */
  .mb-ai-wrap {
    display: flex; align-items: flex-start; gap: 12px;
  }
  .mb-ai-icon-col { flex-shrink: 0; padding-top: 2px; }
  .mb-ai-icon {
    width: 28px; height: 28px; border-radius: 9px;
    background: var(--mb-icon-ai-bg);
    border: 1px solid var(--mb-icon-ai-border);
    display: flex; align-items: center; justify-content: center;
  }
  .mb-ai-body {
    flex: 1; min-width: 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; line-height: 1.75;
    color: var(--mb-ai-text);
    word-break: break-word;
  }

  /* ── Markdown resets inside AI body ── */
  .mb-ai-body p   { margin: 0 0 0.85em; }
  .mb-ai-body p:last-child { margin-bottom: 0; }

  .mb-ai-body h1,
  .mb-ai-body h2,
  .mb-ai-body h3,
  .mb-ai-body h4 {
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    color: var(--mb-ai-text);
    margin: 1.4em 0 0.5em;
    line-height: 1.3;
  }
  .mb-ai-body h1 { font-size: 1.2em; }
  .mb-ai-body h2 { font-size: 1.1em; }
  .mb-ai-body h3 { font-size: 1em; }
  .mb-ai-body h1:first-child,
  .mb-ai-body h2:first-child,
  .mb-ai-body h3:first-child { margin-top: 0; }

  .mb-ai-body ul,
  .mb-ai-body ol {
    margin: 0 0 0.85em 0;
    padding-left: 1.4em;
  }
  .mb-ai-body li { margin-bottom: 0.3em; }
  .mb-ai-body li > p { margin: 0; }

  .mb-ai-body strong {
    font-weight: 600;
    background: linear-gradient(90deg, var(--mb-dot-red), var(--mb-dot-blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mb-ai-body em { color: var(--mb-ai-text-muted); font-style: italic; }

  .mb-ai-body code {
    font-family: 'DM Mono', 'Fira Code', monospace;
    font-size: 0.84em;
    background: var(--mb-code-bg);
    color: var(--mb-code-text);
    border: 1px solid var(--mb-code-border);
    border-radius: 5px;
    padding: 1px 6px;
  }

  .mb-ai-body pre {
    background: var(--mb-pre-bg);
    border: 1px solid var(--mb-pre-border);
    border-radius: 12px;
    padding: 14px 16px;
    overflow-x: auto;
    margin: 0.6em 0 1em;
  }
  .mb-ai-body pre code {
    background: none; border: none; padding: 0;
    color: var(--mb-pre-text);
    font-size: 0.85em; line-height: 1.6;
    -webkit-text-fill-color: unset;
  }

  .mb-ai-body blockquote {
    margin: 0.6em 0 1em;
    padding: 10px 14px;
    border-left: 3px solid var(--mb-blockquote-border);
    background: var(--mb-blockquote-bg);
    border-radius: 0 10px 10px 0;
    color: var(--mb-blockquote-text);
    font-style: italic;
  }
  .mb-ai-body blockquote p { margin: 0; }

  .mb-ai-body hr {
    border: none;
    border-top: 1px solid var(--mb-hr);
    margin: 1.2em 0;
  }

  .mb-ai-body table {
    width: 100%; border-collapse: collapse;
    font-size: 0.9em; margin: 0.6em 0 1em;
    border-radius: 10px; overflow: hidden;
  }
  .mb-ai-body th {
    background: var(--mb-th-bg);
    font-weight: 600; text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid var(--mb-td-border);
    font-family: 'Syne', sans-serif; font-size: 0.9em;
  }
  .mb-ai-body td {
    padding: 7px 12px;
    border-bottom: 1px solid var(--mb-td-border);
  }
  .mb-ai-body tr:last-child td { border-bottom: none; }

  .mb-ai-body a {
    color: var(--mb-dot-red);
    text-decoration: underline;
    text-decoration-color: rgba(193,18,31,0.35);
    text-underline-offset: 3px;
  }
  .mb-ai-body a:hover { text-decoration-color: var(--mb-dot-red); }

  /* ── Typing indicator ── */
  .mb-typing-wrap {
    display: flex; align-items: flex-start; gap: 12px;
  }
  .mb-typing-dots {
    display: flex; align-items: center; gap: 5px;
    padding: 12px 16px;
    background: var(--mb-typing-bg);
    border: 1px solid var(--mb-typing-border);
    border-radius: 16px 16px 16px 4px;
    backdrop-filter: blur(10px);
  }

  @keyframes mb-blink {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.35; }
    40%           { transform: scale(1);   opacity: 1; }
  }
  .mb-dot {
    width: 6px; height: 6px; border-radius: 50%;
    animation: mb-blink 1.3s ease-in-out infinite;
  }
  .mb-dot-r { background: var(--mb-dot-red);  animation-delay: 0ms; }
  .mb-dot-p { background: linear-gradient(135deg,var(--mb-dot-red),var(--mb-dot-blue)); animation-delay: 200ms; }
  .mb-dot-b { background: var(--mb-dot-blue); animation-delay: 400ms; }

  /* ── User markdown (inside bubble) ── */
  .mb-user-bubble p   { margin: 0 0 0.6em; }
  .mb-user-bubble p:last-child { margin: 0; }
  .mb-user-bubble code {
    background: rgba(255,255,255,0.18);
    border-radius: 4px; padding: 1px 5px;
    font-family: monospace; font-size: 0.85em;
  }
  .mb-user-bubble strong { font-weight: 600; -webkit-text-fill-color: #fff; }
`

/* ── AI icon with gradient sparkle ── */
function AiIcon() {
  return (
    <div className="mb-ai-icon">
      <Sparkles size={13} style={{ color: 'transparent', stroke: 'url(#mbIconGrad)' }} />
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="mbIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C1121F" />
            <stop offset="100%" stopColor="#1E6FD9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

/* ── Typing indicator ── */
export function TypingIndicator() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="mb-typing-wrap mb-fade-up">
        <div className="mb-ai-icon-col">
          <AiIcon />
        </div>
        <div className="mb-typing-dots">
          <span className="mb-dot mb-dot-r" />
          <span className="mb-dot mb-dot-p" />
          <span className="mb-dot mb-dot-b" />
        </div>
      </div>
    </>
  )
}

/* ── Message bubble ── */
export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const content = typeof message.content === 'string' ? message.content : ''

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {isUser ? (
        /* ── User: right-aligned gradient bubble ── */
        <div className="mb-user-wrap mb-fade-up">
          <div className="mb-user-bubble">
            <ReactMarkDown>{content}</ReactMarkDown>
          </div>
          <div className="mb-user-icon">
            <User size={13} />
          </div>
        </div>
      ) : (
        /* ── AI: full-width, no box, ChatGPT-style ── */
        <div className="mb-ai-wrap mb-fade-up">
          <div className="mb-ai-icon-col">
            <AiIcon />
          </div>
          <div className="mb-ai-body">
            <ReactMarkDown>{content}</ReactMarkDown>
          </div>
        </div>
      )}
    </>
  )
}
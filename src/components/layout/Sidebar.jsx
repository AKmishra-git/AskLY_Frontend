import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, MessageSquare, LogOut, Sparkles, Search, X } from 'lucide-react'
import { useChatStore } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'
import ThemeToggle from '../ui/ThemeToggle'

/* ─── Sidebar CSS (matches ChatArea token system) ───────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Light tokens ── */
  :root {
    --sb-bg:           #F4F2EF;
    --sb-bloom-red:    rgba(193,18,31,0.06);
    --sb-bloom-blue:   rgba(30,111,217,0.06);
    --sb-border:       rgba(0,0,0,0.07);
    --sb-header-bg:    rgba(255,255,255,0.80);
    --sb-footer-bg:    rgba(255,255,255,0.70);
    --sb-text-hi:      #12111A;
    --sb-text-mid:     rgba(30,25,50,0.65);
    --sb-text-lo:      rgba(30,25,50,0.35);
    --sb-item-hover:   rgba(0,0,0,0.04);
    --sb-item-active-bg:    rgba(193,18,31,0.07);
    --sb-item-active-border:rgba(193,18,31,0.22);
    --sb-item-active-text:  #C1121F;
    --sb-search-bg:    rgba(0,0,0,0.04);
    --sb-search-focus: rgba(193,18,31,0.08);
    --sb-search-border:rgba(0,0,0,0.08);
    --sb-search-focus-border: rgba(193,18,31,0.35);
    --sb-avatar-bg:    rgba(193,18,31,0.10);
    --sb-avatar-text:  #C1121F;
    --sb-new-bg:       rgba(193,18,31,0.07);
    --sb-new-hover:    rgba(193,18,31,0.13);
    --sb-new-border:   rgba(193,18,31,0.20);
    --sb-new-text:     #C1121F;
    --sb-skel-bg:      rgba(0,0,0,0.06);
    --sb-scrollbar:    rgba(0,0,0,0.12);
    --sb-empty-icon:   rgba(0,0,0,0.15);
    --sb-empty-text:   rgba(30,25,50,0.35);
    --sb-header-shadow: 0 1px 0 rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05);
    --sb-footer-shadow: 0 -1px 0 rgba(0,0,0,0.06);
  }

  /* ── Dark tokens ── */
  .dark {
    --sb-bg:           #07091A;
    --sb-bloom-red:    rgba(193,18,31,0.14);
    --sb-bloom-blue:   rgba(30,111,217,0.14);
    --sb-border:       rgba(255,255,255,0.07);
    --sb-header-bg:    rgba(7,9,26,0.70);
    --sb-footer-bg:    rgba(7,9,26,0.65);
    --sb-text-hi:      #F0EEF8;
    --sb-text-mid:     rgba(220,215,240,0.60);
    --sb-text-lo:      rgba(200,195,225,0.32);
    --sb-item-hover:   rgba(255,255,255,0.05);
    --sb-item-active-bg:    rgba(193,18,31,0.12);
    --sb-item-active-border:rgba(193,18,31,0.28);
    --sb-item-active-text:  #F87171;
    --sb-search-bg:    rgba(255,255,255,0.04);
    --sb-search-focus: rgba(193,18,31,0.08);
    --sb-search-border:rgba(255,255,255,0.08);
    --sb-search-focus-border: rgba(193,18,31,0.45);
    --sb-avatar-bg:    rgba(193,18,31,0.18);
    --sb-avatar-text:  #F87171;
    --sb-new-bg:       rgba(193,18,31,0.10);
    --sb-new-hover:    rgba(193,18,31,0.18);
    --sb-new-border:   rgba(193,18,31,0.22);
    --sb-new-text:     #F87171;
    --sb-skel-bg:      rgba(255,255,255,0.07);
    --sb-scrollbar:    rgba(255,255,255,0.10);
    --sb-empty-icon:   rgba(255,255,255,0.15);
    --sb-empty-text:   rgba(200,195,225,0.32);
    --sb-header-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.4);
    --sb-footer-shadow: 0 -1px 0 rgba(255,255,255,0.05);
  }

  /* ── Sidebar layout ── */
  .sb-root {
    font-family: 'DM Sans', sans-serif;
    background:
      radial-gradient(ellipse 80% 35% at 50% 0%,   var(--sb-bloom-red)  0%, transparent 70%),
      radial-gradient(ellipse 70% 30% at 50% 100%, var(--sb-bloom-blue) 0%, transparent 70%),
      var(--sb-bg);
    transition: background 350ms ease;
  }

  .sb-header {
    background: var(--sb-header-bg);
    border-bottom: 1px solid var(--sb-border);
    box-shadow: var(--sb-header-shadow);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: background 300ms ease;
  }

  .sb-footer {
    background: var(--sb-footer-bg);
    border-top: 1px solid var(--sb-border);
    box-shadow: var(--sb-footer-shadow);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: background 300ms ease;
  }

  /* Logo */
  .sb-logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
    background: linear-gradient(110deg, #C1121F 0%, #1E6FD9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* New chat button */
  .sb-new-btn {
    width: 100%;
    display: flex; align-items: center; gap: 8px;
    padding: 9px 14px;
    border-radius: 12px;
    border: 1px solid var(--sb-new-border);
    background: var(--sb-new-bg);
    color: var(--sb-new-text);
    font-size: 13px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 180ms, transform 120ms;
  }
  .sb-new-btn:hover  { background: var(--sb-new-hover); }
  .sb-new-btn:active { transform: scale(0.97); }

  /* Search input wrapper */
  .sb-search-wrap {
    position: relative;
    margin: 8px 12px 4px;
  }
  .sb-search-icon {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    color: var(--sb-text-lo);
    pointer-events: none;
    transition: color 200ms;
  }
  .sb-search-wrap:focus-within .sb-search-icon { color: var(--sb-new-text); }

  .sb-search-input {
    width: 100%; box-sizing: border-box;
    padding: 8px 32px 8px 32px;
    border-radius: 10px;
    border: 1px solid var(--sb-search-border);
    background: var(--sb-search-bg);
    color: var(--sb-text-hi);
    font-size: 12.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 200ms, background 200ms, box-shadow 200ms;
  }
  .sb-search-input::placeholder { color: var(--sb-text-lo); }
  .sb-search-input:focus {
    border-color: var(--sb-search-focus-border);
    background: var(--sb-search-focus);
    box-shadow: 0 0 0 3px rgba(193,18,31,0.08);
  }

  .sb-search-clear {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    padding: 2px;
    border: none; background: none;
    color: var(--sb-text-lo);
    cursor: pointer; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    transition: color 150ms, background 150ms;
  }
  .sb-search-clear:hover { color: var(--sb-text-hi); background: var(--sb-item-hover); }

  /* Section label */
  .sb-section-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--sb-text-lo);
    padding: 8px 14px 4px;
    font-family: 'Syne', sans-serif;
  }

  /* Chat items */
  .sb-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px;
    border-radius: 11px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background 150ms, border-color 150ms;
    position: relative;
  }
  .sb-item:hover  { background: var(--sb-item-hover); }
  .sb-item.active {
    background: var(--sb-item-active-bg);
    border-color: var(--sb-item-active-border);
  }

  .sb-item-icon       { color: var(--sb-text-lo); flex-shrink: 0; transition: color 150ms; }
  .sb-item.active .sb-item-icon { color: var(--sb-item-active-text); }

  .sb-item-title {
    font-size: 13px; flex: 1; min-width: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    color: var(--sb-text-mid);
    transition: color 150ms;
  }
  .sb-item.active .sb-item-title { color: var(--sb-item-active-text); font-weight: 500; }

  /* Highlight matched text */
  .sb-highlight {
    background: linear-gradient(90deg, rgba(193,18,31,0.25), rgba(30,111,217,0.20));
    border-radius: 3px;
    padding: 0 1px;
  }

  .sb-item-del {
    opacity: 0; padding: 4px; border: none; background: none;
    color: rgba(239,68,68,0.7); border-radius: 7px; cursor: pointer;
    flex-shrink: 0;
    transition: opacity 150ms, background 150ms, color 150ms;
  }
  .sb-item:hover .sb-item-del { opacity: 1; }
  .sb-item-del:hover { background: rgba(239,68,68,0.12); color: #EF4444; }

  /* No-results */
  .sb-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem 1rem; gap: 8px; text-align: center;
  }
  .sb-empty-icon { color: var(--sb-empty-icon); }
  .sb-empty-text { font-size: 12px; color: var(--sb-empty-text); line-height: 1.5; }

  /* Skeleton */
  @keyframes sb-shimmer {
    0%   { background-position: -300px 0; }
    100% { background-position:  300px 0; }
  }
  .sb-skel {
    background: linear-gradient(90deg,
      var(--sb-skel-bg) 25%,
      rgba(193,18,31,0.06) 50%,
      var(--sb-skel-bg) 75%
    );
    background-size: 300px 100%;
    animation: sb-shimmer 1.5s infinite linear;
    border-radius: 8px;
  }

  /* Scrollbar */
  .sb-list::-webkit-scrollbar { width: 3px; }
  .sb-list::-webkit-scrollbar-track { background: transparent; }
  .sb-list::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(193,18,31,0.4), rgba(30,111,217,0.4));
    border-radius: 99px;
  }

  /* Avatar */
  .sb-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--sb-avatar-bg);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .sb-avatar span {
    font-size: 11px; font-weight: 600; color: var(--sb-avatar-text);
    font-family: 'Syne', sans-serif;
  }

  .sb-user-name  { font-size: 13px; font-weight: 500; color: var(--sb-text-hi); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sb-user-email { font-size: 11px; color: var(--sb-text-lo); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .sb-logout-btn {
    padding: 6px; border: none; background: none;
    color: var(--sb-text-lo); border-radius: 8px; cursor: pointer;
    flex-shrink: 0;
    transition: background 150ms, color 150ms;
  }
  .sb-logout-btn:hover { background: rgba(239,68,68,0.12); color: #EF4444; }

  /* Top accent line */
  .sb-top-line {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(193,18,31,0.5) 40%, rgba(30,111,217,0.5) 60%, transparent);
    z-index: 10;
  }

  @keyframes sb-fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sb-fade-up { animation: sb-fade-up 0.25s ease both; }
`

/* ─── Highlight helper ───────────────────────────────────────────────── */
function HighlightedTitle({ title, query }) {
  if (!query.trim()) return <span>{title}</span>
  const idx = title.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{title}</span>
  return (
    <span>
      {title.slice(0, idx)}
      <span className="sb-highlight">{title.slice(idx, idx + query.length)}</span>
      {title.slice(idx + query.length)}
    </span>
  )
}

/* ─── ChatItem ───────────────────────────────────────────────────────── */
function ChatItem({ chat, isActive, onSelect, onDelete, query }) {
  const id    = chat._id || chat.id
  const title = chat.title || 'New conversation'

  return (
    <div
      className={`sb-item sb-fade-up ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(id)}
    >
      <MessageSquare size={13} className="sb-item-icon" />
      <span className="sb-item-title">
        <HighlightedTitle title={title} query={query} />
      </span>
      <button
        className="sb-item-del"
        onClick={(e) => { e.stopPropagation(); onDelete(id) }}
        title="Delete"
      >
        <Trash2 size={12} />
      </button>
    </div>
  )
}

/* ─── SkeletonChat ───────────────────────────────────────────────────── */
function SkeletonChat() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px' }}>
      <div className="sb-skel" style={{ width: 13, height: 13, borderRadius: '50%', flexShrink: 0 }} />
      <div className="sb-skel" style={{ height: 11, flex: 1, borderRadius: 6 }} />
    </div>
  )
}

/* ─── Sidebar ────────────────────────────────────────────────────────── */
export default function Sidebar() {
  const { chats, activeChatId, loadingChats, fetchChats, setActiveChatId, fetchMessages, openDeleteModal, newChat } = useChatStore()
  const { user, logout } = useAuthStore()

  const [query, setQuery]       = useState('')
  const searchRef               = useRef(null)

  useEffect(() => { fetchChats() }, [])

  const handleSelect = (id) => {
    setActiveChatId(id)
    fetchMessages(id)
  }

  // Client-side filter
  const filtered = query.trim()
    ? chats.filter((c) =>
        (c.title || 'New conversation').toLowerCase().includes(query.toLowerCase())
      )
    : chats

  return (
    <aside className="sb-root" style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', width: 256, flexShrink: 0,
      position: 'relative', overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Accent top rule */}
      <div className="sb-top-line" />

      {/* ── Logo / Header ── */}
      <div className="sb-header" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 16px', flexShrink: 0,
      }}>
        {/* Logo icon */}
        <div style={{
          width: 28, height: 28, borderRadius: 9, flexShrink: 0,
          background: 'linear-gradient(135deg, #C1121F 0%, #1E6FD9 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(193,18,31,0.3)',
        }}>
          <Sparkles size={13} style={{ color: '#fff' }} />
        </div>

        <span className="sb-logo-text">AskLY</span>

        <div style={{ marginLeft: 'auto' }}>
          <ThemeToggle />
        </div>
      </div>

      {/* ── New Chat ── */}
      <div style={{ padding: '10px 12px 4px' }}>
        <button className="sb-new-btn" onClick={newChat}>
          <Plus size={15} />
          New chat
        </button>
      </div>

      {/* ── Search ── */}
      <div className="sb-search-wrap">
        <Search size={13} className="sb-search-icon" />
        <input
          ref={searchRef}
          className="sb-search-input"
          type="text"
          placeholder="Search conversations…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="sb-search-clear"
            onClick={() => { setQuery(''); searchRef.current?.focus() }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Result count badge */}
      {query.trim() && (
        <div style={{ padding: '4px 14px 0' }}>
          <span style={{
            fontSize: 11, color: 'var(--sb-text-lo)',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            {filtered.length === 0
              ? 'No results'
              : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      )}

      {/* Section label */}
      {!query.trim() && (
        <div className="sb-section-label">Conversations</div>
      )}

      {/* ── Chat List ── */}
      <div className="sb-list" style={{ flex: 1, overflowY: 'auto', padding: '2px 12px 8px' }}>
        {loadingChats ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonChat key={i} />)
        ) : filtered.length === 0 ? (
          <div className="sb-empty">
            <Search size={22} className="sb-empty-icon" />
            <p className="sb-empty-text">
              {query.trim()
                ? <>No conversations match<br /><strong style={{ color: 'var(--sb-text-mid)' }}>"{query}"</strong></>
                : 'No conversations yet'}
            </p>
          </div>
        ) : (
          filtered.map((chat) => (
            <ChatItem
              key={chat._id || chat.id}
              chat={chat}
              isActive={(chat._id || chat.id) === activeChatId}
              onSelect={handleSelect}
              onDelete={openDeleteModal}
              query={query}
            />
          ))
        )}
      </div>

      {/* Gradient fade at bottom of list */}
      <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        bottom: 72, left: 0, right: 0, height: 28,
        background: 'linear-gradient(to bottom, transparent, var(--sb-bg))',
        opacity: 0.7,
      }} />

      {/* ── User Footer ── */}
      <div className="sb-footer" style={{ padding: '10px 12px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 11,
          transition: 'background 150ms', cursor: 'default',
        }}>
          <div className="sb-avatar">
            <span>{(user?.username || user?.email || 'U')[0].toUpperCase()}</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="sb-user-name">{user?.username || user?.name || 'User'}</p>
            <p className="sb-user-email">{user?.email}</p>
          </div>

          <button className="sb-logout-btn" onClick={logout} title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
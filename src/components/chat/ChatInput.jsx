import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Plus, X, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { useChatStore } from '../../store/chatStore'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Light tokens ── */
  :root {
    --ci-wrap-bg:        rgba(255,255,255,0.60);
    --ci-border:         rgba(0,0,0,0.08);
    --ci-focus-border:   rgba(193,18,31,0.35);
    --ci-focus-bg:       rgba(255,255,255,0.85);
    --ci-focus-shadow:   0 0 0 3px rgba(193,18,31,0.07), 0 4px 20px rgba(0,0,0,0.06);
    --ci-text:           #12111A;
    --ci-placeholder:    rgba(30,25,50,0.35);
    --ci-kbd-bg:         rgba(0,0,0,0.06);
    --ci-kbd-border:     rgba(0,0,0,0.10);
    --ci-hint:           rgba(30,25,50,0.32);
    --ci-send-idle-bg:   rgba(0,0,0,0.05);
    --ci-send-idle-icon: rgba(30,25,50,0.25);

    --ci-plus-bg:        rgba(0,0,0,0.05);
    --ci-plus-icon:      rgba(30,25,50,0.40);
    --ci-plus-hover-bg:  rgba(193,18,31,0.10);
    --ci-plus-hover-icon:#C1121F;

    --ci-pill-bg:        rgba(193,18,31,0.07);
    --ci-pill-border:    rgba(193,18,31,0.20);
    --ci-pill-text:      #9B1010;
    --ci-pill-x:         rgba(30,25,50,0.35);

    --ci-toast-ok-bg:    rgba(22,163,74,0.10);
    --ci-toast-ok-border:rgba(22,163,74,0.25);
    --ci-toast-ok-text:  #15803d;
    --ci-toast-err-bg:   rgba(193,18,31,0.08);
    --ci-toast-err-border:rgba(193,18,31,0.22);
    --ci-toast-err-text: #C1121F;
  }

  /* ── Dark tokens ── */
  .dark {
    --ci-wrap-bg:        rgba(7,9,26,0.55);
    --ci-border:         rgba(255,255,255,0.08);
    --ci-focus-border:   rgba(193,18,31,0.45);
    --ci-focus-bg:       rgba(7,9,26,0.75);
    --ci-focus-shadow:   0 0 0 3px rgba(193,18,31,0.09), 0 4px 24px rgba(0,0,0,0.35);
    --ci-text:           #F0EEF8;
    --ci-placeholder:    rgba(200,195,225,0.32);
    --ci-kbd-bg:         rgba(255,255,255,0.07);
    --ci-kbd-border:     rgba(255,255,255,0.10);
    --ci-hint:           rgba(200,195,225,0.28);
    --ci-send-idle-bg:   rgba(255,255,255,0.05);
    --ci-send-idle-icon: rgba(200,195,225,0.25);

    --ci-plus-bg:        rgba(255,255,255,0.06);
    --ci-plus-icon:      rgba(200,195,225,0.45);
    --ci-plus-hover-bg:  rgba(193,18,31,0.18);
    --ci-plus-hover-icon:#F87171;

    --ci-pill-bg:        rgba(193,18,31,0.14);
    --ci-pill-border:    rgba(193,18,31,0.30);
    --ci-pill-text:      #F87171;
    --ci-pill-x:         rgba(200,195,225,0.45);

    --ci-toast-ok-bg:    rgba(22,163,74,0.12);
    --ci-toast-ok-border:rgba(22,163,74,0.28);
    --ci-toast-ok-text:  #4ade80;
    --ci-toast-err-bg:   rgba(193,18,31,0.12);
    --ci-toast-err-border:rgba(193,18,31,0.30);
    --ci-toast-err-text: #F87171;
  }

  /* ── Wrapper box ── */
  .ci-box {
    display: flex; align-items: flex-end; gap: 10px;
    border-radius: 18px;
    border: 1px solid var(--ci-border);
    background: var(--ci-wrap-bg);
    padding: 10px 12px 10px 10px;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    transition: border-color 200ms, background 200ms, box-shadow 200ms;
  }
  .ci-box:focus-within {
    border-color: var(--ci-focus-border);
    background: var(--ci-focus-bg);
    box-shadow: var(--ci-focus-shadow);
  }

  /* ── Textarea ── */
  .ci-textarea {
    flex: 1; resize: none; background: transparent;
    font-size: 13.5px; line-height: 1.6;
    font-family: 'DM Sans', sans-serif;
    color: var(--ci-text);
    border: none; outline: none;
    max-height: 160px; overflow-y: auto;
    padding: 0;
  }
  .ci-textarea::placeholder { color: var(--ci-placeholder); }
  .ci-textarea:disabled { opacity: 0.45; }
  .ci-textarea::-webkit-scrollbar { width: 3px; }
  .ci-textarea::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(193,18,31,0.4), rgba(30,111,217,0.4));
    border-radius: 99px;
  }

  /* ── Plus button ── */
  .ci-plus {
    padding: 7px; border-radius: 11px; border: none; cursor: pointer; flex-shrink: 0;
    background: var(--ci-plus-bg);
    color: var(--ci-plus-icon);
    transition: background 180ms, color 180ms, transform 140ms;
    display: flex; align-items: center; justify-content: center;
  }
  .ci-plus:hover {
    background: var(--ci-plus-hover-bg);
    color: var(--ci-plus-hover-icon);
    transform: scale(1.08) rotate(90deg);
  }
  .ci-plus:active { transform: scale(0.92) rotate(90deg); }
  .ci-plus:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── Send button — active ── */
  .ci-send-active {
    padding: 7px; border-radius: 11px; border: none; cursor: pointer; flex-shrink: 0;
    background: linear-gradient(135deg, #C1121F 0%, #9B1010 60%, #1E6FD9 100%);
    color: #fff;
    box-shadow: 0 2px 12px rgba(193,18,31,0.35), 0 1px 3px rgba(0,0,0,0.2);
    transition: transform 150ms, box-shadow 150ms, opacity 150ms;
  }
  .ci-send-active:hover {
    box-shadow: 0 4px 18px rgba(193,18,31,0.45), 0 1px 4px rgba(0,0,0,0.2);
    transform: scale(1.04);
  }
  .ci-send-active:active { transform: scale(0.93); }

  /* ── Send button — idle ── */
  .ci-send-idle {
    padding: 7px; border-radius: 11px; border: none; flex-shrink: 0;
    background: var(--ci-send-idle-bg);
    color: var(--ci-send-idle-icon);
    cursor: not-allowed;
    transition: background 200ms;
  }

  /* ── File pill ── */
  @keyframes ci-pill-in {
    from { opacity: 0; transform: translateY(6px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0)  scale(1); }
  }
  .ci-pill-wrap {
    padding: 0 4px 6px;
    animation: ci-pill-in 200ms ease both;
  }
  .ci-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 10px; border-radius: 10px;
    background: var(--ci-pill-bg);
    border: 1px solid var(--ci-pill-border);
    font-size: 12px; font-family: 'DM Sans', sans-serif;
    color: var(--ci-pill-text);
    max-width: 100%; overflow: hidden;
  }
  .ci-pill-name {
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 220px;
  }
  .ci-pill-x {
    border: none; background: none; cursor: pointer; padding: 0;
    color: var(--ci-pill-x); display: flex; align-items: center;
    transition: color 150ms; flex-shrink: 0;
  }
  .ci-pill-x:hover { color: #C1121F; }

  /* ── Upload spinner inside pill ── */
  @keyframes ci-spin { to { transform: rotate(360deg); } }
  .ci-uploading { animation: ci-spin 0.9s linear infinite; }

  /* ── Toast ── */
  @keyframes ci-toast-in {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ci-toast-out {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  .ci-toast {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 10px; font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    margin-top: 6px;
    animation: ci-toast-in 200ms ease both;
  }
  .ci-toast.hiding { animation: ci-toast-out 300ms ease forwards; }
  .ci-toast-ok {
    background: var(--ci-toast-ok-bg);
    border: 1px solid var(--ci-toast-ok-border);
    color: var(--ci-toast-ok-text);
  }
  .ci-toast-err {
    background: var(--ci-toast-err-bg);
    border: 1px solid var(--ci-toast-err-border);
    color: var(--ci-toast-err-text);
  }

  /* ── Hint row ── */
  .ci-hint {
    text-align: center;
    font-size: 10.5px;
    color: var(--ci-hint);
    font-family: 'DM Sans', sans-serif;
    margin-top: 8px;
    letter-spacing: 0.01em;
  }
  .ci-kbd {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    background: var(--ci-kbd-bg);
    border: 1px solid var(--ci-kbd-border);
    border-radius: 4px;
    padding: 1px 5px;
    display: inline-block;
  }
`

export default function ChatInput() {
  const [value, setValue] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)   // File object
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState(null)                 // { type: 'ok'|'err', msg }
  const [toastHiding, setToastHiding] = useState(false)

  const { sendMessage, sending } = useChatStore()
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const toastTimerRef = useRef(null)

  /* ── Auto-grow textarea ── */
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [value])

  /* ── Show toast helper ── */
  const showToast = (type, msg) => {
    clearTimeout(toastTimerRef.current)
    setToastHiding(false)
    setToast({ type, msg })
    toastTimerRef.current = setTimeout(() => {
      setToastHiding(true)
      setTimeout(() => setToast(null), 310)
    }, 3000)
  }

  /* ── File chosen from picker ── */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!fileInputRef.current) return
    fileInputRef.current.value = ''          // reset so same file can be re-picked

    if (!file) return

    // client-side guard: PDFs only
    if (file.type !== 'application/pdf') {
      showToast('err', 'Only PDF files are supported.')
      return
    }

    setSelectedFile(file)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/upload`, {
        method: 'POST',
        credentials: 'include',             // sends auth cookie
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Upload failed')
      }

      showToast('ok', `"${file.name}" indexed — ${data.chunks} chunks ready.`)
    } catch (err) {
      console.error('PDF upload error:', err)
      setSelectedFile(null)
      showToast('err', err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  /* ── Remove attached file ── */
  const removeFile = () => {
    setSelectedFile(null)
    clearTimeout(toastTimerRef.current)
    setToast(null)
  }

  /* ── Send message ── */
  const handleSubmit = async () => {
    const trimmed = value.trim()
    if (!trimmed || sending || uploading) return
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await sendMessage(trimmed)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSend = value.trim() && !sending && !uploading

  return (
    <div style={{ padding: '12px 16px 14px' }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* ── File pill (shown after file is picked) ── */}
        {selectedFile && (
          <div className="ci-pill-wrap">
            <div className="ci-pill">
              {uploading
                ? <Loader2 size={12} className="ci-uploading" />
                : <FileText size={12} style={{ flexShrink: 0 }} />
              }
              <span className="ci-pill-name">
                {uploading ? `Uploading "${selectedFile.name}"…` : selectedFile.name}
              </span>
              {!uploading && (
                <button className="ci-pill-x" onClick={removeFile} title="Remove file">
                  <X size={11} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Input box ── */}
        <div className="ci-box">

          {/* (+) button */}
          <button
            className="ci-plus"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || sending}
            title="Attach a PDF"
          >
            <Plus size={15} />
          </button>

          <textarea
            ref={textareaRef}
            className="ci-textarea"
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything…"
            disabled={sending}
          />

          <button
            onClick={handleSubmit}
            disabled={!canSend}
            className={canSend ? 'ci-send-active' : 'ci-send-idle'}
          >
            {sending
              ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={15} />
            }
          </button>
        </div>

        {/* ── Toast notification ── */}
        {toast && (
          <div className={`ci-toast ci-toast-${toast.type === 'ok' ? 'ok' : 'err'}${toastHiding ? ' hiding' : ''}`}>
            {toast.type === 'ok'
              ? <CheckCircle size={12} style={{ flexShrink: 0 }} />
              : <AlertCircle  size={12} style={{ flexShrink: 0 }} />
            }
            {toast.msg}
          </div>
        )}

        <p className="ci-hint">
          <kbd className="ci-kbd">Enter</kbd> to send &nbsp;·&nbsp;
          <kbd className="ci-kbd">Shift+Enter</kbd> for new line &nbsp;·&nbsp;
          <kbd className="ci-kbd">+</kbd> attach PDF
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

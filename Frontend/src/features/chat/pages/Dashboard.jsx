import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentChatId, appendChatChunk, setLoading } from '../chat.slice'
import ReactMarkdown from 'react-markdown'
import useChat from '../hooks/useChat'
import { CiMenuKebab } from "react-icons/ci"
import Loader from '../../../app/Loader'

const SUGGESTIONS = [
  { text: "Write a to-do list for a personal project", icon: "person" },
  { text: "Generate an email to reply to a job offer", icon: "mail" },
  { text: "Summarize this article in one paragraph", icon: "chat" },
  { text: "How does AI work in a technical capacity", icon: "code" },
]

const SidebarIcon = ({ d, active, onClick, label }) => (
  <button onClick={onClick} className={`sidebar-icon ${active ? 'active' : ''}`} title={label}>
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  </button>
)

const SuggestionIcon = ({ type }) => {
  const icons = {
    person: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0",
    mail: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.5-9.75-6.5",
    chat: "M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z",
    code: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  }
  return (
    <div className="card-icon">
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={icons[type]} />
      </svg>
    </div>
  )
}

const Dashboard = () => {
  const dispatch = useDispatch()
  const { initSocketClient, handleSendMessage, handleGetChats, handleGetMessages } = useChat()
  const { user } = useSelector((state) => state.auth)
  const [message, setMessage] = useState('')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const chunkBufferRef = useRef({ chatId: null, text: '' })
  const rafIdRef = useRef(null)
  const isStreamingRef = useRef(false)
  const { chats, currentChatId, loading } = useSelector(state => state.chat)

  useEffect(() => {
    const socket = initSocketClient();

    // Buffer chunks and flush once per animation frame for smooth rendering
    socket.on("chat_chunk", ({ chatId, chunk }) => {
      chunkBufferRef.current.chatId = chatId
      chunkBufferRef.current.text += chunk
      isStreamingRef.current = true

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          const { chatId: cid, text } = chunkBufferRef.current
          if (text) {
            dispatch(appendChatChunk({ chatId: cid, chunk: text }))
            chunkBufferRef.current.text = ''
          }
          rafIdRef.current = null
        })
      }
    })

    socket.on("chat_complete", ({ chatId, aiMessageId, fullContent }) => {
      // Flush any remaining buffer
      if (chunkBufferRef.current.text) {
        dispatch(appendChatChunk({ chatId, chunk: chunkBufferRef.current.text }))
        chunkBufferRef.current.text = ''
      }
      isStreamingRef.current = false
      dispatch(setLoading(false))
    })

    socket.on("chat_error", ({ error }) => {
      console.error("Streaming error:", error)
      isStreamingRef.current = false
      dispatch(setLoading(false))
    })

    handleGetChats()

    return () => {
      socket.off("chat_chunk")
      socket.off("chat_complete")
      socket.off("chat_error")
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  // Auto-scroll: snap instantly during streaming, smooth on chat switch
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    if (isStreamingRef.current) {
      // Instant snap — no competing smooth-scroll animations
      container.scrollTop = container.scrollHeight
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chats, currentChatId])


  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    const trimmedMessage = message.trim()
    setMessage('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await handleSendMessage(trimmedMessage, currentChatId)
  }

  const handleTextareaChange = (e) => {
    setMessage(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e) }
  }

  const handleSelectConversation = async (chatId) => { await handleGetMessages(chatId, chats) }

  const handleSuggestionClick = async (text) => {
    setMessage('')
    await handleSendMessage(text, currentChatId)
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const hasMessages = currentChatId && chats[currentChatId] && chats[currentChatId]?.messages?.length > 0
  const isChatLoading = loading && currentChatId && (!chats[currentChatId] || !chats[currentChatId]?.messages || chats[currentChatId]?.messages?.length === 0)
  const userName = user?.username || 'User'

  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ background: 'var(--bg-primary)', fontFamily: "'Inter', sans-serif" }}>
      {/* Icon Sidebar */}
      <aside className="flex flex-col items-center py-5 px-2 gap-2" style={{ width: '60px', background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-light)' }}>
        <div className="sidebar-icon" style={{ marginBottom: 8, background: 'transparent' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #c084fc, #8b5cf6 40%, #6d28d9 70%, #4c1d95 100%)', boxShadow: '0 3px 10px rgba(139, 92, 246, 0.35)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 5, left: 7, width: 8, height: 5, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.55), transparent)', filter: 'blur(1px)' }} />
          </div>
        </div>

        <SidebarIcon label="Chat" active={false} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" onClick={() => setSidebarExpanded(!sidebarExpanded)} />

        <div className="flex-1" />

        {/* Bottom icons */}
        <SidebarIcon label="Conversations" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        <SidebarIcon label="Settings" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />

        {/* User Avatar */}
        <div className="mt-2" style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          {userName.charAt(0).toUpperCase()}
        </div>
      </aside>

      {/* Expandable Chat List Panel */}
      {sidebarExpanded && (
        <div className="flex flex-col py-4 px-3" style={{ width: 240, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-light)' }}>
          <h3 className="px-3 mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Recent Chats</h3>
          <div className="message-box flex-1 overflow-y-auto space-y-1">
            <button
              onClick={() => dispatch(setCurrentChatId(null))}
              className="new-chat-btn"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Chat
            </button>
            {Object.values(chats)
              .sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0))
              .map((chat, idx) => (
                <div key={idx} onClick={() => handleSelectConversation(chat.id)}
                  className={`chat-sidebar-item ${chat.id === currentChatId ? 'active' : ''}`}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="truncate">{chat.title}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {hasMessages || isChatLoading ? (
          /* ── Chat View ── */
          <>
            <header className="flex-shrink-0 px-6 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-light)' }}>
              <div className="flex items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.4)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Cerebro AI</span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--purple-50)', color: 'var(--purple-600)', fontWeight: 500 }}>Online</span>
            </header>

            {isChatLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader fullScreen={false} text="Loading messages..." />
              </div>
            ) : (
              <div ref={scrollContainerRef} className="message-box flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {chats[currentChatId]?.messages?.map((msg, index) => {
                  if (msg.role === 'ai' && !msg.content.trim()) return null;
                  return (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'user' ? (
                        <div className="user-message">{msg.content}</div>
                      ) : (
                        <div className="ai-message">
                          <ReactMarkdown components={{
                            h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-4 mb-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-sm font-semibold mt-3 mb-1" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                            li: ({ node, ...props }) => <li {...props} />,
                            code: ({ node, inline, ...props }) => (
                              inline
                                ? <code className="px-1.5 py-0.5 rounded font-mono text-xs" style={{ background: 'var(--purple-50)', color: 'var(--purple-700)', border: '1px solid var(--purple-100)' }} {...props} />
                                : <code className="block p-3.5 rounded-xl overflow-x-auto font-mono text-xs my-3 leading-normal" style={{ background: '#f8f7fc', color: 'var(--purple-700)', border: '1px solid var(--border-light)' }} {...props} />
                            ),
                            pre: ({ node, ...props }) => <pre className="bg-transparent p-0 m-0" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="pl-4 italic my-3" style={{ borderLeft: '2px solid var(--purple-300)', color: 'var(--text-muted)' }} {...props} />,
                          }}>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Show typing/thinking indicator when loading the next response */}
                {loading && chats[currentChatId]?.messages && (() => {
                  const msgs = chats[currentChatId].messages
                  const lastMsg = msgs[msgs.length - 1]
                  if (lastMsg && (lastMsg.role === 'user' || (lastMsg.role === 'ai' && !lastMsg.content.trim()))) {
                    return (
                      <div className="flex justify-start">
                        <div className="ai-message flex items-center gap-3">
                          {/* Animated Avatar/Orb Icon */}
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #c084fc, #8b5cf6 40%, #6d28d9 70%, #4c1d95 100%)', boxShadow: '0 3px 10px rgba(139, 92, 246, 0.25)' }} />
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Chat Input */}
            <div className="flex-shrink-0 px-6 py-4" style={{ borderTop: '1px solid var(--border-light)' }}>
              <form onSubmit={handleSend} className="flex items-end gap-3">
                <div className="chat-input-wrapper flex-1 px-4 py-3">
                  <textarea ref={textareaRef} rows={1} value={message} onChange={handleTextareaChange} onKeyDown={handleKeyDown}
                    placeholder="Ask AI a question or make a request..." id="chat-message-input" disabled={isChatLoading} />
                </div>
                <button type="submit" disabled={!message.trim() || isChatLoading} className="send-btn" id="chat-send-button">
                  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          /* ── Empty / Welcome State ── */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-2xl flex flex-col items-center">
              {/* Orb */}
              <div className="orb-container fade-in-up mb-8">
                <div className="orb" />
              </div>

              {/* Greeting */}
              <h2 className="text-3xl font-bold mb-1 fade-in-up fade-in-up-delay-1" style={{ color: 'var(--text-primary)', textAlign: 'center' }}>
                {getGreeting()}, {userName}
              </h2>
              <p className="text-3xl font-bold mb-10 fade-in-up fade-in-up-delay-2" style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--text-primary)' }}>What's on </span>
                <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your mind?</span>
              </p>

              {/* Chat Input */}
              <div className="w-full mb-3 fade-in-up fade-in-up-delay-2">
                <div className="chat-input-wrapper px-4 pt-3 pb-2">
                  <textarea ref={textareaRef} rows={2} value={message} onChange={handleTextareaChange} onKeyDown={handleKeyDown}
                    placeholder="Ask AI a question or make a request..." id="chat-message-input"
                    style={{ minHeight: 48 }} />
                  <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
                    <div className="flex items-center gap-2">
                      <button type="button" className="action-btn">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                        </svg>
                        Attach
                      </button>
                      <button type="button" className="action-btn">
                        Writing Styles
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="toggle-switch" />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Citation</span>
                      </div>
                      <button type="button" onClick={handleSend} disabled={!message.trim()} className="send-btn">
                        <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestion Cards */}
              <div className="w-full mt-6 fade-in-up fade-in-up-delay-3">
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                  Get started with an example below
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {SUGGESTIONS.map((s, i) => (
                    <div key={i} className="suggestion-card" onClick={() => handleSuggestionClick(s.text)}>
                      <p>{s.text}</p>
                      <div className="flex-1" />
                      <SuggestionIcon type={s.icon} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
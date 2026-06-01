import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import useChat from '../hooks/useChat'

const Dashboard = () => {
  const { 
    initSocketClient, 
    handleSendMessage, 
    handleGetChats,
    handleGetMessages
  } = useChat()
  const { user } = useSelector((state) => state.auth)
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)

  const { chats, currentChatId, loading } = useSelector(state => state.chat)

  useEffect(() => {
    initSocketClient(),
    handleGetChats()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const trimmedMessage = message.trim()
    setMessage('')
    await handleSendMessage(trimmedMessage, currentChatId)

  }

  const handleNewChat = () => {
    const newConv = {
      id: conversations.length + 1,
      title: `New Chat ${conversations.length + 1}`,
      active: true,
    }
    setConversations((prev) =>
      [newConv, ...prev.map((c) => ({ ...c, active: false }))]
    )
    setMessages([])
  }

  const handleSelectConversation = async (chatId) => {
    await handleGetMessages(chatId)    
  }

  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex overflow-hidden font-sans relative">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* ─── Sidebar ─── */}
      <aside className="w-72 flex-shrink-0 bg-zinc-900/60 backdrop-blur-xl border-r border-zinc-800/80 flex flex-col relative">
        {/* Accent top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />

        {/* Brand */}
        <div className="px-5 pt-6 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-950 border border-amber-500/40 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6m-6 4h6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-amber-500/80 bg-clip-text text-transparent">
            Cerebro
          </h1>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-amber-500/20 rounded-xl text-sm font-medium text-amber-400 hover:from-amber-500/20 hover:to-yellow-600/20 hover:border-amber-500/40 transition-all duration-300 group cursor-pointer"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-thin">
          <p className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Recent
          </p>
          {Object.values(chats).map((chat, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectConversation(chat.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2.5 group cursor-pointer ${
                chat.active
                  ? 'bg-zinc-800/70 text-zinc-100 border border-zinc-700/50'
                  : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <svg className={`w-4 h-4 flex-shrink-0 ${chat.active ? 'text-amber-500' : 'text-zinc-600 group-hover:text-zinc-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>

        {/* User Info Footer */}
        <div className="px-4 py-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-zinc-950 text-sm font-bold flex-shrink-0">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">{user?.username || 'User'}</p>
              <p className="text-[11px] text-zinc-500 truncate">{user?.email || 'user@cerebro.ai'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Chat Area ─── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <header className="flex-shrink-0 px-6 py-4 border-b border-zinc-800/60 bg-zinc-900/30 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] flex-shrink-0" />
            <h2 className="text-sm font-semibold text-zinc-200 truncate">
              {/* {chats[currentChatId].find((c) => c.title || 'New Chat')} */}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2.5 py-1 rounded-lg border border-zinc-700/40">
              Cerebro AI
            </span>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth">
          {!currentChatId || !chats[currentChatId] || chats[currentChatId]?.messages.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
                <svg className="w-8 h-8 text-amber-500/70" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-300 mb-2">Start a conversation</h3>
              <p className="text-sm text-zinc-500 max-w-sm">
                Ask Cerebro anything - get help with cover letters, resumes, career advice, and more.
              </p>
            </div>
          ) : (
            chats[currentChatId].messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-2xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-zinc-950'
                      : 'bg-zinc-800 border border-zinc-700/60 text-amber-500'
                  }`}>
                    {msg.role === 'user'
                      ? (user?.username?.charAt(0)?.toUpperCase() || 'U')
                      : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                        </svg>
                      )}
                  </div>

                   {/* Message Bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-amber-500/15 to-yellow-600/10 border border-amber-500/20 text-zinc-100 rounded-tr-sm whitespace-pre-wrap'
                      : 'bg-zinc-800/50 border border-zinc-700/40 text-zinc-300 rounded-tl-sm w-full'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2 text-zinc-100 border-b border-zinc-800 pb-1" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-4 mb-2 text-zinc-100" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-semibold mt-3 mb-1 text-zinc-100" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0 text-zinc-300" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-zinc-300" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-zinc-300" {...props} />,
                          li: ({ node, ...props }) => <li className="text-zinc-300" {...props} />,
                          code: ({ node, inline, ...props }) => (
                            inline 
                              ? <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-amber-400 font-mono text-[11px] border border-zinc-800/60" {...props} />
                              : <code className="block bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80 overflow-x-auto text-amber-400 font-mono text-[11px] my-3 leading-normal" {...props} />
                          ),
                          pre: ({ node, ...props }) => <pre className="bg-transparent p-0 m-0" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                          blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-amber-500/50 pl-4 italic my-3 text-zinc-400" {...props} />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-zinc-800/60 bg-zinc-900/30 backdrop-blur-md">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                id="chat-message-input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200 text-sm"
              />
              {/* Attachment icon inside input */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
              </button>
            </div>
            <button
              id="chat-send-button"
              type="submit"
              disabled={!message.trim()}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-zinc-950 font-semibold rounded-xl transition-all duration-300 hover:from-amber-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(245,158,11,0.15)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
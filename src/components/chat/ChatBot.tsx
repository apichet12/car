'use client'
import { useState, useRef, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const t = useTranslations('chat')
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Set greeting on open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t('greeting') }])
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')

    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      if (data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
      } else {
        throw new Error('No message returned')
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            locale === 'th'
              ? 'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งนะคะ 🙏'
              : 'Sorry, something went wrong. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const quickReplies =
    locale === 'th'
      ? ['ราคาเช่ารถเท่าไหร่?', 'มีรถ SUV ไหม?', 'วิธีจองรถ']
      : ['What are your prices?', 'Any SUVs available?', 'How to book?']

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full shadow-lg shadow-yellow-500/25 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-black border-b border-gray-800 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-base flex-shrink-0">
              🐱
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{t('title')}</div>
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                Online
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-gray-600 hover:text-gray-400"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-950">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-yellow-500 text-black font-medium rounded-br-sm'
                      : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-400 px-4 py-3 rounded-2xl rounded-bl-sm text-sm flex items-center gap-1">
                  <span>{t('thinking')}</span>
                  <span className="flex gap-0.5 ml-1">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q)
                    setTimeout(() => {
                      setInput('')
                      const newMsgs: Message[] = [
                        ...messages,
                        { role: 'user', content: q },
                      ]
                      setMessages(newMsgs)
                      setLoading(true)
                      fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages: newMsgs }),
                      })
                        .then((r) => r.json())
                        .then((d) => {
                          if (d.message)
                            setMessages((p) => [
                              ...p,
                              { role: 'assistant', content: d.message },
                            ])
                        })
                        .finally(() => setLoading(false))
                    }, 10)
                  }}
                  className="flex-shrink-0 border border-gray-700 text-gray-400 hover:border-yellow-500/40 hover:text-yellow-400 text-xs px-3 py-1.5 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-800 flex gap-2 bg-gray-900">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={t('placeholder')}
              className="flex-1 bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:border-yellow-500/50 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-yellow-500 disabled:bg-gray-700 disabled:text-gray-600 text-black rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-yellow-400 active:scale-95"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'
import { useChatStore } from '@/lib/chatStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatWidget () {
  const {
    messages,
    isOpen,
    isLoading,
    error,
    toggleOpen,
    sendMessage,
    clearMessages
  } = useChatStore()

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      await sendMessage(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className='fixed bottom-6 right-6 z-50 font-sans'>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className='absolute bottom-20 right-0 w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden'
          >
            {/* Header */}
            <div className='bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex justify-between items-center'>
              <h3 className='font-semibold'>FarmDirect Assistant</h3>
              <button
                onClick={toggleOpen}
                className='hover:bg-green-800 p-1 rounded-md transition-colors'
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className='flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3'>
              {messages.length === 0 && (
                <div className='flex items-center justify-center h-full text-center'>
                  <div className='text-gray-500'>
                    <FiMessageCircle
                      size={40}
                      className='mx-auto mb-2 opacity-50'
                    />
                    <p className='text-sm'>
                      Hi! 👋 I'm here to help with questions about FarmDirect.
                    </p>
                  </div>
                </div>
              )}

              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-green-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className='break-words'>{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className='flex justify-start'>
                  <div className='bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none'>
                    <div className='flex space-x-1'>
                      <div className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'></div>
                      <div className='w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100'></div>
                      <div className='w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200'></div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className='bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm'>
                  <p>Error: {error}</p>
                  <button
                    onClick={() => setInputValue('')}
                    className='text-xs underline hover:no-underline mt-1'
                  >
                    Try again
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className='border-t border-gray-200 p-3 bg-white'
            >
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder='Type your question...'
                  disabled={isLoading}
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm disabled:bg-gray-100'
                />
                <button
                  type='submit'
                  disabled={isLoading || !inputValue.trim()}
                  className='bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                >
                  <FiSend size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Bubble Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className='bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center'
        aria-label='Open chat'
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </motion.button>
    </div>
  )
}

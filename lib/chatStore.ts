import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatStore {
  messages: ChatMessage[]
  isOpen: boolean
  isLoading: boolean
  error: string | null
  addMessage: (role: 'user' | 'assistant', content: string) => void
  toggleOpen: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearMessages: () => void
  sendMessage: (userMessage: string) => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  error: null,

  addMessage: (role, content) => {
    set(state => ({
      messages: [
        ...state.messages,
        {
          id: `msg-${Date.now()}-${Math.random()}`,
          role,
          content,
          timestamp: new Date()
        }
      ]
    }))
  },

  toggleOpen: () => {
    set(state => ({ isOpen: !state.isOpen }))
  },

  setLoading: loading => {
    set({ isLoading: loading })
  },

  setError: error => {
    set({ error })
  },

  clearMessages: () => {
    set({ messages: [], error: null })
  },

  sendMessage: async (userMessage: string) => {
    if (!userMessage.trim()) return

    // Add user message first
    set(state => ({
      messages: [
        ...state.messages,
        {
          id: `msg-${Date.now()}-${Math.random()}`,
          role: 'user',
          content: userMessage,
          timestamp: new Date()
        }
      ],
      isLoading: true,
      error: null
    }))

    try {
      // Get latest state for API call
      const currentState = get()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentState.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      // Add assistant message
      set(state => ({
        messages: [
          ...state.messages,
          {
            id: `msg-${Date.now()}-${Math.random()}`,
            role: 'assistant',
            content: data.message,
            timestamp: new Date()
          }
        ],
        isLoading: false,
        error: null
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      set({ error: errorMessage, isLoading: false })
    }
  }
}))

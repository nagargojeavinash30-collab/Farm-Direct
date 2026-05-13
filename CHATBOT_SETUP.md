# 🤖 FarmDirect AI Chatbot Setup Guide

## Overview

FarmDirect now includes an AI-powered customer support chatbot that runs on **Groq API**. The chatbot appears as a floating widget on every page and is trained with FarmDirect-specific knowledge about products, orders, roles, and features.

## Features

✅ **Floating Widget** - Available on every page
✅ **Platform-Aware** - Trained with FarmDirect FAQs and features  
✅ **Real-time Responses** - Fast inference using Groq's LLMs
✅ **Conversation History** - Maintains context within a session
✅ **Error Handling** - Graceful error messages and retry support
✅ **Responsive Design** - Works on mobile and desktop

## Setup Instructions

### Step 1: Get Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Create a new API key
5. Copy the API key (keep it secure)

### Step 2: Configure Environment Variables

1. Open `.env.local` file in your project root
2. Add the following line:
   ```
   GROQ_API_KEY=your-actual-groq-api-key
   ```
3. Save the file

**Note**: The `.env.local` file should be in `.gitignore` to prevent exposing your API key.

### Step 3: Install Dependencies (if needed)

The chatbot uses existing dependencies already in `package.json`:

- `framer-motion` - For animations
- `zustand` - For state management
- `react-icons` - For UI icons

No additional packages need to be installed.

### Step 4: Start Development Server

```bash
npm run dev
```

The chatbot will be available at `http://localhost:3000` as a green floating bubble in the bottom-right corner.

## How to Use

### For Users

1. **Click the green bubble** in the bottom-right corner
2. **Type your question** about FarmDirect
3. **Wait for AI response** - The chatbot will provide helpful answers
4. **Continue conversation** - Context is maintained across messages
5. **Close chat** - Click the X button or click the bubble again

### Example Questions the Chatbot Can Answer

- "How do I register as a farmer?"
- "What payment methods do you accept?"
- "How do I track my order?"
- "Can I list products as a farmer?"
- "What are the product categories?"
- "How does the checkout process work?"
- "Is my data secure?"

## File Structure

```
FarmDirect/
├── app/
│   └── api/
│       └── chat/
│           └── route.ts          # Groq API integration
├── components/
│   └── ChatWidget.tsx             # Floating chat widget UI
├── lib/
│   └── chatStore.ts               # Zustand state management
└── .env.local                      # Environment variables (not in git)
```

### API Route: `/app/api/chat/route.ts`

- Handles chat message requests
- Sends messages to Groq API with system prompt
- Returns AI-generated responses
- Includes error handling and validation

### Component: `/components/ChatWidget.tsx`

- Floating chat bubble (fixed position, bottom-right)
- Expandable chat window with message history
- Message input form
- Loading and error states
- Smooth animations with Framer Motion

### Store: `/lib/chatStore.ts`

- Manages chat state globally with Zustand
- Tracks messages, loading state, and errors
- Handles API calls and message updates
- Provides actions: `toggleOpen`, `sendMessage`, `clearMessages`

## Customization

### Change System Prompt

Edit `/app/api/chat/route.ts` and modify the `SYSTEM_PROMPT` constant to:

- Add more FAQs
- Change chatbot personality
- Add specific business rules

Example:

```typescript
const SYSTEM_PROMPT = `You are FarmDirect AI Assistant...
// Add more context here
`
```

### Customize UI Colors

Edit `/components/ChatWidget.tsx` to change colors:

- Green theme: `from-green-600 to-green-700`
- Button style: `bg-gradient-to-r`
- Message bubbles: User (green), Assistant (gray)

### Change Chat Model

Edit `/app/api/chat/route.ts` and update the model:

```typescript
model: 'mixtral-8x7b-32768' // Current model
// Available Groq models:
// - mixtral-8x7b-32768
// - llama2-70b-4096
// - llama3-8b-8192
// - llama3-70b-8192
// - gemma-7b-it
```

### Adjust Response Settings

In `/app/api/chat/route.ts`:

```typescript
max_tokens: 1024,      // Max response length
temperature: 0.7,      // 0=deterministic, 1=creative
```

## API Response Format

### Request

```json
{
  "messages": [
    { "role": "user", "content": "How do I register?" },
    { "role": "assistant", "content": "..." }
  ]
}
```

### Response

```json
{
  "message": "To register as a farmer, click 'Register' and select the Farmer role..."
}
```

### Error Response

```json
{
  "error": "GROQ_API_KEY not configured"
}
```

## Troubleshooting

### Chatbot Not Appearing

1. **Clear browser cache** - Ctrl+Shift+Delete
2. **Check console for errors** - F12 → Console tab
3. **Verify layout includes ChatWidget** - Check `app/layout.tsx`
4. **Rebuild** - `npm run build`

### No Response from Chatbot

1. **Check API key** - Ensure `GROQ_API_KEY` is set in `.env.local`
2. **Verify API key is valid** - Test in Groq console
3. **Check browser console** - Look for fetch errors
4. **Check server logs** - Look for "Groq API error"

### Slow Responses

- Groq's free tier may have rate limiting
- Consider upgrading to paid plan for faster responses
- Try with simpler questions first
- Check your internet connection

### API Key Exposed

If you accidentally commit your API key:

1. **Immediately revoke the key** in Groq console
2. **Generate a new key**
3. **Update `.env.local`**
4. **Remove from git history** (if needed):
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   ```

## Production Deployment

### Before Going Live

1. **Generate strong API key** with rate limiting (if available)
2. **Set environment variables** on your hosting platform:
   - Vercel: Settings → Environment Variables
   - Netlify: Build & Deploy → Environment
   - Other platforms: Set via dashboard or `.env` file
3. **Test thoroughly** with various questions
4. **Monitor API usage** to avoid unexpected costs
5. **Consider rate limiting** on backend if needed

### Environment Variables

```env
# Production
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

## Performance Tips

1. **Message History** - Clear old messages on new sessions (optional improvement)
2. **Caching** - Consider adding browser caching for common questions
3. **Rate Limiting** - Implement backend rate limiting if needed
4. **Analytics** - Log chat metrics to understand user questions

## Future Enhancements

- [ ] Persist chat history to database
- [ ] User authentication for personalized responses
- [ ] Analytics dashboard for common questions
- [ ] Multi-language support
- [ ] Integration with order/product API for real-time info
- [ ] Admin panel to manage chatbot responses
- [ ] Feedback system (helpful/not helpful)

## Support

For issues or questions:

- Check `.env.local` configuration
- Review browser console for errors
- Check server logs in terminal
- Contact Groq support for API issues
- Email: support@farmdirect.in

## Security Notes

✅ **API Key Protection**

- Never commit `.env.local` to git
- Use `.gitignore` to exclude environment files
- Rotate keys periodically
- Use environment variables on production

✅ **Data Privacy**

- Chat messages are sent to Groq's servers
- Follow Groq's privacy policy
- Consider GDPR/data residency requirements

✅ **Rate Limiting**

- Groq may have rate limits on free tier
- Implement frontend debouncing if needed
- Consider backend rate limiting

## License

This chatbot feature is part of FarmDirect and follows the same MIT License.

---

**Chatbot Version:** 1.0  
**Last Updated:** 2026-05-14  
**Created for:** FarmDirect AI Support

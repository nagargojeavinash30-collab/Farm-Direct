import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const SYSTEM_PROMPT = `You are FarmDirect AI Assistant, a helpful customer support bot for FarmDirect - a marketplace connecting farmers directly with buyers.

PLATFORM INFORMATION:
- FarmDirect eliminates middlemen between farmers and buyers
- Users can be: Farmers (sellers), Buyers (consumers/wholesalers), or Admins
- Farmers can list agricultural products with images, prices, quantities, and locations
- Buyers can search, filter, and purchase products from farmers
- Payment methods: UPI, Card, Cash on Delivery

PRODUCT CATEGORIES:
- Vegetables, Fruits, Grains, Dairy, Spices, Oils, Honey, Organic products

KEY FEATURES:
- Product marketplace with search and filters (category, price, location)
- Shopping cart and checkout system
- Order tracking and management
- Admin dashboard for analytics
- Multi-language ready (English, Hindi, Marathi)
- Responsive mobile-first design

COMMON QUESTIONS:
Q: How do I register as a farmer?
A: Click "Register" → Select "Farmer" role → Fill farm details (farm name, size, crops grown) → Complete registration

Q: How do I purchase products?
A: Browse marketplace → Filter by category/price/location → Add to cart → Checkout → Select payment method → Confirm

Q: What are the payment options?
A: UPI, Credit/Debit Card, and Cash on Delivery (COD)

Q: Can I track my order?
A: Yes, go to Dashboard → View order history → Click on order to see status (Pending → Confirmed → Shipped → Delivered)

Q: How do I list my products as a farmer?
A: Dashboard → Add Product → Fill details (name, description, price, quantity, images, location) → Publish

Q: What's the minimum order quantity?
A: Farmers can set their own minimum order quantity per product

Q: Is my data secure?
A: Yes, passwords are hashed with bcryptjs, authentication uses JWT tokens

Be friendly, concise, and helpful. If asked about something outside FarmDirect, politely redirect to platform-related help.
Direct technical issues to support@farmdirect.in`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST (request: NextRequest) {
  try {
    console.log('[Chat API] Starting request...')

    if (!GROQ_API_KEY) {
      console.error('[Chat API] GROQ_API_KEY not set')
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured' },
        { status: 500 }
      )
    }

    console.log('[Chat API] API Key present:', GROQ_API_KEY.substring(0, 10) + '...')

    const { messages } = (await request.json()) as { messages: Message[] }

    if (!messages || !Array.isArray(messages)) {
      console.error('[Chat API] Invalid messages format')
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    console.log('[Chat API] Sending to Groq with', messages.length, 'messages')

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 512,
        temperature: 0.7
      })
    })

    console.log('[Chat API] Groq response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Chat API] Groq error response:', errorText)
      try {
        const error = JSON.parse(errorText)
        console.error('[Chat API] Parsed error:', error)
        return NextResponse.json(
          { error: error.error?.message || 'Failed to generate response' },
          { status: 500 }
        )
      } catch {
        return NextResponse.json(
          { error: `Groq API error: ${response.status} - ${errorText}` },
          { status: 500 }
        )
      }
    }

    const data = await response.json()
    console.log('[Chat API] Success, got response')
    const assistantMessage = data.choices[0].message.content

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('[Chat API] Exception:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: `Internal error: ${errorMsg}` },
      { status: 500 }
    )
  }
}

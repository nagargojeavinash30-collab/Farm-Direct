import { NextRequest } from 'next/server'
import { APIResponse } from '@/lib/response'
import { verifyToken } from '@/lib/auth'

export async function POST (request: NextRequest) {
  try {
    // Verify token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return APIResponse.unauthorized()
    }

    const token = authHeader.slice(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return APIResponse.unauthorized()
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return APIResponse.validationError('No file provided')
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return APIResponse.error('File must be an image', 400)
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return APIResponse.error('File size must be less than 5MB', 400)
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    return APIResponse.success({ url: dataUrl }, 'Image uploaded successfully')
  } catch (error: any) {
    console.error('Error uploading image:', error)
    return APIResponse.error(error.message || 'Error uploading image', 500)
  }
}

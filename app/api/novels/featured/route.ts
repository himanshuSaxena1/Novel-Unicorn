import { NextResponse } from 'next/server'
import { NovelAPI } from '@/lib/api'

export async function GET() {
  try {
    const novels = await NovelAPI.getFeaturedNovels(8)
    return NextResponse.json(novels)
  } catch (error) {
    console.error('Error fetching featured novels:', error)
    return NextResponse.json({ error: 'Failed to fetch featured novels' }, { status: 500 })
  }
}
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from 'next/server'
import { NovelAPI } from '@/lib/api'

export async function GET() {
  try {
    const novels = await NovelAPI.getTrendingNovels(10)
    return NextResponse.json(novels)
  } catch (error) {
    console.error('Error fetching trending novels:', error)
    return NextResponse.json({ error: 'Failed to fetch trending novels' }, { status: 500 })
  }
}
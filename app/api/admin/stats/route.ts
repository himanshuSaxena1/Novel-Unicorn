export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminAPI } from '@/lib/api'
import { canAccessAdminPanel } from '@/lib/permissions'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
   if (
      !session?.user ||
      !canAccessAdminPanel(
        session.user.role as "USER" | "AUTHOR" | "TRANSLATOR" | "EDITOR" | "MODERATOR" | "ADMIN"
      )
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await AdminAPI.getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
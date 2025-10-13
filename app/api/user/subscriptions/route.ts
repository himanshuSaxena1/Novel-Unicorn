export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SubscriptionAPI } from '@/lib/api'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscriptions = await SubscriptionAPI.getUserSubscriptions(session.user.id)
    const highestTier = await SubscriptionAPI.getHighestUserTier(session.user.id)
    
    return NextResponse.json({
      subscriptions,
      highestTier
    })
  } catch (error) {
    console.error('Error fetching user subscriptions:', error)
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  }
}
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['Access to free chapters', 'Basic reading features'],
    maxChapters: 5
  },
  SMALL: {
    name: 'Small',
    price: 4.99,
    features: ['Access to small tier chapters', 'Ad-free reading', 'Bookmarks'],
    maxChapters: 50
  },
  MEDIUM: {
    name: 'Medium', 
    price: 9.99,
    features: ['Access to medium tier chapters', 'Early chapter access', 'Reading statistics'],
    maxChapters: 200
  },
  PREMIUM: {
    name: 'Premium',
    price: 19.99,
    features: ['Access to all chapters', 'Premium content', 'Author interaction', 'Unlimited bookmarks'],
    maxChapters: -1 // unlimited
  }
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS

export function hasAccessToTier(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  const tierOrder = ['FREE', 'SMALL', 'MEDIUM', 'PREMIUM']
  const userIndex = tierOrder.indexOf(userTier)
  const requiredIndex = tierOrder.indexOf(requiredTier)
  
  return userIndex >= requiredIndex
}
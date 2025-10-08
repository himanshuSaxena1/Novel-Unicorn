'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SubscriptionCard from '@/components/SubscriptionCard'
import { Crown, Check, X, Star, Zap, Gift } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription'

const FEATURES_COMPARISON = [
  { feature: 'Free Chapters', free: true, small: true, medium: true, premium: true },
  { feature: 'Ad-free Reading', free: false, small: true, medium: true, premium: true },
  { feature: 'Bookmarks', free: '5', small: '50', medium: '200', premium: 'Unlimited' },
  { feature: 'Early Access', free: false, small: '1 day', medium: '3 days', premium: '7 days' },
  { feature: 'Premium Chapters', free: false, small: false, medium: true, premium: true },
  { feature: 'Author Interaction', free: false, small: false, medium: false, premium: true },
  { feature: 'Reading Statistics', free: false, small: false, medium: true, premium: true },
  { feature: 'Custom Themes', free: false, small: false, medium: false, premium: true },
  { feature: 'Offline Reading', free: false, small: false, medium: false, premium: true },
]

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState<keyof typeof SUBSCRIPTION_PLANS>('FREE')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const handleSubscribe = (tier: keyof typeof SUBSCRIPTION_PLANS) => {
    // TODO: Integrate with payment processor
    console.log(`Subscribing to ${tier}`)
  }

  const getDiscountedPrice = (price: number) => {
    return billingCycle === 'yearly' ? price * 10 : price // 2 months free on yearly
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Unlock Premium Reading Experience
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your reading journey. Access exclusive content, early releases, and premium features.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 p-1 bg-muted rounded-lg max-w-xs mx-auto">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                billingCycle === 'yearly' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>Yearly</span>
              <Badge variant="secondary" className="text-xs">Save 20%</Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {(Object.keys(SUBSCRIPTION_PLANS) as Array<keyof typeof SUBSCRIPTION_PLANS>).map((tier) => (
              <div key={tier} className="relative">
                <SubscriptionCard
                  tier={tier}
                  isCurrentPlan={currentPlan === tier}
                  onSubscribe={handleSubscribe}
                />
                {billingCycle === 'yearly' && tier !== 'FREE' && (
                  <div className="absolute -top-2 right-2">
                    <Badge variant="destructive" className="text-xs">
                      20% OFF
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="comparison">Feature Comparison</TabsTrigger>
              <TabsTrigger value="benefits">Premium Benefits</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="comparison" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Comparison</CardTitle>
                  <CardDescription>
                    Compare what's included in each subscription plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 font-medium">Features</th>
                          <th className="text-center py-3 font-medium">Free</th>
                          <th className="text-center py-3 font-medium">Small</th>
                          <th className="text-center py-3 font-medium">Medium</th>
                          <th className="text-center py-3 font-medium">Premium</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FEATURES_COMPARISON.map((row, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 font-medium">{row.feature}</td>
                            <td className="text-center py-3">
                              {typeof row.free === 'boolean' ? (
                                row.free ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-500 mx-auto" />
                              ) : row.free}
                            </td>
                            <td className="text-center py-3">
                              {typeof row.small === 'boolean' ? (
                                row.small ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-500 mx-auto" />
                              ) : row.small}
                            </td>
                            <td className="text-center py-3">
                              {typeof row.medium === 'boolean' ? (
                                row.medium ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-500 mx-auto" />
                              ) : row.medium}
                            </td>
                            <td className="text-center py-3">
                              {typeof row.premium === 'boolean' ? (
                                row.premium ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-500 mx-auto" />
                              ) : row.premium}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <Star className="h-8 w-8 text-yellow-500 mb-2" />
                    <CardTitle>Exclusive Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Access premium novels and chapters available only to subscribers. Discover hidden gems from top authors.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Zap className="h-8 w-8 text-blue-500 mb-2" />
                    <CardTitle>Early Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Read new chapters before anyone else. Get up to 7 days early access with Premium subscription.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Gift className="h-8 w-8 text-green-500 mb-2" />
                    <CardTitle>Ad-Free Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Enjoy uninterrupted reading with no ads. Focus on the stories that matter to you.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Can I change my subscription plan?</h4>
                    <p className="text-muted-foreground">
                      Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What happens if I cancel my subscription?</h4>
                    <p className="text-muted-foreground">
                      You'll keep access to premium features until your current billing period ends. After that, you'll revert to the free plan.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
                    <p className="text-muted-foreground">
                      We offer a 7-day money-back guarantee for new subscribers. Contact support for assistance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto text-center text-white">
          <div className="space-y-6 max-w-2xl mx-auto">
            <Crown className="h-16 w-16 mx-auto" />
            <h2 className="text-3xl font-bold">Ready to Start Your Premium Journey?</h2>
            <p className="text-xl opacity-90">
              Join thousands of readers who have unlocked the full potential of our platform
            </p>
            <Button size="lg" variant="secondary" onClick={() => handleSubscribe('PREMIUM')}>
              Start Premium Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
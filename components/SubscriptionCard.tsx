import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Crown } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription'

interface SubscriptionCardProps {
  tier: keyof typeof SUBSCRIPTION_PLANS
  isCurrentPlan?: boolean
  onSubscribe?: (tier: keyof typeof SUBSCRIPTION_PLANS) => void
}

export default function SubscriptionCard({ tier, isCurrentPlan = false, onSubscribe }: SubscriptionCardProps) {
  const plan = SUBSCRIPTION_PLANS[tier]
  
  return (
    <Card className={`relative ${tier === 'PREMIUM' ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
      {tier === 'PREMIUM' && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            <Crown className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2">
          <span>{plan.name}</span>
          {isCurrentPlan && <Badge variant="secondary">Current</Badge>}
        </CardTitle>
        <div className="space-y-1">
          <div className="text-3xl font-bold">
            ${plan.price}
            {plan.price > 0 && <span className="text-lg font-normal text-muted-foreground">/month</span>}
          </div>
          {plan.price === 0 && (
            <CardDescription>Perfect for getting started</CardDescription>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            Chapter Access: {plan.maxChapters === -1 ? 'Unlimited' : `Up to ${plan.maxChapters}`}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isCurrentPlan ? "outline" : (tier === 'PREMIUM' ? "default" : "outline")}
          onClick={() => !isCurrentPlan && onSubscribe?.(tier)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : `Subscribe to ${plan.name}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
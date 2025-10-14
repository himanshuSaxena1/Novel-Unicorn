'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Save, Settings, Crown, Palette } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('subscription')

  // Subscription Plans Management
  const { data: subscriptionPlans = [] } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const response = await fetch('/api/subscription/plans')
      if (!response.ok) throw new Error('Failed to fetch subscription plans')
      return response.json()
    }
  })

  const updatePlanMutation = useMutation({
    mutationFn: async (plan: any) => {
      const response = await fetch(`/api/subscription/plans/${plan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      })
      if (!response.ok) throw new Error('Failed to update plan')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      toast.success('Plan updated successfully')
    },
    onError: () => {
      toast.error('Failed to update plan')
    }
  })

  const createPlanMutation = useMutation({
    mutationFn: async (plan: any) => {
      const response = await fetch('/api/subscription/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      })
      if (!response.ok) throw new Error('Failed to create plan')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      toast.success('Plan created successfully')
    },
    onError: () => {
      toast.error('Failed to create plan')
    }
  })

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await fetch(`/api/subscription/plans/${planId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete plan')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      toast.success('Plan deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete plan')
    }
  })

  const [newPlan, setNewPlan] = useState({
    name: '',
    tier: 'SMALL',
    price: 0,
    yearlyPrice: 0,
    features: [''],
    maxChapters: 50,
    description: '',
    color: '#3B82F6',
    isPopular: false,
    discount: 0
  })

  const addFeature = () => {
    setNewPlan(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const removeFeature = (index: number) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleCreatePlan = () => {
    const validFeatures = newPlan.features.filter(f => f.trim() !== '')
    createPlanMutation.mutate({
      ...newPlan,
      features: validFeatures
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Settings className="mr-3 h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your platform settings and configurations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="payment">Payment Settings</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-6">
          {/* Existing Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>
                Manage your subscription tiers, pricing, and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subscriptionPlans.map((plan: any) => (
                  <Card key={plan.id} className="relative">
                    {plan.isPopular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary">
                          <Crown className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge variant="outline">{plan.tier}</Badge>
                      </div>
                      <div className="text-2xl font-bold">
                        ${plan.price}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                      {plan.yearlyPrice && (
                        <div className="text-sm text-muted-foreground">
                          ${plan.yearlyPrice}/year (Save {Math.round((1 - plan.yearlyPrice / (plan.price * 12)) * 100)}%)
                        </div>
                      )}
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Features</Label>
                        <div className="space-y-1">
                          {plan.features.map((feature: string, index: number) => (
                            <div key={index} className="text-sm text-muted-foreground">
                              • {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Max Chapters:</span>
                        <span>{plan.maxChapters === -1 ? 'Unlimited' : plan.maxChapters}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={plan.isActive}
                          onCheckedChange={(checked) => 
                            updatePlanMutation.mutate({ ...plan, isActive: checked })
                          }
                        />
                        <Label>Active</Label>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deletePlanMutation.mutate(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create New Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Plan</CardTitle>
              <CardDescription>
                Add a new subscription tier to your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Premium"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plan-tier">Tier</Label>
                  <Select
                    value={newPlan.tier}
                    onValueChange={(value) => setNewPlan(prev => ({ ...prev, tier: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMALL">Small</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plan-price">Monthly Price ($)</Label>
                  <Input
                    id="plan-price"
                    type="number"
                    step="0.01"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plan-yearly-price">Yearly Price ($)</Label>
                  <Input
                    id="plan-yearly-price"
                    type="number"
                    step="0.01"
                    value={newPlan.yearlyPrice}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, yearlyPrice: parseFloat(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plan-chapters">Max Chapters (-1 for unlimited)</Label>
                  <Input
                    id="plan-chapters"
                    type="number"
                    value={newPlan.maxChapters}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, maxChapters: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plan-discount">Discount (%)</Label>
                  <Input
                    id="plan-discount"
                    type="number"
                    step="0.01"
                    value={newPlan.discount}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, discount: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-description">Description</Label>
                <Textarea
                  id="plan-description"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the plan"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Features</Label>
                <div className="space-y-2">
                  {newPlan.features.map((feature, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Enter feature"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newPlan.isPopular}
                    onCheckedChange={(checked) => setNewPlan(prev => ({ ...prev, isPopular: checked }))}
                  />
                  <Label>Mark as Popular</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="plan-color">Color:</Label>
                  <Input
                    id="plan-color"
                    type="color"
                    value={newPlan.color}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, color: e.target.value }))}
                    className="w-16 h-8"
                  />
                </div>
              </div>
              
              <Button onClick={handleCreatePlan} disabled={createPlanMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {createPlanMutation.isPending ? 'Creating...' : 'Create Plan'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Configuration</CardTitle>
              <CardDescription>
                Configure your site&apos;s basic information and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" defaultValue="NovelHub" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input id="site-url" defaultValue="https://novelhub.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  defaultValue="Discover amazing stories from talented authors worldwide"
                />
              </div>
              
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Configure PayPal and other payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
                <Input id="paypal-client-id" placeholder="Enter PayPal Client ID" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paypal-client-secret">PayPal Client Secret</Label>
                <Input id="paypal-client-secret" type="password" placeholder="Enter PayPal Client Secret" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="paypal-sandbox" />
                <Label htmlFor="paypal-sandbox">Use PayPal Sandbox (Testing)</Label>
              </div>
              
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input id="primary-color" type="color" defaultValue="#3B82F6" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <Input id="secondary-color" type="color" defaultValue="#10B981" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="dark-mode-default" />
                <Label htmlFor="dark-mode-default">Enable Dark Mode by Default</Label>
              </div>
              
              <Button>
                <Palette className="h-4 w-4 mr-2" />
                Save Appearance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
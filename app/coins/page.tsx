'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Sparkles, Zap, Crown, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PACKAGES, type Package } from '@/lib/utils'

const FAQ_ITEMS = [
  {
    id: 'refund',
    question: 'Are coins refundable?',
    answer: 'Coins are non-refundable once purchased. We recommend carefully selecting your package before completing the transaction. If you experience any issues, please contact our support team.',
  },
  {
    id: 'instant',
    question: 'How long does it take to receive coins?',
    answer: 'Coins are credited instantly to your account after successful payment. You can start using them immediately to unlock premium chapters in our library.',
  },
  {
    id: 'usage',
    question: 'What can I use coins for?',
    answer: 'Coins can be used to unlock premium chapters in our reading library. Each chapter costs a specific number of coins depending on its length and exclusivity.',
  },
  {
    id: 'expire',
    question: 'Do coins expire?',
    answer: 'No, your coins never expire. Once purchased, they remain in your account indefinitely until you choose to use them.',
  },
  {
    id: 'support',
    question: 'Need additional help?',
    answer: 'Contact our support team at support@ourplatform.com or visit our help center for more information about coin packages and account management.',
  },
]

export default function CoinsPage() {
  const [selected, setSelected] = useState<Package | null>(null)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false)

  const createOrder = async (pkg: Package) => {
    setSelected(pkg)
    setCreatingOrder(true)
    try {
      const res = await fetch('/api/coins/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')
      setOrderId(data.orderId)
      loadPayPalSdk()
    } catch (err: any) {
      toast.error(err?.message || 'Failed')
    } finally {
      setCreatingOrder(false)
    }
  }

  const loadPayPalSdk = () => {
    if ((window as any).paypal) {
      setIsPayPalLoaded(true)
      return
    }
    const src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onerror = () => toast.error('Failed to load PayPal SDK')
    script.onload = () => setIsPayPalLoaded(true)
    document.body.appendChild(script)
  }

  useEffect(() => {
    if (isPayPalLoaded && orderId && selected) {
      renderButtons()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPayPalLoaded, orderId, selected])

  const renderButtons = () => {
    const paypal = (window as any).paypal
    if (!paypal || !orderId || !selected) return

    const container = document.getElementById(`paypal-buttons-${selected.id}`)
    if (container) {
      container.innerHTML = ''
    }

    paypal
      .Buttons({
        createOrder: () => orderId,
        onApprove: async (data: any) => {
          try {
            const res = await fetch('/api/coins/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID }),
            })
            const result = await res.json()
            if (!res.ok) throw new Error(result.error || 'Capture failed')
            toast.success(`Credited ${result.coinsGranted} coins!`)
            setOrderId(null)
            setSelected(null)
            window.location.reload()
          } catch (err: any) {
            toast.error(err?.message || 'Purchase failed')
          }
        },
        onError: (err: any) => {
          console.error('PayPal Buttons error', err)
          toast.error('PayPal error')
        },
        onCancel: () => {
          setOrderId(null)
          setSelected(null)
        },
      })
      .render(`#paypal-buttons-${selected.id}`)
  }

  return (
    <main className="min-h-screen dark:bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-10 sm:py-14 lg:py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-cyan-800" />
              <span className="text-sm font-semibold text-cyan-800">Premium Coins</span>
            </div>

            <h1 className="bg-gradient-to-r from-white/40 via-slate-500 to-slate-700 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl">
              Unlock Premium Content
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              Purchase coin packages to access exclusive chapters and premium reading experiences. Secure PayPal checkout, instant delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="relative px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PACKAGES.map((pkg, index) => {
              const paypalContainerId = `paypal-buttons-${pkg.id}`
              const isThisSelected = selected?.id === pkg.id
              const isPopular = index === 1
              const mostBeneficial = index === 2
              const goldBadge = index === 3

              return (
                <Card
                  key={pkg.id}
                  className={cn(
                    'relative flex flex-col overflow-hidden border transition-all duration-300 p-0',
                    isThisSelected
                      ? 'border-cyan-500 bg-slate-800/80 shadow-2xl shadow-cyan-500/20 scale-105'
                      : mostBeneficial
                        ? 'border-blue-500/50 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg shadow-blue-500/10'
                        : isPopular
                          ? 'border-cyan-500/50 bg-slate-800/50 shadow-lg'
                          : goldBadge
                            ? 'border-yellow-500/50 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg shadow-blue-500/10 text-white'
                            : 'border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60'

                  )}
                >
                  {mostBeneficial && (
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                  )}
                  {mostBeneficial && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-xs font-bold text-white">
                      <Crown className="h-3 w-3" />
                      Best Value
                    </span>
                  )}
                  {isPopular && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 px-3 py-1 text-xs font-bold text-white">
                      <Zap className="h-3 w-3" />
                      Popular
                    </span>
                  )}

                  <CardHeader className="space-y-3 pb-4">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-gradient-to-br from-yellow-500/20 to-blue-500/20 p-3">
                        <Sparkles className="h-8 w-8 text-yellow-500" />
                      </div>
                    </div>

                    <div>
                      <CardTitle className="text-center text-xl font-bold text-white">
                        {pkg.name}
                      </CardTitle>
                      {pkg.subtitle && (
                        <p className="mt-2 text-center text-xs dark:text-slate-400">
                          {pkg.subtitle}
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4 pb-4">
                    <div className="flex items-end justify-center gap-2 rounded-lg bg-slate-900/50 p-4">
                      <div>
                        <p className="text-3xl font-bold text-white">
                          {pkg.coins.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400">coins</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">
                          ${pkg.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">one-time</p>
                      </div>
                    </div>

                    {pkg.description && (
                      <p className="text-center text-sm text-white dark:text-slate-400 line-clamp-2">
                        {pkg.description}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-col gap-3 p-1.5">
                    <Button
                      onClick={() => createOrder(pkg)}
                      disabled={creatingOrder || !!orderId}
                      className={`w-full  ${goldBadge ? 'border-yellow-500/50 bg-gradient-to-br from-orange-500 to-yellow-500 hover:shadow-lg hover:shadow-yellow-500/50 text-white' : 'bg-gradient-to-r from-cyan-600 to-blue-700 font-semibold text-white hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50'}`}
                    >
                      {creatingOrder && isThisSelected ? 'Processing...' : 'Get Coins'}
                    </Button>

                    {orderId && isThisSelected && (
                      <div
                        id={paypalContainerId}
                        className="mt-2 w-full flex justify-center"
                      />
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-slate-500">
              Everything you need to know about coins and purchases
            </p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-6 backdrop-blur-sm">
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-slate-700 py-4"
                >
                  <AccordionTrigger className="hover:text-cyan-400 text-left text-white">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
                      <span className="font-semibold">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="dark:text-slate-300">
                    <div className="ml-8 text-sm leading-relaxed">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  )
}

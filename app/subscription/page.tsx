'use client'

import React, { useState } from 'react'
import { determineCoinsForAmount } from '@/lib/coins'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Modal, ModalContent } from '@/components/ui/modal'
import { Coins, CheckCircle } from 'lucide-react'

type Package = {
  id: string
  name: string
  price: number
  coins: number
  subtitle?: string
  description?: string
}

const PACKAGES: Package[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    price: 9.99,
    coins: 1000,
    subtitle: 'Great for Starters',
    description: 'Perfect for new users to explore premium chapters and unlock basic content.',
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 29.99,
    coins: 3000,
    subtitle: 'Perfect for Regulars',
    description: 'Ideal for frequent readers to enjoy a variety of premium stories and features.',
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 49.99,
    coins: 5100,
    subtitle: 'Ideal for Enthusiasts',
    description: 'Great for avid readers who want extended access to exclusive content and bonuses.',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 99.99,
    coins: 11000,
    subtitle: 'Ultimate Experience',
    description: 'The best choice for power users with unlimited access to all premium content and perks.',
  },
]

export default function CoinsPage() {
  const [selected, setSelected] = useState<Package | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const openModal = (pkg: Package) => {
    setSelected(pkg)
    setModalOpen(true)
  }

  const createOrder = async (pkg: Package) => {
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
      toast.error(err.message || 'Failed')
      setModalOpen(false)
    } finally {
      setCreatingOrder(false)
    }
  }

  const loadPayPalSdk = () => {
    if ((window as any).paypal) return
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`
    script.async = true
    script.onload = () => {
      renderButtons()
    }
    document.body.appendChild(script)
  }

  const renderButtons = () => {
    const paypal = (window as any).paypal
    if (!paypal || !orderId) return
    paypal.Buttons({
      createOrder: () => orderId,
      onApprove: async (data: any, actions: any) => {
        try {
          const res = await fetch('/api/coins/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID }),
          })
          const result = await res.json()
          if (!res.ok) throw new Error(result.error || 'Capture failed')
          toast.success(`Credited ${result.coinsGranted} coins!`, {
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          })
          setModalOpen(false)
          window.location.reload()
        } catch (err: any) {
          toast.error(err.message || 'Purchase failed')
        }
      },
      onError: (err: any) => {
        console.error('PayPal Buttons error', err)
        toast.error('PayPal error')
      },
    }).render('#paypal-buttons')
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" data-theme="light" id="theme-root">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Buy Coins</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Unlock premium content and enhance your reading experience with our coin packages!
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-center mb-4">
                <Coins className="h-12 w-12 text-yellow-500 dark:text-yellow-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-2">{pkg.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">{pkg.subtitle}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">${pkg.price.toFixed(2)}</p>
              <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-6">{pkg.coins.toLocaleString()} Coins</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">{pkg.description}</p>
              <Button
                onClick={() => openModal(pkg)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700 dark:hover:from-yellow-700 dark:hover:to-orange-700 transition-colors"
              >
                Buy Now
              </Button>
            </div>
          ))}
        </div>

        {isModalOpen && selected && (
          <Modal open={isModalOpen} onOpenChange={() => setModalOpen(false)}>
            <ModalContent className="max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">Confirm Purchase</h3>
                <div className="text-center space-y-2">
                  <p className="text-xl text-gray-700 dark:text-gray-300">{selected.name} Package</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${selected.price.toFixed(2)}</p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">{selected.coins.toLocaleString()} Coins</p>
                </div>
                <div>
                  <Button
                    onClick={() => createOrder(selected)}
                    disabled={creatingOrder}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 text-white hover:from-green-600 hover:to-teal-700 dark:hover:from-green-700 dark:hover:to-teal-700 transition-colors"
                  >
                    {creatingOrder ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 inline-block text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `Pay $${selected.price.toFixed(2)}`
                    )}
                  </Button>
                </div>
                <div id="paypal-buttons" className="mt-4" />
              </div>
            </ModalContent>
          </Modal>
        )}
      </div>
    </div>
  )
}
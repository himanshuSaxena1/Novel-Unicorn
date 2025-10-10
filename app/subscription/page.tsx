'use client'

import React, { useState } from 'react'
import { determineCoinsForAmount } from '@/lib/coins' // client copy or call API to compute
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Modal, ModalContent } from '@/components/ui/modal'

type Package = {
  id: string
  name: string
  price: number
  coins: number
  subtitle?: string
}

const PACKAGES: Package[] = [
  { id: 'bronze', name: 'Bronze', price: 9.99, coins: 1000 },
  { id: 'silver', name: 'Silver', price: 29.99, coins: 3200 },
  { id: 'gold', name: 'Gold', price: 49.99, coins: 5500 },
  { id: 'platinum', name: 'Platinum', price: 99.99, coins: 12000 },
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
        body: JSON.stringify({ packageId: pkg.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')
      setOrderId(data.orderId)
      // Load PayPal Buttons dynamically (client-side)
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
      createOrder: () => orderId, // we already created order server-side
      onApprove: async (data: any, actions: any) => {
        // Capture server-side
        try {
          const res = await fetch('/api/coins/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID })
          })
          const result = await res.json()
          if (!res.ok) throw new Error(result.error || 'Capture failed')
          toast.success(`Credited ${result.coinsGranted} coins!`)
          setModalOpen(false)
          // Optionally refresh user session / profile to update coin balance
          window.location.reload()
        } catch (err: any) {
          toast.error(err.message || 'Purchase failed')
        }
      },
      onError: (err: any) => {
        console.error('PayPal Buttons error', err)
        toast.error('PayPal error')
      }
    }).render('#paypal-buttons')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Buy Coins</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="p-6 border rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">{pkg.name}</h2>
            <p className="text-3xl font-bold">${pkg.price.toFixed(2)}</p>
            <p>{pkg.coins.toLocaleString()} coins</p>
            <Button onClick={() => openModal(pkg)}>Buy</Button>
          </div>
        ))}
      </div>

      {isModalOpen && selected && (
        <Modal open={isModalOpen} onOpenChange={() => setModalOpen(false)}>
          <ModalContent>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Buy {selected.name}</h3>
              <p>${selected.price.toFixed(2)} — {selected.coins.toLocaleString()} coins</p>
              <div>
                <Button
                  onClick={() => createOrder(selected)}
                  disabled={creatingOrder}
                >
                  {creatingOrder ? 'Processing...' : `Pay $${selected.price.toFixed(2)}`}
                </Button>
              </div>

              {/* PayPal buttons mount point */}
              <div id="paypal-buttons" />
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}

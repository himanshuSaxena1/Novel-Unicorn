"use client"

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CoinsIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { PACKAGES, type Package } from "@/lib/utils"

export default function CoinsPage() {
  const [selected, setSelected] = useState<Package | null>(null)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false)

  const createOrder = async (pkg: Package) => {
    setSelected(pkg)
    setCreatingOrder(true)
    try {
      const res = await fetch("/api/coins/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create order")
      setOrderId(data.orderId)
      loadPayPalSdk()
    } catch (err: any) {
      toast.error(err?.message || "Failed")
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
    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.onerror = () => toast.error("Failed to load PayPal SDK")
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

    // Clean up any previous render in case of re-renders
    const container = document.getElementById(`paypal-buttons-${selected.id}`)
    if (container) {
      container.innerHTML = ""
    }

    paypal
      .Buttons({
        // Use the server-created order id
        createOrder: () => orderId,
        onApprove: async (data: any) => {
          try {
            const res = await fetch("/api/coins/capture", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            })
            const result = await res.json()
            if (!res.ok) throw new Error(result.error || "Capture failed")
            toast.success(`Credited ${result.coinsGranted} coins!`)
            setOrderId(null)
            setSelected(null)
            window.location.reload() // Consider useSession().update() instead to avoid reloads
          } catch (err: any) {
            toast.error(err?.message || "Purchase failed")
          }
        },
        onError: (err: any) => {
          console.error("PayPal Buttons error", err)
          toast.error("PayPal error")
        },
        onCancel: () => {
          setOrderId(null)
          setSelected(null)
        },
      })
      .render(`#paypal-buttons-${selected.id}`)
  }

  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-background to-muted/40">
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <header className="mb-12 text-center">
          <div className="mx-auto mb-4 inline-flex items-center rounded-full bg-yellow-100 px-4 py-1.5 text-xs font-semibold text-yellow-700">
            <CoinsIcon className="mr-1.5 h-4 w-4" />
            Buy Coins
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Unlock premium chapters instantly
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Pick a coin bundle that fits your reading style. Secure checkout with PayPal.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg, index) => {
            const paypalContainerId = `paypal-buttons-${pkg.id}`
            const isThisSelected = selected?.id === pkg.id
            const isPopular = index === 1 
            const mostBeneficial = index === 2

            return (
              <Card
                key={pkg.id}
                className={cn(
                  "relative flex flex-col justify-between overflow-hidden transition-all duration-300 p-0",
                  isThisSelected
                    ? "ring-2 ring-yellow-500 shadow-lg scale-[1.02]"
                    : "hover:shadow-xl hover:-translate-y-1"
                )}
              >
                {mostBeneficial && (
                  <span className="absolute right-3 top-3 rounded-full text-black bg-yellow-500 px-2 py-0.5 text-[12px] font-semibold ">
                    Best Value
                  </span>
                )}
                {isPopular && (
                  <span className="absolute right-3 top-3 rounded-full text-black bg-yellow-500 px-2 py-0.5 text-[12px] font-semibold ">
                    Most Popular
                  </span>
                )}

                <CardHeader className="space-y-2 pt-6 p-3">
                  <CoinsIcon className="mx-auto h-12 w-12 text-yellow-500" />

                  <CardTitle className="text-center text-lg font-semibold">
                    {pkg.name}
                  </CardTitle>

                  {pkg.subtitle && (
                    <p className="text-center text-xs font-medium text-muted-foreground">
                      {pkg.subtitle}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4 p-2">
                  <div className="text-center flex items-end justify-center gap-3">
                    <div>
                      <p className="text-lg font-bold">${pkg.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Pay only</p>
                    </div>

                    <div>
                      <p className="mt-2 text-3xl font-extrabold text-yellow-500">
                        {pkg.coins.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">coins</p>
                    </div>
                  </div>

                  {pkg.description && (
                    <p className="text-center text-sm text-muted-foreground line-clamp-3">
                      {pkg.description}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pb-6">
                  <Button
                    onClick={() => createOrder(pkg)}
                    disabled={creatingOrder || !!orderId}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                  >
                    {creatingOrder && isThisSelected ? "Processing..." : "Buy Now"}
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
      </section>
    </main>

  )
}

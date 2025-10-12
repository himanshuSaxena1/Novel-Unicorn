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
    <main className="min-h-[70vh] bg-background">
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
        <header className="mb-10 text-center md:mb-14">
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <CoinsIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Buy Coins
          </div>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
            Unlock premium content with flexible coin packs
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:mt-4 md:text-base">
            Choose a package that fits your reading habit. Pay securely with PayPal.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg) => {
            const paypalContainerId = `paypal-buttons-${pkg.id}`
            const isThisSelected = selected?.id === pkg.id
            return (
              <Card
                key={pkg.id}
                className={cn(
                  "flex flex-col justify-between border-border bg-card text-card-foreground transition-shadow duration-200",
                  isThisSelected ? "ring-2 ring-primary" : "hover:shadow-md",
                )}
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-center">
                    <CoinsIcon className="h-10 w-10 text-yellow-600" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-center text-lg md:text-xl">{pkg.name}</CardTitle>
                  {pkg.subtitle ? (
                    <p className="text-center text-xs font-medium text-muted-foreground">{pkg.subtitle}</p>
                  ) : null}
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-center">
                    <p className="text-3xl font-semibold text-foreground md:text-4xl">${pkg.price.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{pkg.coins.toLocaleString()} coins</p>
                  </div>
                  {pkg.description ? (
                    <p className="line-clamp-2 text-center text-sm text-muted-foreground">{pkg.description}</p>
                  ) : null}
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  <Button onClick={() => createOrder(pkg)} disabled={creatingOrder || !!orderId} className="w-full bg-yellow-600 text-white">
                    {creatingOrder && isThisSelected ? "Processing..." : "Buy"}
                  </Button>

                  {orderId && isThisSelected ? (
                    <div id={paypalContainerId} className="mt-2 w-full flex justify-center" />
                  ) : null}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}

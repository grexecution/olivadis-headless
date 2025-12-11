'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatEUR } from '@/lib/utils/currency'

interface OrderDetails {
  id: number
  number: string
  status: string
  total: string
  currency: string
  date_created: string
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId)
    } else {
      setLoading(false)
      setError('No order ID provided')
    }
  }, [orderId])

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/checkout?order_id=${id}`)
      const data = await response.json()

      if (data.success && data.order) {
        setOrder(data.order)
      } else {
        setError(data.error || 'Failed to fetch order details')
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('An error occurred while fetching order details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-body text-primary">Bestelldetails werden geladen...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-h2 text-primary mb-4">Bestellung nicht gefunden</h1>
          <p className="text-body text-primary/60 mb-8">
            {error || 'Wir konnten Ihre Bestellung nicht finden. Bitte kontaktieren Sie den Support, wenn Sie Hilfe benötigen.'}
          </p>
          <Link href="/shop">
            <Button variant="primary">Weiter einkaufen</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-h2 text-primary mb-4">Bestellung bestätigt!</h1>
          <p className="text-body text-primary/60">
            Vielen Dank für Ihre Bestellung. Wir haben Ihre Bestellung erhalten und werden sie in Kürze bearbeiten.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-cream-light rounded-md p-8 border border-primary/10 mb-8">
          <h2 className="text-h3 text-primary mb-6">Bestelldetails</h2>

          <div className="space-y-4">
            <div className="flex justify-between text-body">
              <span className="text-primary/60">Bestellnummer</span>
              <span className="text-primary font-bold">#{order.number}</span>
            </div>

            <div className="flex justify-between text-body">
              <span className="text-primary/60">Bestellstatus</span>
              <span className="text-primary font-bold capitalize">{order.status}</span>
            </div>

            <div className="flex justify-between text-body">
              <span className="text-primary/60">Bestelldatum</span>
              <span className="text-primary font-bold">
                {new Date(order.date_created).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="border-t border-primary/10 pt-4 mt-4">
              <div className="flex justify-between text-h4 font-bold">
                <span className="text-primary">Gesamt</span>
                <span className="text-primary">
                  {formatEUR(parseFloat(order.total))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-md p-8 border border-primary/10 mb-8">
          <h2 className="text-h3 text-primary mb-4">Was kommt als Nächstes?</h2>
          <ul className="space-y-3 text-body text-primary/80">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Sie erhalten in Kürze eine Bestellbestätigungs-E-Mail</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Wir senden Ihnen Versandaktualisierungen, während Ihre Bestellung bearbeitet wird</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Sie können Ihren Bestellstatus in Ihrem Konto verfolgen</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Weiter einkaufen
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Meine Bestellungen ansehen
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Lade Bestelldetails...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

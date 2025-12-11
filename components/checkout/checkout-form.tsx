'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { WooCommerceAddress } from '@/types/woocommerce'
import { Country } from '@/lib/woocommerce/countries-taxes'

interface CheckoutFormProps {
  onSubmit: (billing: WooCommerceAddress, shipping: WooCommerceAddress) => void
  isLoading?: boolean
}

interface CheckoutFormData {
  billing: WooCommerceAddress
  shipping: WooCommerceAddress
  sameAsBilling: boolean
}

interface CheckoutFormComponentProps {
  formData: CheckoutFormData
  onFormDataChange: (data: CheckoutFormData) => void
  isLoading?: boolean
  shippableCountries: string[]
  countries: Country[]
}

export function CheckoutForm({ formData, onFormDataChange, isLoading = false, shippableCountries, countries }: CheckoutFormComponentProps) {
  const handleInputChange = (
    section: 'billing' | 'shipping',
    field: keyof WooCommerceAddress,
    value: string
  ) => {
    onFormDataChange({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    })
  }

  const setSameAsBilling = (value: boolean) => {
    onFormDataChange({
      ...formData,
      sameAsBilling: value,
    })
  }

  // Filter countries to only shippable ones
  const availableCountries = countries.filter(c => shippableCountries.includes(c.code))

  return (
    <div className="space-y-8">
      {/* Billing Information */}
      <div>
        <h3 className="text-h3 text-primary mb-6">Rechnungsinformationen</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billing_first_name" className="block text-body text-primary mb-2">
                Vorname *
              </label>
              <Input
                id="billing_first_name"
                type="text"
                required
                value={formData.billing.first_name}
                onChange={(e) => handleInputChange('billing', 'first_name', e.target.value)}
                placeholder="Max"
              />
            </div>
            <div>
              <label htmlFor="billing_last_name" className="block text-body text-primary mb-2">
                Nachname *
              </label>
              <Input
                id="billing_last_name"
                type="text"
                required
                value={formData.billing.last_name}
                onChange={(e) => handleInputChange('billing', 'last_name', e.target.value)}
                placeholder="Mustermann"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billing_email" className="block text-body text-primary mb-2">
                E-Mail *
              </label>
              <Input
                id="billing_email"
                type="email"
                required
                value={formData.billing.email}
                onChange={(e) => handleInputChange('billing', 'email', e.target.value)}
                placeholder="max.mustermann@beispiel.de"
              />
            </div>

            <div>
              <label htmlFor="billing_phone" className="block text-body text-primary mb-2">
                Telefon *
              </label>
              <Input
                id="billing_phone"
                type="tel"
                required
                value={formData.billing.phone}
                onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                placeholder="+43 123 456789"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billing_address_1" className="block text-body text-primary mb-2">
                Adresse *
              </label>
              <Input
                id="billing_address_1"
                type="text"
                required
                value={formData.billing.address_1}
                onChange={(e) => handleInputChange('billing', 'address_1', e.target.value)}
                placeholder="Straße und Hausnummer"
              />
            </div>

            <div>
              <label htmlFor="billing_address_2" className="block text-body text-primary mb-2">
                Adresszeile 2 (optional)
              </label>
              <Input
                id="billing_address_2"
                type="text"
                value={formData.billing.address_2}
                onChange={(e) => handleInputChange('billing', 'address_2', e.target.value)}
                placeholder="Wohnung, Stockwerk, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billing_city" className="block text-body text-primary mb-2">
                Stadt *
              </label>
              <Input
                id="billing_city"
                type="text"
                required
                value={formData.billing.city}
                onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                placeholder="Wien"
              />
            </div>
            <div>
              <label htmlFor="billing_postcode" className="block text-body text-primary mb-2">
                Postleitzahl *
              </label>
              <Input
                id="billing_postcode"
                type="text"
                required
                value={formData.billing.postcode}
                onChange={(e) => handleInputChange('billing', 'postcode', e.target.value)}
                placeholder="1010"
              />
            </div>
          </div>

          <div>
            <label htmlFor="billing_country" className="block text-body text-primary mb-2">
              Land *
            </label>
            <select
              id="billing_country"
              required
              value={formData.billing.country}
              onChange={(e) => handleInputChange('billing', 'country', e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-body text-primary-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {availableCountries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shipping Address Toggle */}
      <div className="border-t border-primary/10 pt-6">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={formData.sameAsBilling}
            onChange={(e) => setSameAsBilling(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-primary/30 text-primary bg-white checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 cursor-pointer transition-all duration-200 accent-primary"
          />
          <span className="text-body text-primary group-hover:text-primary-light transition-colors">
            Versandadresse ist identisch mit Rechnungsadresse
          </span>
        </label>
      </div>

      {/* Shipping Information */}
      {!formData.sameAsBilling && (
        <div>
          <h3 className="text-h3 text-primary mb-6">Versandinformationen</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="shipping_first_name" className="block text-body text-primary mb-2">
                  Vorname *
                </label>
                <Input
                  id="shipping_first_name"
                  type="text"
                  required
                  value={formData.shipping.first_name}
                  onChange={(e) => handleInputChange('shipping', 'first_name', e.target.value)}
                  placeholder="Max"
                />
              </div>
              <div>
                <label htmlFor="shipping_last_name" className="block text-body text-primary mb-2">
                  Nachname *
                </label>
                <Input
                  id="shipping_last_name"
                  type="text"
                  required
                  value={formData.shipping.last_name}
                  onChange={(e) => handleInputChange('shipping', 'last_name', e.target.value)}
                  placeholder="Mustermann"
                />
              </div>
            </div>

            <div>
              <label htmlFor="shipping_company" className="block text-body text-primary mb-2">
                Firma (optional)
              </label>
              <Input
                id="shipping_company"
                type="text"
                value={formData.shipping.company}
                onChange={(e) => handleInputChange('shipping', 'company', e.target.value)}
                placeholder="Firmenname"
              />
            </div>

            <div>
              <label htmlFor="shipping_address_1" className="block text-body text-primary mb-2">
                Adresse *
              </label>
              <Input
                id="shipping_address_1"
                type="text"
                required
                value={formData.shipping.address_1}
                onChange={(e) => handleInputChange('shipping', 'address_1', e.target.value)}
                placeholder="Straße und Hausnummer"
              />
            </div>

            <div>
              <label htmlFor="shipping_address_2" className="block text-body text-primary mb-2">
                Adresszeile 2 (optional)
              </label>
              <Input
                id="shipping_address_2"
                type="text"
                value={formData.shipping.address_2}
                onChange={(e) => handleInputChange('shipping', 'address_2', e.target.value)}
                placeholder="Wohnung, Stockwerk, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="shipping_city" className="block text-body text-primary mb-2">
                  Stadt *
                </label>
                <Input
                  id="shipping_city"
                  type="text"
                  required
                  value={formData.shipping.city}
                  onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                  placeholder="Wien"
                />
              </div>
              <div>
                <label htmlFor="shipping_postcode" className="block text-body text-primary mb-2">
                  Postleitzahl *
                </label>
                <Input
                  id="shipping_postcode"
                  type="text"
                  required
                  value={formData.shipping.postcode}
                  onChange={(e) => handleInputChange('shipping', 'postcode', e.target.value)}
                  placeholder="1010"
                />
              </div>
            </div>

            <div>
              <label htmlFor="shipping_country" className="block text-body text-primary mb-2">
                Land *
              </label>
              <select
                id="shipping_country"
                required
                value={formData.shipping.country}
                onChange={(e) => handleInputChange('shipping', 'country', e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-body text-primary-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {availableCountries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// Export the type for use in parent component
export type { CheckoutFormData }

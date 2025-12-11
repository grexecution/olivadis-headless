import { NextResponse } from 'next/server'
import { getAllShippingZones } from '@/lib/woocommerce/shipping'

export async function GET() {
  try {
    const zones = await getAllShippingZones()

    return NextResponse.json({
      success: true,
      zones: zones.map(zone => ({
        id: zone.id,
        name: zone.name,
        locations: zone.locations,
        methods: zone.methods.map(method => ({
          id: method.id,
          instance_id: method.instance_id,
          title: method.title,
          enabled: method.enabled,
          method_id: method.method_id,
          settings: method.settings
        }))
      }))
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

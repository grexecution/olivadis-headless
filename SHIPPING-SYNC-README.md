# Automatic Shipping Rules Sync

This system automatically syncs WooCommerce shipping settings to your Next.js cart for **instant, accurate calculations (<100ms)** without API delays.

## How It Works

### 1. Build-Time Sync
- Script `scripts/sync-shipping-rules.js` runs before every `npm run build`
- Fetches shipping zones, methods, and tax rates from WooCommerce API
- Writes to `lib/woocommerce/shipping-rules.json`
- Client-side calculator imports this JSON for instant calculations

### 2. Automatic Rebuild on WooCommerce Changes
- WordPress plugin (`class-shipping-hooks.php`) detects shipping setting changes
- Triggers Vercel Deploy Hook to rebuild production site
- New shipping rules automatically synced during build

## Setup Instructions

### On Vercel

1. **Create Deploy Hook:**
   - Go to your Vercel project
   - Settings → Git → Deploy Hooks
   - Name: "Shipping Settings Changed"
   - Branch: `main`
   - Click "Create Hook"
   - **Copy the webhook URL** (looks like: `https://api.vercel.com/v1/integrations/deploy/prj_...`)

2. **Environment Variables** (already configured):
   - `WP_BASE_URL`: https://olivadis.com
   - `WOO_CONSUMER_KEY`: Your WooCommerce consumer key
   - `WOO_CONSUMER_SECRET`: Your WooCommerce consumer secret

### On WordPress (olivadis.com)

1. **Install Plugin:**
   - Upload `wordpress-plugin/olivadis-headless-integration/` to `/wp-content/plugins/`
   - Activate in WordPress Admin → Plugins

2. **Configure Deploy Hook:**
   - Go to Settings → Olivadis Headless
   - Paste your Vercel Deploy Hook URL into "Vercel Deploy Hook URL" field
   - Save Changes

## What Gets Synced

The system automatically syncs these WooCommerce settings:

### Shipping Zones
- Free shipping thresholds (e.g., €79 for Austria & Germany)
- Flat rate costs (e.g., €5.99)
- Enabled/disabled shipping methods

### Tax Rates
- Country-specific tax rates (e.g., 10% for Austria, 7% for Germany)

## Current Configuration

Based on your WooCommerce settings (synced from API):

```json
{
  "AT": {
    "freeShippingThreshold": 79,
    "flatRate": 5.99,
    "taxRate": 0.10
  },
  "DE": {
    "freeShippingThreshold": 79,
    "flatRate": 5.99,
    "taxRate": 0.07
  },
  "DEFAULT": {
    "freeShippingThreshold": 100,
    "flatRate": 9.99,
    "taxRate": 0.20
  }
}
```

## Workflow Example

1. **You change WooCommerce shipping settings:**
   - WooCommerce → Settings → Shipping → Zones
   - Change Austria free shipping threshold from €79 → €99

2. **WordPress plugin automatically:**
   - Detects the change
   - Triggers Vercel Deploy Hook
   - Logs: "Vercel rebuild triggered due to shipping settings change"

3. **Vercel automatically:**
   - Starts new deployment
   - Runs `npm run build`
   - `prebuild` script fetches latest shipping rules from WooCommerce
   - Writes new rules to `shipping-rules.json`
   - Builds site with updated rules

4. **Production site now:**
   - Shows €99 free shipping threshold
   - Cart calculations use new threshold
   - All instant (<100ms), no API calls needed

## Manual Sync (Development)

To manually sync shipping rules during development:

```bash
node scripts/sync-shipping-rules.js
```

This will fetch from WooCommerce and update `lib/woocommerce/shipping-rules.json`.

## Troubleshooting

### Deploy Hook Not Triggering

Check WordPress error log for messages like:
```
Olivadis Headless: Vercel Deploy Hook URL not configured
Olivadis Headless: Failed to trigger Vercel rebuild: [error]
Olivadis Headless: Vercel rebuild triggered due to shipping settings change
```

### Shipping Rules Not Updating

1. Check `lib/woocommerce/shipping-rules.json` in your repository
2. Verify WooCommerce API credentials in Vercel environment variables
3. Check Vercel deployment logs for `sync-shipping-rules.js` output

### Local Development

The script automatically loads `.env.local` when running locally, so you can test the sync:

```bash
node scripts/sync-shipping-rules.js
```

Output should show:
```
🚀 Syncing shipping rules from WooCommerce...
✅ Found 3 shipping zones
✅ Found 2 tax rates
✅ Shipping rules synced successfully!
```

## Benefits

- ✅ **Instant calculations** (<100ms vs 3-10 seconds API roundtrip)
- ✅ **Always accurate** - automatically syncs when you change WooCommerce settings
- ✅ **No manual updates** - change WooCommerce → automatic production deployment
- ✅ **Zero maintenance** - webhook automation handles everything

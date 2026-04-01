# AI Tool Studio

A Next.js starter project initialized in the App Router style and prepared for Supabase integration.

## Reuse Across Sites

This project is structured so you can duplicate it into a new site with minimal edits:

- Shared business logic lives in `src/lib`
- Reusable UI sections live in `src/components`
- SEO metadata is centralized through `src/lib/site.js`
- Environment-driven site settings are centralized through `src/lib/env.js`

To clone this project into a new site quickly, you usually only need to update:

- `NEXT_PUBLIC_SITE_URL`
- `CREEM_PRODUCT_ID`
- `REPLICATE_MODEL`
- `SUPABASE_STORAGE_BUCKET`
- branding copy in `src/lib/site.js`
- public pricing and policy copy in `src/app/pricing`, `src/app/privacy`, and `src/app/terms`

## Requirements

- Node.js 18.20+ recommended
- npm 10+

## Install and Run

Dependencies are already installed. To start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Configuration

1. Create a local environment file:

```bash
cp .env.example .env.local
```

2. Open your Supabase project dashboard.
3. Copy the project URL and anon public key.
4. Set them in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CREEM_MODE=test
CREEM_API_KEY=your-creem-api-key
CREEM_WEBHOOK_SECRET=your-creem-webhook-secret
CREEM_PRODUCT_ID=prod_your_subscription_product
REPLICATE_API_TOKEN=your-replicate-api-token
REPLICATE_MODEL=black-forest-labs/flux-kontext-dev
SUPABASE_STORAGE_BUCKET=ai-images
```

The app reads these variables on startup. If they are missing, the homepage will show that Supabase is not configured yet.

## Supabase User Table

Run the SQL in [profiles_subscription.sql](/Users/wanghailun/Documents/MyProject/AITools/AI Image/ai-tool-studio/supabase/profiles_subscription.sql) inside the Supabase SQL Editor.

It creates or updates the `public.profiles` table and ensures these billing fields exist:

- `subscription_status`
- `plan_id`

The script also enables RLS so users can read and manage only their own profile row, while the webhook uses the service role key to update subscription state.

Run the SQL in [image_generations.sql](/Users/wanghailun/Documents/MyProject/AITools/AI Image/ai-tool-studio/supabase/image_generations.sql) as well.

It creates `public.image_generations`, which stores:

- `user_id`
- `generation_count`
- `style`
- `prompt`
- `image_url`
- `storage_path`
- `created_at`

The same SQL also creates a public Supabase Storage bucket named `ai-images`.

## Public Site Pages

The starter now includes public-facing pages commonly needed before connecting a real domain and applying for live billing:

- [pricing page](/Users/wanghailun/Documents/MyProject/AITools/AI Image/ai-tool-studio/src/app/pricing/page.js)
- [privacy policy page](/Users/wanghailun/Documents/MyProject/AITools/AI Image/ai-tool-studio/src/app/privacy/page.js)
- [terms of service page](/Users/wanghailun/Documents/MyProject/AITools/AI Image/ai-tool-studio/src/app/terms/page.js)

Before launch, replace the placeholder business copy in those pages with your final company name, support email, refund policy, and region-specific legal language.

## OAuth Provider Setup

The app login page supports Google, GitHub, and email Magic Link through Supabase Auth.

### App `.env.local`

Set these values locally:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CREEM_MODE=test
CREEM_API_KEY=your-creem-api-key
CREEM_WEBHOOK_SECRET=your-creem-webhook-secret
CREEM_PRODUCT_ID=prod_your_subscription_product
REPLICATE_API_TOKEN=your-replicate-api-token
REPLICATE_MODEL=black-forest-labs/flux-kontext-dev
SUPABASE_STORAGE_BUCKET=ai-images
```

`NEXT_PUBLIC_SITE_URL` is used to build the local auth callback URL:

```text
http://localhost:3000/auth/callback
```

`SUPABASE_SERVICE_ROLE_KEY` is required for the Creem webhook to update `subscription_status` and `plan_id`.

### Supabase Dashboard

In your Supabase project, go to `Authentication -> URL Configuration` and add:

- Site URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/auth/callback`

### Google OAuth

1. Create OAuth credentials in Google Cloud.
2. In Google Cloud, add the authorized redirect URL shown by Supabase in `Authentication -> Providers -> Google`.
3. In Supabase `Authentication -> Providers -> Google`, enable Google and paste:
- Google Client ID
- Google Client Secret

These Google credentials are configured in Supabase, not in the Next.js `.env.local` file.

### GitHub OAuth

1. Create an OAuth App in GitHub.
2. In GitHub, set the callback URL to the one shown by Supabase in `Authentication -> Providers -> GitHub`.
3. In Supabase `Authentication -> Providers -> GitHub`, enable GitHub and paste:
- GitHub Client ID
- GitHub Client Secret

These GitHub credentials are also configured in Supabase, not in the Next.js `.env.local` file.

### Magic Link

Enable Email login in Supabase `Authentication -> Providers -> Email`. The login page uses `signInWithOtp` and sends users back to:

```text
http://localhost:3000/auth/callback
```

## Creem Subscription Setup

This project assumes one recurring Creem product for the paid plan. I used a single-plan default so the flow is testable right away; if your friend's site uses a different price or multiple tiers, replace `CREEM_PRODUCT_ID` with the exact recurring product ID from Creem.

### Required `.env.local` values

```bash
CREEM_MODE=test
CREEM_API_KEY=your-creem-api-key
CREEM_WEBHOOK_SECRET=your-creem-webhook-secret
CREEM_PRODUCT_ID=prod_your_subscription_product
```

`CREEM_MODE` supports:

- `test` for Creem test mode
- `live` for Creem production mode

This allows local development to open either test or live checkout without tying the API host to `NODE_ENV`.

### Creem Dashboard

1. Create a recurring subscription product in Creem.
2. Copy its product ID into `CREEM_PRODUCT_ID`.
3. Add this webhook endpoint in Creem:

```text
http://localhost:3000/api/webhooks/creem
```

For deployed environments, use your real domain:

```text
https://your-domain.com/api/webhooks/creem
```

4. Copy the webhook secret into `CREEM_WEBHOOK_SECRET`.

If you want to test the real payment flow locally, set:

```bash
CREEM_MODE=live
```

and make sure `CREEM_API_KEY` and `CREEM_PRODUCT_ID` are both production values from the same Creem environment.

## AI Image Generation Setup

The homepage now includes an AI image generation block with:

- optional reference image upload
- style selection such as `Ghibli` and `Cartoon`
- generated image preview and download button

### Required `.env.local` values

```bash
REPLICATE_API_TOKEN=your-replicate-api-token
REPLICATE_MODEL=black-forest-labs/flux-kontext-dev
SUPABASE_STORAGE_BUCKET=ai-images
```

`REPLICATE_MODEL` is optional. If omitted, the app defaults to `black-forest-labs/flux-kontext-dev`.
`SUPABASE_STORAGE_BUCKET` is optional. If omitted, the app defaults to `ai-images`.

The server route [route.js](/Users/wanghailun/Documents/MyProject/AITools/AI Image/ai-tool-studio/src/app/api/images/generate/route.js) uses Replicate's Predictions API:

- fetches the configured model schema
- creates a prediction with the selected style prompt
- polls until the prediction finishes
- downloads the output image and stores it in Supabase Storage

After each successful generation, the app uploads the PNG to Supabase Storage using this path structure:

```text
user_id/generation_id.png
```

The upload uses `SUPABASE_SERVICE_ROLE_KEY`, which serves as the server-side storage credential for writes.

## SEO And Performance Notes

- Homepage metadata and Open Graph tags are configured in [page.js](/Users/wanghailun/Documents/MyProject/AITools/AI Image/ai-tool-studio/src/app/page.js)
- Login page metadata and Open Graph tags are configured in [page.js](/Users/wanghailun/Documents/MyProject/AITools/AI Image/ai-tool-studio/src/app/login/page.js)
- Payment success metadata and Open Graph tags are configured in [page.js](/Users/wanghailun/Documents/MyProject/AITools/AI Image/ai-tool-studio/src/app/billing/success/page.js)
- Shared metadata helpers live in [site.js](/Users/wanghailun/Documents/MyProject/AITools/AI Image/ai-tool-studio/src/lib/site.js)
- Static shells use SSG/ISR-friendly server pages, while auth, checkout callbacks, and API routes stay dynamic
- Generated and history images use `next/image` with lazy loading

### Generation limits

- Free users get 1 image generation total
- After the free quota is used, the UI prompts the user to subscribe
- Subscribed users can generate unlimited images

### Local testing

The checkout API uses the `CREEM_MODE` value from `.env.local`.

When a signed-in user clicks `订阅` on `/`, the app:

1. Creates a Creem checkout session on `/api/creem/checkout`
2. Opens the hosted Creem checkout in a popup window
3. Returns to `/billing/success`
4. Waits for the Creem webhook to update `profiles.subscription_status` and `profiles.plan_id`

## Local Login Test

1. Run `npm run dev`
2. Open `http://localhost:3000/login`
3. Test Google, GitHub, or Magic Link
4. After successful authentication, the app redirects to `/`

## Local Billing Test

1. Log in at `http://localhost:3000/login`
2. Open `http://localhost:3000/`
3. Click `订阅`
4. Complete checkout in the popup
5. Confirm the webhook reaches `/api/webhooks/creem`
6. Refresh the homepage if needed and confirm:
- Unsubscribed users see `免费次数剩余 + 订阅按钮`
- Subscribed users see `订阅有效 + 可生成无限次`

## Domain And Merchant Review Prep

Before applying for a real domain or live merchant review, make sure the deployed site includes:

- a public homepage that clearly explains what the product does
- a public pricing page
- a public privacy policy page
- a public terms of service page
- a working login flow and a visible paid upgrade path

When you move to a new domain, update:

- `NEXT_PUBLIC_SITE_URL`
- Supabase auth Site URL and redirect URLs
- Creem success URLs and webhook endpoint
- any business contact details in the pricing and policy pages

## Local AI Image Test

1. Make sure `.env.local` includes `REPLICATE_API_TOKEN`
2. Run `npm run dev`
3. Log in at `http://localhost:3000/login`
4. Open `http://localhost:3000/`
5. Enter a prompt, choose a style, optionally upload a reference image
6. Click `生成`
7. Confirm the generated image appears and can be downloaded
8. Confirm the image also appears in the `生成历史` section after refresh

## Project Structure

- `src/app` - App Router pages, layout, and styles
- `src/components` - Reusable UI blocks for auth, generator, account status, and history
- `src/app/login` - Login page with OAuth and Magic Link buttons
- `src/app/auth/callback` - Handles Supabase auth redirects and forwards users to `/`
- `src/app/api/creem/checkout` - Creates hosted Creem subscription checkout sessions
- `src/app/api/images/generate` - Calls the AI image model and enforces free/subscription limits
- `src/app/api/webhooks/creem` - Receives Creem webhook events and updates Supabase
- `src/app/billing/success` - Returns popup success state to the opener window
- `src/lib/env.js` - Shared environment helpers for site URL, storage bucket, and model selection
- `src/lib/image-generation.js` - Shared style presets and prompt builder
- `src/lib/replicate.js` - Replicate model lookup, prediction, and polling helpers
- `src/lib/subscription.js` - Shared free-tier and subscription-status helpers
- `src/lib/supabase.js` - Shared Supabase browser client
- `src/lib/supabase-admin.js` - Service role Supabase client for webhook updates
- `src/lib/creem.js` - Creem API and webhook helpers
- `src/lib/site.js` - Shared metadata, SEO, and site identity configuration
- `.env.example` - Required environment variable template

## Notes

- `dotenv` is loaded from `next.config.mjs`.
- `react-icons` is available for auth and UI icons.
- `@supabase/supabase-js` is installed and ready to use.

# v60 optional integrations

The site remains functional without these services. Configure only with real provider values.

## WhatsApp
Edit `shared-assets/site-config.js` and set `whatsappNumber` in international digits only, e.g. `4179...`. The WhatsApp buttons are hidden while this value is empty.

## Booking
Set `bookingUrl` to your real Calendly, Cal.com, Microsoft Bookings or other HTTPS booking page. Booking CTAs are hidden while empty.

## AI Coach
The Smart Practice Coach has a local fallback. To enable real AI, set `aiEndpoint` to a secure server-side endpoint that accepts JSON `{message, language, mode}` and returns `{reply}`. Never place an LLM API secret in browser JavaScript.

## Supabase account sync
Existing integration remains in `sprachlernapp/supabase-config.js` and setup SQL files. Use only the browser publishable/anon key, never a service-role key.

## Stripe checkout
Existing Stripe placeholders remain unchanged. Add real Payment Links / server-side webhook configuration only when checkout is ready.

## Newsletter
The current form sends an interest notification through FormSubmit to `fabiowitt@gmx.de`. For an actual mailing list with unsubscribe/double-opt-in, connect a dedicated provider such as Brevo, Mailchimp or Buttondown before sending newsletters.

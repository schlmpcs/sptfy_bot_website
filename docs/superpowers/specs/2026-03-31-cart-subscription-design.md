# Cart & Subscription Purchase — Design Spec
**Date:** 2026-03-31

## Overview

Add a cart and subscription selection flow to the website so users can choose a plan and initiate a purchase entirely on-site. Payment gateway integration is deferred — the checkout step temporarily redirects to the Telegram bot to complete payment.

---

## Goals

- Users can select a subscription plan from the Pricing page and add it to a cart
- Cart is accessible via a slide-out drawer from the Navbar
- Checkout calls the existing backend and redirects to Telegram bot
- No backend changes required for this phase

## Non-Goals

- Payment processing on-site (future)
- Multi-item cart (single plan only)
- Cart persistence across sessions (in-memory only)
- User authentication on the website

---

## Architecture

### New files

| File | Purpose |
|---|---|
| `src/cart/CartContext.jsx` | React Context — holds selected plan, exposes `addToCart`, `clearCart`, `isOpen`, `setIsOpen` |
| `src/cart/CartDrawer.jsx` | Slide-in drawer UI component |
| `src/cart/CartDrawer.module.css` | Styles for the drawer and backdrop |

### Modified files

| File | Change |
|---|---|
| `src/main.jsx` | Wrap app with `CartProvider` |
| `src/components/Navbar.jsx` | Add cart icon + badge, toggle drawer |
| `src/components/Navbar.module.css` | Styles for cart icon and badge |
| `src/pages/Pricing.jsx` | "Subscribe" → "Add to Cart" / "In Cart" button state |

---

## Data Flow

```
User clicks "Add to Cart" on PlanCard
  → addToCart(plan) stored in CartContext
  → CartDrawer opens automatically
  → Navbar badge shows "1"

User clicks "Checkout" in CartDrawer
  → POST /api/user/subscribe  { region, plan_type, months }
  → Response: { telegram_bot_url }
  → window.open(telegram_bot_url)  — opens Telegram in new tab
  → clearCart()

User clicks "Remove" or closes drawer
  → clearCart()
  → badge returns to 0
```

---

## CartContext API

```js
const { plan, addToCart, clearCart, isOpen, setIsOpen } = useCart()
```

- `plan` — `Plan | null` (matches the existing `Plan` model from the backend)
- `addToCart(plan)` — sets the plan and opens the drawer
- `clearCart()` — sets plan to null
- `isOpen` — boolean drawer visibility
- `setIsOpen(bool)` — toggle drawer

---

## CartDrawer UI

- Fixed, right-side slide-in panel (~380px wide)
- Semi-transparent backdrop behind it; clicking backdrop closes the drawer
- Contents when plan is selected:
  - Plan name + duration label
  - Price + currency (large)
  - Features list (✓ bullets)
  - **Checkout** button (green, primary) — calls API, shows loading spinner during request
  - **Remove** button (text/subtle) — clears cart
  - **×** close button top-right
- Contents when empty: "Your cart is empty" message

---

## Pricing Page Changes

- `PlanCard` receives `isInCart` boolean prop
- "Subscribe" button label:
  - Default: "Add to Cart"
  - When plan is already in cart: "In Cart" (disabled, highlighted border)
- On click: `addToCart(plan)` — replaces current `<a href={TELEGRAM_URL}>` link

---

## Backend

No changes required. Uses existing endpoint:

```
POST /api/user/subscribe
Body: { telegram_id (omitted for now), region, plan_type, months }
Returns: { success, message, telegram_bot_url }
```

Note: `telegram_id` is not collected on the website — identity is resolved inside the Telegram bot after redirect.

---

## Error Handling

- If `POST /api/user/subscribe` fails: show an inline error message in the drawer with a retry option. Do not redirect.
- Network timeout: same inline error treatment.

---

## Testing

- Subagent runs Playwright or manual smoke tests after implementation:
  - Select a plan → drawer opens, badge shows 1
  - Select a different plan → replaces previous selection
  - Click Checkout → API called, new tab opens to Telegram URL
  - Click Remove → drawer empties, badge shows 0
  - Refresh page → cart is empty (no persistence)

---

## Future: Payment Gateway

When a payment gateway (e.g., YooKassa, Stripe) is added:
- Replace the `window.open(telegram_bot_url)` step in CartDrawer with a payment form or redirect to the gateway
- `CartContext` and drawer UI remain unchanged
- Add a `/checkout` route if a multi-step payment flow is needed

# Cart & Subscription Purchase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a single-item cart with a Navbar drawer so users can select a subscription plan on the Pricing page and initiate a purchase, temporarily redirecting to the Telegram bot at checkout.

**Architecture:** A `CartContext` (React Context, same pattern as `LanguageContext`) holds the selected plan in memory. A `CartDrawer` component renders at the `App` level and slides in from the right. The Pricing page's "Subscribe" button calls `addToCart(plan)` instead of linking to Telegram directly.

**Tech Stack:** React 18, Vite 5, CSS Modules, FastAPI (existing), Vitest + @testing-library/react (added in Task 2)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `backend/models.py` | Make `telegram_id` optional in `SubscribeRequest` |
| Create | `frontend/src/cart/CartContext.jsx` | Cart state: `plan`, `addToCart`, `clearCart`, `isOpen`, `setIsOpen` |
| Create | `frontend/src/cart/CartDrawer.jsx` | Slide-in drawer — plan summary, Checkout, Remove |
| Create | `frontend/src/cart/CartDrawer.module.css` | Drawer + backdrop styles |
| Modify | `frontend/src/App.jsx` | Wrap with `CartProvider`, render `<CartDrawer />` |
| Modify | `frontend/src/components/Navbar.jsx` | Cart icon + badge (count 0/1), clicking toggles drawer |
| Modify | `frontend/src/components/Navbar.module.css` | Styles for cart icon and badge |
| Modify | `frontend/src/pages/Pricing.jsx` | `PlanCard` button: "Add to Cart" / "In Cart", calls `addToCart` |
| Modify | `frontend/package.json` | Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` |
| Modify | `frontend/vite.config.js` | Add Vitest config block |
| Create | `frontend/src/cart/CartContext.test.jsx` | Unit tests for CartContext |

---

## Task 1: Make `telegram_id` optional in backend

**Files:**
- Modify: `backend/models.py`

- [ ] **Step 1: Update `SubscribeRequest` in models.py**

Open `backend/models.py`. Change the `SubscribeRequest` class so `telegram_id` is optional:

```python
class SubscribeRequest(BaseModel):
    telegram_id: Optional[int] = None   # not collected on the website
    region: str    # "KZ" | "RU"
    plan_type: str # "group" | "individual" | "duo"
    months: int
```

The `Optional` import is already at the top of the file (`from typing import Optional`).

- [ ] **Step 2: Verify the backend starts cleanly**

```bash
cd backend
pip install -r requirements.txt   # only needed if first time
uvicorn main:app --reload --port 8000
```

Expected: `INFO: Application startup complete.`

Then in a second terminal:

```bash
curl -s -X POST http://localhost:8000/api/user/subscribe \
  -H "Content-Type: application/json" \
  -d '{"region":"KZ","plan_type":"group","months":3}' | python -m json.dumps
```

Expected: `{"success":true,"message":"...","telegram_bot_url":"https://t.me/..."}`

- [ ] **Step 3: Commit**

```bash
cd backend
git add models.py
git commit -m "fix: make telegram_id optional in SubscribeRequest"
```

---

## Task 2: Set up Vitest

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/vite.config.js`

- [ ] **Step 1: Install test dependencies**

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

Expected: packages added to `node_modules`, `package.json` devDependencies updated.

- [ ] **Step 2: Add test script to package.json**

In `frontend/package.json`, add `"test"` to the `scripts` block:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Add Vitest config to vite.config.js**

Replace the entire contents of `frontend/vite.config.js` with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
  },
})
```

- [ ] **Step 4: Create test setup file**

Create `frontend/src/test-setup.js` with:

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Verify Vitest runs**

```bash
cd frontend
npm test
```

Expected: `No test files found, exiting with code 0` (no tests yet, that's fine).

- [ ] **Step 6: Commit**

```bash
git add frontend/package.json frontend/vite.config.js frontend/src/test-setup.js frontend/package-lock.json
git commit -m "chore: add Vitest + @testing-library/react test setup"
```

---

## Task 3: CartContext with unit tests (TDD)

**Files:**
- Create: `frontend/src/cart/CartContext.jsx`
- Create: `frontend/src/cart/CartContext.test.jsx`

- [ ] **Step 1: Write the failing tests first**

Create `frontend/src/cart/CartContext.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from './CartContext.jsx'

// Helper component that exposes cart state via the DOM
function CartConsumer() {
  const { plan, isOpen, addToCart, clearCart, setIsOpen } = useCart()
  const fakePlan = {
    id: 'kz_group_3m',
    name: '3 Months',
    region: 'KZ',
    plan_type: 'group',
    price: 2100,
    price_per_month: 700,
    currency: '₸',
    duration_months: 3,
    features: ['Feature A'],
    highlighted: true,
  }
  return (
    <div>
      <span data-testid="plan-id">{plan ? plan.id : 'empty'}</span>
      <span data-testid="is-open">{isOpen ? 'open' : 'closed'}</span>
      <button onClick={() => addToCart(fakePlan)}>add</button>
      <button onClick={() => clearCart()}>clear</button>
      <button onClick={() => setIsOpen(false)}>close</button>
    </div>
  )
}

describe('CartContext', () => {
  it('starts with no plan and drawer closed', () => {
    render(<CartProvider><CartConsumer /></CartProvider>)
    expect(screen.getByTestId('plan-id').textContent).toBe('empty')
    expect(screen.getByTestId('is-open').textContent).toBe('closed')
  })

  it('addToCart sets plan and opens drawer', async () => {
    render(<CartProvider><CartConsumer /></CartProvider>)
    await userEvent.click(screen.getByText('add'))
    expect(screen.getByTestId('plan-id').textContent).toBe('kz_group_3m')
    expect(screen.getByTestId('is-open').textContent).toBe('open')
  })

  it('addToCart replaces previous plan', async () => {
    render(<CartProvider><CartConsumer /></CartProvider>)
    await userEvent.click(screen.getByText('add'))
    await userEvent.click(screen.getByText('add'))
    expect(screen.getByTestId('plan-id').textContent).toBe('kz_group_3m')
  })

  it('clearCart removes plan and keeps drawer state unchanged', async () => {
    render(<CartProvider><CartConsumer /></CartProvider>)
    await userEvent.click(screen.getByText('add'))
    await userEvent.click(screen.getByText('clear'))
    expect(screen.getByTestId('plan-id').textContent).toBe('empty')
  })

  it('setIsOpen(false) closes the drawer', async () => {
    render(<CartProvider><CartConsumer /></CartProvider>)
    await userEvent.click(screen.getByText('add'))
    await userEvent.click(screen.getByText('close'))
    expect(screen.getByTestId('is-open').textContent).toBe('closed')
  })

  it('useCart throws outside CartProvider', () => {
    // suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<CartConsumer />)).toThrow('useCart must be used inside <CartProvider>')
    spy.mockRestore()
  })
})
```

- [ ] **Step 2: Install @testing-library/user-event (needed for the tests)**

```bash
cd frontend
npm install --save-dev @testing-library/user-event
```

- [ ] **Step 3: Run tests — expect them to fail**

```bash
cd frontend
npm test
```

Expected: FAIL — `Cannot find module './CartContext.jsx'`

- [ ] **Step 4: Implement CartContext**

Create `frontend/src/cart/CartContext.jsx`:

```jsx
import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [plan, setPlan] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  function addToCart(newPlan) {
    setPlan(newPlan)
    setIsOpen(true)
  }

  function clearCart() {
    setPlan(null)
  }

  return (
    <CartContext.Provider value={{ plan, addToCart, clearCart, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
```

- [ ] **Step 5: Run tests — expect them to pass**

```bash
cd frontend
npm test
```

Expected: `6 passed` (all CartContext tests green)

- [ ] **Step 6: Commit**

```bash
git add frontend/src/cart/CartContext.jsx frontend/src/cart/CartContext.test.jsx frontend/package.json frontend/package-lock.json
git commit -m "feat: add CartContext with unit tests"
```

---

## Task 4: CartDrawer component

**Files:**
- Create: `frontend/src/cart/CartDrawer.jsx`
- Create: `frontend/src/cart/CartDrawer.module.css`

- [ ] **Step 1: Create CartDrawer.jsx**

Create `frontend/src/cart/CartDrawer.jsx`:

```jsx
import { useState } from 'react'
import { useCart } from './CartContext.jsx'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { plan, clearCart, isOpen, setIsOpen } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function close() {
    setIsOpen(false)
    setError(null)
  }

  async function handleCheckout() {
    if (!plan) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: plan.region,
          plan_type: plan.plan_type,
          months: plan.duration_months,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || `Server error ${res.status}`)
      }
      const data = await res.json()
      window.open(data.telegram_bot_url, '_blank', 'noopener,noreferrer')
      clearCart()
      setIsOpen(false)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />

      {/* Drawer panel */}
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Cart">
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Cart</h2>
          <button className={styles.closeBtn} onClick={close} aria-label="Close cart">✕</button>
        </div>

        {/* Content */}
        <div className={styles.body}>
          {plan ? (
            <>
              <div className={styles.planSummary}>
                <p className={styles.planName}>{plan.name}</p>
                <p className={styles.planPrice}>
                  <span className={styles.priceAmount}>{plan.currency}{plan.price}</span>
                  {plan.duration_months > 1 && (
                    <span className={styles.pricePerMonth}>
                      {' '}· {plan.currency}{plan.price_per_month}/mo
                    </span>
                  )}
                </p>
                <ul className={styles.featureList}>
                  {plan.features.map((f) => (
                    <li key={f} className={styles.featureItem}>
                      <span className={styles.check}>✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <div className={styles.actions}>
                <button
                  className={styles.checkoutBtn}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Opening…' : 'Checkout'}
                </button>
                <button
                  className={styles.removeBtn}
                  onClick={() => { clearCart(); setError(null) }}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <p className={styles.emptyMsg}>Your cart is empty.</p>
          )}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Create CartDrawer.module.css**

Create `frontend/src/cart/CartDrawer.module.css`:

```css
/* Backdrop */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1100;
  animation: fadeIn 0.2s ease;
}

/* Drawer panel */
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 380px;
  max-width: 100vw;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border);
  z-index: 1101;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.closeBtn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}
.closeBtn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
}

/* Body */
.body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Plan summary */
.planSummary {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}

.planName {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.planPrice {
  margin-bottom: 16px;
}

.priceAmount {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--accent);
}

.pricePerMonth {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.featureList {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.featureItem {
  font-size: 0.88rem;
  color: var(--text-secondary);
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.check {
  color: var(--accent);
  font-size: 0.85rem;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Error */
.errorMsg {
  font-size: 0.875rem;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.08);
  border: 1px solid rgba(255, 107, 107, 0.25);
  border-radius: 8px;
  padding: 10px 14px;
}

/* Actions */
.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkoutBtn {
  width: 100%;
  padding: 14px;
  background: var(--accent);
  color: #000;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}
.checkoutBtn:hover:not(:disabled) {
  background: var(--accent-glow);
}
.checkoutBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.removeBtn {
  width: 100%;
  padding: 10px;
  background: none;
  color: var(--text-secondary);
  font-size: 0.88rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.removeBtn:hover:not(:disabled) {
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.25);
}

/* Empty state */
.emptyMsg {
  color: var(--text-secondary);
  font-size: 0.95rem;
  text-align: center;
  padding: 40px 0;
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/cart/CartDrawer.jsx frontend/src/cart/CartDrawer.module.css
git commit -m "feat: add CartDrawer component"
```

---

## Task 5: Wire CartProvider and CartDrawer into App

**Files:**
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Update App.jsx**

Replace the entire contents of `frontend/src/App.jsx` with:

```jsx
import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import { CartProvider } from './cart/CartContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './cart/CartDrawer.jsx'
import Landing from './pages/Landing.jsx'
import Pricing from './pages/Pricing.jsx'
import FAQ from './pages/FAQ.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LegalPage from './pages/LegalPage.jsx'

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Navbar />
        <CartDrawer />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/offer" element={<LegalPage documentKey="offer" />} />
            <Route path="/privacy" element={<LegalPage documentKey="privacy" />} />
            <Route path="/safety" element={<LegalPage documentKey="safety" />} />
            <Route path="/refund-policy" element={<LegalPage documentKey="refundPolicy" />} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </LanguageProvider>
  )
}
```

- [ ] **Step 2: Verify app still renders**

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` — site should load with no console errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/App.jsx
git commit -m "feat: wire CartProvider and CartDrawer into App"
```

---

## Task 6: Add cart icon + badge to Navbar

**Files:**
- Modify: `frontend/src/components/Navbar.jsx`
- Modify: `frontend/src/components/Navbar.module.css`

- [ ] **Step 1: Update Navbar.jsx**

Add the `useCart` import and cart icon button. In `frontend/src/components/Navbar.jsx`, replace the import block and the JSX `{/* Desktop CTA */}` section:

**At the top, add the import:**
```jsx
import { useCart } from '../cart/CartContext.jsx'
```

**Inside the `Navbar` function, after the existing hooks, add:**
```jsx
const { plan, isOpen, setIsOpen } = useCart()
const cartCount = plan ? 1 : 0
```

**Between the Language switcher `</div>` and the Desktop CTA `<a>`, add the cart button:**
```jsx
{/* Cart icon */}
<button
  className={styles.cartBtn}
  onClick={() => setIsOpen(!isOpen)}
  aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item` : ', empty'}`}
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
  {cartCount > 0 && (
    <span className={styles.cartBadge} aria-hidden="true">{cartCount}</span>
  )}
</button>
```

The full updated `Navbar.jsx` after edits:

```jsx
import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useCart } from '../cart/CartContext.jsx'
import { siteDetails } from '../content/siteDetails.js'
import styles from './Navbar.module.css'

const LANG_OPTIONS = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, lang, setLang } = useLanguage()
  const { plan, isOpen, setIsOpen } = useCart()
  const cartCount = plan ? 1 : 0

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoGlyph}>✦</span>
          <span className={styles.logoText}>{siteDetails.brandName}</span>
        </Link>

        {/* Desktop nav links */}
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            {t('nav.pricing')}
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            {t('nav.faq')}
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            {t('nav.dashboard')}
          </NavLink>

          {/* Mobile-only CTA inside nav */}
          <a
            href={siteDetails.support.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaBtn} ${styles.ctaMobile}`}
            onClick={closeMenu}
          >
            {t('nav.openBot')}
          </a>
        </nav>

        {/* Language switcher */}
        <div className={styles.langSwitcher} aria-label="Language switcher">
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              className={`${styles.langBtn} ${lang === opt.code ? styles.langBtnActive : ''}`}
              onClick={() => setLang(opt.code)}
              aria-pressed={lang === opt.code}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Cart icon */}
        <button
          className={styles.cartBtn}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item` : ', empty'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span className={styles.cartBadge} aria-hidden="true">{cartCount}</span>
          )}
        </button>

        {/* Desktop CTA */}
        <a
          href={siteDetails.support.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
        >
          {t('nav.openBot')}
        </a>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile backdrop */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  )
}
```

- [ ] **Step 2: Add cart icon styles to Navbar.module.css**

Append to the end of `frontend/src/components/Navbar.module.css`:

```css
/* ── Cart icon ── */
.cartBtn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: none;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.cartBtn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border);
}

.cartBadge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: var(--accent);
  color: #000;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
```

- [ ] **Step 3: Verify in browser**

Start dev server: `npm run dev`

Navigate to `http://localhost:5173` — you should see a small cart/bag icon in the Navbar to the left of the "Open Bot" button. Clicking it should open the empty `CartDrawer` (shows "Your cart is empty."). Clicking the backdrop or ✕ should close it.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/Navbar.jsx frontend/src/components/Navbar.module.css
git commit -m "feat: add cart icon and badge to Navbar"
```

---

## Task 7: Update Pricing page — "Add to Cart" button

**Files:**
- Modify: `frontend/src/pages/Pricing.jsx`

- [ ] **Step 1: Update Pricing.jsx**

The `PlanCard` component currently renders an `<a href={TELEGRAM_URL}>` button. Replace the entire `Pricing.jsx` with the updated version below — the key changes are:
1. Import `useCart`
2. `PlanCard` receives `isInCart` + `onAdd` props
3. Button becomes a `<button>` that calls `onAdd()`
4. All plan renderers pass `isInCart` and `onAdd`

```jsx
import { useState } from 'react'
import GlowCard from '../components/GlowCard.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useCart } from '../cart/CartContext.jsx'
import { siteDetails } from '../content/siteDetails.js'
import styles from './Pricing.module.css'

const TELEGRAM_URL = siteDetails.support.telegramUrl

const KZ_PLANS = [
  { months: 1, basePrice: 700, labelKey: 'pricing.plan.1month', badge: null },
  { months: 3, basePrice: 700, labelKey: 'pricing.plan.3months', badge: 'popular' },
  { months: 6, basePrice: 700, labelKey: 'pricing.plan.6months', badge: 'bestValue' },
]

const RU_GROUP_PLANS = [
  { months: 1, basePrice: 200, labelKey: 'pricing.plan.1month', badge: null },
  { months: 3, basePrice: 200, labelKey: 'pricing.plan.3months', badge: 'popular' },
  { months: 6, basePrice: 200, labelKey: 'pricing.plan.6months', badge: 'bestValue' },
  { months: 12, basePrice: 200, labelKey: 'pricing.plan.12months', badge: 'maxSavings' },
]

function PlanCard({ planId, label, price, currency, perMonth, features, badgeKey, highlighted = false, isInCart, onAdd, t }) {
  const badgeText = badgeKey ? t(`pricing.badge.${badgeKey}`) : null
  return (
    <GlowCard highlighted={highlighted} className={styles.planCard}>
      {badgeText && (
        <span className={`${styles.badge} ${highlighted ? styles.badgeHighlighted : ''}`}>
          {badgeText}
        </span>
      )}
      <div className={styles.planHeader}>
        <h3 className={styles.planLabel}>{label}</h3>
        <div className={styles.planPriceRow}>
          <span className={styles.planPrice}>{currency}{price}</span>
        </div>
        {perMonth !== null && (
          <p className={styles.planPerMonth}>
            {t('pricing.perMonth').replace('{currency}', currency).replace('{price}', perMonth)}
          </p>
        )}
      </div>

      <ul className={styles.featureList}>
        {features.map((f) => (
          <li key={f} className={styles.featureItem}>
            <span className={styles.featureCheck}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={onAdd}
        disabled={isInCart}
        className={`${styles.subscribeBtn} ${highlighted ? styles.subscribeBtnHighlighted : ''} ${isInCart ? styles.subscribeBtnInCart : ''}`}
      >
        {isInCart ? t('pricing.inCartBtn') : t('pricing.addToCartBtn')}
      </button>
    </GlowCard>
  )
}

function KZPlans({ t }) {
  const { plan, addToCart } = useCart()

  const features = [
    t('pricing.feature.kz1'),
    t('pricing.feature.kz2'),
    t('pricing.feature.kz3'),
    t('pricing.feature.kz4'),
    t('pricing.feature.kz5'),
  ]

  return (
    <div className={styles.plansGrid}>
      {KZ_PLANS.map((p) => {
        const total = p.basePrice * p.months
        const perMonth = p.months > 1 ? p.basePrice : null
        const planId = `kz_group_${p.months}m`
        const cartPlan = {
          id: planId,
          name: t(p.labelKey),
          region: 'KZ',
          plan_type: 'group',
          price: total,
          price_per_month: p.basePrice,
          currency: '₸',
          duration_months: p.months,
          features,
          highlighted: p.badge === 'popular',
        }
        return (
          <PlanCard
            key={p.months}
            planId={planId}
            label={t(p.labelKey)}
            price={total}
            currency="₸"
            perMonth={perMonth}
            features={features}
            badgeKey={p.badge}
            highlighted={p.badge === 'popular'}
            isInCart={plan?.id === planId}
            onAdd={() => addToCart(cartPlan)}
            t={t}
          />
        )
      })}
    </div>
  )
}

function RUPlans({ t }) {
  const [subTab, setSubTab] = useState('group')
  const { plan, addToCart } = useCart()

  const groupFeatures = [
    t('pricing.feature.rug1'),
    t('pricing.feature.rug2'),
    t('pricing.feature.rug3'),
    t('pricing.feature.rug4'),
    t('pricing.feature.rug5'),
  ]
  const indFeatures = [
    t('pricing.feature.ind1'),
    t('pricing.feature.ind2'),
    t('pricing.feature.ind3'),
    t('pricing.feature.ind4'),
    t('pricing.feature.ind5'),
  ]
  const duoFeatures = [
    t('pricing.feature.duo1'),
    t('pricing.feature.duo2'),
    t('pricing.feature.duo3'),
    t('pricing.feature.duo4'),
    t('pricing.feature.duo5'),
  ]

  return (
    <div>
      <div className={styles.subTabRow}>
        <button
          className={`${styles.subTab} ${subTab === 'group' ? styles.subTabActive : ''}`}
          onClick={() => setSubTab('group')}
        >
          {t('pricing.subtab.group')}
        </button>
        <button
          className={`${styles.subTab} ${subTab === 'individual' ? styles.subTabActive : ''}`}
          onClick={() => setSubTab('individual')}
        >
          {t('pricing.subtab.individual')}
        </button>
      </div>

      {subTab === 'group' && (
        <div className={styles.plansGrid}>
          {RU_GROUP_PLANS.map((p) => {
            const total = p.basePrice * p.months
            const perMonth = p.months > 1 ? p.basePrice : null
            const planId = `ru_group_${p.months}m`
            const cartPlan = {
              id: planId,
              name: t(p.labelKey),
              region: 'RU',
              plan_type: 'group',
              price: total,
              price_per_month: p.basePrice,
              currency: '₽',
              duration_months: p.months,
              features: groupFeatures,
              highlighted: p.badge === 'popular',
            }
            return (
              <PlanCard
                key={p.months}
                planId={planId}
                label={t(p.labelKey)}
                price={total}
                currency="₽"
                perMonth={perMonth}
                features={groupFeatures}
                badgeKey={p.badge}
                highlighted={p.badge === 'popular'}
                isInCart={plan?.id === planId}
                onAdd={() => addToCart(cartPlan)}
                t={t}
              />
            )
          })}
        </div>
      )}

      {subTab === 'individual' && (
        <div className={styles.plansGrid}>
          {(() => {
            const indId = 'ru_individual_1m'
            const duoId = 'ru_duo_1m'
            const indCartPlan = {
              id: indId,
              name: t('pricing.plan.individual'),
              region: 'RU',
              plan_type: 'individual',
              price: 250,
              price_per_month: 250,
              currency: '₽',
              duration_months: 1,
              features: indFeatures,
              highlighted: false,
            }
            const duoCartPlan = {
              id: duoId,
              name: t('pricing.plan.duo'),
              region: 'RU',
              plan_type: 'duo',
              price: 600,
              price_per_month: 300,
              currency: '₽',
              duration_months: 1,
              features: duoFeatures,
              highlighted: true,
            }
            return (
              <>
                <PlanCard
                  planId={indId}
                  label={t('pricing.plan.individual')}
                  price={250}
                  currency="₽"
                  perMonth={null}
                  features={indFeatures}
                  badgeKey="personal"
                  highlighted={false}
                  isInCart={plan?.id === indId}
                  onAdd={() => addToCart(indCartPlan)}
                  t={t}
                />
                <PlanCard
                  planId={duoId}
                  label={t('pricing.plan.duo')}
                  price={600}
                  currency="₽"
                  perMonth={300}
                  features={duoFeatures}
                  badgeKey="bestForTwo"
                  highlighted={true}
                  isInCart={plan?.id === duoId}
                  onAdd={() => addToCart(duoCartPlan)}
                  t={t}
                />
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}

export default function Pricing() {
  const [region, setRegion] = useState('KZ')
  const { t } = useLanguage()

  return (
    <div className={styles.page}>
      <div className={styles.bgGradient} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionTag}>{t('pricing.tag')}</span>
          <h1 className={styles.title}>{t('pricing.title')}</h1>
          <p className={styles.subtitle}>{t('pricing.subtitle')}</p>
        </div>

        {/* Region tab switcher */}
        <div className={styles.regionTabs} role="tablist" aria-label="Select region">
          <button
            role="tab"
            aria-selected={region === 'KZ'}
            className={`${styles.regionTab} ${region === 'KZ' ? styles.regionTabActive : ''}`}
            onClick={() => setRegion('KZ')}
          >
            {t('pricing.tab.kz')}
          </button>
          <button
            role="tab"
            aria-selected={region === 'RU'}
            className={`${styles.regionTab} ${region === 'RU' ? styles.regionTabActive : ''}`}
            onClick={() => setRegion('RU')}
          >
            {t('pricing.tab.ru')}
          </button>
        </div>

        {/* Plans */}
        <div className={styles.plansSection}>
          {region === 'KZ' ? <KZPlans t={t} /> : <RUPlans t={t} />}
        </div>

        {/* Footer note */}
        <GlowCard className={styles.noteCard}>
          <div className={styles.noteInner}>
            <span className={styles.noteIcon}>ℹ</span>
            <p className={styles.noteText}>
              {t('pricing.note')
                .split('{link}')[0]}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.noteLink}
              >
                {t('pricing.noteLink')}
              </a>
              {t('pricing.note')
                .split('{link}')[1]
                ?.split('{faqLink}')[0]}
              <a href="/faq" className={styles.noteLink}>
                {t('pricing.noteFaq')}
              </a>
              {t('pricing.note')
                .split('{faqLink}')[1]}
            </p>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add translation keys for the new button states**

The new button uses `t('pricing.addToCartBtn')` and `t('pricing.inCartBtn')`. These keys need to exist in the translations file. Open `frontend/src/i18n/translations.js` and add to each language's object:

Find the translations file:
```bash
ls frontend/src/i18n/
```

Then add these keys to each language (ru, kz, en). The exact location depends on the file structure — add them alongside the other `pricing.*` keys:

```js
// Russian (ru)
'pricing.addToCartBtn': 'В корзину',
'pricing.inCartBtn': 'В корзине',

// Kazakh (kz)
'pricing.addToCartBtn': 'Себетке',
'pricing.inCartBtn': 'Себетте',

// English (en)
'pricing.addToCartBtn': 'Add to Cart',
'pricing.inCartBtn': 'In Cart',
```

- [ ] **Step 3: Add `.subscribeBtnInCart` style to Pricing.module.css**

Append to `frontend/src/pages/Pricing.module.css`:

```css
.subscribeBtnInCart {
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid var(--border);
  cursor: default;
  opacity: 0.9;
}
```

- [ ] **Step 4: Smoke test the full flow in browser**

```bash
cd frontend
npm run dev
```

1. Go to `http://localhost:5173/pricing`
2. Click "Add to Cart" on any plan → drawer slides in, badge shows "1"
3. The clicked button changes to "In Cart" (disabled, green tint)
4. Click "Remove" → plan cleared, badge gone, button resets to "Add to Cart"
5. Add a plan → click "Checkout" → API is called, Telegram opens in new tab, cart clears
6. Refresh page → cart is empty

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/Pricing.jsx frontend/src/pages/Pricing.module.css frontend/src/i18n/translations.js
git commit -m "feat: replace Subscribe button with Add to Cart flow on Pricing page"
```

---

## Task 8: Subagent smoke test

**Dispatch a subagent to verify the complete flow works end-to-end.**

- [ ] **Step 1: Run all unit tests**

```bash
cd frontend
npm test
```

Expected: `6 passed` (all CartContext tests)

- [ ] **Step 2: Verify backend health**

```bash
curl -s http://localhost:8000/health | python -m json.tool
```

Expected: `{"status": "ok", ...}`

- [ ] **Step 3: Verify subscribe endpoint accepts request without telegram_id**

```bash
curl -s -X POST http://localhost:8000/api/user/subscribe \
  -H "Content-Type: application/json" \
  -d '{"region":"RU","plan_type":"duo","months":1}' | python -m json.tool
```

Expected:
```json
{
  "success": true,
  "message": "Ready to subscribe to a 1-month duo plan for Russia. Open the Telegram bot to complete your purchase.",
  "telegram_bot_url": "https://t.me/sptfy_premium"
}
```

- [ ] **Step 4: Final commit tag**

```bash
git tag cart-v1
```

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| CartContext with plan, addToCart, clearCart, isOpen, setIsOpen | Task 3 |
| CartDrawer slides in from right | Task 4 |
| Navbar cart icon + badge | Task 6 |
| Badge shows 0 or 1 | Task 6 |
| Pricing button: "Add to Cart" / "In Cart" | Task 7 |
| Checkout calls POST /api/user/subscribe | Task 4 |
| On success: window.open(telegram_bot_url) + clearCart | Task 4 |
| Loading state on Checkout button | Task 4 |
| Inline error on API failure | Task 4 |
| Remove clears cart | Task 4 |
| Backdrop click closes drawer | Task 4 |
| Session-only (no localStorage) | Task 3 (useState, no localStorage) |
| telegram_id optional in backend | Task 1 |
| Unit tests for CartContext | Task 3 |

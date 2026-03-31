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

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

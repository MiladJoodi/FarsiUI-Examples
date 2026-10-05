"use client"

import * as React from "react"

import { getProductById, type Product } from "@/lib/mock/ecommerce"

export type CartLine = {
  productId: string
  quantity: number
}

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  addItem: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
  getLineProduct: (productId: string) => Product | undefined
}

const STORAGE_KEY = "farsiui-ecommerce-cart"
const CART_EVENT = "farsiui-ecommerce-cart"

const emptyLines: CartLine[] = []

let snapshotCache: { raw: string | null; lines: CartLine[] } = {
  raw: null,
  lines: emptyLines,
}

const CartContext = React.createContext<CartContextValue | null>(null)

function parseLines(raw: string | null): CartLine[] {
  if (!raw) return emptyLines
  try {
    const parsed = JSON.parse(raw) as CartLine[]
    if (!Array.isArray(parsed)) return emptyLines
    const next = parsed.filter(
      (line) =>
        typeof line.productId === "string" &&
        typeof line.quantity === "number" &&
        line.quantity > 0 &&
        getProductById(line.productId)
    )
    return next.length ? next : emptyLines
  } catch {
    return emptyLines
  }
}

function getSnapshot() {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === snapshotCache.raw) return snapshotCache.lines
  const lines = parseLines(raw)
  snapshotCache = { raw, lines }
  return lines
}

function getServerSnapshot() {
  return emptyLines
}

function writeStoredLines(lines: CartLine[]) {
  const raw = JSON.stringify(lines)
  window.localStorage.setItem(STORAGE_KEY, raw)
  snapshotCache = { raw, lines: lines.length ? lines : emptyLines }
  window.dispatchEvent(new Event(CART_EVENT))
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CART_EVENT, onStoreChange)
  window.addEventListener("storage", onStoreChange)
  return () => {
    window.removeEventListener(CART_EVENT, onStoreChange)
    window.removeEventListener("storage", onStoreChange)
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  function addItem(productId: string, quantity = 1) {
    const product = getProductById(productId)
    if (!product || product.stock <= 0) return
    const prev = getSnapshot()
    const existing = prev.find((l) => l.productId === productId)
    let next: CartLine[]
    if (existing) {
      const nextQty = Math.min(product.stock, existing.quantity + quantity)
      next = prev.map((l) =>
        l.productId === productId ? { ...l, quantity: nextQty } : l
      )
    } else {
      next = [
        ...prev,
        { productId, quantity: Math.min(product.stock, quantity) },
      ]
    }
    writeStoredLines(next)
  }

  function setQuantity(productId: string, quantity: number) {
    const product = getProductById(productId)
    if (!product) return
    const prev = getSnapshot()
    const next =
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.min(product.stock, quantity) }
              : l
          )
    writeStoredLines(next)
  }

  function removeItem(productId: string) {
    writeStoredLines(getSnapshot().filter((l) => l.productId !== productId))
  }

  function clear() {
    writeStoredLines([])
  }

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0)
  const subtotal = lines.reduce((sum, l) => {
    const product = getProductById(l.productId)
    return sum + (product ? product.price * l.quantity : 0)
  }, 0)

  return (
    <CartContext.Provider
      value={{
        lines,
        itemCount,
        subtotal,
        addItem,
        setQuantity,
        removeItem,
        clear,
        getLineProduct: getProductById,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider")
  }
  return ctx
}

// ---------------------------------------------------------------------------
// Cart Animation -- Event bus for fly-to-cart and cart icon bounce
// ---------------------------------------------------------------------------
//
// Lightweight pub/sub so AddToCartButton can notify the CartButton to bounce
// without prop drilling or global state coupling.
// ---------------------------------------------------------------------------

type CartAnimationListener = () => void;

const listeners = new Set<CartAnimationListener>();

/** Subscribe to cart-add events. Returns an unsubscribe function. */
export function onCartAdd(fn: CartAnimationListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Emit a cart-add event (triggers bounce on cart icon). */
export function emitCartAdd(): void {
  listeners.forEach((fn) => fn());
}

-- Migration: Add sales_channel to orders + decrement_stock function
-- Run this in Supabase Dashboard > SQL Editor

-- Add sales channel tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sales_channel text DEFAULT 'website';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS external_order_id text;

CREATE INDEX IF NOT EXISTS idx_orders_sales_channel ON orders(sales_channel);
CREATE INDEX IF NOT EXISTS idx_orders_external_order_id ON orders(external_order_id);

-- Helper function to decrement stock
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id uuid, p_quantity integer)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity - p_quantity),
      updated_at = now()
  WHERE id = p_product_id;

  UPDATE products_inventory
  SET stock_qty = GREATEST(0, stock_qty - p_quantity),
      updated_at = now()
  WHERE product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

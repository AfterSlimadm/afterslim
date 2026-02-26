// ---------------------------------------------------------------------------
// AfterSlim -- Server-side product query functions (Supabase)
// ---------------------------------------------------------------------------

import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GetProductsOptions {
  category?: string;
  tag?: string;
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Fetch products from Supabase with optional filtering.
 * Only returns active products, ordered by sort_order.
 */
export async function getProducts(
  options?: GetProductsOptions
): Promise<Product[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (options?.category) {
      query = query.eq("category", options.category);
    }

    if (options?.featured !== undefined) {
      query = query.eq("is_featured", options.featured);
    }

    if (options?.tag) {
      query = query.contains("tags", [options.tag]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getProducts] Supabase error:", error.message);
      return [];
    }

    return (data as Product[]) ?? [];
  } catch (err) {
    console.error("[getProducts] Unexpected error:", err);
    return [];
  }
}

/**
 * Fetch a single product by its URL slug.
 * Returns null if not found or on error.
 */
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      // PGRST116 = "no rows returned" -- expected when slug doesn't match
      if (error.code !== "PGRST116") {
        console.error("[getProductBySlug] Supabase error:", error.message);
      }
      return null;
    }

    return data as Product;
  } catch (err) {
    console.error("[getProductBySlug] Unexpected error:", err);
    return null;
  }
}

/**
 * Fetch only featured products (is_featured = true).
 * Convenience wrapper around getProducts.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featured: true });
}

/**
 * Fetch distinct product categories from active products.
 */
export async function getProductCategories(): Promise<string[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("category")
      .eq("is_active", true)
      .order("category", { ascending: true });

    if (error) {
      console.error("[getProductCategories] Supabase error:", error.message);
      return [];
    }

    // Extract unique category strings
    const categories = [
      ...new Set((data ?? []).map((row) => row.category as string)),
    ];

    return categories;
  } catch (err) {
    console.error("[getProductCategories] Unexpected error:", err);
    return [];
  }
}

/**
 * Fetch all product slugs (for static generation / sitemap).
 */
export async function getAllProductSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[getAllProductSlugs] Supabase error:", error.message);
      return [];
    }

    return (data as { slug: string; updated_at: string }[]) ?? [];
  } catch (err) {
    console.error("[getAllProductSlugs] Unexpected error:", err);
    return [];
  }
}

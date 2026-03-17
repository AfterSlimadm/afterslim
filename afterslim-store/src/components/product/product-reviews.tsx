"use client";

import { Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import * as m from "motion/react-client";
import type { Review } from "@/types/database";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProductReviewsProps {
  productId: string;
}

// ---------------------------------------------------------------------------
// Placeholder reviews
// ---------------------------------------------------------------------------

const PLACEHOLDER_REVIEWS: Review[] = [
  {
    id: "rev-1",
    product_id: "",
    user_id: null,
    author_name: "Sarah M.",
    rating: 5,
    title: "Amazing results in just 2 weeks!",
    body: "I have been using this product for two weeks and I am already seeing a noticeable difference. My energy levels are up and I feel great throughout the day. Highly recommend to anyone looking for a quality supplement.",
    is_verified_purchase: true,
    is_approved: true,
    created_at: "2025-12-15T10:30:00Z",
    updated_at: "2025-12-15T10:30:00Z",
  },
  {
    id: "rev-2",
    product_id: "",
    user_id: null,
    author_name: "James R.",
    rating: 4,
    title: "Good quality, fast shipping",
    body: "The product arrived quickly and is clearly high quality. I have only been using it for a week so I cannot speak to long-term results yet, but so far so good. The capsules are easy to swallow and do not have an aftertaste.",
    is_verified_purchase: true,
    is_approved: true,
    created_at: "2025-11-28T14:15:00Z",
    updated_at: "2025-11-28T14:15:00Z",
  },
  {
    id: "rev-3",
    product_id: "",
    user_id: null,
    author_name: "Emily T.",
    rating: 5,
    title: "Best supplement I have tried",
    body: "After trying many different brands, I finally found one that actually works. The ingredients are clean and I love that everything is made in the USA. Will be subscribing for sure.",
    is_verified_purchase: true,
    is_approved: true,
    created_at: "2025-11-10T09:45:00Z",
    updated_at: "2025-11-10T09:45:00Z",
  },
  {
    id: "rev-4",
    product_id: "",
    user_id: null,
    author_name: "Michael D.",
    rating: 5,
    title: "Exceeded my expectations",
    body: "I was skeptical at first but decided to give it a try. Glad I did! I have been taking it daily for a month and the difference is real. Great product, great company.",
    is_verified_purchase: false,
    is_approved: true,
    created_at: "2025-10-22T16:20:00Z",
    updated_at: "2025-10-22T16:20:00Z",
  },
  {
    id: "rev-5",
    product_id: "",
    user_id: null,
    author_name: "Lisa K.",
    rating: 4,
    title: "Solid product",
    body: "Does what it says. I noticed improvements within the first couple of weeks. The subscription option is convenient and saves a nice amount. Would recommend to friends and family.",
    is_verified_purchase: true,
    is_approved: true,
    created_at: "2025-10-05T11:00:00Z",
    updated_at: "2025-10-05T11:00:00Z",
  },
  {
    id: "rev-6",
    product_id: "",
    user_id: null,
    author_name: "David W.",
    rating: 3,
    title: "Decent but takes time",
    body: "It took about three weeks before I started noticing any changes. The quality seems good and the ingredients list is clean. I will keep using it for another month before making a final judgment.",
    is_verified_purchase: true,
    is_approved: true,
    created_at: "2025-09-18T08:30:00Z",
    updated_at: "2025-09-18T08:30:00Z",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating
              ? "fill-as-orange text-as-orange"
              : "fill-none text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-12 shrink-0 text-right text-muted-foreground">
        {stars} star{stars !== 1 ? "s" : ""}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-as-orange transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">
        {count}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductReviews({ productId }: ProductReviewsProps) {
  // Tag reviews with the current product ID
  const reviews = PLACEHOLDER_REVIEWS.map((r) => ({
    ...r,
    product_id: productId,
  }));

  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  function handleWriteReview() {
    toast("Coming soon", {
      description: "Review submission will be available shortly.",
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-2xl font-display font-bold text-foreground">
            Customer Reviews
          </h3>

          {/* Average rating */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-4xl font-bold text-foreground">
              {averageRating.toFixed(1)}
            </span>
            <div>
              <StarRating rating={Math.round(averageRating)} size="md" />
              <p className="mt-0.5 text-sm text-muted-foreground">
                Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleWriteReview} variant="outline">
          Write a Review
        </Button>
      </div>

      {/* Rating distribution */}
      <div className="max-w-sm space-y-1.5">
        {distribution.map((d) => (
          <RatingBar
            key={d.stars}
            stars={d.stars}
            count={d.count}
            total={totalReviews}
          />
        ))}
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <m.div
            key={review.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="space-y-3">
                {/* Rating & date */}
                <div className="flex items-center justify-between">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(review.created_at)}
                  </span>
                </div>

                {/* Title */}
                {review.title && (
                  <h4 className="font-semibold text-foreground">
                    {review.title}
                  </h4>
                )}

                {/* Body */}
                {review.body && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {review.body}
                  </p>
                )}

                {/* Author & verified */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {review.author_name}
                  </span>
                  {review.is_verified_purchase && (
                    <Badge
                      variant="secondary"
                      className="gap-1 text-[10px]"
                    >
                      <CheckCircle2 className="size-3" />
                      Verified Purchase
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </m.div>
        ))}
      </div>
    </div>
  );
}

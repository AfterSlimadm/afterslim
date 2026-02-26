import { cn } from "@/lib/utils";
import type { SupplementFacts as SupplementFactsType } from "@/types/database";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SupplementFactsProps {
  facts: SupplementFactsType;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SupplementFacts({ facts, className }: SupplementFactsProps) {
  const hasDaggerIngredients = facts.ingredients.some(
    (ing) => !ing.daily_value || ing.daily_value === ""
  );

  return (
    <div
      className={cn(
        "w-full max-w-sm border-2 border-black bg-white p-1 text-black",
        className
      )}
    >
      {/* Title */}
      <div className="border-b-[10px] border-black pb-0.5 text-center">
        <h3 className="text-2xl font-extrabold leading-tight tracking-tight">
          Supplement Facts
        </h3>
      </div>

      {/* Serving info */}
      <div className="border-b border-black py-1 text-xs">
        <p>
          <span className="font-bold">Serving Size</span> {facts.serving_size}
        </p>
        <p>
          <span className="font-bold">Servings Per Container</span>{" "}
          {facts.servings_per_container}
        </p>
      </div>

      {/* Thick divider */}
      <div className="border-b-[6px] border-black" />

      {/* Column headers */}
      <div className="flex items-end justify-between border-b border-black py-0.5 text-[10px]">
        <span className="font-bold">Amount Per Serving</span>
        <span className="font-bold">% Daily Value</span>
      </div>

      {/* Ingredient rows */}
      {facts.ingredients.map((ingredient, index) => {
        const isLast = index === facts.ingredients.length - 1;
        const dvDisplay =
          ingredient.daily_value && ingredient.daily_value !== ""
            ? ingredient.daily_value
            : "\u2020";

        return (
          <div
            key={ingredient.name}
            className={cn(
              "flex items-baseline justify-between py-0.5 text-xs",
              !isLast && "border-b border-black/30"
            )}
          >
            <div>
              <span className="font-bold">{ingredient.name}</span>{" "}
              <span>{ingredient.amount}</span>
            </div>
            <span className="ml-4 shrink-0 font-bold">{dvDisplay}</span>
          </div>
        );
      })}

      {/* Thick divider */}
      <div className="border-b-[4px] border-black" />

      {/* Dagger footnote */}
      {hasDaggerIngredients && (
        <p className="py-1 text-[10px] leading-tight">
          <span className="font-bold">&dagger;</span> Daily Value not
          established.
        </p>
      )}

      {/* Other ingredients */}
      {facts.other_ingredients && (
        <div className="border-t border-black py-1.5 text-[10px] leading-tight">
          <span className="font-bold">Other Ingredients: </span>
          {facts.other_ingredients}
        </div>
      )}

      {/* Allergen warning */}
      {facts.allergen_warning && (
        <div className="border-t border-black py-1.5 text-[10px] leading-tight">
          <span className="font-bold">Allergen Warning: </span>
          {facts.allergen_warning}
        </div>
      )}
    </div>
  );
}

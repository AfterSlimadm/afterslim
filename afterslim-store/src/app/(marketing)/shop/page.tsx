import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { ShopPDP } from "./shop-pdp";

export const metadata: Metadata = {
  title: `AfterSlim | Berberine-Powered GLP-1 Companion Supplement`,
  description:
    "9 science-backed ingredients in one formula. Metabolism, energy, sleep, and recovery support for people on Ozempic, Mounjaro, and Wegovy.",
  openGraph: {
    title: `Shop AfterSlim | ${SITE.name}`,
    description:
      "9 science-backed ingredients in one formula. Berberine-powered support for your GLP-1 journey.",
    type: "website",
  },
};

export default function ShopPage() {
  return <ShopPDP />;
}

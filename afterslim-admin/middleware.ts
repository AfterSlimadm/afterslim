// Next.js 16 requires config to be defined directly, not re-exported
import { proxy } from "./src/proxy";

export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

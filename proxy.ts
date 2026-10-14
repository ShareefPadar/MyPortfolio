import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * The time machine. The site has five eras: 1995 is this Next.js app (the live
 * site), and 1986, 2002, 2014 and Now are static pages generated from
 * era-system/ into public/_eras/ (npm run eras, before dev and build).
 *
 * - A link with ?era=<id> picks an era: it's remembered in the `era` cookie and
 *   that request is served in the era straight away (no redirect, so it works
 *   even with cookies off).
 * - Otherwise the cookie decides. No cookie → 1995, so first visits, search
 *   engines and link previews always get the live site.
 * - A page in another era is a rewrite, so the URL never changes: /work stays
 *   /work in every year.
 *
 * Next strips its internal RSC headers before a proxy runs, so a client-side
 * navigation inside the 1995 app can't be told apart from a page load. That's
 * fine: while the cookie says 1995 nothing is rewritten, and if a 1995 tab is
 * still open after you've switched to another year, Next sees HTML instead of
 * its data and falls back to a full page load, which lands in that year.
 */

const ERAS = ["1986", "1995", "2002", "2014", "now"] as const;
type Era = (typeof ERAS)[number];
const LIVE: Era = "1995";
const COOKIE = "era";

const isEra = (v: string | null | undefined): v is Era => !!v && (ERAS as readonly string[]).includes(v);

// the page's file in public/_eras/<era>/
const fileFor = (pathname: string) => {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/") return "index.html";
  return p.slice(1) + ".html"; // work, about, work/<slug>
};

export function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const asked = nextUrl.searchParams.get("era");
  const picked = isEra(asked) ? asked : null;
  const era: Era = picked ?? (isEra(cookies.get(COOKIE)?.value) ? (cookies.get(COOKIE)!.value as Era) : LIVE);

  let res: NextResponse;
  if (era === LIVE) {
    res = NextResponse.next();
  } else {
    res = NextResponse.rewrite(new URL(`/_eras/${era}/${fileFor(nextUrl.pathname)}`, request.url));
    // the live 1995 pages are the ones search engines should index
    res.headers.set("X-Robots-Tag", "noindex");
    res.headers.set("Cache-Control", "private, no-cache");
  }

  if (picked) {
    if (picked === LIVE) res.cookies.delete(COOKIE);
    else res.cookies.set(COOKIE, picked, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return res;
}

// Only the pages every era has. Everything else (assets, _next, the API, OG images) never reaches the proxy.
export const config = {
  matcher: ["/", "/work", "/about", "/work/:slug"],
};

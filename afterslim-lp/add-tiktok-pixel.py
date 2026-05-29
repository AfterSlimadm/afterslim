#!/usr/bin/env python3
"""
Insert the TikTok Pixel base code (PageView) + ttclid capture + the
`asTikTokAttr` helper into the <head> of every production page, right after
the Google Tag Manager block.

- Idempotent: skips files that already contain the pixel.
- Uses the placeholder TIKTOK_PIXEL_ID_PLACEHOLDER. Run set-tiktok-pixel-id.py
  (or a find/replace) to inject the real Pixel ID before deploy.

Run from afterslim-lp/:  python add-tiktok-pixel.py
"""
import os

PIXEL_BLOCK = """
<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('TIKTOK_PIXEL_ID_PLACEHOLDER');
  ttq.page();
}(window, document, 'ttq');
</script>
<!-- End TikTok Pixel Code -->
<!-- TikTok attribution capture: persist ttclid, expose asTikTokAttr() for checkout -->
<script>
(function(){
  try{var c=new URLSearchParams(location.search).get('ttclid');if(c)localStorage.setItem('as_ttclid',c);}catch(e){}
  window.asTikTokAttr=function(){
    var ttclid='';try{ttclid=localStorage.getItem('as_ttclid')||'';}catch(e){}
    var ttp='';try{var m=document.cookie.match(/(?:^|; )_ttp=([^;]+)/);if(m)ttp=decodeURIComponent(m[1]);}catch(e){}
    return {ttclid:ttclid,ttp:ttp};
  };
})();
</script>
"""

GTM_END = "<!-- End Google Tag Manager -->"
GTM_SCRIPT_CLOSE = ",'GTM-WVF2ZGCL');</script>"


def find_pages(root="."):
    pages = []
    for dirpath, _dirs, files in os.walk(root):
        if "node_modules" in dirpath:
            continue
        for f in files:
            if f == "index.html":
                pages.append(os.path.join(dirpath, f))
    return sorted(pages)


def main():
    pages = find_pages()
    inserted, skipped, failed = [], [], []

    for path in pages:
        with open(path, "r", encoding="utf-8") as fh:
            html = fh.read()

        if "TiktokAnalyticsObject" in html:
            skipped.append(path)
            continue

        if GTM_END in html:
            html = html.replace(GTM_END, GTM_END + PIXEL_BLOCK, 1)
        elif GTM_SCRIPT_CLOSE in html:
            html = html.replace(
                GTM_SCRIPT_CLOSE, GTM_SCRIPT_CLOSE + PIXEL_BLOCK, 1
            )
        else:
            failed.append(path)
            continue

        with open(path, "w", encoding="utf-8") as fh:
            fh.write(html)
        inserted.append(path)

    print(f"Inserted: {len(inserted)}")
    for p in inserted:
        print("  +", p)
    if skipped:
        print(f"Skipped (already had pixel): {len(skipped)}")
    if failed:
        print(f"FAILED (no GTM anchor): {len(failed)}")
        for p in failed:
            print("  !", p)


if __name__ == "__main__":
    main()

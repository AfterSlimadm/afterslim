/**
 * AfterSlim Checkout — redirects "Shop Now" buttons to embedded checkout page.
 */
(function () {
  // Map button text to quantities
  var QTY_MAP = {
    "shop now": 1,
    "shop afterslim": 1,
    "shop bundle": 6,
  };

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("button, a");
    if (!btn) return;
    var text = (btn.textContent || "").trim().toLowerCase();

    // Check if this is a shop button
    var qty = QTY_MAP[text];
    if (qty === undefined) return;

    e.preventDefault();
    e.stopPropagation();

    // Figure out quantity from context (parent card position)
    var card = btn.closest("[class*='card'], [class*='Card'], [class*='product']");
    if (card) {
      var allCards = card.parentElement ? Array.from(card.parentElement.children) : [];
      var idx = allCards.indexOf(card);
      // 0=1 bottle, 1=3 bottles, 2=6 bottles
      if (idx === 1) qty = 3;
      else if (idx === 2) qty = 6;
    }

    window.location.href = "/checkout?qty=" + qty;
  });
})();

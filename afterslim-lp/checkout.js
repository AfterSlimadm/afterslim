/**
 * AfterSlim Checkout — redirects pricing buttons to checkout page.
 * Works with lp-v3 button texts: "Try AfterSlim", "Get 2 Bottles", "Get 3 Bottles"
 */
(function () {
  var QTY_MAP = {
    "try afterslim": 1,
    "get 2 bottles": 2,
    "get 3 bottles": 3,
    "order now": 1,
    "start protecting your gut": 2,
  };

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("button, a");
    if (!btn) return;
    var text = (btn.textContent || "").trim().toLowerCase();

    var qty = QTY_MAP[text];
    if (qty === undefined) return;

    e.preventDefault();
    e.stopPropagation();
    window.location.href = "/checkout?qty=" + qty;
  });
})();

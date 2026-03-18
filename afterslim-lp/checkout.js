/**
 * AfterSlim Checkout — connects "Shop Now" buttons to Stripe via admin API.
 * Include this script at the bottom of the LP: <script src="/checkout.js"></script>
 */
(function () {
  var API = "https://admin.afterslim.com/api/checkout";

  function startCheckout(btn) {
    btn.disabled = true;
    btn.textContent = "Loading...";

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 1 }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert("Something went wrong. Please try again.");
          btn.disabled = false;
          btn.textContent = "Shop Now";
        }
      })
      .catch(function () {
        alert("Connection error. Please try again.");
        btn.disabled = false;
        btn.textContent = "Shop Now";
      });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("button, a");
    if (!btn) return;
    var text = (btn.textContent || "").trim().toLowerCase();
    if (text === "shop now" || text === "shop afterslim") {
      e.preventDefault();
      e.stopPropagation();
      startCheckout(btn);
    }
  });
})();

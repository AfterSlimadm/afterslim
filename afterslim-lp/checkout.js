/**
 * AfterSlim Checkout — redirects Shop Now / CTA buttons to checkout page
 * with the correct quantity and subscription parameters.
 */
(function () {
  document.addEventListener("click", function (e) {
    // Desktop first bundle: desktop-add-to-cart
    var btn = e.target.closest(".desktop-add-to-cart");
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      // Uses global variables from the desktop product section script
      var qty = window.desktopSelectedQty || 2;
      var isSubscribe = window.desktopPurchaseType === "subscribe";
      var url = "/checkout?qty=" + qty;
      if (isSubscribe) url += "&subscribe=true";
      window.location.href = url;
      return;
    }

    // Desktop second bundle: btn-bundle-shop
    btn = e.target.closest(".btn-bundle-shop");
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      var selectedOption = document.querySelector(".bundle-option.selected");
      var qty = selectedOption ? selectedOption.getAttribute("data-qty") : "2";
      var toggleBtn = document.querySelector(".bundle-toggle-btn.active");
      var isSubscribe = toggleBtn && toggleBtn.getAttribute("data-type") === "subscribe";
      var url = "/checkout?qty=" + qty;
      if (isSubscribe) url += "&subscribe=true";
      window.location.href = url;
      return;
    }

    // Mobile bundle: mobile-add-to-cart
    btn = e.target.closest(".mobile-add-to-cart");
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      var selectedQty = document.querySelector(".mobile-qty-option.selected");
      var qtyIndex = selectedQty
        ? Array.from(document.querySelectorAll(".mobile-qty-option")).indexOf(selectedQty) + 1
        : 2;
      var purchaseOption = document.querySelector(".mobile-purchase-option.selected");
      var allOptions = document.querySelectorAll(".mobile-purchase-option");
      var isSubscribe = purchaseOption === allOptions[0];
      var url = "/checkout?qty=" + qtyIndex;
      if (isSubscribe) url += "&subscribe=true";
      window.location.href = url;
      return;
    }
  });
})();

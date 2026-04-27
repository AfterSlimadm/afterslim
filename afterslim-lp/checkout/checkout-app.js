/**
 * AfterSlim Custom Checkout — 3-step checkout with Stripe Elements
 */
(function() {
  // Config
  var PK = 'pk_live_51TC4a9Ay7m7ndbNOiC086tsFYZ2AYWhz9t001JGU7f2S8Sk3GFkCQTwcoibyWUWxjtEOfTTUkaAoLdloz3L0JWcC00cIrsgQzP';
  var API_URL = '/api/checkout';

  var PRICE_MAP = {
    '1-onetime':   'price_1TC4qvAy7m7ndbNOmzhrCfLv',
    '1-subscribe': 'price_1TMbv8Ay7m7ndbNOKKiA3vxk',
    '2-onetime':   'price_1TMbxdAy7m7ndbNOYi3z5QoA',
    '2-subscribe': 'price_1TMbzPAy7m7ndbNO1zsXcJ6e',
    '3-onetime':   'price_1TMc1AAy7m7ndbNO7vOXSCU6',
    '3-subscribe': 'price_1TMc2MAy7m7ndbNOh5oPM3MF'
  };

  var PRODUCT_INFO = {
    '1-onetime':   { name: 'AfterSlim GLP-1 Companion', variant: '1 bottle - 30 day supply', price: 37.99, unit: '$37.99' },
    '1-subscribe': { name: 'AfterSlim GLP-1 Companion', variant: '1 bottle - monthly subscription', price: 27.99, unit: '$27.99/mo' },
    '2-onetime':   { name: 'AfterSlim GLP-1 Companion', variant: '2 bottles - 60 day supply', price: 57.99, unit: '$29.00/bottle' },
    '2-subscribe': { name: 'AfterSlim GLP-1 Companion', variant: '2 bottles - monthly subscription', price: 47.99, unit: '$24.00/bottle' },
    '3-onetime':   { name: 'AfterSlim GLP-1 Companion', variant: '3 bottles - 90 day supply', price: 67.99, unit: '$22.66/bottle' },
    '3-subscribe': { name: 'AfterSlim GLP-1 Companion', variant: '3 bottles - monthly subscription', price: 57.99, unit: '$19.33/bottle' }
  };

  // Parse URL params
  var params = new URLSearchParams(window.location.search);
  var rawQty = parseInt(params.get('qty')) || 1;
  var qty = [1,2,3].indexOf(rawQty) >= 0 ? rawQty : 1;
  var isSubscribe = params.get('subscribe') === 'true';
  var key = qty + '-' + (isSubscribe ? 'subscribe' : 'onetime');
  var priceId = PRICE_MAP[key];
  var info = PRODUCT_INFO[key];

  // State
  var currentStep = 1;
  var customerData = { name: '', email: '', phone: '' };
  var shippingData = { address: '', city: '', state: '', zip: '', country: 'US' };
  var stripe, elements, cardElement;

  // DOM refs
  var stepCards = [null, document.getElementById('step1'), document.getElementById('step2'), document.getElementById('step3')];
  var stepIndicators = document.querySelectorAll('.step-indicator');
  var errorEl = document.getElementById('checkout-error');
  var processingEl = document.getElementById('processing');

  // Init sidebar
  function initSidebar() {
    var el;
    el = document.getElementById('sidebar-name');
    if (el) el.textContent = info.name;
    el = document.getElementById('sidebar-variant');
    if (el) el.textContent = info.variant;
    el = document.getElementById('sidebar-price');
    if (el) el.textContent = '$' + info.price.toFixed(2);
    el = document.getElementById('sidebar-subtotal');
    if (el) el.textContent = '$' + info.price.toFixed(2);
    el = document.getElementById('sidebar-total');
    if (el) el.textContent = '$' + info.price.toFixed(2);
  }

  // Show/hide steps
  function showStep(step) {
    currentStep = step;
    for (var i = 1; i <= 3; i++) {
      var card = stepCards[i];
      var ind = stepIndicators[i-1];
      if (!card || !ind) continue;

      if (i < step) {
        card.className = 'step-card done';
        ind.className = 'step-indicator completed';
        // Show summary
        var formEl = card.querySelector('.step-form');
        var summaryEl = card.querySelector('.step-summary');
        if (formEl) formEl.style.display = 'none';
        if (summaryEl) summaryEl.style.display = 'block';
      } else if (i === step) {
        card.className = 'step-card';
        ind.className = 'step-indicator active';
        var formEl = card.querySelector('.step-form');
        var summaryEl = card.querySelector('.step-summary');
        if (formEl) formEl.style.display = 'block';
        if (summaryEl) summaryEl.style.display = 'none';
      } else {
        card.className = 'step-card collapsed';
        ind.className = 'step-indicator';
        var formEl = card.querySelector('.step-form');
        var summaryEl = card.querySelector('.step-summary');
        if (formEl) formEl.style.display = 'none';
        if (summaryEl) summaryEl.style.display = 'none';
      }
    }
  }

  // Validate step 1
  function validateStep1() {
    var name = document.getElementById('f-name').value.trim();
    var email = document.getElementById('f-email').value.trim();
    var phone = document.getElementById('f-phone').value.trim();
    var valid = true;

    if (!name || name.length < 2) {
      document.getElementById('f-name').classList.add('error');
      valid = false;
    } else {
      document.getElementById('f-name').classList.remove('error');
    }

    if (!email || email.indexOf('@') < 1) {
      document.getElementById('f-email').classList.add('error');
      valid = false;
    } else {
      document.getElementById('f-email').classList.remove('error');
    }

    if (valid) {
      customerData.name = name;
      customerData.email = email;
      customerData.phone = phone;
      document.getElementById('summary1').innerHTML =
        '<span>' + name + '</span><span>' + email + '</span>' + (phone ? '<span>' + phone + '</span>' : '');
      showStep(2);
    }
  }

  // Validate step 2
  function validateStep2() {
    var address = document.getElementById('f-address').value.trim();
    var city = document.getElementById('f-city').value.trim();
    var state = document.getElementById('f-state').value.trim();
    var zip = document.getElementById('f-zip').value.trim();
    var country = document.getElementById('f-country').value;
    var valid = true;

    ['f-address','f-city','f-state','f-zip'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
      else { el.classList.remove('error'); }
    });

    if (valid) {
      shippingData = { address: address, city: city, state: state, zip: zip, country: country };
      document.getElementById('summary2').innerHTML =
        '<span>' + address + '</span><span>' + city + ', ' + state + ' ' + zip + '</span><span>' + country + '</span>';
      showStep(3);
      initStripe();
    }
  }

  // Init Stripe Elements
  function initStripe() {
    if (stripe) return;
    stripe = Stripe(PK);
    elements = stripe.elements();
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#1a1a1a',
          '::placeholder': { color: '#999' }
        }
      }
    });
    cardElement.mount('#card-element');
    cardElement.on('focus', function() {
      document.getElementById('card-element').parentElement.classList.add('focused');
    });
    cardElement.on('blur', function() {
      document.getElementById('card-element').parentElement.classList.remove('focused');
    });
  }

  // Process payment
  async function processPayment() {
    errorEl.style.display = 'none';
    processingEl.classList.add('active');

    try {
      // Create PaymentIntent or Subscription via backend
      var res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_id: priceId,
          customer_email: customerData.email,
          customer_name: customerData.name,
          shipping: shippingData
        })
      });

      if (!res.ok) {
        var errData = await res.json().catch(function() { return {}; });
        throw new Error(errData.error || 'Failed to create payment');
      }

      var data = await res.json();

      // Confirm payment with Stripe Elements
      var result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone || undefined,
            address: {
              line1: shippingData.address,
              city: shippingData.city,
              state: shippingData.state,
              postal_code: shippingData.zip,
              country: shippingData.country
            }
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Success - redirect
      var piId = result.paymentIntent ? result.paymentIntent.id : '';
      window.location.href = '/checkout/success?payment_id=' + piId;

    } catch (err) {
      processingEl.classList.remove('active');
      errorEl.textContent = err.message || 'Something went wrong. Please try again.';
      errorEl.style.display = 'block';
    }
  }

  // Click handlers for done steps
  document.addEventListener('click', function(e) {
    var doneCard = e.target.closest('.step-card.done');
    if (doneCard) {
      var stepNum = parseInt(doneCard.id.replace('step', ''));
      if (stepNum && stepNum < currentStep) {
        showStep(stepNum);
      }
    }
  });

  // Wire up buttons
  document.getElementById('btn-step1').addEventListener('click', validateStep1);
  document.getElementById('btn-step2').addEventListener('click', validateStep2);
  document.getElementById('btn-pay').addEventListener('click', processPayment);

  // Allow Enter key to advance
  document.querySelectorAll('.step-form input').forEach(function(input) {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        var btn = this.closest('.step-card').querySelector('.btn-next');
        if (btn) btn.click();
      }
    });
  });

  // Init
  initSidebar();
  showStep(1);

})();

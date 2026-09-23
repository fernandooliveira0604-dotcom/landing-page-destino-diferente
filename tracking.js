// ============================================================
// tracking.js — Meta Pixel
// Pixel ID: 1246179545938164
// ============================================================

(function () {

  var PIXEL_ID = '1246179545938164';

  // Carrega o Meta Pixel
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);

  // PageView ao carregar
  fbq('track', 'PageView');

  function attachEvents() {

    // ── Botões do Hotmart (InitiateCheckout + AddToCart) ──────
    // Apenas os 2 botões que levam direto ao checkout
    var hotmartButtons = document.querySelectorAll('a[href*="pay.hotmart"]');

    hotmartButtons.forEach(function (btn) {
      if (btn.dataset.pixelCheckout) return;
      btn.dataset.pixelCheckout = 'true';

      btn.addEventListener('click', function () {
        var href    = btn.getAttribute('href') || '';
        var isCombo = href.indexOf('I106554872V') !== -1;

        var eventData = {
          content_name: isCombo ? 'Combo Flórida Inteligente' : 'Orlando Inteligente',
          content_ids:  [isCombo ? 'combo-florida-inteligente' : 'orlando-inteligente'],
          content_type: 'product',
          currency:     'BRL',
          value:        isCombo ? 67.90 : 24.90
        };

        fbq('track', 'AddToCart', eventData);
        fbq('track', 'InitiateCheckout', eventData);
      });
    });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachEvents);
  } else {
    attachEvents();
  }

})();

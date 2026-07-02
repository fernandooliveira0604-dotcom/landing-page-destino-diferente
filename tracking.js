// ============================================================
// tracking.js — Meta Pixel
// Pixel ID: 1246179545938164
// Eventos: PageView, AddToCart, InitiateCheckout
// ============================================================

(function () {

  var PIXEL_ID = '1246179545938164';

  // 1) Carrega o Meta Pixel
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);

  // 2) PageView — dispara quando a página carrega
  fbq('track', 'PageView');

  // 3) AddToCart + InitiateCheckout — dispara ao clicar nos botões de compra
  function attachEvents() {
    // Seleciona todos os botões de compra
    var buttons = document.querySelectorAll(
      'a[href*="hotmart"], .btn-primary, .fab-btn, .urgency-btn'
    );

    buttons.forEach(function (btn) {
      if (btn.dataset.pixelAttached) return;
      btn.dataset.pixelAttached = 'true';

      btn.addEventListener('click', function () {
        // Detecta qual produto pelo href ou texto do botão
        var href = btn.getAttribute('href') || '';
        var text = (btn.innerText || btn.textContent || '').toUpperCase();
        var isCombo = href.indexOf('I106554872V') !== -1 || text.indexOf('COMBO') !== -1;

        var productName  = isCombo ? 'Combo Flórida Inteligente' : 'Orlando Inteligente';
        var productValue = isCombo ? 67.90 : 24.90;
        var productId    = isCombo ? 'combo-florida-inteligente' : 'orlando-inteligente';

        var eventData = {
          content_name: productName,
          content_ids:  [productId],
          content_type: 'product',
          currency:     'BRL',
          value:        productValue,
        };

        // AddToCart
        fbq('track', 'AddToCart', eventData);

        // InitiateCheckout — dispara imediatamente antes do redirecionamento
        fbq('track', 'InitiateCheckout', eventData);
      });
    });
  }

  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachEvents);
  } else {
    attachEvents();
  }

})();

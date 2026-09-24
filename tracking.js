// ============================================================
// tracking.js — Meta Pixel + UTM Tracking
// Pixel ID: 1246179545938164
// ============================================================

(function () {

  var PIXEL_ID = '1246179545938164';

  // ============================================================
  // META PIXEL
  // ============================================================

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


  // ============================================================
  // UTM TRACKING
  // ============================================================

  var UTM_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
  ];

  var UTM_STORAGE_KEY = 'destino_diferente_utms';


  // ------------------------------------------------------------
  // Captura UTMs presentes na URL
  // ------------------------------------------------------------

  function getUTMsFromURL() {

    var params = new URLSearchParams(window.location.search);
    var utms = {};

    UTM_PARAMS.forEach(function (param) {

      var value = params.get(param);

      if (value) {
        utms[param] = value;
      }

    });

    return utms;
  }


  // ------------------------------------------------------------
  // Recupera UTMs salvas no navegador
  // ------------------------------------------------------------

  function getSavedUTMs() {

    try {

      var saved = localStorage.getItem(UTM_STORAGE_KEY);

      if (!saved) {
        return {};
      }

      return JSON.parse(saved);

    } catch (error) {

      console.warn(
        'Erro ao recuperar UTMs:',
        error
      );

      return {};

    }

  }


  // ------------------------------------------------------------
  // Salva UTMs
  // ------------------------------------------------------------

  function saveUTMs() {

    var urlUTMs   = getUTMsFromURL();
    var savedUTMs = getSavedUTMs();

    /*
     * Se chegaram novas UTMs pela URL,
     * elas atualizam as antigas.
     *
     * Caso contrário, mantém as UTMs já salvas.
     */

    var finalUTMs = Object.assign(
      {},
      savedUTMs,
      urlUTMs
    );

    if (Object.keys(finalUTMs).length > 0) {

      localStorage.setItem(
        UTM_STORAGE_KEY,
        JSON.stringify(finalUTMs)
      );

    }

    return finalUTMs;

  }


  // ============================================================
  // ADICIONA UTMs AOS LINKS DA HOTMART
  // ============================================================

  function addUTMsToHotmartLinks() {

    var utms = getSavedUTMs();

    if (Object.keys(utms).length === 0) {
      return;
    }

    /*
     * Encontra todos os links que levam para o checkout
     * da Hotmart.
     */

    var hotmartButtons = document.querySelectorAll(
      'a[href*="pay.hotmart"]'
    );


    hotmartButtons.forEach(function (btn) {

      try {

        var href = btn.getAttribute('href');

        if (!href) {
          return;
        }

        var url = new URL(
          href,
          window.location.origin
        );


        UTM_PARAMS.forEach(function (param) {

          if (utms[param]) {

            url.searchParams.set(
              param,
              utms[param]
            );

          }

        });


        /*
         * Atualiza o href do botão
         * preservando todos os parâmetros que
         * já existiam no link da Hotmart.
         */

        btn.setAttribute(
          'href',
          url.toString()
        );


      } catch (error) {

        console.warn(
          'Erro ao adicionar UTMs ao link da Hotmart:',
          error
        );

      }

    });

  }


  // ============================================================
  // HOTMART + META PIXEL
  // ============================================================

  function attachEvents() {

    // ── Botões do Hotmart (InitiateCheckout + AddToCart) ──────
    // Apenas os botões que levam direto ao checkout

    var hotmartButtons = document.querySelectorAll(
      'a[href*="pay.hotmart"]'
    );


    hotmartButtons.forEach(function (btn) {

      /*
       * Evita adicionar o evento duas vezes.
       */

      if (btn.dataset.pixelCheckout) {
        return;
      }

      btn.dataset.pixelCheckout = 'true';


      btn.addEventListener('click', function () {

        // ------------------------------------------------------
        // GARANTE QUE AS UTMs ESTEJAM NO LINK ANTES DO CLIQUE
        // ------------------------------------------------------

        var utms = getSavedUTMs();

        try {

          var currentHref =
            btn.getAttribute('href') || '';

          if (currentHref) {

            var url = new URL(
              currentHref,
              window.location.origin
            );


            UTM_PARAMS.forEach(function (param) {

              if (utms[param]) {

                url.searchParams.set(
                  param,
                  utms[param]
                );

              }

            });


            btn.setAttribute(
              'href',
              url.toString()
            );

          }

        } catch (error) {

          console.warn(
            'Erro ao preparar UTMs no clique:',
            error
          );

        }


        // ------------------------------------------------------
        // META PIXEL
        // ------------------------------------------------------

        var href =
          btn.getAttribute('href') || '';

        var isCombo =
          href.indexOf('I106554872V') !== -1;


        var eventData = {

          content_name:
            isCombo
              ? 'Combo Flórida Inteligente'
              : 'Orlando Inteligente',

          content_ids: [
            isCombo
              ? 'combo-florida-inteligente'
              : 'orlando-inteligente'
          ],

          content_type: 'product',

          currency: 'BRL',

          value:
            isCombo
              ? 67.90
              : 24.90

        };


        fbq(
          'track',
          'AddToCart',
          eventData
        );


        fbq(
          'track',
          'InitiateCheckout',
          eventData
        );

      });

    });

  }


  // ============================================================
  // MONITORAMENTO DE NOVOS BOTÕES
  // ============================================================

  /*
   * Caso algum botão da página seja criado dinamicamente,
   * o script identifica o novo botão e aplica o rastreamento.
   */

  function observeNewElements() {

    var observer =
      new MutationObserver(function () {

        addUTMsToHotmartLinks();
        attachEvents();

      });


    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );

  }


  // ============================================================
  // INICIALIZAÇÃO
  // ============================================================

  function init() {

    /*
     * 1. Captura e salva as UTMs.
     */

    saveUTMs();


    /*
     * 2. Adiciona as UTMs aos links existentes.
     */

    addUTMsToHotmartLinks();


    /*
     * 3. Ativa os eventos do Meta Pixel.
     */

    attachEvents();


    /*
     * 4. Monitora novos elementos.
     */

    observeNewElements();


    /*
     * DEBUG
     *
     * Para conferir as UTMs:
     * F12 → Console
     */

    console.log(
      'UTMs armazenadas:',
      getSavedUTMs()
    );

  }


  // ============================================================
  // EXECUTA QUANDO A PÁGINA ESTIVER PRONTA
  // ============================================================

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      init
    );

  } else {

    init();

  }

})();

// ============================================================
// DESTINO DIFERENTE — Central de Links
// Edite APENAS este arquivo para atualizar qualquer link da página.
// ============================================================

const LINKS = {
  comunidade: "https://chat.whatsapp.com/FpsR3NpN5tGCuJ9lnoeh4v",
  combo: "https://landing-page-destino-diferente.pages.dev/",
  hoteis: "https://www.hotels.com/affiliates/destino_diferente/international_drive",
  ingressos: "https://destinodiferente.justtraveltour.com/pt", // agora usado no card "Plataforma Completa de Reservas"
  nomad: "https://nomad.onelink.me/wIQT/10gb_europa?code=K81YL8HSTU%26n=Fernando%20Oliveira",
  chip: "https://omeuchip.com/?ref=destinodiferente",
  youtube: "https://www.youtube.com/@destino.diferente",
  instagram: "https://instagram.com/destino.diferente",
  whatsapp: "https://wa.me/5511982294713"
};

// Preenche automaticamente todos os elementos com atributo data-link
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.getAttribute("data-link");
    if (LINKS[key]) {
      el.setAttribute("href", LINKS[key]);
    }
  });
});

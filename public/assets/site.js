import { badgePolicy } from "./badge-policy.mjs";

const root = document.documentElement;
const dark = matchMedia("(prefers-color-scheme: dark)");
const theme = document.querySelector(".theme-toggle");
const currentTheme = () =>
  root.dataset.theme || (dark.matches ? "dark" : "light");
function labelTheme() {
  const label = `Switch to ${currentTheme() === "dark" ? "light" : "dark"} mode`;
  theme.setAttribute("aria-label", label);
  theme.title = label;
}
theme.hidden = false;
labelTheme();
theme.addEventListener("click", () => {
  root.dataset.theme = currentTheme() === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch {}
  labelTheme();
});
dark.addEventListener("change", labelTheme);

const menu = document.querySelector("#chapter-menu");
const openMenu = document.querySelector(".menu-toggle");
if (typeof menu.showModal === "function") {
  root.classList.add("nav-ready");
  openMenu.hidden = false;
  openMenu.addEventListener("click", () => menu.showModal());
  menu
    .querySelector(".menu-close")
    .addEventListener("click", () => menu.close());
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.close();
      const target = new URL(link.href);
      if (target.pathname === location.pathname && target.hash) {
        requestAnimationFrame(() =>
          document
            .getElementById(target.hash.slice(1))
            ?.focus({ preventScroll: true }),
        );
      }
    }),
  );
  matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches && menu.open) menu.close();
  });
}
const printButton = document.querySelector(".print-resume");
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener("click", () => print());
}

const card = document.querySelector("#id-card");
if (card) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  const inspect = card.querySelector(".inspect-badge");
  const flip = card.querySelector(".flip-card");
  const poster = card.querySelector(".badge-poster");
  const canvas = card.querySelector("canvas");
  const status = card.querySelector(".badge-status");
  let scene;
  let reversed = false;
  let loading = false;
  let contextLost = false;
  const eligible = () =>
    badgePolicy({
      reducedMotion: motion.matches,
      saveData: !!connection?.saveData,
      webglAvailable: !contextLost,
    });

  function showPoster() {
    canvas.hidden = true;
    poster.hidden = false;
    flip.hidden = true;
    inspect.setAttribute("aria-pressed", "false");
    inspect.textContent = "Inspect in 3D";
  }
  function syncPreference() {
    if (!eligible()) showPoster();
    inspect.hidden = !eligible();
  }
  syncPreference();
  motion.addEventListener("change", syncPreference);
  connection?.addEventListener("change", syncPreference);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    contextLost = true;
    syncPreference();
    status.textContent =
      "3D is unavailable. The portfolio credential image remains visible.";
  });
  inspect.addEventListener("click", async () => {
    if (loading || !eligible()) return;
    if (!canvas.hidden) {
      showPoster();
      return;
    }
    loading = true;
    inspect.disabled = true;
    inspect.textContent = "Loading 3D…";
    try {
      if (!scene) {
        const context = canvas.getContext("webgl2", {
          alpha: true,
          antialias: true,
        });
        if (!context) throw new Error("WebGL unavailable");
        const { createBadgeScene } = await import("./id-card-3d.js");
        const portrait = card.querySelector("#badge-portrait");
        portrait.loading = "eager";
        portrait.src = portrait.dataset.src;
        await Promise.allSettled([
          portrait.decode(),
          document.fonts.load('800 2rem "Barlow Condensed"'),
        ]);
        if (context.isContextLost()) throw new Error("WebGL context lost");
        scene = createBadgeScene(canvas, context, portrait);
      }
      const bounds = card.getBoundingClientRect();
      if (
        !eligible() ||
        document.hidden ||
        bounds.bottom <= 0 ||
        bounds.top >= innerHeight
      ) {
        showPoster();
        return;
      }
      canvas.hidden = false;
      poster.hidden = true;
      scene.showSide(reversed, false);
      inspect.textContent = "View studio image";
      inspect.setAttribute("aria-pressed", "true");
      flip.hidden = false;
      status.textContent =
        "3D credential ready. Drag to inspect or use Flip card.";
    } catch {
      showPoster();
      status.textContent =
        "3D could not be loaded. The portfolio credential image remains visible.";
    } finally {
      loading = false;
      inspect.disabled = false;
    }
  });
  flip.addEventListener("click", () => {
    reversed = !reversed;
    flip.setAttribute("aria-pressed", String(reversed));
    scene?.showSide(reversed);
    status.textContent = reversed
      ? "Card back: threat hunting, detection engineering, incident response."
      : "Card front: Rifqi Rofian Tanamas, L2 Security Analyst at ITSEC Asia.";
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) showPoster();
  });
  new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) showPoster();
  }).observe(card);
}

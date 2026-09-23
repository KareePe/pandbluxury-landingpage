// P and B Luxury - header interactions
// โหลดหลัง feather-icons เพราะต้องใช้ <svg> ที่ feather แปลงจาก <i> แล้ว

feather.replace();

(function () {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const desktop = window.matchMedia("(min-width: 1024px)");

  // aria-expanded drives the icon cross-fade (ดู #menu-toggle ใน assets/style.css)
  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "ปิดเมนู" : "เปิดเมนู");
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  desktop.addEventListener("change", function (e) {
    if (e.matches) setOpen(false);
  });
})();

(function () {
  const header = document.getElementById("site-header");
  if (!header) return;

  function syncHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
})();

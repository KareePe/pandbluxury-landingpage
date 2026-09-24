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

(function () {
  // ใส่ .is-in ให้ .reveal ตอนเลื่อนเข้ามาในจอ (ครั้งเดียว)
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) {
      el.classList.add("is-in");
    });
    return;
  }

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach(function (el) {
    io.observe(el);
  });
})();

(function () {
  // popup gallery ของการ์ดใน #categories — อ่านรายการรูปจาก data-gallery
  const dialog = document.getElementById("gallery");
  const triggers = document.querySelectorAll("[data-gallery]");
  if (!dialog || !triggers.length) return;

  const titleEl = dialog.querySelector("#gallery-title");
  const countEl = dialog.querySelector(".gallery-count");
  const img = dialog.querySelector(".gallery-img");
  const thumbs = dialog.querySelector(".gallery-thumbs");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let images = [];
  let index = 0;
  let title = "";

  function show(next) {
    index = (next + images.length) % images.length;
    const apply = function () {
      img.src = images[index];
      img.alt = title + " รูปที่ " + (index + 1);
      img.classList.remove("is-swapping");
    };

    if (reduceMotion.matches || !img.getAttribute("src")) {
      apply();
    } else {
      img.classList.add("is-swapping");
      setTimeout(apply, 180);
    }

    countEl.textContent =
      String(index + 1).padStart(2, "0") + " / " + String(images.length).padStart(2, "0");
    thumbs.querySelectorAll(".gallery-thumb").forEach(function (t, i) {
      t.setAttribute("aria-current", String(i === index));
    });
  }

  function open(trigger) {
    images = trigger.dataset.gallery.split(",").map(function (s) {
      return s.trim();
    });
    title = trigger.dataset.title || "";
    titleEl.textContent = title;
    dialog.classList.toggle("is-single", images.length < 2);

    thumbs.innerHTML = "";
    images.forEach(function (src, i) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "gallery-thumb tile";
      b.setAttribute("aria-label", "รูปที่ " + (i + 1));
      b.innerHTML = '<img src="' + src + '" alt="" />';
      b.addEventListener("click", function () {
        show(i);
      });
      thumbs.appendChild(b);
    });

    img.removeAttribute("src");
    show(0);
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(function () {
      dialog.classList.add("is-open");
    });
  }

  function close() {
    dialog.classList.remove("is-open");
    setTimeout(function () {
      dialog.close();
    }, reduceMotion.matches ? 0 : 280);
  }

  triggers.forEach(function (t) {
    t.addEventListener("click", function () {
      open(t);
    });
  });

  dialog.querySelector(".gallery-close").addEventListener("click", close);
  dialog.querySelector(".gallery-prev").addEventListener("click", function () {
    show(index - 1);
  });
  dialog.querySelector(".gallery-next").addEventListener("click", function () {
    show(index + 1);
  });

  // คลิกนอกกล่อง (ที่ backdrop) = ปิด
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) close();
  });

  // Esc ของ <dialog> ปิดทันที — ดักไว้ให้เล่น animation ปิดเหมือนปุ่ม
  dialog.addEventListener("cancel", function (e) {
    e.preventDefault();
    close();
  });

  dialog.addEventListener("close", function () {
    document.documentElement.style.overflow = "";
  });

  dialog.addEventListener("keydown", function (e) {
    if (images.length < 2) return;
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // ปัดซ้าย/ขวาบนมือถือ
  let startX = null;
  const stage = dialog.querySelector(".gallery-stage");
  stage.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );
  stage.addEventListener("touchend", function (e) {
    if (startX === null || images.length < 2) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();

(function () {
  // #about: ตำแหน่งเมาส์ → แสงนวลทั้ง section + ขอบทองของแต่ละการ์ด
  const section = document.querySelector(".why");
  if (!section || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const cards = section.querySelectorAll(".why-card");
  let frame = null;
  let last = null;

  function paint() {
    frame = null;
    const r = section.getBoundingClientRect();
    section.style.setProperty("--mx", last.x - r.left + "px");
    section.style.setProperty("--my", last.y - r.top + "px");
    cards.forEach(function (card) {
      const b = card.getBoundingClientRect();
      card.style.setProperty("--x", last.x - b.left + "px");
      card.style.setProperty("--y", last.y - b.top + "px");
    });
  }

  section.addEventListener("mousemove", function (e) {
    last = { x: e.clientX, y: e.clientY };
    if (!frame) frame = requestAnimationFrame(paint);
  });
})();

(function () {
  // ปุ่มกลับขึ้นบนสุด: โผล่เมื่อ #home พ้นจอ + วงแหวนบอกระยะที่เลื่อน
  const btn = document.getElementById("back-to-top");
  const hero = document.getElementById("home");
  if (!btn || !hero) return;

  new IntersectionObserver(function (entries) {
    btn.classList.toggle("is-visible", !entries[0].isIntersecting);
  }).observe(hero);

  let ticking = false;
  function syncProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    btn.style.setProperty("--progress", max > 0 ? Math.min(1, window.scrollY / max) : 0);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(syncProgress);
      }
    },
    { passive: true }
  );
  syncProgress();
})();

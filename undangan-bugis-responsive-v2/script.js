
// ========================================
// KONFIGURASI UNDANGAN
// Ubah data ini sesuai acara sebenarnya.
// ========================================

const CONFIG = {
  weddingDate: "2026-12-20T08:00:00+08:00",
  whatsappNumber: "6281234567890",
  accountNumber: "000000000000",
  guestNameParam: "to"
};

// ========================================

/* ========================================
   NAMA TAMU DARI URL PERSONAL
   Contoh: /fifi/ atau /faidah/
======================================== */

const pathParts = window.location.pathname
  .split("/")
  .filter(Boolean);

const guestSlug = pathParts.length > 1
  ? pathParts[pathParts.length - 1].toLowerCase()
  : "";

const guests = {
  fifi: "Fifi",
  faidah: "Faidah"
};

const guestName = guests[guestSlug] || "";

const guestElement = document.getElementById("guest-name");
const rsvpElement = document.getElementById("rsvp-name");

if (guestElement) {
  guestElement.textContent = guestName || "Tamu Undangan";
}

if (rsvpElement) {
  rsvpElement.value = guestName;
}


// ========================================
// MENU NAVIGASI HP
// ========================================

const menuButton = document.getElementById("menu-button");
const navLinks = document.getElementById("nav-links");

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

// ========================================
// ANIMASI SAAT SCROLL
// ========================================

// Elemen halaman muncul perlahan ketika terlihat.
const animatedElements = document.querySelectorAll(
  ".section-heading, .section-content > p, " +
  ".couple-grid, .event-card, .countdown-grid, " +
  ".gallery-grid, .timeline, .rsvp-form, " +
  ".gift-card, .footer-ornament, .footer h2"
);

animatedElements.forEach(element => {
  element.classList.add("reveal");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  animatedElements.forEach(element => {
    revealObserver.observe(element);
  });
} else {
  animatedElements.forEach(element => {
    element.classList.add("is-visible");
  });
}

// ========================================
// COUNTDOWN PERNIKAHAN
// ========================================

function updateCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const diff = target - Date.now();

  let values;

  if (Number.isNaN(target)) {
    values = ["--", "--", "--", "--"];
  } else if (diff <= 0) {
    values = [0, 0, 0, 0];
  } else {
    values = [
      Math.floor(diff / 86400000),
      Math.floor((diff % 86400000) / 3600000),
      Math.floor((diff % 3600000) / 60000),
      Math.floor((diff % 60000) / 1000)
    ];
  }

  ["days", "hours", "minutes", "seconds"].forEach((id, index) => {
    document.getElementById(id).textContent =
      String(values[index]).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ========================================
// GALERI FOTO DIPERBESAR
// ========================================

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");

document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");

    if (
      !img ||
      img.style.display === "none" ||
      !img.complete ||
      img.naturalWidth === 0
    ) {
      return;
    }

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

// ========================================
// RSVP KE WHATSAPP
// ========================================

document.getElementById("rsvp-form").addEventListener("submit", event => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);

  const message = [
    "Assalamu'alaikum, konfirmasi undangan pernikahan Faiz & Diva.",
    `Nama: ${form.get("name")}`,
    `Kehadiran: ${form.get("status")}`,
    `Jumlah tamu: ${form.get("count")}`,
    `Ucapan: ${form.get("message") || "-"}`
  ].join("\n");

  const url =
    `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

// ========================================
// SALIN NOMOR REKENING
// ========================================

document.getElementById("copy-account").addEventListener("click", async event => {
  const button = event.currentTarget;

  try {
    await navigator.clipboard.writeText(CONFIG.accountNumber);
    button.textContent = "Tersalin ✓";
  } catch {
    button.textContent = CONFIG.accountNumber;
  }
});

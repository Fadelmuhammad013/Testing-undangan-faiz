// Ubah konfigurasi di bawah sebelum undangan dipublikasikan.
const CONFIG = {
  weddingDate: "2025-08-17T08:00:00+08:00", // format ISO; ganti dengan tanggal acara yang benar
  whatsappNumber: "6281234567890", // gunakan kode negara, tanpa tanda +
  accountNumber: "000000000000",
  guestNameParam: "to"
};

// Personalisasi nama dari URL: ?to=Faidah
const params = new URLSearchParams(window.location.search);
const guest = params.get(CONFIG.guestNameParam);
if (guest) {
  const cleanGuest = guest.replace(/[<>]/g, "").trim().slice(0, 80);
  document.getElementById("guest-name").textContent = cleanGuest || "Tamu Undangan";
  document.getElementById("rsvp-name").value = cleanGuest;
}

// Mobile navigation
const menuButton = document.getElementById("menu-button");
const navLinks = document.getElementById("nav-links");
menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

// Countdown
function updateCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const diff = target - Date.now();
  const values = diff > 0 ? [
    Math.floor(diff / 86400000),
    Math.floor((diff % 86400000) / 3600000),
    Math.floor((diff % 3600000) / 60000),
    Math.floor((diff % 60000) / 1000)
  ] : [0,0,0,0];
  ["days","hours","minutes","seconds"].forEach((id, i) => {
    document.getElementById(id).textContent = String(values[i]).padStart(2,"0");
  });
}
updateCountdown(); setInterval(updateCountdown, 1000);

// Gallery lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    if (!img || img.style.display === "none" || !img.complete || img.naturalWidth === 0) return;
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
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

// RSVP opens WhatsApp with a prefilled message. It does not store responses in a database.
document.getElementById("rsvp-form").addEventListener("submit", e => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const message = [
    "Assalamu'alaikum, konfirmasi undangan pernikahan Faiz & Diva.",
    `Nama: ${form.get("name")}`,
    `Kehadiran: ${form.get("status")}`,
    `Jumlah tamu: ${form.get("count")}`,
    `Ucapan: ${form.get("message") || "-"}`
  ].join("\n");
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

// Copy bank account
document.getElementById("copy-account").addEventListener("click", async e => {
  try {
    await navigator.clipboard.writeText(CONFIG.accountNumber);
    e.currentTarget.textContent = "Tersalin ✓";
  } catch {
    e.currentTarget.textContent = CONFIG.accountNumber;
  }
});

// Music control is a UI placeholder until a licensed music file is supplied.
const musicToggle = document.getElementById("music-toggle");
musicToggle.addEventListener("click", () => {
  const label = document.getElementById("music-label");
  label.textContent = "Tambahkan musik.mp3";
  musicToggle.setAttribute("aria-pressed", "false");
});

import { db, wishesCollection } from "./firebase.js";

import {
  addDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

// ========================================
// KONFIGURASI UTAMA
// ========================================
const CONFIG = {
  weddingDate: "2026-12-20T08:00:00+08:00",
  whatsappNumber: "6285298823047",
  accountNumber: "000000000000",
  guestNameParam: "to"
};

// ========================================
// PERSONALISASI NAMA TAMU
// Mendukung URL /fifi/ dan /faidah/
// ========================================
const guestNames = {
  fifi: "Fifi",
  faidah: "Faidah"
};

const guestElement = document.getElementById("guest-name");
const rsvpNameInput = document.getElementById("rsvp-name");

const pathParts = window.location.pathname
  .split("/")
  .filter(Boolean);

const lastPathPart = (pathParts[pathParts.length - 1] || "")
  .toLowerCase();

const urlParams = new URLSearchParams(window.location.search);
const guestFromQuery = urlParams.get(CONFIG.guestNameParam);

const guestName =
  (guestFromQuery || "").replace(/[<>]/g, "").trim().slice(0, 80) ||
  guestNames[lastPathPart] ||
  "";

if (guestName) {
  if (guestElement) {
    guestElement.textContent = guestName;
  }

  if (rsvpNameInput && !rsvpNameInput.value) {
    rsvpNameInput.value = guestName;
  }
}

// ========================================
// COUNTDOWN
// ========================================
function updateCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const diff = target - Date.now();

  const values = diff > 0
    ? [
        Math.floor(diff / 86400000),
        Math.floor((diff % 86400000) / 3600000),
        Math.floor((diff % 3600000) / 60000),
        Math.floor((diff % 60000) / 1000)
      ]
    : [0, 0, 0, 0];

  ["days", "hours", "minutes", "seconds"].forEach((id, index) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = String(values[index]).padStart(2, "0");
    }
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ========================================
// GALERI FOTO / LIGHTBOX
// ========================================
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");

document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");

    if (
      !lightbox ||
      !lightboxImage ||
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
  if (!lightbox || !lightboxImage) return;

  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

// ========================================

 // ========================================
 // RSVP KE WHATSAPP + FIREBASE
 // ========================================
const rsvpForm = document.getElementById("rsvp-form");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = new FormData(rsvpForm);

    const whatsappNumber = String(CONFIG.whatsappNumber || "")
      .replace(/\D/g, "");

    if (!whatsappNumber) {
      alert("Nomor WhatsApp belum dikonfigurasi.");
      return;
    }

    const name = String(form.get("name") || "").trim();
    const status = String(form.get("status") || "-");
    const count = String(form.get("count") || "1");
    const wishes = String(form.get("message") || "").trim();

    if (!name) {
      alert("Silakan isi nama lengkap terlebih dahulu.");
      return;
    }

    // Siapkan pesan WhatsApp
    const message = [
      "Assalamu'alaikum, konfirmasi undangan pernikahan Faiz & Diva.",
      "",
      `Nama: ${name}`,
      `Kehadiran: ${status}`,
      `Jumlah tamu: ${count}`,
      `Ucapan: ${wishes || "-"}`
    ].join("\n");

    const url =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(message);

    // Buka tab WhatsApp sebelum proses async
    // agar tidak mudah diblokir oleh browser
    const whatsappWindow = window.open("about:blank", "_blank");

    try {
      // Simpan RSVP dan ucapan ke Firestore
      await addDoc(wishesCollection, {
        name: name,
        status: status,
        count: count,
        message: wishes,
        createdAt: serverTimestamp()
      });

      console.log("RSVP berhasil disimpan ke Firebase.");

      if (whatsappWindow) {
        whatsappWindow.location.href = url;
      } else {
        window.location.href = url;
      }

      rsvpForm.reset();

    } catch (error) {
      console.error("Gagal menyimpan RSVP ke Firebase:", error);

      // WhatsApp tetap bisa digunakan meskipun penyimpanan gagal
      if (whatsappWindow) {
        whatsappWindow.location.href = url;
      } else {
        window.location.href = url;
      }

      alert(
        "RSVP gagal disimpan ke database, tetapi WhatsApp tetap dibuka. " +
        "Silakan coba lagi nanti atau hubungi pengelola undangan."
      );
    }
  });
}


// ========================================
// SALIN NOMOR REKENING
// ========================================
const copyAccountButton = document.getElementById("copy-account");

if (copyAccountButton) {
  copyAccountButton.addEventListener("click", async () => {
    const accountNumber = String(CONFIG.accountNumber || "");

    if (!accountNumber) {
      alert("Nomor rekening belum dikonfigurasi.");
      return;
    }

    try {
      await navigator.clipboard.writeText(accountNumber);
      copyAccountButton.textContent = "Tersalin ✓";
    } catch (error) {
      window.prompt("Salin nomor rekening berikut:", accountNumber);
    }
  });
}

// ========================================

/* =========================

/* =========================
   BACKSOUND UNDANGAN
========================= */
(() => {
  const music = document.getElementById("background-music");

  if (!music) return;

  music.loop = true;
  music.volume = 0.7;
  music.autoplay = true;
  music.preload = "auto";

  let isPlaying = false;

  function startMusic() {
    if (isPlaying) return;

    const playPromise = music.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          removeListeners();
          console.log("Backsound berhasil diputar.");
        })
        .catch((error) => {
          console.log("Autoplay belum diizinkan:", error.name);
        });
    }
  }

  function removeListeners() {
    document.removeEventListener("click", startMusic);
    document.removeEventListener("touchstart", startMusic);
    document.removeEventListener("keydown", startMusic);
  }

  
/* ========================================
   UCAPAN & DOA DARI FIREBASE
======================================== */

const wishesList = document.getElementById("wishes-list");
const wishesCount = document.getElementById("wishes-count");

const wishesQuery = query(
  wishesCollection,
  orderBy("createdAt", "desc"),
  limit(50)
);

if (wishesList) {
  onSnapshot(
    wishesQuery,
    (snapshot) => {
      wishesList.replaceChildren();

      if (wishesCount) {
        wishesCount.textContent =
          `${snapshot.size} ucapan`;
      }

      if (snapshot.empty) {
        wishesList.textContent =
          "Belum ada ucapan. Jadilah yang pertama memberikan doa!";
        return;
      }

      snapshot.forEach((documentSnapshot) => {
        const wish = documentSnapshot.data();

        const card = document.createElement("article");
        card.className = "wish-card";

        const name = document.createElement("h3");
        name.textContent = wish.name || "Tamu";

        const message = document.createElement("p");
        message.textContent = wish.message || "Tidak ada ucapan.";

        const status = document.createElement("small");
        status.textContent =
          `Kehadiran: ${wish.status || "-"}`;

        card.append(name, message, status);
        wishesList.appendChild(card);
      });
    },
    (error) => {
      console.error("Gagal memuat ucapan:", error);

      if (wishesCount) {
        wishesCount.textContent = "Ucapan belum dapat dimuat.";
      }
    }
  );
}

  // Coba autoplay ketika script dijalankan.
  startMusic();

  // Jika ditolak browser, coba lagi saat interaksi pertama.
  document.addEventListener("click", startMusic);
  document.addEventListener("touchstart", startMusic);
  document.addEventListener("keydown", startMusic);

  // Coba kembali jika halaman selesai dimuat.
  window.addEventListener("load", startMusic, { once: true });
})();

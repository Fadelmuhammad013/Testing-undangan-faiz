// ========================================
// KONEKSI FIREBASE
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
  getFirestore,
  collection
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

// Konfigurasi aplikasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDXvORgDO4Tc-Ea0Vyc7jEcSzEQiRAHNJQ",
  authDomain: "undangan-nikah-65527.firebaseapp.com",
  projectId: "undangan-nikah-65527",
  storageBucket: "undangan-nikah-65527.firebasestorage.app",
  messagingSenderId: "516015091468",
  appId: "1:516015091468:web:6e0322b372b81f2e16e329",
  measurementId: "G-66M5V7TEDW"
};

// Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referensi koleksi ucapan
const wishesCollection = collection(db, "wishes");

// Ekspor agar bisa digunakan oleh script.js
export { db, wishesCollection };
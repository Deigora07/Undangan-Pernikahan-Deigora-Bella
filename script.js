// ================================================
// PENGATURAN UNDANGAN — ubah bagian ini sesuai kebutuhan
// ================================================
const weddingDate = new Date("2028-06-10T09:00:00+07:00");
const whatsappNumber = "081903163424"; 

// Baca nama tamu dari URL, misalnya: ?to=Keluarga%20Budi
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");
if (guest) document.getElementById("guestName").textContent = guest;

// Buka undangan dan coba putar musik setelah tindakan pengguna.
const openButton = document.getElementById("openInvitation");
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

openButton.addEventListener("click", async () => {
  document.body.classList.remove("locked");
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
  try {
    await music.play();
    musicToggle.textContent = "♫ Matikan musik";
    musicToggle.setAttribute("aria-pressed", "true");
  } catch (error) {
    musicToggle.textContent = "♫ Putar musik";
  }
});

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.textContent = "♫ Matikan musik";
      musicToggle.setAttribute("aria-pressed", "true");
    } catch (error) {
      alert("Tambahkan file music.mp3 ke folder website, lalu coba lagi.");
    }
  } else {
    music.pause();
    musicToggle.textContent = "♫ Putar musik";
    musicToggle.setAttribute("aria-pressed", "false");
  }
});

// Hitung mundur ke tanggal pernikahan.
const pad = (number) => String(number).padStart(2, "0");
function updateCountdown() {
  const now = new Date();
  let remaining = weddingDate - now;
  if (remaining <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => {
      document.getElementById(id).textContent = "00";
    });
    document.getElementById("countdownMessage").textContent = "Hari bahagia kami telah tiba. Terima kasih telah menjadi bagian dari cerita kami!";
    return;
  }
  const days = Math.floor(remaining / 86400000);
  remaining %= 86400000;
  const hours = Math.floor(remaining / 3600000);
  remaining %= 3600000;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = pad(hours);
  document.getElementById("minutes").textContent = pad(minutes);
  document.getElementById("seconds").textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Animasi elemen saat masuk ke layar.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}
document.getElementById("rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const attendance = document.getElementById("attendance").value;
  const guests = document.getElementById("guests").value;
  const message = document.getElementById("message").value.trim();
  const text = `RSVP Undangan Deigora & Salsa%0A%0ANama: ${encodeURIComponent(name)}%0AKehadiran: ${encodeURIComponent(attendance)}%0AJumlah tamu: ${encodeURIComponent(guests)} orang%0AUcapan: ${encodeURIComponent(message || "-")}`;
  const status = document.getElementById("formStatus");

  if (!whatsappNumber) {
    status.textContent = "Formulir berhasil diuji. Untuk mengirim RSVP secara online, isi whatsappNumber di script.js dengan nomor WhatsApp tujuan.";
    alert(`RSVP contoh:\nNama: ${name}\nKehadiran: ${attendance}\nJumlah tamu: ${guests}\nUcapan: ${message || "-"}`);
    return;
  }
  window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener,noreferrer");
  status.textContent = "WhatsApp dibuka untuk mengirim konfirmasi. Tekan Kirim di WhatsApp untuk menyelesaikannya.";
});

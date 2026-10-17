// Av. Fatma Atalay Kötelek — script.js
document.getElementById("year").textContent = new Date().getFullYear();

// Mobil menü
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  toggle.setAttribute("aria-expanded", String(links.classList.toggle("open")));
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// WhatsApp iletişim formu
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const msg =
    `Merhaba, ön görüşme talep ediyorum.\n` +
    `Ad soyad: ${document.getElementById("adSoyad").value}\n` +
    `Konu: ${document.getElementById("konu").value}\n` +
    `Durum: ${document.getElementById("mesaj").value}`;
  window.open("https://wa.me/905550402394?text=" + encodeURIComponent(msg), "_blank", "noopener");
});

// Duyurular: content.json (yoksa localStorage) → boşsa bölüm gizlenir
const esc = (s) => {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
};
const fmtDate = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
};

function render(items) {
  const filled = (items || []).filter((it) => it && (it.title || it.text));
  if (!filled.length) {
    document.getElementById("dosyalar").hidden = true;
    document.getElementById("navDuyuru").hidden = true;
    return;
  }
  document.getElementById("dosyaGrid").innerHTML = filled
    .map(
      (it) => `
    <article class="dosya-card">
      ${it.image ? `<img class="dosya-image" src="${it.image}" alt="" loading="lazy">` : ""}
      <div class="dosya-body">
        ${it.date ? `<div class="dosya-date">${fmtDate(it.date)}</div>` : ""}
        <h3>${esc(it.title || "")}</h3>
        <p>${esc(it.text || "")}</p>
      </div>
    </article>`
    )
    .join("");
}

async function loadContent() {
  try {
    const res = await fetch("content.json", { cache: "no-store" });
    if (res.ok) return render((await res.json()).items);
  } catch (e) {}
  try {
    const raw = localStorage.getItem("siteContent");
    if (raw) return render(JSON.parse(raw).items);
  } catch (e) {}
  render([]);
}
loadContent();

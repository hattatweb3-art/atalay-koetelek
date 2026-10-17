// ===========================================================
// Fatma Atalay Kötelek Hukuk & Danışmanlık — admin.js
// admin.html üzerinde çalışır.
// ===========================================================

// Bu parolayı dilediğiniz gibi değiştirebilirsiniz.
// Not: Bu yalnızca tarayıcı tarafında bir kilittir, gerçek bir
// güvenlik önlemi DEĞİLDİR (statik site, sunucu tarafı doğrulama yok).
const ADMIN_PASSWORD = "corum2026";

const STORAGE_KEY = "siteContent";
const BLOCK_COUNT = 3;

// ---------- Kilit ekranı ----------
const lockCard = document.getElementById("lockCard");
const adminShell = document.getElementById("adminShell");
const pwInput = document.getElementById("pwInput");
const pwErr = document.getElementById("pwErr");
const pwSubmit = document.getElementById("pwSubmit");

function unlock() {
  lockCard.style.display = "none";
  adminShell.style.display = "block";
  initForm();
}

pwSubmit.addEventListener("click", () => {
  if (pwInput.value === ADMIN_PASSWORD) {
    unlock();
  } else {
    pwErr.textContent = "Parola hatalı, tekrar deneyin.";
  }
});
pwInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") pwSubmit.click();
});

// ---------- Form oluşturma ----------
const form = document.getElementById("contentForm");
const statusMsg = document.getElementById("statusMsg");

function blockTemplate(index, data) {
  data = data || {};
  return `
    <div class="block-card" data-index="${index}">
      <div class="sub">İçerik Bloğu ${index + 1}</div>
      <h2>${index === 0 ? "Birinci" : index === 1 ? "İkinci" : "Üçüncü"} Duyuru / İçerik</h2>
      <div class="field">
        <label for="title-${index}">Başlık</label>
        <input type="text" id="title-${index}" data-field="title" value="${escapeAttr(data.title || "")}" placeholder="Örn: Ağır Ceza Yargılamalarında Yeni Süreç">
      </div>
      <div class="field">
        <label for="text-${index}">Metin</label>
        <textarea id="text-${index}" data-field="text" placeholder="İçerik metnini buraya yazın...">${escapeHtml(data.text || "")}</textarea>
      </div>
      <div class="field">
        <label for="date-${index}">Tarih</label>
        <input type="date" id="date-${index}" data-field="date" value="${data.date || ""}">
      </div>
      <div class="field">
        <label for="image-${index}">Görsel</label>
        <div class="img-row">
          <img class="img-preview" id="preview-${index}" src="${data.image || ""}" alt="" ${data.image ? "" : 'style="opacity:.3;"'}>
          <input class="file-input" type="file" id="image-${index}" accept="image/*">
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

let state = { items: [] };

function initForm() {
  state = loadFromStorage() || { items: [] };
  while (state.items.length < BLOCK_COUNT) state.items.push({});

  form.innerHTML = state.items
    .slice(0, BLOCK_COUNT)
    .map((item, i) => blockTemplate(i, item))
    .join("");

  // Görsel yükleme dinleyicileri
  for (let i = 0; i < BLOCK_COUNT; i++) {
    const fileInput = document.getElementById(`image-${i}`);
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 1.8 * 1024 * 1024) {
        statusMsg.textContent = "Görsel çok büyük (max ~1.8MB). Daha küçük bir görsel seçin.";
        statusMsg.className = "status-msg";
        fileInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        state.items[i].image = reader.result;
        const preview = document.getElementById(`preview-${i}`);
        preview.src = reader.result;
        preview.style.opacity = "1";
      };
      reader.readAsDataURL(file);
    });
  }
}

function collectFormIntoState() {
  document.querySelectorAll(".block-card").forEach((card) => {
    const idx = Number(card.dataset.index);
    if (!state.items[idx]) state.items[idx] = {};
    card.querySelectorAll("[data-field]").forEach((el) => {
      state.items[idx][el.dataset.field] = el.value;
    });
  });
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---------- Butonlar ----------
document.getElementById("saveBtn").addEventListener("click", () => {
  collectFormIntoState();
  saveToStorage();
  statusMsg.textContent = "Kaydedildi. (Bu tarayıcıda önizlenebilir — yayınlamak için JSON Dışa Aktar'ı kullanın.)";
  statusMsg.className = "status-msg ok";
});

document.getElementById("exportBtn").addEventListener("click", () => {
  collectFormIntoState();
  saveToStorage();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "content.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  statusMsg.textContent = "content.json indirildi. Bu dosyayı GitHub deponuzdaki mevcut content.json ile değiştirin.";
  statusMsg.className = "status-msg ok";
});

document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state = parsed && parsed.items ? parsed : { items: [] };
      while (state.items.length < BLOCK_COUNT) state.items.push({});
      saveToStorage();
      initForm();
      statusMsg.textContent = "content.json içe aktarıldı.";
      statusMsg.className = "status-msg ok";
    } catch (err) {
      statusMsg.textContent = "Dosya okunamadı, geçerli bir content.json seçtiğinizden emin olun.";
      statusMsg.className = "status-msg";
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Bu tarayıcıda kayıtlı içerik verisi silinecek. Emin misiniz?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = { items: [] };
  initForm();
  statusMsg.textContent = "Tarayıcı verisi temizlendi.";
  statusMsg.className = "status-msg";
});

// Sayfa yüklenince, daha önce yayınlanmış content.json varsa onu
// öneri olarak yüklemeyi dene (yalnızca localStorage boşsa).
async function tryPrefillFromPublished() {
  if (loadFromStorage()) return;
  try {
    const res = await fetch("content.json", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    }
  } catch (e) {
    /* yoksay */
  }
}
tryPrefillFromPublished();

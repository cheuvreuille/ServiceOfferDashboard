const seedAccounts = [
  { sector: "Banque", company: "Groupe Aster", status: "Pitch planifié", iam: true, ai: true, bt: "https://example.com/dpia/aster", bu: "https://example.com/bu/aster" },
  { sector: "Énergie", company: "Voltéo", status: "En discussion", iam: true, ai: false, bt: "https://example.com/dpia/volteo", bu: "" },
  { sector: "Industrie", company: "Nexum Industries", status: "Pitch réalisé", iam: true, ai: true, bt: "https://example.com/dpia/nexum", bu: "https://example.com/bu/nexum" },
  { sector: "Assurance", company: "Horizon Assurances", status: "À contacter", iam: false, ai: true, bt: "", bu: "https://example.com/bu/horizon" },
  { sector: "Retail", company: "Maison Lumen", status: "En discussion", iam: true, ai: true, bt: "https://example.com/dpia/lumen", bu: "https://example.com/bu/lumen" },
  { sector: "Santé", company: "Clinisys", status: "À contacter", iam: true, ai: false, bt: "", bu: "" }
];

const storageKey = "identity-ai-accounts";
let accounts = JSON.parse(localStorage.getItem(storageKey) || "null") || seedAccounts;
const rows = document.querySelector("#accountRows");
const search = document.querySelector("#searchInput");
const sectorFilter = document.querySelector("#sectorFilter");
const statusFilter = document.querySelector("#statusFilter");

const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);
const statusClass = status => ({"En discussion":"discussion","Pitch planifié":"planifie","Pitch réalisé":"realise"})[status] || "";

function save() {
  localStorage.setItem(storageKey, JSON.stringify(accounts));
  document.querySelector("#updatedAt").textContent = "à l’instant";
}

function hydrateSectors() {
  const selected = sectorFilter.value;
  sectorFilter.innerHTML = '<option value="">Tous les secteurs</option>' + [...new Set(accounts.map(a => a.sector))].sort().map(s => `<option>${escapeHtml(s)}</option>`).join("");
  sectorFilter.value = selected;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase("fr");
  const filtered = accounts.filter(a => (!query || `${a.company} ${a.sector}`.toLocaleLowerCase("fr").includes(query)) && (!sectorFilter.value || a.sector === sectorFilter.value) && (!statusFilter.value || a.status === statusFilter.value));
  rows.innerHTML = filtered.map(a => {
    const index = accounts.indexOf(a);
    return `<tr><td><span class="sector">${escapeHtml(a.sector)}</span></td><td class="company">${escapeHtml(a.company)}</td><td><span class="status ${statusClass(a.status)}">${escapeHtml(a.status)}</span></td><td><span class="pill ${a.iam ? "yes" : "no"}">${a.iam ? "✦ Oui" : "— Non"}</span></td><td><span class="pill ai ${a.ai ? "yes" : "no"}">${a.ai ? "⌁ Oui" : "— Non"}</span></td><td>${a.bt ? `<a class="link" href="${escapeHtml(a.bt)}" target="_blank" rel="noreferrer">Ouvrir</a>` : '<span class="no-link">—</span>'}</td><td>${a.bu ? `<a class="link" href="${escapeHtml(a.bu)}" target="_blank" rel="noreferrer">Ouvrir</a>` : '<span class="no-link">—</span>'}</td><td><button class="delete" data-index="${index}" title="Supprimer ${escapeHtml(a.company)}">×</button></td></tr>`;
  }).join("");
  document.querySelector("#emptyState").hidden = filtered.length > 0;
  document.querySelector("#resultCount").textContent = `${filtered.length} entreprise${filtered.length > 1 ? "s" : ""} sur ${accounts.length}`;
  document.querySelector("#companyCount").textContent = accounts.length;
  document.querySelector("#activeCount").textContent = `${accounts.filter(a => a.status !== "À contacter").length} actives`;
  document.querySelector("#iamCount").textContent = accounts.filter(a => a.iam).length;
  document.querySelector("#aiCount").textContent = accounts.filter(a => a.ai).length;
  const links = accounts.filter(a => a.bt || a.bu).length;
  document.querySelector("#linkCount").textContent = `${links} liens`;
  document.querySelector("#coverage").textContent = `${accounts.length ? Math.round(links / accounts.length * 100) : 0}%`;
}

[search, sectorFilter, statusFilter].forEach(control => control.addEventListener("input", render));
document.querySelector("#clearFilters").addEventListener("click", () => { search.value = ""; sectorFilter.value = ""; statusFilter.value = ""; render(); });
rows.addEventListener("click", event => { if (!event.target.matches(".delete")) return; accounts.splice(Number(event.target.dataset.index), 1); save(); hydrateSectors(); render(); });

const dialog = document.querySelector("#accountDialog");
const form = document.querySelector("#accountForm");
document.querySelector("#openModal").addEventListener("click", () => dialog.showModal());
["#closeModal", "#cancelModal"].forEach(id => document.querySelector(id).addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  accounts.unshift({ company: data.get("company").trim(), sector: data.get("sector").trim(), status: data.get("status"), bt: data.get("bt").trim(), bu: data.get("bu").trim(), iam: data.has("iam"), ai: data.has("ai") });
  save(); hydrateSectors(); render(); form.reset(); dialog.close();
});
document.querySelector("#resetButton").addEventListener("click", () => { accounts = structuredClone(seedAccounts); save(); hydrateSectors(); render(); });

hydrateSectors();
render();

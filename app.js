const seedAccounts = [
  { sector: "Banque", company: "Groupe Aster", iam: { status: "En discussion", wavestone: "Léa Martin", client: "Marc Leroy" }, ai: { status: "Identifiée", wavestone: "Samir Diallo", client: "Sophie Bernard" }, bt: "https://example.com/dpia/aster", bu: "https://example.com/bu/aster" },
  { sector: "Énergie", company: "Voltéo", iam: { status: "Proposition envoyée", wavestone: "Léa Martin", client: "Julie Robert" }, ai: { status: "Non qualifiée", wavestone: "", client: "" }, bt: "https://example.com/dpia/volteo", bu: "" },
  { sector: "Industrie", company: "Nexum Industries", iam: { status: "Gagnée", wavestone: "Paul Petit", client: "Alain Morel" }, ai: { status: "En discussion", wavestone: "Samir Diallo", client: "Alain Morel" }, bt: "https://example.com/dpia/nexum", bu: "https://example.com/bu/nexum" },
  { sector: "Assurance", company: "Horizon Assurances", iam: { status: "Non qualifiée", wavestone: "", client: "" }, ai: { status: "À qualifier", wavestone: "Chloé Simon", client: "" }, bt: "", bu: "https://example.com/bu/horizon" },
  { sector: "Retail", company: "Maison Lumen", iam: { status: "Identifiée", wavestone: "Paul Petit", client: "Emma Dubois" }, ai: { status: "Identifiée", wavestone: "Chloé Simon", client: "Emma Dubois" }, bt: "https://example.com/dpia/lumen", bu: "https://example.com/bu/lumen" },
  { sector: "Santé", company: "Clinisys", iam: { status: "À qualifier", wavestone: "Léa Martin", client: "" }, ai: { status: "Non qualifiée", wavestone: "", client: "" }, bt: "", bu: "" }
];

const storageKey = "identity-ai-accounts";
let accounts = JSON.parse(localStorage.getItem(storageKey) || "null") || structuredClone(seedAccounts);
accounts = accounts.map(account => ({
  ...account,
  iam: account.iam && typeof account.iam === "object" ? account.iam : { status: account.iam ? "Identifiée" : "Non qualifiée", wavestone: "", client: "" },
  ai: account.ai && typeof account.ai === "object" ? account.ai : { status: account.ai ? "Identifiée" : "Non qualifiée", wavestone: "", client: "" }
}));

const rows = document.querySelector("#accountRows");
const search = document.querySelector("#searchInput");
const sectorFilter = document.querySelector("#sectorFilter");
const statusFilter = document.querySelector("#statusFilter");
const offerStatuses = ["À qualifier", "Identifiée", "En discussion", "Proposition envoyée", "Gagnée", "Non qualifiée"];
const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
const offerStatusClass = status => status.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-");

function updateTimestamp() {
  document.querySelector("#updatedAt").textContent = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
}

function save() {
  localStorage.setItem(storageKey, JSON.stringify(accounts));
  updateTimestamp();
}

function hydrateSectors() {
  const selected = sectorFilter.value;
  sectorFilter.innerHTML = '<option value="">Tous les secteurs</option>' + [...new Set(accounts.map(account => account.sector))].sort().map(sector => `<option>${escapeHtml(sector)}</option>`).join("");
  sectorFilter.value = selected;
}

function offerCells(offer, track, index) {
  const options = offerStatuses.map(status => `<option${status === offer.status ? " selected" : ""}>${status}</option>`).join("");
  return `<td><select class="inline-status ${offerStatusClass(offer.status)}" data-index="${index}" data-track="${track}" data-field="status" aria-label="Statut ${track.toUpperCase()}">${options}</select></td>
    <td><input class="inline-contact" data-index="${index}" data-track="${track}" data-field="wavestone" value="${escapeHtml(offer.wavestone)}" placeholder="Ajouter…" aria-label="Contact Wavestone ${track.toUpperCase()}"></td>
    <td><input class="inline-contact" data-index="${index}" data-track="${track}" data-field="client" value="${escapeHtml(offer.client)}" placeholder="Ajouter…" aria-label="Contact client ${track.toUpperCase()}"></td>`;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase("fr");
  const filtered = accounts.filter(account => (!query || `${account.company} ${account.sector}`.toLocaleLowerCase("fr").includes(query)) && (!sectorFilter.value || account.sector === sectorFilter.value) && (!statusFilter.value || account.iam.status === statusFilter.value || account.ai.status === statusFilter.value));
  rows.innerHTML = filtered.map(account => {
    const index = accounts.indexOf(account);
    return `<tr><td><span class="sector">${escapeHtml(account.sector)}</span></td><td class="company">${escapeHtml(account.company)}</td>${offerCells(account.iam, "iam", index)}${offerCells(account.ai, "ai", index)}<td>${account.bt ? `<a class="link" href="${escapeHtml(account.bt)}" target="_blank" rel="noreferrer">Ouvrir</a>` : '<span class="no-link">—</span>'}</td><td>${account.bu ? `<a class="link" href="${escapeHtml(account.bu)}" target="_blank" rel="noreferrer">Ouvrir</a>` : '<span class="no-link">—</span>'}</td><td><button class="delete" data-index="${index}" title="Supprimer ${escapeHtml(account.company)}">×</button></td></tr>`;
  }).join("");
  document.querySelector("#emptyState").hidden = filtered.length > 0;
  document.querySelector("#resultCount").textContent = `${filtered.length} entreprise${filtered.length > 1 ? "s" : ""} sur ${accounts.length}`;
  document.querySelector("#companyCount").textContent = accounts.length;
  document.querySelector("#activeCount").textContent = `${accounts.filter(account => account.iam.status !== "Non qualifiée" || account.ai.status !== "Non qualifiée").length} actives`;
  document.querySelector("#iamCount").textContent = accounts.filter(account => account.iam.status !== "Non qualifiée").length;
  document.querySelector("#aiCount").textContent = accounts.filter(account => account.ai.status !== "Non qualifiée").length;
  const links = accounts.filter(account => account.bt || account.bu).length;
  document.querySelector("#linkCount").textContent = `${links} liens`;
  document.querySelector("#coverage").textContent = `${accounts.length ? Math.round(links / accounts.length * 100) : 0}%`;
}

[search, sectorFilter, statusFilter].forEach(control => control.addEventListener("input", render));
document.querySelector("#clearFilters").addEventListener("click", () => { search.value = ""; sectorFilter.value = ""; statusFilter.value = ""; render(); });
rows.addEventListener("click", event => {
  if (!event.target.matches(".delete")) return;
  accounts.splice(Number(event.target.dataset.index), 1);
  save(); hydrateSectors(); render();
});
rows.addEventListener("change", event => {
  if (!event.target.matches("[data-track][data-field]")) return;
  const { index, track, field } = event.target.dataset;
  accounts[Number(index)][track][field] = event.target.value.trim();
  save(); render();
});

const dialog = document.querySelector("#accountDialog");
const form = document.querySelector("#accountForm");
document.querySelector("#openModal").addEventListener("click", () => dialog.showModal());
["#closeModal", "#cancelModal"].forEach(id => document.querySelector(id).addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  accounts.unshift({
    company: data.get("company").trim(), sector: data.get("sector").trim(), bt: data.get("bt").trim(), bu: data.get("bu").trim(),
    iam: { status: data.get("iamStatus"), wavestone: data.get("iamWavestone").trim(), client: data.get("iamClient").trim() },
    ai: { status: data.get("aiStatus"), wavestone: data.get("aiWavestone").trim(), client: data.get("aiClient").trim() }
  });
  save(); hydrateSectors(); render(); form.reset(); dialog.close();
});
document.querySelector("#resetButton").addEventListener("click", () => { accounts = structuredClone(seedAccounts); save(); hydrateSectors(); render(); });
document.querySelector("#exportButton").addEventListener("click", () => {
  const payload = { exportedAt: new Date().toISOString(), accounts };
  const file = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `identity-ai-business-plan-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  updateTimestamp();
});

hydrateSectors();
render();
updateTimestamp();

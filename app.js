const CONTACT_STATUSES = ["pas de contact", "discussion", "expertise", "pitch", "lead"];
const OFFER_STATUSES = ["inconnu", "pitch prévu", "pitch fait", "pas intéressé", "lead", "propal", "mission"];

const tabs = {
  prospection: {
    label: "Suivi prospection", icon: "⌁", description: "Contacts, pitchs et opportunités AI4IAM / IAM4AI.",
    columns: [
      { key: "secteur", label: "secteur", type: "select", options: ["manuf", "dc", "ps", "fs"] },
      { key: "entreprise", label: "entreprise", type: "text" },
      { key: "diContact", label: "di contact", type: "text" },
      { key: "ai4iamStatut", label: "statut ai4iam", type: "select", options: OFFER_STATUSES, group: "ai4iam" },
      { key: "ai4iamDate", label: "date ai4iam", type: "date", group: "ai4iam" },
      { key: "ai4iamContactClient", label: "contact client", type: "text", group: "ai4iam" },
      { key: "iam4aiStatut", label: "statut iam4ai", type: "select", options: OFFER_STATUSES, group: "iam4ai" },
      { key: "iam4aiDate", label: "date iam4ai", type: "date", group: "iam4ai" },
      { key: "iam4aiContactClient", label: "contact client", type: "text", group: "iam4ai" },
      { key: "aiContact", label: "ai contact", type: "text", group: "ai contact" },
      { key: "aiContactStatut", label: "statut", type: "select", options: CONTACT_STATUSES, group: "ai contact" },
      { key: "dpaiContact", label: "dpai contact", type: "text", group: "dpai contact" },
      { key: "dpaiContactStatut", label: "statut", type: "select", options: CONTACT_STATUSES, group: "dpai contact" },
      { key: "commentaire", label: "Commentaire", type: "textarea" }
    ],
    seed: [{ secteur: "fs", entreprise: "Groupe Aster", diContact: "Marie Dupont", aiContact: "Nora Martin", aiContactStatut: "discussion", dpaiContact: "Paul Robert", dpaiContactStatut: "pitch", ai4iamStatut: "pitch prévu", ai4iamDate: "2026-10-15", ai4iamContactClient: "Nora Martin", iam4aiStatut: "lead", iam4aiDate: "2026-10-22", iam4aiContactClient: "Paul Robert", commentaire: "Préparer le prochain atelier." }]
  },
  mission: {
    label: "Suivi mission", icon: "◇", description: "Missions en cours, références et principaux sujets.",
    columns: [
      { key: "secteur", label: "secteur", type: "select", options: ["manuf", "dc", "ps", "fs"] },
      { key: "entreprise", label: "entreprise", type: "text" }, { key: "diSponsor", label: "di sponsor", type: "text" },
      { key: "do", label: "do", type: "text" }, { key: "brancheOrga", label: "branche orga", type: "text" },
      { key: "teamW", label: "team W", type: "text" },
      { key: "statut", label: "statut", type: "select", options: ["started", "on going", "done"] },
      { key: "type", label: "type", type: "select", options: ["study", "archi", "rfp", "hands on"] },
      { key: "propaleAno", label: "propale ano", type: "select", options: ["yes", "no"] },
      { key: "ref", label: "ref", type: "select", options: ["yes", "no"] }, { key: "keyTopics", label: "key topics", type: "text" }
    ],
    seed: [{ secteur: "manuf", entreprise: "Nova Industries", diSponsor: "Sophie Leroy", do: "Digital", brancheOrga: "Europe", teamW: "Identity.ai", statut: "on going", type: "study", propaleAno: "yes", ref: "no", keyTopics: "Gouvernance des identités IA" }]
  },
  stage: {
    label: "Suivi stage", icon: "▱", description: "Stages, tutorat et livrables associés.",
    columns: [
      { key: "clientDi", label: "client di", type: "text" }, { key: "tuteurDi", label: "tuteur di", type: "text" },
      { key: "stagiaire", label: "stagiaire", type: "text" },
      { key: "statut", label: "statut", type: "select", options: ["to start", "started", "done"] },
      { key: "sharepoint", label: "sharepoint", type: "url" }, { key: "topicsKeyWord", label: "Topics & key Word", type: "text" }
    ],
    seed: [{ clientDi: "Groupe Aster", tuteurDi: "Marie Dupont", stagiaire: "Camille Bernard", statut: "started", sharepoint: "https://example.com/sharepoint", topicsKeyWord: "AI agents, identity governance" }]
  },
  expertise: {
    label: "Suivi expertise", icon: "✦", description: "Compétences consultants, solutions et certifications.",
    columns: [
      { key: "nomConsultant", label: "nom consultant", type: "text" }, { key: "nomSolution", label: "nom solution", type: "text" },
      { key: "statut", label: "statut", type: "select", options: ["sachant", "trained", "certified"] },
      { key: "nomCertification", label: "nom certification", type: "text" }
    ],
    seed: [{ nomConsultant: "Alex Martin", nomSolution: "SailPoint", statut: "certified", nomCertification: "IdentityIQ Engineer" }]
  }
};

const STORAGE_KEY = "identity-ai-dashboard-v2";
const SYNC_STORAGE_KEY = "identity-ai-dashboard-sync-v1";
const clone = value => JSON.parse(JSON.stringify(value));
const initialData = Object.fromEntries(Object.entries(tabs).map(([key, tab]) => [key, clone(tab.seed)]));
let data;
try { data = { ...initialData, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; } catch { data = clone(initialData); }
let activeTab = "prospection";
let syncConfig;
try { syncConfig = JSON.parse(localStorage.getItem(SYNC_STORAGE_KEY) || "{}"); } catch { syncConfig = {}; }
let syncTimer = null;
let pushTimer = null;
let applyingRemoteData = false;
const $ = selector => document.querySelector(selector);

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  $("#updatedAt").textContent = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
  if (!applyingRemoteData && syncConfig[activeTab]?.url) schedulePush();
}

function control(column, value = "", index = null) {
  const attributes = index === null ? `name="${column.key}"` : `data-index="${index}" data-key="${column.key}"`;
  if (column.type === "select") return `<select ${attributes} aria-label="${column.label}">${column.options.map(option => `<option${option === value ? " selected" : ""}>${option}</option>`).join("")}</select>`;
  if (column.type === "textarea") return `<textarea ${attributes} placeholder="Ajouter un commentaire…" aria-label="${column.label}">${escapeHtml(value)}</textarea>`;
  return `<input ${attributes} type="${column.type}" value="${escapeHtml(value)}" ${column.type === "url" ? 'placeholder="https://…"' : 'placeholder="—"'} aria-label="${column.label}">`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function renderHeader(columns) {
  const cells = [];
  for (let index = 0; index < columns.length;) {
    const column = columns[index];
    if (!column.group) { cells.push(`<th rowspan="2">${column.label}</th>`); index += 1; continue; }
    let count = 1;
    while (columns[index + count]?.group === column.group) count += 1;
    cells.push(`<th colspan="${count}" class="group ${column.group.replaceAll(" ", "-")}">${column.group}</th>`); index += count;
  }
  $("#tableHead").innerHTML = `<tr>${cells.join("")}<th rowspan="2" aria-label="Actions"></th></tr><tr>${columns.filter(column => column.group).map(column => `<th>${column.label}</th>`).join("")}</tr>`;
}

function metricsFor(key, rows) {
  if (key === "prospection") return [["ENTREPRISES", rows.length], ["LEADS", rows.filter(r => r.ai4iamStatut === "lead" || r.iam4aiStatut === "lead").length], ["MISSIONS", rows.filter(r => r.ai4iamStatut === "mission" || r.iam4aiStatut === "mission").length], ["PITCHS FAITS", rows.filter(r => r.ai4iamStatut === "pitch fait" || r.iam4aiStatut === "pitch fait").length]];
  if (key === "mission") return [["MISSIONS", rows.length], ["EN COURS", rows.filter(r => r.statut === "on going").length], ["TERMINÉES", rows.filter(r => r.statut === "done").length], ["RÉFÉRENCES", rows.filter(r => r.ref === "yes").length]];
  if (key === "stage") return [["STAGES", rows.length], ["À DÉMARRER", rows.filter(r => r.statut === "to start").length], ["DÉMARRÉS", rows.filter(r => r.statut === "started").length], ["TERMINÉS", rows.filter(r => r.statut === "done").length]];
  return [["CONSULTANTS", new Set(rows.map(r => r.nomConsultant).filter(Boolean)).size], ["SOLUTIONS", new Set(rows.map(r => r.nomSolution).filter(Boolean)).size], ["SACHANTS", rows.filter(r => r.statut === "sachant").length], ["CERTIFIÉS", rows.filter(r => r.statut === "certified").length]];
}

function render() {
  const tab = tabs[activeTab], rows = data[activeTab];
  $("#pageTitle").textContent = tab.label; $("#breadcrumb").textContent = tab.label; $("#pageDescription").textContent = tab.description;
  $("#tableTitle").textContent = `Tableau — ${tab.label}`; $("#modalTitle").textContent = tab.label;
  document.querySelectorAll("[data-tab]").forEach(button => button.classList.toggle("active", button.dataset.tab === activeTab));
  $("#metrics").innerHTML = metricsFor(activeTab, rows).map(([label, value], index) => `<article class="metric metric-${index}"><span>${label}</span><strong>${value}</strong><small>Mis à jour automatiquement</small></article>`).join("");
  renderHeader(tab.columns);
  const query = $("#searchInput").value.trim().toLowerCase();
  const filtered = rows.map((row, index) => ({ row, index })).filter(({ row }) => !query || Object.values(row).join(" ").toLowerCase().includes(query));
  $("#tableBody").innerHTML = filtered.map(({ row, index }) => `<tr>${tab.columns.map(column => `<td>${control(column, row[column.key], index)}</td>`).join("")}<td><button class="delete" data-delete="${index}" title="Supprimer la ligne" aria-label="Supprimer la ligne">×</button></td></tr>`).join("");
  $("#emptyState").hidden = filtered.length > 0; $("#resultCount").textContent = `${filtered.length} ligne${filtered.length > 1 ? "s" : ""} sur ${rows.length}`;
}

function setTab(key) { activeTab = key; $("#searchInput").value = ""; render(); startSync(); }
function buildTabs(container) { container.innerHTML = Object.entries(tabs).map(([key, tab]) => `<button type="button" data-tab="${key}"><span>${tab.icon}</span>${tab.label}</button>`).join(""); }
buildTabs($("#sideTabs")); buildTabs($("#mobileTabs"));
document.addEventListener("click", event => { const tabButton = event.target.closest("[data-tab]"); if (tabButton) setTab(tabButton.dataset.tab); });
$("#searchInput").addEventListener("input", render);
$("#tableBody").addEventListener("change", event => { if (!event.target.dataset.key) return; data[activeTab][Number(event.target.dataset.index)][event.target.dataset.key] = event.target.value; save(); render(); });
$("#tableBody").addEventListener("click", event => { const button = event.target.closest("[data-delete]"); if (!button) return; data[activeTab].splice(Number(button.dataset.delete), 1); save(); render(); });

const dialog = $("#rowDialog");
$("#addButton").addEventListener("click", () => { $("#formFields").innerHTML = tabs[activeTab].columns.map(column => `<label>${column.label}${control(column)}</label>`).join(""); dialog.showModal(); });
[$("#closeDialog"), $("#cancelDialog")].forEach(button => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
$("#rowForm").addEventListener("submit", event => { event.preventDefault(); const values = new FormData(event.currentTarget); const row = {}; tabs[activeTab].columns.forEach(column => { row[column.key] = String(values.get(column.key) || "").trim(); }); data[activeTab].unshift(row); save(); dialog.close(); event.currentTarget.reset(); render(); });
$("#resetButton").addEventListener("click", () => { data[activeTab] = clone(tabs[activeTab].seed); save(); render(); });

function xmlEscape(value) { return escapeHtml(value); }
function workbookXml(tabKey = activeTab) {
  const tab = tabs[tabKey];
  const rowXml = data[tabKey].map(row => `<Row>${tab.columns.map(column => `<Cell><Data ss:Type="String">${xmlEscape(row[column.key] || "")}</Data></Cell>`).join("")}</Row>`).join("");
  return `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="${xmlEscape(tab.label)}"><Table><Row>${tab.columns.map(column => `<Cell><Data ss:Type="String">${xmlEscape(column.label)}</Data></Cell>`).join("")}</Row>${rowXml}</Table></Worksheet></Workbook>`;
}
$("#exportButton").addEventListener("click", () => {
  const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([workbookXml()], { type: "application/vnd.ms-excel" })); link.download = `${activeTab}-${new Date().toISOString().slice(0, 10)}.xls`; link.click(); URL.revokeObjectURL(link.href);
});

function setSyncStatus(message, state = "ok") {
  $("#syncBanner").hidden = !syncConfig[activeTab]?.url; $("#syncStatus").textContent = message; $("#syncBanner").dataset.state = state;
  $("#syncTitle").textContent = state === "error" ? "Synchronisation interrompue" : "Excel connecté";
}
function parseWorkbook(xmlText, tabKey) {
  const documentXml = new DOMParser().parseFromString(xmlText, "application/xml");
  if (documentXml.querySelector("parsererror")) throw new Error("Le fichier reçu n’est pas un fichier Excel XML valide.");
  const rows = [...documentXml.getElementsByTagName("Row")]; if (!rows.length) return [];
  const values = row => [...row.getElementsByTagName("Cell")].map(cell => cell.getElementsByTagName("Data")[0]?.textContent || "");
  const headers = values(rows[0]), columns = tabs[tabKey].columns, indexes = columns.map(column => headers.indexOf(column.label));
  const missing = columns.filter((column, index) => indexes[index] < 0).map(column => column.label);
  if (missing.length) throw new Error(`Colonnes absentes : ${missing.join(", ")}`);
  return rows.slice(1).map(row => { const cells = values(row), item = {}; columns.forEach((column, index) => { item[column.key] = cells[indexes[index]] || ""; }); return item; });
}
async function pullExcel(showErrors = true) {
  const tabKey = activeTab, config = syncConfig[tabKey]; if (!config?.url) return;
  setSyncStatus("Lecture du fichier…", "loading");
  try {
    const headers = config.etag ? { "If-None-Match": config.etag } : {};
    const response = await fetch(config.url, { method: "GET", headers, cache: "no-store" });
    if (response.status === 304) { setSyncStatus("Fichier à jour"); return; }
    if (!response.ok) throw new Error(`Lecture impossible (HTTP ${response.status})`);
    const rows = parseWorkbook(await response.text(), tabKey);
    if (JSON.stringify(rows) !== JSON.stringify(data[tabKey])) { applyingRemoteData = true; data[tabKey] = rows; save(); applyingRemoteData = false; if (activeTab === tabKey) render(); }
    config.etag = response.headers.get("ETag") || ""; config.lastSync = new Date().toISOString(); localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(syncConfig));
    setSyncStatus(`Dernière lecture à ${new Date().toLocaleTimeString("fr-FR")}`);
  } catch (error) { applyingRemoteData = false; setSyncStatus(error.message, "error"); if (showErrors) throw error; }
}
async function pushExcel() {
  const tabKey = activeTab, config = syncConfig[tabKey]; if (!config?.url) return;
  setSyncStatus("Écriture dans le fichier…", "loading");
  try {
    const headers = { "Content-Type": "application/vnd.ms-excel" }; if (config.etag) headers["If-Match"] = config.etag;
    const response = await fetch(config.url, { method: "PUT", headers, body: workbookXml(tabKey) });
    if (response.status === 412) { await pullExcel(false); throw new Error("Le fichier a changé : sa version distante a été rechargée."); }
    if (!response.ok) throw new Error(`Écriture impossible (HTTP ${response.status})`);
    config.etag = response.headers.get("ETag") || ""; config.lastSync = new Date().toISOString(); localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(syncConfig));
    setSyncStatus(`Modifications envoyées à ${new Date().toLocaleTimeString("fr-FR")}`);
  } catch (error) { setSyncStatus(error.message, "error"); }
}
function schedulePush() { clearTimeout(pushTimer); pushTimer = setTimeout(pushExcel, 700); }
function startSync() {
  clearInterval(syncTimer); clearTimeout(pushTimer); const config = syncConfig[activeTab]; $("#syncBanner").hidden = !config?.url; if (!config?.url) return;
  setSyncStatus(config.lastSync ? `Dernière synchronisation à ${new Date(config.lastSync).toLocaleTimeString("fr-FR")}` : "Connexion en attente…");
  pullExcel(false); syncTimer = setInterval(() => pullExcel(false), Number(config.interval || 5) * 1000);
}
const syncDialog = $("#syncDialog");
$("#syncButton").addEventListener("click", () => { const config = syncConfig[activeTab] || {}; $("#syncUrl").value = config.url || ""; $("#syncInterval").value = config.interval || "5"; $("#disconnectButton").hidden = !config.url; $("#syncError").hidden = true; syncDialog.showModal(); });
[$("#closeSyncDialog"), $("#cancelSyncDialog")].forEach(button => button.addEventListener("click", () => syncDialog.close()));
$("#syncForm").addEventListener("submit", async event => { event.preventDefault(); const form = new FormData(event.currentTarget); syncConfig[activeTab] = { url: String(form.get("url")).trim(), interval: Number(form.get("interval")) }; localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(syncConfig)); try { await pullExcel(true); syncDialog.close(); startSync(); } catch (error) { $("#syncError").textContent = error.message; $("#syncError").hidden = false; } });
$("#disconnectButton").addEventListener("click", () => { delete syncConfig[activeTab]; localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(syncConfig)); syncDialog.close(); startSync(); });
$("#syncNowButton").addEventListener("click", () => pullExcel(false));

render(); save(); startSync();

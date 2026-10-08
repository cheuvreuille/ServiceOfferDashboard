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
const clone = value => JSON.parse(JSON.stringify(value));
const initialData = Object.fromEntries(Object.entries(tabs).map(([key, tab]) => [key, clone(tab.seed)]));
let data;
try { data = { ...initialData, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; } catch { data = clone(initialData); }
let activeTab = "prospection";
const columnFilters = Object.fromEntries(Object.keys(tabs).map(key => [key, {}]));
const $ = selector => document.querySelector(selector);

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  $("#updatedAt").textContent = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
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
  const filterCells = columns.map(column => {
    const value = columnFilters[activeTab][column.key] || "";
    if (column.type === "select") {
      return `<th><select data-filter="${column.key}" aria-label="Filtrer ${column.label}"><option value="">TOUS</option>${column.options.map(option => `<option value="${escapeHtml(option)}"${option === value ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select></th>`;
    }
    return `<th><input data-filter="${column.key}" type="search" value="${escapeHtml(value)}" placeholder="FILTRER…" aria-label="Filtrer ${column.label}"></th>`;
  }).join("");
  $("#tableHead").innerHTML = `<tr class="heading-row">${cells.join("")}<th rowspan="2" aria-label="Actions"></th></tr><tr class="subheading-row">${columns.filter(column => column.group).map(column => `<th>${column.label}</th>`).join("")}</tr><tr class="column-filters">${filterCells}<th><button type="button" id="clearColumnFilters" title="Effacer les filtres" aria-label="Effacer les filtres">×</button></th></tr>`;
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
  const filters = columnFilters[activeTab];
  const filtered = rows.map((row, index) => ({ row, index })).filter(({ row }) => {
    if (query && !Object.values(row).join(" ").toLowerCase().includes(query)) return false;
    return tab.columns.every(column => {
      const filter = filters[column.key];
      if (!filter) return true;
      const value = String(row[column.key] || "").toLocaleLowerCase("fr");
      return column.type === "select" ? value === filter.toLocaleLowerCase("fr") : value.includes(filter.toLocaleLowerCase("fr"));
    });
  });
  $("#tableBody").innerHTML = filtered.map(({ row, index }) => `<tr>${tab.columns.map(column => `<td>${control(column, row[column.key], index)}</td>`).join("")}<td><button class="delete" data-delete="${index}" title="Supprimer la ligne" aria-label="Supprimer la ligne">×</button></td></tr>`).join("");
  $("#emptyState").hidden = filtered.length > 0; $("#resultCount").textContent = `${filtered.length} ligne${filtered.length > 1 ? "s" : ""} sur ${rows.length}`;
}

function setTab(key) { activeTab = key; $("#searchInput").value = ""; render(); }
function buildTabs(container) { container.innerHTML = Object.entries(tabs).map(([key, tab]) => `<button type="button" data-tab="${key}"><span>${tab.icon}</span>${tab.label}</button>`).join(""); }
buildTabs($("#sideTabs")); buildTabs($("#mobileTabs"));
document.addEventListener("click", event => { const tabButton = event.target.closest("[data-tab]"); if (tabButton) setTab(tabButton.dataset.tab); });
$("#searchInput").addEventListener("input", render);
$("#tableHead").addEventListener("input", event => {
  const key = event.target.dataset.filter;
  if (!key) return;
  columnFilters[activeTab][key] = event.target.value;
  render();
  const replacement = $(`#tableHead [data-filter="${key}"]`);
  if (replacement?.matches("input")) {
    replacement.focus();
    replacement.setSelectionRange(replacement.value.length, replacement.value.length);
  }
});
$("#tableHead").addEventListener("click", event => {
  if (event.target.id !== "clearColumnFilters") return;
  columnFilters[activeTab] = {};
  render();
});
$("#tableBody").addEventListener("change", event => { if (!event.target.dataset.key) return; data[activeTab][Number(event.target.dataset.index)][event.target.dataset.key] = event.target.value; save(); render(); });
$("#tableBody").addEventListener("click", event => { const button = event.target.closest("[data-delete]"); if (!button) return; data[activeTab].splice(Number(button.dataset.delete), 1); save(); render(); });

const dialog = $("#rowDialog");
$("#addButton").addEventListener("click", () => { $("#formFields").innerHTML = tabs[activeTab].columns.map(column => `<label>${column.label}${control(column)}</label>`).join(""); dialog.showModal(); });
[$("#closeDialog"), $("#cancelDialog")].forEach(button => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
$("#rowForm").addEventListener("submit", event => { event.preventDefault(); const values = new FormData(event.currentTarget); const row = {}; tabs[activeTab].columns.forEach(column => { row[column.key] = String(values.get(column.key) || "").trim(); }); data[activeTab].unshift(row); save(); dialog.close(); event.currentTarget.reset(); render(); });
$("#resetButton").addEventListener("click", () => { data[activeTab] = clone(tabs[activeTab].seed); save(); render(); });

function xmlEscape(value) { return escapeHtml(value); }
function worksheetXml(tabKey) {
  const tab = tabs[tabKey];
  const header = tab.columns.map(column => `<Cell><Data ss:Type="String">${xmlEscape(column.label)}</Data></Cell>`).join("");
  const rows = data[tabKey].map(row => `<Row>${tab.columns.map(column => `<Cell><Data ss:Type="String">${xmlEscape(row[column.key] || "")}</Data></Cell>`).join("")}</Row>`).join("");
  return `<Worksheet ss:Name="${xmlEscape(tab.label)}"><Table><Row>${header}</Row>${rows}</Table></Worksheet>`;
}
function workbookXml() {
  return `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">${Object.keys(tabs).map(worksheetXml).join("")}</Workbook>`;
}

$("#exportButton").addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([workbookXml()], { type: "application/vnd.ms-excel;charset=utf-8" }));
  link.download = `identity-ai-dashboard-${new Date().toISOString().slice(0, 10)}.xls`;
  link.click(); URL.revokeObjectURL(link.href);
});

function rowsFromValues(values, tabKey) {
  if (!values?.length) return [];
  const headers = values[0].map(String), columns = tabs[tabKey].columns, indexes = columns.map(column => headers.indexOf(column.label));
  const missing = columns.filter((column, index) => indexes[index] < 0).map(column => column.label);
  if (missing.length) throw new Error(`Colonnes absentes : ${missing.join(", ")}`);
  return values.slice(1).filter(row => row.some(cell => cell !== "" && cell != null)).map(cells => { const item = {}; columns.forEach((column, index) => { item[column.key] = String(cells[indexes[index]] ?? ""); }); return item; });
}

function importWorkbook(xmlText) {
  const documentXml = new DOMParser().parseFromString(xmlText, "application/xml");
  if (documentXml.querySelector("parsererror")) throw new Error("Ce fichier n’est pas un export Excel valide du dashboard.");
  const worksheets = [...documentXml.getElementsByTagName("Worksheet")];
  const imported = {};
  Object.entries(tabs).forEach(([tabKey, tab]) => {
    const worksheet = worksheets.find(sheet => sheet.getAttribute("ss:Name") === tab.label || sheet.getAttributeNS("urn:schemas-microsoft-com:office:spreadsheet", "Name") === tab.label);
    if (!worksheet) throw new Error(`Onglet manquant : ${tab.label}.`);
    const rows = [...worksheet.getElementsByTagName("Row")];
    if (!rows.length) throw new Error(`L’onglet ${tab.label} ne contient pas d’en-têtes.`);
    const values = rows.map(row => [...row.getElementsByTagName("Cell")].map(cell => cell.getElementsByTagName("Data")[0]?.textContent || ""));
    imported[tabKey] = rowsFromValues(values, tabKey);
  });
  return imported;
}

$("#importButton").addEventListener("click", () => $("#importFile").click());
$("#importFile").addEventListener("change", async event => {
  const [file] = event.target.files; if (!file) return;
  try {
    const imported = importWorkbook(await file.text());
    data = imported; save(); render();
    window.alert("Import terminé : les quatre tableaux ont été restaurés.");
  } catch (error) {
    window.alert(`Import impossible : ${error.message}`);
  } finally { event.target.value = ""; }
});

render(); save();

(function () {
  "use strict";

  const core = window.AutoDataCleanerCore;
  if (!core) return;

  const els = Object.fromEntries([
    "autoCleanerFile", "autoCleanerFileName", "autoCleanerChoose", "autoCleanerProcess", "autoCleanerError",
    "autoCleanerResults", "autoCleanerSummary", "autoCleanerOldest", "autoCleanerDomains",
    "autoCleanerDownloadCsv", "autoCleanerDownloadExcel", "autoCleanerDropZone"
  ].map((id) => [id, document.getElementById(id)]));
  let selectedFile = null;
  let result = null;

  els.autoCleanerChoose?.addEventListener("click", () => els.autoCleanerFile.click());
  els.autoCleanerFile?.addEventListener("change", () => setFile(els.autoCleanerFile.files?.[0]));
  els.autoCleanerDropZone?.addEventListener("dragover", (event) => { event.preventDefault(); els.autoCleanerDropZone.classList.add("is-dragging"); });
  els.autoCleanerDropZone?.addEventListener("dragleave", () => els.autoCleanerDropZone.classList.remove("is-dragging"));
  els.autoCleanerDropZone?.addEventListener("drop", (event) => {
    event.preventDefault();
    els.autoCleanerDropZone.classList.remove("is-dragging");
    setFile(event.dataTransfer?.files?.[0]);
  });
  els.autoCleanerProcess?.addEventListener("click", processFile);
  els.autoCleanerDownloadCsv?.addEventListener("click", downloadCsv);
  els.autoCleanerDownloadExcel?.addEventListener("click", downloadExcel);

  function setFile(file) {
    selectedFile = file || null;
    els.autoCleanerFileName.textContent = file ? `${file.name} · ${formatBytes(file.size)}` : ".xlsx, .xls or .csv";
    els.autoCleanerProcess.disabled = !file;
    els.autoCleanerError.textContent = "";
  }

  async function processFile() {
    if (!selectedFile) return;
    els.autoCleanerProcess.disabled = true;
    els.autoCleanerProcess.textContent = "Processing…";
    els.autoCleanerError.textContent = "";
    try {
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const matrix = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "", raw: false });
      result = core.processRows(matrix);
      renderResult();
    } catch (error) {
      result = null;
      els.autoCleanerResults.hidden = true;
      els.autoCleanerError.textContent = error instanceof Error ? error.message : String(error);
    } finally {
      els.autoCleanerProcess.disabled = !selectedFile;
      els.autoCleanerProcess.textContent = "Process Data";
    }
  }

  function renderResult() {
    const confirmed = result.rows.filter((row) => row.confidence === "High").length;
    const unconfirmed = result.rows.length - confirmed;
    const domains = [...new Set(result.rows.map((row) => row.domain))];
    els.autoCleanerSummary.innerHTML = [
      ["Rows cleaned", result.rows.length], ["High confidence", confirmed], ["Needs review", unconfirmed], ["Domains", domains.length]
    ].map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${value}</strong></article>`).join("");
    els.autoCleanerOldest.textContent = result.oldest ? `Oldest Listing Across Case: ${formatDate(result.oldest)}` : "Oldest Listing Across Case: needs confirmation";
    els.autoCleanerDomains.innerHTML = domains.map(renderDomain).join("");
    els.autoCleanerResults.hidden = false;
    window.lucide?.createIcons?.();
    els.autoCleanerResults.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderDomain(domain) {
    const domainRows = result.rows.filter((row) => row.domain === domain);
    const suppliers = [...new Set(domainRows.map((row) => row.supplier))].sort((a, b) => {
      const aUnconfirmed = a.startsWith("Unconfirmed");
      const bUnconfirmed = b.startsWith("Unconfirmed");
      return aUnconfirmed === bUnconfirmed ? a.localeCompare(b) : aUnconfirmed ? 1 : -1;
    });
    return `<section class="auto-cleaner-domain"><h4>Domain: ${escapeHtml(domain)}</h4>${suppliers.map((supplier) => renderSupplier(supplier, domainRows.filter((row) => row.supplier === supplier))).join("")}</section>`;
  }

  function renderSupplier(supplier, rows) {
    return `<div class="auto-cleaner-supplier"><h5>${escapeHtml(supplier)}</h5><div class="auto-cleaner-table-wrap"><table><thead><tr><th>Supplier</th><th>Title</th><th>Variation details</th><th>QTY</th><th>Unit Price</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.supplier)}</td><td>${escapeHtml(row.title)}</td><td>${escapeHtml(row.variation)}</td><td>${formatNumber(row.qty)}</td><td>${row.unitPrice === null ? "needs confirmation" : formatPrice(row.unitPrice)}</td></tr>`).join("")}</tbody></table></div></div>`;
  }

  function exportRows() {
    return result.rows.map((row) => ({
      Supplier: row.supplier,
      Title: row.title,
      "Variation details": row.variation,
      QTY: row.qty,
      "Unit Price": row.unitPrice ?? "needs confirmation"
    }));
  }

  function downloadCsv() {
    if (!result) return;
    const sheet = XLSX.utils.json_to_sheet(exportRows());
    const csv = XLSX.utils.sheet_to_csv(sheet);
    downloadBlob(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }), "mc011-cleaned-data.csv");
  }

  function downloadExcel() {
    if (!result) return;
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(exportRows());
    XLSX.utils.book_append_sheet(workbook, sheet, "Cleaned Data");
    XLSX.writeFile(workbook, "mc011-cleaned-data.xlsx");
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), { href: url, download: name });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function formatDate(date) { return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date); }
  function formatPrice(value) { return Number(value).toFixed(2); }
  function formatNumber(value) { return Number.isInteger(value) ? String(value) : Number(value).toFixed(2); }
  function formatBytes(bytes) { return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`; }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]); }
})();

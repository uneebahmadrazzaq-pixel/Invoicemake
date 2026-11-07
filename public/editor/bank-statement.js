(() => {
  const fields = ["Date", "Amount", "Description"];
  const cell = (value) => String(value ?? "").trim();

  function readRows(matrix) {
    const first = matrix.findIndex(row => row.some(value => cell(value)));
    const headers = (matrix[first] || []).map(value => cell(value).replace(/^\uFEFF/, "").toLowerCase());
    const indexes = fields.map(name => headers.indexOf(name.toLowerCase()));
    if (indexes.some(index => index < 0) || fields.some(name => headers.filter(header => header === name.toLowerCase()).length !== 1)) {
      throw new Error("The first row must contain one Date, Amount and Description column each.");
    }
    const rows = matrix.slice(first + 1)
      .filter(row => row.some(value => cell(value)))
      .map(row => indexes.map(index => cell(row[index])));
    if (!rows.length) throw new Error("No transactions were found below the headers.");
    if (rows.length > 2000) throw new Error("Import up to 2,000 transactions at a time.");
    return rows;
  }

  const months = "january february march april may june july august september october november december".split(" ");
  const monthToken = months.map(month => month.length === 3 ? month : "(?:" + month + "|" + month.slice(0, 3) + ")").join("|");
  const wordDate = "\\d{1,2}[\\s-]+(?:" + monthToken + ")(?:[\\s-]+\\d{4})?";
  const statementDatePrefix = new RegExp("^(\\d{4}-\\d{1,2}-\\d{1,2}|\\d{1,2}[/-]\\d{1,2}[/-]\\d{4}|" + wordDate + ")(?=\\s|$)", "i");
  function dateKey(value, statementYear) {
    const text = cell(value);
    let y, m, d;
    let hit = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text);
    if (hit) [, y, m, d] = hit;
    else if ((hit = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(text))) [, d, m, y] = hit;
    else if ((hit = /^(\d{1,2})[\s-]+([a-z]+)(?:[\s-]+(\d{4}))?$/i.exec(text))) {
      const month = hit[2].toLowerCase();
      d = hit[1]; m = months.findIndex(name => name === month || name.slice(0, 3) === month) + 1; y = hit[3] || statementYear;
    }
    y = Number(y); m = Number(m); d = Number(d);
    if (!(y >= 1900 && y <= 2199 && m >= 1 && m <= 12 && d >= 1)) return "";
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCMonth() === m - 1 ? date.toISOString().slice(0, 10) : "";
  }

  function statementRows(lines) {
    const results = [];
    for (const line of lines) {
      const hit = statementDatePrefix.exec(line);
      if (!hit || !/\d[.,]\d{2}(?!\d)/.test(line.slice(hit[0].length))) continue;
      const detail = line.slice(hit[0].length).trim();
      if (/^(?:opening|closing|brought forward|carried forward)\s+balance\b/i.test(detail)) continue;
      results.push({ date: hit[1], protected: /\be[\s-]?bay\b/i.test(detail) });
    }
    return results;
  }

  function reviewDates(rows, source, year) {
    const byDate = new Map();
    let unresolved = 0;
    for (const entry of source) {
      const key = dateKey(entry.date, year);
      if (!key) { unresolved++; continue; }
      const entries = byDate.get(key) || [];
      entries.push(entry);
      byDate.set(key, entries);
    }
    const incoming = rows.map(row => dateKey(row[0]));
    const orderedDates = [...byDate.keys()].sort();
    const targets = incoming.map(key => !key || unresolved ? "" : byDate.has(key) ? key : orderedDates.find(date => date > key) || "");
    const targetCounts = new Map();
    targets.forEach(target => targetCounts.set(target, (targetCounts.get(target) || 0) + 1));
    return { unresolved, labels: incoming.map((key, i) => {
      if (!key) return "Check spreadsheet date";
      if (unresolved) return "Pending PDF date check";
      const target = targets[i];
      if (!target) return "No exact or later PDF date - review";
      const entries = byDate.get(target);
      if (entries.every(entry => entry.protected)) return target + " - eBay row protected";
      if (entries.length > 1 || targetCounts.get(target) > 1) return target + " - competing rows, review";
      return target + (target === key ? " - exact date, verify" : " - next later date, verify");
    }) };
  }

  async function inspectStatement(file) {
    const lib = await ensurePdfJs();
    const task = lib.getDocument({
      data: new Uint8Array(await file.arrayBuffer()),
      isEvalSupported: false, fontExtraProperties: true
    });
    try {
      const pdf = await task.promise;
      if (pdf.numPages > 50) throw new Error("Choose a PDF with up to 50 pages.");
      const fonts = new Set();
      const lines = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const [content] = await Promise.all([page.getTextContent(), page.getOperatorList()]);
        const positioned = content.items.filter(item => item.str?.trim() && item.transform);
        for (const name of new Set(positioned.map(item => item.fontName))) {
          if (!name || !page.commonObjs.has(name)) continue;
          const font = page.commonObjs.get(name);
          const label = cell(font?.name).replace(/^[A-Z]{6}\+/, "");
          if (label && !/^g_d\d+_f\d+$/.test(label)) fonts.add(label);
        }
        positioned.sort((a, b) => b.transform[5] - a.transform[5]);
        let line = [];
        const flush = () => {
          if (line.length) lines.push(line.sort((a, b) => a.transform[4] - b.transform[4]).map(item => item.str.trim()).join(" "));
          line = [];
        };
        for (const item of positioned) {
          if (line.length && Math.abs(line[0].transform[5] - item.transform[5]) > 2) flush();
          line.push(item);
        }
        flush();
        page.cleanup();
      }
      const entries = statementRows(lines);
      if (!entries.length) throw new Error("No readable dated transaction rows found. Scanned or unsupported layouts cannot be compared.");
      return { entries, fonts: [...fonts].sort() };
    } finally {
      await task.destroy();
    }
  }

  function writeReport(pdf, rows, reconciliation = false) {
    const columns = reconciliation ? [42, 132, 220, 421] : [42, 138, 240];
    const widths = reconciliation ? [80, 78, 191, 130] : [86, 92, 310];
    let y;
    const startPage = () => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(19);
      pdf.text(reconciliation ? "Transaction Reconciliation Report" : "Transaction Report", 42, 51);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("User-prepared review report. Separate from the original PDF.", 42, 69);
      pdf.setFont("helvetica", "bold");
      (reconciliation ? [...fields, "Date check"] : fields).forEach((field, i) => pdf.text(field, columns[i], 98));
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      y = 115;
    };
    startPage();
    for (const row of rows) {
      const lines = row.map((value, i) => pdf.splitTextToSize(value, widths[i]));
      const count = Math.max(...lines.map(part => part.length));
      if (count > 48) throw new Error("A transaction is too long for one PDF page. Shorten its description.");
      const height = Math.max(24, count * 13 + 8);
      if (y + height > 780) {
        pdf.addPage();
        startPage();
      }
      lines.forEach((part, i) => pdf.text(part, columns[i], y));
      pdf.setDrawColor(222, 225, 233);
      pdf.line(42, y + height - 15, 552, y + height - 15);
      y += height;
    }
  }

  if (typeof module !== "undefined" && module.exports) module.exports = { readRows, writeReport, statementRows, reviewDates };
  if (typeof document === "undefined") return;
  const file = document.getElementById("bankStatementFile");
  if (!file) return;
  const table = document.getElementById("bankStatementTable");
  const body = table.tBodies[0];
  const status = document.getElementById("bankStatementStatus");
  const download = document.getElementById("bankStatementDownload");
  const pdfInput = document.getElementById("bankStatementPdf");
  const yearInput = document.getElementById("bankStatementYear");
  const pdfStatus = document.getElementById("bankStatementPdfStatus");
  const originalPanel = document.getElementById("bankStatementOriginalPanel");
  const originalName = document.getElementById("bankStatementOriginalName");
  const originalPreview = document.getElementById("bankStatementOriginalPreview");
  const originalOpen = document.getElementById("bankStatementOriginalOpen");
  const originalDownload = document.getElementById("bankStatementOriginalDownload");
  const preview = document.getElementById("bankStatementPreview");
  const previewStatus = document.getElementById("bankStatementPreviewStatus");
  let rows = [];
  let statement = null;
  let inspecting = false;
  let revision = 0;
  let previewTimer;
  let previewUrl = "";
  let previewFilename = "";
  let originalUrl = "";

  function clearOriginal() {
    originalPanel.hidden = true;
    originalPreview.removeAttribute("src");
    originalOpen.removeAttribute("href");
    originalDownload.removeAttribute("href");
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    originalUrl = "";
  }

  async function showOriginal(selected) {
    const signature = new TextDecoder().decode(await selected.slice(0, 1024).arrayBuffer());
    if (!/%PDF-\d\.\d/.test(signature)) throw new Error("The selected file does not appear to be a PDF.");
    originalUrl = URL.createObjectURL(selected.slice(0, selected.size, "application/pdf"));
    originalName.textContent = selected.name;
    originalPreview.src = originalUrl;
    originalOpen.href = originalUrl;
    originalDownload.href = originalUrl;
    originalDownload.download = selected.name;
    originalPanel.hidden = false;
  }

  function queuePreview(review) {
    const current = ++revision;
    clearTimeout(previewTimer);
    download.disabled = true;
    preview.hidden = true;
    preview.removeAttribute("src");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = "";
    if (inspecting || file.disabled || !rows.length) {
      previewStatus.textContent = inspecting || file.disabled ? "Reading your files…" :
        "Import transactions to preview the report.";
      return;
    }
    const reportRows = rows.map(row => row.map(cell));
    const incomplete = reportRows.findIndex(row => row.some(value => !value));
    if (incomplete >= 0) {
      previewStatus.textContent = "Complete Date, Amount and Description on transaction " + (incomplete + 1) + ".";
      return;
    }
    previewStatus.textContent = "Preparing PDF preview…";
    previewTimer = setTimeout(async () => {
      try {
        await ensurePdfLibraries();
        if (current !== revision) return;
        const pdf = new window.jspdf.jsPDF({ unit: "pt", format: "a4", compress: true });
        pdf.setProperties({ title: review ? "Transaction Reconciliation Report" : "Transaction Report" });
        writeReport(pdf, review ? reportRows.map((row, i) => [...row, review.labels[i]]) : reportRows, Boolean(review));
        previewUrl = URL.createObjectURL(pdf.output("blob"));
        previewFilename = review ? "transaction-reconciliation-report.pdf" : "transaction-report.pdf";
        preview.src = previewUrl;
        preview.hidden = false;
        download.disabled = false;
        previewStatus.textContent = review?.unresolved
          ? "Preview ready. Date checks are pending. Enter the PDF date year to update them."
          : "Preview ready. The download uses this exact PDF.";
      } catch (error) {
        if (current === revision) previewStatus.textContent = error.message || "Could not prepare the report preview.";
      }
    }, 250);
  }

  function refreshReview() {
    const review = statement ? reviewDates(rows, statement.entries, yearInput.value) : null;
    Array.from(body.rows).forEach((tr, i) => {
      tr.cells[3].textContent = review?.labels[i] || "No PDF loaded";
    });
    if (statement) {
      const protectedCount = statement.entries.filter(entry => entry.protected).length;
      const names = statement.fonts.join(", ") || "font names unavailable";
      pdfStatus.textContent = 'Detected ' + statement.entries.length + ' dated rows, including ' + protectedCount + ' with an eBay label. Fonts: ' + names + '.'
        + (review.unresolved ? ' Enter the year for dates without a year before comparing.' : ' Exact dates are preferred; otherwise the next later date is suggested. No source rows are changed.');
    }
    queuePreview(review);
  }

  yearInput.addEventListener("input", refreshReview);
  pdfInput.addEventListener("change", async () => {
    const selected = pdfInput.files[0];
    if (!selected) return;
    clearOriginal();
    inspecting = true;
    statement = null;
    pdfInput.disabled = true;
    pdfStatus.textContent = "Inspecting the PDF in your browser…";
    refreshReview();
    try {
      if (!/\.pdf$/i.test(selected.name) || selected.size > 15 * 1024 * 1024) throw new Error("Choose a PDF no larger than 15 MB.");
      await showOriginal(selected);
      statement = await inspectStatement(selected);
    } catch (error) {
      pdfStatus.textContent = (error.message || "Could not inspect the PDF.") +
        (originalUrl ? " You can still view and download the original below." : "");
    } finally {
      inspecting = false;
      pdfInput.value = "";
      pdfInput.disabled = false;
      refreshReview();
    }
  });

  file.addEventListener("change", async () => {
    const selected = file.files[0];
    if (!selected) return;
    file.disabled = true;
    refreshReview();
    status.textContent = "Reading transactions…";
    try {
      if (!/\.(xlsx|xls|csv)$/i.test(selected.name) || selected.size > 10 * 1024 * 1024) {
        throw new Error("Choose an Excel or CSV file no larger than 10 MB.");
      }
      if (!window.XLSX) throw new Error("The spreadsheet reader did not load. Refresh and try again.");
      const book = window.XLSX.read(await selected.arrayBuffer(), { type: "array", raw: true });
      const sheet = book.Sheets[book.SheetNames[0]];
      if (!sheet) throw new Error("The file has no readable worksheet.");
      rows = readRows(window.XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: "yyyy-mm-dd", defval: "" }));
      body.replaceChildren();
      rows.forEach((row, index) => {
        const tr = body.insertRow();
        row.forEach((value, column) => {
          const input = document.createElement("input");
          input.type = "text";
          input.value = value;
          input.setAttribute("aria-label", `${fields[column]}, transaction ${index + 1}`);
          input.addEventListener("input", () => { row[column] = input.value; refreshReview(); });
          tr.insertCell().append(input);
        });
        tr.insertCell();
      });
      table.hidden = false;
      status.textContent = `${rows.length} transactions imported. Review or edit them before downloading.`;
    } catch (error) {
      status.textContent = error.message || "Could not read the file.";
    } finally {
      file.value = "";
      file.disabled = false;
      refreshReview();
    }
  });

  download.addEventListener("click", () => {
    if (!previewUrl || download.disabled) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = previewFilename;
    document.body.append(link);
    link.click();
    link.remove();
  });
})();

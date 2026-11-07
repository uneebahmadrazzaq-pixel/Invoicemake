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

  function writeReport(pdf, rows) {
    const columns = [42, 138, 240];
    const widths = [86, 92, 310];
    let y;
    const startPage = () => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(19);
      pdf.text("Transaction Report", 42, 51);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("Prepared from user-provided data. Not a bank-issued statement.", 42, 69);
      pdf.setFont("helvetica", "bold");
      fields.forEach((field, i) => pdf.text(field, columns[i], 98));
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

  if (typeof module !== "undefined" && module.exports) module.exports = { readRows, writeReport };
  if (typeof document === "undefined") return;
  const file = document.getElementById("bankStatementFile");
  if (!file) return;
  const table = document.getElementById("bankStatementTable");
  const body = table.tBodies[0];
  const status = document.getElementById("bankStatementStatus");
  const download = document.getElementById("bankStatementDownload");
  let rows = [];

  file.addEventListener("change", async () => {
    const selected = file.files[0];
    if (!selected) return;
    file.disabled = true;
    download.disabled = true;
    status.textContent = "Reading transactions…";
    try {
      if (!/\.(xlsx|xls|csv)$/i.test(selected.name) || selected.size > 10 * 1024 * 1024) {
        throw new Error("Choose an Excel or CSV file no larger than 10 MB.");
      }
      if (!window.XLSX) throw new Error("The spreadsheet reader did not load. Refresh and try again.");
      const book = window.XLSX.read(await selected.arrayBuffer(), { type: "array", raw: true });
      const sheet = book.Sheets[book.SheetNames[0]];
      if (!sheet) throw new Error("The file has no readable worksheet.");
      rows = readRows(window.XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" }));
      body.replaceChildren();
      rows.forEach((row, index) => {
        const tr = body.insertRow();
        row.forEach((value, column) => {
          const input = document.createElement("input");
          input.type = "text";
          input.value = value;
          input.setAttribute("aria-label", `${fields[column]}, transaction ${index + 1}`);
          input.addEventListener("input", () => { row[column] = input.value; });
          tr.insertCell().append(input);
        });
      });
      table.hidden = false;
      status.textContent = `${rows.length} transactions imported. Review or edit them before downloading.`;
    } catch (error) {
      status.textContent = error.message || "Could not read the file.";
    } finally {
      file.value = "";
      file.disabled = false;
      download.disabled = !rows.length;
    }
  });

  download.addEventListener("click", async () => {
    download.disabled = true;
    file.disabled = true;
    try {
      const reportRows = rows.map(row => row.map(cell));
      const incomplete = reportRows.findIndex(row => row.some(value => !value));
      if (incomplete >= 0) throw new Error(`Complete Date, Amount and Description on transaction ${incomplete + 1}.`);
      await ensurePdfLibraries();
      const pdf = new window.jspdf.jsPDF({ unit: "pt", format: "a4", compress: true });
      pdf.setProperties({ title: "Transaction Report" });
      writeReport(pdf, reportRows);
      pdf.save("transaction-report.pdf");
      status.textContent = "Transaction report downloaded.";
    } catch (error) {
      status.textContent = error.message || "Could not download the report.";
    } finally {
      download.disabled = !rows.length;
      file.disabled = false;
    }
  });
})();

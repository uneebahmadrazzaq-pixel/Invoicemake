# Costco USA typography

- Reference: `Costco US 02.pdf`, a single-image PDF with no embedded font names or selectable text. The font cannot be identified definitively from PDF metadata; do not claim an exact embedded-font match.
- The invoice uses isolated Arial typography with the existing full, licensed Arimo variable font as a metric-compatible fallback on devices without Arial. Do not reuse the incomplete Arial subsets from other suppliers: they omit letters needed for arbitrary customer names and addresses.
- Address, payment, product and amount text stays regular and black. Section headings, column labels and invoice metadata remain bold. The invoice title is light blue and the footer grey, unaffected by dashboard palette overrides.
- Preview, single and bulk export wait for regular and bold fallback weights. Export cloning explicitly preserves the same typeface and reference colours.
- Browser QA compares a 12-product reference-shaped invoice and the actual html2canvas export-clone path. Regression tests cover scoped typography and font/colour export loading. Customer data and unrelated supplier templates are unchanged.

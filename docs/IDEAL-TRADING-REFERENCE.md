# Ideal Trading USA reference alignment

Updated 24 October 2026 against the owner-supplied `IDEAL TRADING USA TOY WHOLESALE.pdf` (709 x 1001 points).

- The reference uses Roboto regular and bold, not Arial. The template now uses the existing complete bundled Roboto files, isolated from workspace typography; export cloning waits for both weights.
- Invoice To / Ship To use regular-weight names and separate A. (address), P. (phone), and E. (email) rows. Names are not repeated in the address. Structured edited fields take precedence, while legacy multiline addresses and contact labels remain supported. Missing contacts are not fabricated.
- Reference scale is 794 / 709. Body contact text is 13.44px, address text 11.2px, customer names 20.5px, company title 35.84px, and invoice title 53.76px. Body data is black, labels are #303030, and header/footer shades follow the reference.
- Decorative motifs, watermark, and footer contact icons in `public/assets/ideal-trading/` were extracted from the supplied PDF without customer text. All customer and invoice fields remain editable HTML, not a flattened invoice background.
- Products are no longer silently limited to eight. The template retains eight rows for short invoices, uses the selected currency for empty totals, and lets notes/totals/footer flow below additional or wrapped rows.
- Local browser QA checked the actual renderer, styles, bundled fonts, assets, and export-clone preparation with the reference sample and twenty long product rows. No production customer invoice was created or downloaded for testing. Download-render screenshots are retained locally under ignored `tmp/`.

Relevant automated checks: `ideal-trading-reference.test.mjs` (five tests), the existing Ideal Trading template test, save/download/admin regressions, and affected catalog/template cache checks. The production static build and TypeScript check also pass.

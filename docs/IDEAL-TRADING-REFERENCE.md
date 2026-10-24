# Ideal Trading USA reference alignment

Updated 24 October 2026 against the owner-supplied `IDEAL TRADING USA TOY WHOLESALE.pdf` (709 x 1001 points).

- The reference uses Roboto regular and bold, not Arial. The template now uses the existing complete bundled Roboto files, isolated from workspace typography; export cloning waits for both weights.
- Invoice To / Ship To use regular-weight names and separate A. (address), P. (phone), and E. (email) rows. Names are not repeated in the address. Structured edited fields take precedence, while legacy multiline addresses and contact labels remain supported. Missing contacts are not fabricated.
- Reference scale is 794 / 709. Body contact text is 13.44px, address text 11.2px, customer names 20.5px, company title 35.84px, and invoice title 53.76px. Body data is black, labels are #303030, and header/footer shades follow the reference.
- Decorative motifs, watermark, and footer contact icons in `public/assets/ideal-trading/` were extracted from the supplied PDF without customer text. All customer and invoice fields remain editable HTML, not a flattened invoice background.
- Products are no longer silently limited to eight. The template retains eight rows for short invoices, uses the selected currency for empty totals, and lets notes/totals/footer flow below additional or wrapped rows.
- Local browser QA checked the actual renderer, styles, bundled fonts, assets, and export-clone preparation with the reference sample and twenty long product rows. No production customer invoice was created or downloaded for testing. Download-render screenshots are retained locally under ignored `tmp/`.

Relevant automated checks: `ideal-trading-reference.test.mjs` (eight tests), the existing Ideal Trading template test, save/download/admin regressions, and affected catalog/template cache checks. The production static build and TypeScript check also pass.

## Payment/terms follow-up

The complete production dashboard stylesheet stack was added to visual QA after the owner reported blue-grey payment/footer text. Its high-specificity `!important` heading and paragraph palette had overridden the invoice's source colours. The document now explicitly fixes regular/bold weights, sizes, black payment/notes text, source-grey labels/contact lines and light-grey thank-you text, while preserving white table/totals labels. Font metrics confirmed the regular Roboto file matches the PDF, but found small differences in the bold variant. Exact embedded bold label/amount subsets from the reference now take precedence through Unicode ranges; the complete bundled bold face supplies edited characters absent from those subsets. Exports preload all three bold faces with representative labels and amounts.

Customer selection no longer overwrites Ideal Trading terms with generated card metadata. Known legacy card-detail blocks display the original terms; custom terms and deliberately blank notes remain editable and preserved. The single-editor field is labelled Terms & Conditions / Notes. Generated payment descriptions follow the selected Visa/Mastercard/PayPal rather than retaining a stale template-default Visa label. Tests cover these cases without changing other supplier templates.

The separate generic invoice-field suite still has its pre-existing Zoro CSV-header expectation failure; it was reproduced against the untouched baseline archive. No Zoro CSV implementation or test was changed for this follow-up.

## Address and control-panel follow-up

Ideal Trading addresses are now continuous paragraphs, as in the reference, instead of forcing street, locality and country onto separate lines. They wrap naturally within each column, and UK postcode pairs stay together. Names, A. address, P. phone and E. email are independently editable for Invoice To and Ship To. Template-specific overrides are stored on the invoice, preserve deliberately blank optional contacts, and reset when changing to a different customer. Existing structured customer profiles remain intact.

The single product editor and editable bulk product grid use Description, Quantity, Unit Price and a calculated Line Total. Single and bulk sample CSVs accept exactly `Description,Quantity,Unit Price`; users do not supply SKU, duplicate product fields or calculated totals. Bulk CSV blank-row grouping remains supported.

Each bulk invoice has its own invoice number/date, currency, VAT, shipping, billing/shipping details, payment type/last four digits/method, and multiline terms. The same fields are available to batch-list controls. Bulk-wide card changes update group payment descriptions without replacing individual addresses. Save-before-download signatures continue to cover all edits. Tests cover CSV round-trips, single editor columns, address normalization, independent batch metadata, grouped row edits/calculated totals, generated invoice overrides and bulk-wide card updates.

# Blowout source parity

Reference: user-supplied `BlowOut 01.pdf`, one US Letter page (612 × 792 pt).
The PDF is a 2550 × 3300 pixel scan with no embedded text or font resources.

- The logo is extracted directly from the original scan, not recreated with CSS.
- Serif data uses the existing bundled Times New Roman font. Bold sans-serif labels now use bundled Arial Bold. The existing Arial font is a subset; missing glyphs use the explicitly bundled Arial-metric-compatible Liberation Sans fallback, preventing platform-dependent fallback. Exact source-font identification is not possible from this scan.
- Ink is scoped to #1f1f1f for preview and export. The source logo retains its scanned colours.
- Sold to/Shipped to display company (or recipient), street/town/region, postcode/country. Phone remains in the separate order-details table. Source free-text addresses remain supported.
- Page margins, logo size, company spacing, address boxes and item column typography were measured against the source. Product rows and totals remain in normal document flow.
- Single and bulk exports wait for the same bundled fonts, including in the capture document.
- Requested refinement: quantity column widened from 5% to 7%, heading increased to 12px and quantity data to 11.5px. Item grid increased to 2.5px and order-details grid to 1.8px.

The supplied source shows different years in its top order date and order-details date. Existing editable date behaviour was preserved rather than hard-coding that source inconsistency.

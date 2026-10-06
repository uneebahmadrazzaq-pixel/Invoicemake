# Sephora source typography and geometry

Reference: user-provided `SEPHORA USA USED FOR ALL BEAUTY ITEMS.pdf`.

- Source page: 842 x 1190 points; content edges x=36 and x=806.
- Body/client/product copy: Arimo regular, 10.5 points, RGB black.
- Client name: Arimo bold, 13.5 points. Invoice heading: Arimo bold, 21 points.
- Company title/address headings: Liberation Sans bold.
- Table labels, metadata labels and selected totals: Proxima Nova bold.
- Account note and opening-hours line: Proxima Nova regular.
- Full Arimo variable font is bundled with its OFL license; Liberation Sans with its license.
- Proxima assets contain only the embedded fixed-label glyphs from the supplied PDF, converted to Unicode-addressable TrueType outlines. Dynamic client/product text uses full Arimo, not the subset fonts.
- Footer remains in normal content flow and moves when product rows are added.
- Single/bulk export use the source page dimensions and explicitly await all source fonts.

The reference contains mixed fonts and slightly inconsistent baselines; this implementation preserves its primary font roles rather than applying one website font to all text.

# Luxury Souq reference

Reference: user-supplied `lx.pdf`, one image-only page, 1086 x 1448.
No font metadata is embedded. Arial regular/bold is a visual match, not an
identified source font. The complete Liberation Sans faces (Arial-compatible)
are explicitly loaded for
preview and HTML-to-PDF export so browser fallback and dashboard styles cannot
change the appearance.

The layout is scaled to 794 x 1059 CSS pixels, preserving the original 3:4
page aspect in single and bulk exports. Table, summary and disclaimer remain
in normal flow when rows or addresses grow.

Logo and original QR PNGs were cropped directly from the embedded source JPEG.
The QR has since been decoded and regenerated as a sharp SVG. Its verified
destination is `https://luxurysouq.com/`; it keeps a white quiet zone and
proportional sizing. The low-resolution original logo remains in use until
the owner supplies a higher-quality digital logo.

Billing and shipping render their distinct saved address fields and phone
contacts without email lines. Supplier email in the header remains unchanged.
Visa, Mastercard and PayPal artwork follows the selected payment brand.

The earlier Perfume Arial subset had only 81 Unicode characters, causing
per-character fallback. Complete regular/bold fonts provide 668 characters each.

Single/bulk PDF exports use 4x capture with lossless PNG. JPG exports use 4x
capture at maximum quality. This avoids additional export blur but cannot
recover detail absent from the scanned source or identify its exact font.

Product CSV and controls use Item Description, SKU, Unit Price, QTY. There is
no product-name or total input column. The single editor calculates its total;
bulk product controls update the owning invoice rows before generation.

# Clearance King controls

- Single and bulk product rows support independent raster-image upload and removal. PNG, JPEG and WebP files up to 5 MB are converted to a maximum 512px WebP thumbnail before saving.
- Images are stored on the invoice item and mirrored to the correct bulk invoice group. Invoice rendering uses the saved image. Only the original sample SKU/barcode retains the reference-product image as a fallback.
- Uploaded SVGs and external image URLs are not accepted. Changes to another invoice or batch while an image is loading cannot overwrite that invoice.
- Bulk controls expose seller VAT number, payment details, delivery method, tax-point date, VAT rate and shipping. Existing CSV columns remain unchanged; images are uploaded from product controls after import.
- Reference: the supplied `clearance king invoice.pdf` uses embedded DejaVu Sans Condensed regular and bold. Full DejaVu 2.37 fonts are bundled with their license (official release ZIP SHA256: `7576310b219e04159d35ff61dd4a4ec4cdba4f35c00e002a136f00e96a908b0a`).
- Typography follows the PDF: 9.75pt address text, 10.5pt section headings, 12pt company/payment/summary text, and 8.68pt product-table text. Product descriptions stay regular; headings and summary labels use the genuine bold face. Both faces are awaited before single/bulk downloads and export cloning.
- Address rendering keeps name/company, postal details, black text, and the template's `T:` label with a blue underlined telephone number. Fonts and weights are isolated from website-theme overrides.

# Drugstore Products editable invoice template

The **Drugstore Products Discount Wholesale** template is available in the Single Invoice Editor and Bulk Invoice Generator.

## Editable fields

- Invoice number, invoice date, due date, payment method, and tracking information
- Bill-to and ship-to addresses
- Drugstore company name, address, phone, email, registration number, and website
- Product description, SKU, quantity, unit rate, and additional product rows
- Tax rate, shipping charge, amount paid, notes, and terms

Subtotal, tax, shipping, total, and balance due are calculated automatically. The invoice can be printed or downloaded as a PDF from the editor.

## Run locally

1. Install Node.js 22.13 or newer.
2. Run `pnpm install`.
3. Run `pnpm run dev`.
4. Open the local URL shown in the terminal.

## Production build

Run:

```text
pnpm run build
```

The included `netlify.toml` contains the Netlify build and routing configuration. Connect the repository to Netlify or upload the complete source folder through your normal deployment workflow.

## Use the template

1. Open **Clients** and create or select a client.
2. Open **Invoice Builder**.
3. Select the client, then choose **Drugstore Products Discount Wholesale**.
4. Edit the invoice and product details.
5. Select **Download PDF** or **Print / PDF**.

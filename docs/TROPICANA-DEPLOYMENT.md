# Tropicana Ltd Editable Invoice Website

This package contains the complete browser-based invoice editor with the new **Tropicana Wholesale Invoice** template based on invoice 1811209.

## Included features

- Editable customer, delivery, invoice, order, account, VAT and shipping fields
- Editable Tropicana item columns: quantity, code, description, origin, commodity, commodity description, unit price and net weight
- Automatic line total, VAT, total weight, delivery and grand-total calculations
- Two-page A4 landscape preview matching the supplied invoice structure
- Print and downloadable PDF output
- Local browser storage for saved clients and invoices

## Fastest Netlify deployment

1. Sign in to Netlify and open **Add new site > Deploy manually**.
2. Upload the `public` folder from this package.
3. After deployment, open `/editor/index.html` if the root redirect has not yet refreshed.

For a Git-based Netlify deployment, push the complete package to a repository and import it in Netlify. The included `netlify.toml` publishes the `public` directory; no server or database is required.

## Any static web host

Upload everything inside the `public` folder to the host's public web directory. The application is static HTML, CSS and JavaScript, so it works on Netlify, Cloudflare Pages, GitHub Pages, cPanel and similar hosting.

## Local preview

From the package directory, run a static server pointed at `public`, for example:

```bash
python -m http.server 8080 --directory public
```

Then open `http://localhost:8080/editor/index.html`.

## Using the template

1. Open **Invoice Builder**.
2. Select or add a client.
3. Choose **Tropicana Wholesale Invoice**.
4. Edit the invoice fields and product rows.
5. Use **Download PDF** or **Print / PDF**.

All invoice processing stays in the user's browser. No invoice data is sent to a server by this package.

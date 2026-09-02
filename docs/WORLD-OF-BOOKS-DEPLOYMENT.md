# World of Books invoice template deployment

This package contains the static MC011 invoice editor with the editable World of Books paid invoice template.

## Netlify

1. Extract the ZIP file.
2. In Netlify, create a site from the extracted folder or drag the folder into Netlify Drop.
3. Keep the included `netlify.toml`; it publishes the `public` directory and opens the invoice editor automatically.

## Other static hosting

Publish the contents of the `public` directory and open `/editor/index.html`.

The World of Books template includes locally hosted copies of the Lato Regular and Lato Bold fonts embedded in the supplied reference PDF. Its typography is scoped to the invoice template and does not inherit the website font.

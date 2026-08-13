(() => {
  const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const benefits = [
    { icon: "mouse-pointer-click", title: "Generate invoices in a few clicks" },
    { icon: "repeat-2", title: "Reduce repetitive manual editing" },
    { icon: "folder-check", title: "Keep invoice documents organized and presentation-ready" },
  ];
  const features = [
    ["layout-template", "40+ Professional Invoice Templates", "Access a growing collection of professionally designed supplier invoice templates."],
    ["files", "Bulk Invoice Generator", "Generate multiple invoices together and reduce repetitive work."],
    ["file-pen-line", "Single Invoice Generator", "Create and customize an individual invoice whenever required."],
    ["wand-sparkles", "One-Click Data Cleaning", "Clean, standardize, and organize invoice data before generating documents."],
    ["scan-line", "PDF Compressor", "Reduce PDF file sizes while maintaining clear and readable document quality."],
    ["shield-check", "Metadata Remover", "Remove unnecessary metadata from generated PDF documents."],
    ["circle-dollar-sign", "Multiple Currency Support", "Prepare invoice documents using currencies supported by the selected template."],
    ["download", "Easy PDF Download", "Generate and download organized, presentation-ready invoice documents."],
  ];
  const suppliers = ["Chinese", "Zoro", "Go Supps", "TW Wholesale", "Costco USA", "Costco UK", "Pound Wholesale", "SunSky", "Vet UK", "Jellycat", "Qogita", "PCS Books", "Sephora", "Bestway", "Paperstone", "Perfume Unlimited", "Porton Garden"];
  const packages = [
    { name: "Starter Package", price: "PKR 20,000", features: ["7+ invoice templates", "Bulk Invoice Generator", "PDF Metadata Remover", "PDF Compressor", "Basic customer support"], button: "Choose Starter" },
    { name: "Professional Package", price: "PKR 40,000", badge: "Popular", features: ["15+ invoice templates", "Bulk Invoice Generator", "Single Invoice Generator", "PDF Compressor", "PDF Metadata Remover", "Data Cleaning with limited features", "Priority customer support"], button: "Choose Professional" },
    { name: "Complete Package", price: "PKR 70,000", badge: "Best Value", featured: true, features: ["40+ invoice templates", "Bulk Invoice Generator", "Single Invoice Generator", "PDF Compressor", "PDF Metadata Remover", "Full Data Cleaning features", "Access to future template updates", "Priority setup assistance", "Premium customer support"], button: "Choose Complete" },
  ];
  // Replace these placeholders with genuine, customer-approved testimonials before publishing.
  const testimonials = [
    ["F", "Fiza", "The bulk invoice tools made document preparation much faster and more organized."],
    ["A", "Ahmad", "The templates are easy to use, and the PDF tools saved me a lot of repetitive work."],
    ["A", "Ali", "The platform helped me organize my supporting documents and prepare them more efficiently."],
  ];
  const faqs = [
    ["How do I create an invoice?", "Choose an invoice template, enter your business and customer details, add your products or services, and generate your invoice."],
    ["Can I choose different invoice templates?", "Yes. You can select from multiple professionally designed invoice templates and choose the one that best suits your business requirements."],
    ["Can I customize the information on my invoice?", "Yes. You can customize business information, customer details, invoice numbers, dates, items, quantities, prices, taxes, and other fields supported by the selected template."],
    ["Can I download my generated invoice?", "Yes. Once the invoice has been generated, you can download it for your legitimate business records or provide it to your customer."],
    ["Is my invoice information stored or shared?", "Invoice information is handled according to our privacy policy. We do not share user information with third parties without authorization, except where required by law."],
    ["Can I create invoices in different currencies?", "Yes. When supported by the selected template, invoices can be created using different currencies based on your business requirements."],
    ["Can the platform create multiple invoices together?", "Yes. Packages that include the Bulk Invoice Generator allow users to prepare multiple invoices through a more efficient workflow."],
    ["Does the platform guarantee MC011 approval or account reinstatement?", "No. The platform helps users prepare and organize legitimate supporting documents. Approval and reinstatement decisions are made solely by eBay, TikTok Shop, or the relevant marketplace."],
  ];

  const benefitGrid = document.getElementById("benefitGrid");
  const featureGrid = document.getElementById("featureGrid");
  const templateMarquee = document.getElementById("templateMarquee");
  const pricingGrid = document.getElementById("pricingGrid");
  const testimonialSlider = document.getElementById("testimonialSlider");
  const testimonialControls = document.getElementById("testimonialControls");
  const faqList = document.getElementById("faqList");
  if (!benefitGrid || !featureGrid || !templateMarquee || !pricingGrid || !testimonialSlider || !testimonialControls || !faqList) return;

  document.querySelectorAll(".landing-nav a").forEach((link) => link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash?.startsWith("#")) return;
    const target = document.querySelector(`.mc-home ${hash === "#workflow" ? "#problem" : hash}`);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", hash);
  }));

  benefitGrid.innerHTML = benefits.map((item) => `<article class="mc-benefit reveal-item"><span>${icon(item.icon)}</span><h3>${item.title}</h3></article>`).join("");
  featureGrid.innerHTML = features.map(([name, title, copy]) => `<article class="nexus-card mc-feature-card reveal-item"><i>${icon(name)}</i><h3>${title}</h3><p>${copy}</p></article>`).join("");
  const supplierCards = suppliers.map((name, index) => `<article class="mc-template-card"><span>${String(index + 1).padStart(2, "0")}</span><strong>${name}</strong><small>Invoice template</small></article>`).join("");
  templateMarquee.innerHTML = supplierCards + supplierCards;
  pricingGrid.innerHTML = packages.map((plan) => {
    const message = encodeURIComponent(`Hello, I would like to get access to the Smart Invoices ${plan.name.replace(" Package", "")} package. Please share the complete details.`);
    return `<article class="nexus-price-card mc-price-card${plan.featured ? " is-featured" : ""} reveal-item">${plan.badge ? `<b>${plan.badge}</b>` : ""}<span>${plan.name}</span><h3>${plan.price}</h3><ul>${plan.features.map((item) => `<li>${item}</li>`).join("")}</ul><a class="btn ${plan.featured ? "primary" : "ghost"} link-btn" href="https://wa.me/923204067479?text=${message}" target="_blank" rel="noopener noreferrer">${plan.button}</a></article>`;
  }).join("");
  testimonialSlider.innerHTML = testimonials.map(([initial, name, quote], index) => `<article class="mc-testimonial${index === 0 ? " is-active" : ""}" data-slide="${index}" aria-hidden="${index !== 0}"><span class="mc-quote-icon">${icon("quote")}</span><div class="mc-stars" aria-label="Five stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p>&ldquo;${quote}&rdquo;</p><footer><span>${initial}</span><strong>${name}</strong><small>Placeholder testimonial</small></footer></article>`).join("");
  testimonialControls.innerHTML = testimonials.map(([, name], index) => `<button type="button" class="${index === 0 ? "is-active" : ""}" aria-label="Show ${name}'s testimonial" aria-pressed="${index === 0}" data-slide-button="${index}"></button>`).join("");
  faqList.innerHTML = faqs.map(([question, answer], index) => `<details${index === 0 ? " open" : ""}><summary>${question}<span>${icon("plus")}</span></summary><p>${answer}</p></details>`).join("");

  faqList.querySelectorAll("details").forEach((detail) => detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    faqList.querySelectorAll("details[open]").forEach((other) => { if (other !== detail) other.open = false; });
  }));

  let activeSlide = 0;
  const showSlide = (next) => {
    activeSlide = next;
    testimonialSlider.querySelectorAll(".mc-testimonial").forEach((slide, index) => { slide.classList.toggle("is-active", index === next); slide.setAttribute("aria-hidden", String(index !== next)); });
    testimonialControls.querySelectorAll("button").forEach((button, index) => { button.classList.toggle("is-active", index === next); button.setAttribute("aria-pressed", String(index === next)); });
  };
  testimonialControls.addEventListener("click", (event) => { const button = event.target.closest("[data-slide-button]"); if (button) showSlide(Number(button.dataset.slideButton)); });
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) setInterval(() => showSlide((activeSlide + 1) % testimonials.length), 6000);

  const revealItems = document.querySelectorAll(".mc-home .reveal-item");
  if (reduceMotion || !("IntersectionObserver" in window)) revealItems.forEach((item) => item.classList.add("is-visible"));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.14 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const counter = document.querySelector("[data-count]");
  if (counter) {
    counter.textContent = counter.dataset.count;
    if (!reduceMotion) counter.animate(
      [{ opacity: 0, transform: "translateY(12px) scale(.86)" }, { opacity: 1, transform: "translateY(0) scale(1)" }],
      { duration: 900, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" },
    );
  }

  window.lucide?.createIcons();
})();

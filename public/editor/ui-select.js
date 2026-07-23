(function () {
  const instances = new WeakMap();

  function closeAll(except) {
    document.querySelectorAll(".ui-select.is-open").forEach((wrapper) => {
      if (wrapper === except) return;
      wrapper.classList.remove("is-open", "opens-up");
      wrapper.querySelector(".ui-select-trigger")?.setAttribute("aria-expanded", "false");
    });
  }

  function getLabel(select) {
    return (
      select.getAttribute("aria-label") ||
      select.closest("label")?.childNodes?.[0]?.textContent?.trim() ||
      "Choose an option"
    );
  }

  function createSelect(select, index) {
    if (
      instances.has(select) ||
      select.multiple ||
      select.hidden ||
      select.classList.contains("is-visually-hidden-control")
    ) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "ui-select";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "ui-select-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", getLabel(select));

    const value = document.createElement("span");
    value.className = "ui-select-value";
    trigger.append(value);

    const menu = document.createElement("div");
    menu.className = "ui-select-menu";
    menu.id = `ui-select-menu-${select.id || index}`;
    menu.setAttribute("role", "listbox");
    trigger.setAttribute("aria-controls", menu.id);

    select.parentNode.insertBefore(wrapper, select);
    wrapper.append(select, trigger, menu);
    select.classList.add("ui-native-select");
    select.tabIndex = -1;

    function sync() {
      const selected = select.options[select.selectedIndex] || select.options[0];
      value.textContent = selected?.textContent?.trim() || "Choose an option";
      value.classList.toggle("is-placeholder", !selected?.value);
      trigger.disabled = select.disabled;
      trigger.setAttribute("aria-disabled", String(select.disabled));
      menu.querySelectorAll(".ui-select-option").forEach((button) => {
        const isSelected = Number(button.dataset.optionIndex) === select.selectedIndex;
        button.classList.toggle("is-selected", isSelected);
        button.setAttribute("aria-selected", String(isSelected));
      });
    }

    function rebuild() {
      menu.replaceChildren();
      Array.from(select.options).forEach((option, optionIndex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ui-select-option";
        button.dataset.optionIndex = String(optionIndex);
        button.textContent = option.textContent.trim();
        button.disabled = option.disabled;
        button.setAttribute("role", "option");
        button.addEventListener("click", () => {
          if (option.disabled) return;
          select.selectedIndex = optionIndex;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          sync();
          closeAll();
          trigger.focus();
        });
        button.addEventListener("keydown", (event) => {
          const options = Array.from(menu.querySelectorAll(".ui-select-option:not(:disabled)"));
          const current = options.indexOf(button);
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const direction = event.key === "ArrowDown" ? 1 : -1;
            options[(current + direction + options.length) % options.length]?.focus();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            closeAll();
            trigger.focus();
          }
        });
        menu.append(button);
      });
      sync();
    }

    function open() {
      if (select.disabled) return;
      const shouldOpen = !wrapper.classList.contains("is-open");
      closeAll(wrapper);
      wrapper.classList.toggle("is-open", shouldOpen);
      trigger.setAttribute("aria-expanded", String(shouldOpen));
      if (!shouldOpen) return;

      requestAnimationFrame(() => {
        const rect = trigger.getBoundingClientRect();
        const menuHeight = Math.min(menu.scrollHeight, 300);
        const roomBelow = window.innerHeight - rect.bottom;
        const roomAbove = rect.top;
        wrapper.classList.toggle("opens-up", roomBelow < menuHeight + 12 && roomAbove > roomBelow);
        menu.querySelector(".ui-select-option.is-selected")?.scrollIntoView({ block: "nearest" });
      });
    }

    trigger.addEventListener("click", open);
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!wrapper.classList.contains("is-open")) open();
        requestAnimationFrame(() => {
          const selectedButton = menu.querySelector(".ui-select-option.is-selected");
          const fallback = menu.querySelector(".ui-select-option:not(:disabled)");
          (selectedButton || fallback)?.focus();
        });
      }
      if (event.key === "Escape") closeAll();
    });

    select.addEventListener("change", sync);
    const observer = new MutationObserver(rebuild);
    observer.observe(select, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "label", "selected"]
    });

    instances.set(select, { rebuild, sync, observer });
    rebuild();
  }

  window.initializeCustomSelects = function (root) {
    Array.from((root || document).querySelectorAll("select")).forEach(createSelect);
  };

  window.refreshCustomSelects = function () {
    document.querySelectorAll("select").forEach((select) => instances.get(select)?.sync());
  };

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".ui-select")) closeAll();
  });

  window.addEventListener("resize", () => closeAll());
})();

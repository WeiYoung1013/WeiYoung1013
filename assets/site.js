(function () {
  document.querySelectorAll("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", async () => {
      const email = button.getAttribute("data-copy-email");
      try {
        await navigator.clipboard.writeText(email);
        const previous = button.textContent;
        button.textContent = "Email copied";
        setTimeout(() => {
          button.textContent = previous;
        }, 1400);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  });

  const stage = document.querySelector("[data-wallpaper-stage]");
  if (stage) {
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty("--tilt-x", `${x * 4}deg`);
      stage.style.setProperty("--tilt-y", `${-y * 4}deg`);
    });
    stage.addEventListener("pointerleave", () => {
      stage.style.setProperty("--tilt-x", "0deg");
      stage.style.setProperty("--tilt-y", "0deg");
    });
  }

  const search = document.querySelector("[data-blog-search]");
  const filters = Array.from(document.querySelectorAll("[data-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-post-card]"));
  const empty = document.querySelector("[data-empty-state]");
  let activeFilter = "all";

  function normalize(value) {
    return value.toLowerCase().trim();
  }

  function applyBlogFilters() {
    const query = normalize(search ? search.value : "");
    let visible = 0;

    cards.forEach((card) => {
      const category = card.getAttribute("data-category") || "";
      const haystack = normalize(card.textContent || "");
      const categoryMatches = activeFilter === "all" || category === activeFilter;
      const queryMatches = !query || haystack.includes(query);
      const show = categoryMatches && queryMatches;
      card.style.display = show ? "" : "none";
      if (show) visible += 1;
    });

    if (empty) {
      empty.classList.toggle("is-visible", visible === 0);
    }
  }

  if (search && cards.length) {
    search.addEventListener("input", applyBlogFilters);
    filters.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.getAttribute("data-filter") || "all";
        filters.forEach((item) => item.classList.toggle("is-active", item === button));
        applyBlogFilters();
      });
    });
    applyBlogFilters();
  }
})();

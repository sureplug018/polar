/* Tescomint static mirror behaviour: theme, modals, tabs, copy, sparkline charts. */
(function () {
  var KEY = "tescomint-theme";
  function apply(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }
  var stored = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch (e) {}
  apply(stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  window.toggleTheme = function () {
    var next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
    drawCharts();
  };

  window.openNav = function () {
    var el = document.getElementById("app-sidebar");
    if (el) el.classList.add("open");
    var bd = document.querySelector("[data-nav-backdrop]");
    if (bd) bd.classList.add("open");
  };
  window.closeNav = function () {
    var el = document.getElementById("app-sidebar");
    if (el) el.classList.remove("open");
    var bd = document.querySelector("[data-nav-backdrop]");
    if (bd) bd.classList.remove("open");
  };

  window.openModal = function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.add("open");
  };
  window.closeModal = function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove("open");
  };

  window.copyText = function (text, btn) {
    navigator.clipboard && navigator.clipboard.writeText(text);
    if (btn) {
      var old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(function () {
        btn.textContent = old;
      }, 1400);
    }
  };

  window.showTab = function (group, name, btn) {
    document.querySelectorAll('[data-tabgroup="' + group + '"]').forEach(function (p) {
      p.classList.toggle("active", p.dataset.tab === name);
    });
    if (btn && btn.parentElement) {
      btn.parentElement.querySelectorAll(".tab").forEach(function (t) {
        t.classList.toggle("active", t === btn);
      });
    }
  };

  function drawChart(svg) {
    var values = JSON.parse(svg.dataset.values || "[]");
    var labels = JSON.parse(svg.dataset.labels || "[]");
    if (!values.length) return;
    var w = svg.clientWidth || 600;
    var h = svg.clientHeight || 220;
    var pad = 26;
    var max = Math.max.apply(null, values) * 1.15;
    var step = (w - pad * 2) / (values.length - 1 || 1);
    var pts = values.map(function (v, i) {
      return [pad + i * step, h - pad - (v / max) * (h - pad * 2)];
    });
    var line = pts
      .map(function (p, i) {
        return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      })
      .join(" ");
    var area = line + " L" + (w - pad) + " " + (h - pad) + " L" + pad + " " + (h - pad) + " Z";
    var css = getComputedStyle(document.documentElement);
    var color = css.getPropertyValue("--primary").trim() || "#10a55a";
    var mutedC = css.getPropertyValue("--muted-foreground").trim() || "#888";
    var border = css.getPropertyValue("--border").trim() || "#ddd";
    var gid = "grad-" + Math.random().toString(36).slice(2);
    var ticks = labels
      .map(function (l, i) {
        return (
          '<text x="' +
          (pad + i * step).toFixed(1) +
          '" y="' +
          (h - 6) +
          '" font-size="11" fill="' +
          mutedC +
          '" text-anchor="middle">' +
          l +
          "</text>"
        );
      })
      .join("");
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.innerHTML =
      '<defs><linearGradient id="' +
      gid +
      '" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="' +
      color +
      '" stop-opacity="0.35"/><stop offset="100%" stop-color="' +
      color +
      '" stop-opacity="0"/></linearGradient></defs>' +
      '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (h - pad) + '" y2="' + (h - pad) +
      '" stroke="' + border + '"/>' +
      '<path d="' + area + '" fill="url(#' + gid + ')"/>' +
      '<path d="' + line + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      pts
        .map(function (p) {
          return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3" fill="' + color + '"/>';
        })
        .join("") +
      ticks;
  }

  function drawCharts() {
    document.querySelectorAll("svg.chart").forEach(drawChart);
  }
  window.drawCharts = drawCharts;
  window.addEventListener("load", drawCharts);
  window.addEventListener("resize", function () {
    clearTimeout(window.__ct);
    window.__ct = setTimeout(drawCharts, 150);
  });

  /* ---------- pagination (max 10 rows / cards per page) ---------- */
  // function setupPager(box) {
  //   var size = parseInt(box.dataset.paginate, 10) || 10;
  //   var rows = Array.prototype.slice.call(box.querySelectorAll("table.data tbody tr"));
  //   var cards = Array.prototype.slice.call(box.querySelectorAll(".cards-list > *"));
  //   var total = Math.max(rows.length, cards.length);
  //   var pager = box.querySelector("[data-pager]");
  //   if (!pager) return;
  //   var pages = Math.max(1, Math.ceil(total / size));
  //   pager.hidden = false;
  //   var info = pager.querySelector("[data-page-info]");
  //   var prev = pager.querySelector("[data-page-prev]");
  //   var next = pager.querySelector("[data-page-next]");
  //   var page = 1;
  //   function render() {
  //     var start = (page - 1) * size;
  //     var end = start + size;
  //     rows.forEach(function (r, i) {
  //       r.style.display = i >= start && i < end ? "" : "none";
  //     });
  //     cards.forEach(function (c, i) {
  //       c.style.display = i >= start && i < end ? "" : "none";
  //     });
  //     if (info) info.textContent = "Page " + page + " of " + pages + " · " + total + " records";
  //     if (prev) prev.disabled = page === 1;
  //     if (next) next.disabled = page === pages;
  //   }
  //   if (prev)
  //     prev.addEventListener("click", function () {
  //       if (page > 1) {
  //         page--;
  //         render();
  //       }
  //     });
  //   if (next)
  //     next.addEventListener("click", function () {
  //       if (page < pages) {
  //         page++;
  //         render();
  //       }
  //     });
  //   render();
  // }
  // function setupPagers() {
  //   document.querySelectorAll("[data-paginate]").forEach(setupPager);
  // }
  // window.addEventListener("DOMContentLoaded", setupPagers);

  document.addEventListener("click", function (e) {
    if (e.target.classList && e.target.classList.contains("modal-backdrop")) {
      e.target.classList.remove("open");
    }
  });

  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (form.dataset.demo !== undefined) {
      e.preventDefault();
      var note = form.querySelector("[data-demo-note]");
      if (note) note.style.display = "block";
      if (form.dataset.redirect) window.location.href = form.dataset.redirect;
    }
  });
})();

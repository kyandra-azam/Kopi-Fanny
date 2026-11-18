/* ============================================================
   Logika halaman: render menu, keranjang sederhana, link WhatsApp
   Data diambil dari js/menu.js. Tidak ada login & tidak ada server.
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "dimsum-mentaiku-cart";
  var cart = loadCart(); // { "mentai|4 pcs": 2, ... }

  var $ = function (sel) { return document.querySelector(sel); };

  /* ---------- util ---------- */
  function rupiah(n) {
    return "Rp" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* abaikan */ }
  }

  function waLink(text) {
    return "https://wa.me/" + SITE.waNumber + "?text=" + encodeURIComponent(text);
  }

  /* ---------- cari item dari kunci keranjang ---------- */
  var allItems = MENU.concat(EXTRAS);

  function findLine(key) {
    var parts = key.split("|");
    var item = allItems.filter(function (i) { return i.id === parts[0]; })[0];
    if (!item) return null;
    var variant = item.variants.filter(function (v) { return v.label === parts[1]; })[0];
    if (!variant) return null;
    return { item: item, variant: variant };
  }

  function cartLines() {
    var lines = [];
    Object.keys(cart).forEach(function (key) {
      var qty = cart[key];
      var found = findLine(key);
      if (found && qty > 0) {
        lines.push({
          name: found.item.name,
          label: found.variant.label,
          price: found.variant.price,
          qty: qty
        });
      }
    });
    return lines;
  }

  /* ---------- render menu ---------- */
  function renderCard(item) {
    var card = document.createElement("article");
    card.className = "card";

    var head = '<div class="card__head"><h3>' + item.name + "</h3>" +
      (item.best ? '<span class="tag">Bestseller</span>' : "") + "</div>" +
      '<p class="card__desc">' + item.desc + "</p>";

    var rows = item.variants.map(function (v) {
      var key = item.id + "|" + v.label;
      var qty = cart[key] || 0;
      return '<div class="row" data-key="' + key + '">' +
        '<div class="row__info"><span class="row__label">' + v.label + '</span>' +
        '<span class="price">' + rupiah(v.price) + "</span></div>" +
        '<div class="stepper">' +
        '<button type="button" class="stepper__btn" data-act="minus" aria-label="Kurangi ' + item.name + " " + v.label + '"' + (qty === 0 ? " disabled" : "") + ">&minus;</button>" +
        '<span class="stepper__qty" aria-live="polite">' + qty + "</span>" +
        '<button type="button" class="stepper__btn stepper__btn--plus" data-act="plus" aria-label="Tambah ' + item.name + " " + v.label + '">+</button>' +
        "</div></div>";
    }).join("");

    card.innerHTML = head + '<div class="rows">' + rows + "</div>";
    return card;
  }

  function renderMenu() {
    var grid = $("#menuGrid");
    var extra = $("#extraGrid");
    grid.innerHTML = "";
    extra.innerHTML = "";
    MENU.forEach(function (i) { grid.appendChild(renderCard(i)); });
    EXTRAS.forEach(function (i) { extra.appendChild(renderCard(i)); });
  }

  /* ---------- update tampilan keranjang ---------- */
  function refreshRow(key) {
    var row = document.querySelector('.row[data-key="' + key + '"]');
    if (!row) return;
    var qty = cart[key] || 0;
    row.querySelector(".stepper__qty").textContent = qty;
    row.querySelector('[data-act="minus"]').disabled = qty === 0;
  }

  function buildMessage() {
    var lines = cartLines();
    var total = 0;
    var text = "Halo " + SITE.name + ", saya mau pesan:\n";
    lines.forEach(function (l) {
      var sub = l.price * l.qty;
      total += sub;
      text += "- " + l.name + " (" + l.label + ") x" + l.qty + " = " + rupiah(sub) + "\n";
    });
    text += "\nTotal: " + rupiah(total) + "\n\nNama:\nAlamat / ambil di tempat:";
    return text;
  }

  function refreshBar() {
    var lines = cartLines();
    var count = lines.reduce(function (s, l) { return s + l.qty; }, 0);
    var total = lines.reduce(function (s, l) { return s + l.qty * l.price; }, 0);
    var bar = $("#cartBar");

    bar.hidden = count === 0;
    document.body.classList.toggle("has-cart", count > 0);
    $("#cartCount").textContent = count + " item";
    $("#cartTotal").textContent = rupiah(total);
    $("#cartSend").href = count > 0 ? waLink(buildMessage()) : "#";
  }

  function changeQty(key, delta) {
    var next = (cart[key] || 0) + delta;
    if (next <= 0) { delete cart[key]; } else { cart[key] = Math.min(next, 99); }
    saveCart();
    refreshRow(key);
    refreshBar();
  }

  /* ---------- event ---------- */
  function bindEvents() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".stepper__btn");
      if (!btn) return;
      var key = btn.closest(".row").getAttribute("data-key");
      changeQty(key, btn.getAttribute("data-act") === "plus" ? 1 : -1);
    });

    $("#cartClear").addEventListener("click", function () {
      cart = {};
      saveCart();
      renderMenu();
      refreshBar();
    });
  }

  /* ---------- tombol WhatsApp umum ---------- */
  function setupWaButtons() {
    var hello = waLink("Halo " + SITE.name + ", saya mau pesan dimsum.");
    document.querySelectorAll(".js-wa").forEach(function (a) {
      a.href = hello;
      a.target = "_blank";
      a.rel = "noopener";
    });
    $("#cartSend").target = "_blank";
    $("#cartSend").rel = "noopener";
  }

  /* ---------- lokasi & footer ---------- */
  function setupInfo() {
    $("#infoAddress").textContent = SITE.address;
    $("#infoHours").textContent = SITE.hours;

    var ig = $("#infoInstagram");
    if (SITE.instagram) {
      var a = document.createElement("a");
      a.href = "https://instagram.com/" + SITE.instagram;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "@" + SITE.instagram;
      ig.appendChild(a);
    } else {
      ig.textContent = "-";
    }

    var maps = $("#mapsBtn");
    if (SITE.mapsUrl) {
      maps.href = SITE.mapsUrl;
    } else if (SITE.address && SITE.address.charAt(0) !== "[") {
      maps.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(SITE.address);
    } else {
      maps.hidden = true;
    }

    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------- header bayangan saat scroll ---------- */
  function setupHeader() {
    var header = $(".header");
    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mulai ---------- */
  renderMenu();
  bindEvents();
  setupWaButtons();
  setupInfo();
  setupHeader();
  refreshBar();
})();
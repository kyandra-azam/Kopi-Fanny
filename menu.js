/* ============================================================
   DATA TOKO & MENU  (edit file ini saja untuk mengubah isi web)
   ============================================================ */

const SITE = {
  name: "Dimsum Mentaiku",
  // Nomor WhatsApp: awali 62, tanpa +, tanpa 0 di depan. Contoh: 6281234567890
  waNumber: "6281234567890",
  address: "[Isi alamat lengkap toko]",
  hours: "[Isi jam buka, contoh: Setiap hari 10.00 - 21.00]",
  city: "",        // nama kota, contoh: "Bandung". Dipakai untuk SEO lokal
  instagram: "",   // contoh: "dimsummentaiku" (tanpa @). Kosongkan jika belum ada
  mapsUrl: "",     // tempel link Google Maps toko. Kosongkan jika belum ada
  siteUrl: "",     // alamat website setelah online, contoh: "https://dimsummentaiku.com"

  // Link toko di aplikasi pesan-antar. Isi yang ada saja, sisanya biarkan kosong
  delivery: {
    gofood: "",
    grabfood: "",
    shopeefood: ""
  }
};

// price dalam rupiah (angka saja). best: true -> muncul label "Bestseller"
const MENU = [
  {
    id: "dimsum",
    name: "Dimsum",
    desc: "Dimsum original.",
    best: false,
    variants: [
      { label: "4 pcs", price: 12000 },
      { label: "6 pcs", price: 18000 }
    ]
  },
  {
    id: "mentai",
    name: "Dimsum Mentai",
    desc: "Dimsum dengan saus mentai.",
    best: true,
    variants: [
      { label: "4 pcs", price: 20000 },
      { label: "6 pcs", price: 28000 }
    ]
  },
  {
    id: "bakar",
    name: "Dimsum Bakar",
    desc: "Dimsum yang dibakar.",
    best: false,
    variants: [
      { label: "4 pcs", price: 18000 },
      { label: "6 pcs", price: 25000 }
    ]
  },
  {
    id: "keju",
    name: "Dimsum Saus Keju",
    desc: "Dimsum dengan saus keju.",
    best: false,
    variants: [
      { label: "4 pcs", price: 20000 },
      { label: "6 pcs", price: 28000 }
    ]
  }
];

const EXTRAS = [
  {
    id: "chili",
    name: "Chili oil",
    desc: "Tambahan pedas.",
    best: false,
    variants: [{ label: "1 porsi", price: 2000 }]
  }
];
import { useState, useEffect } from "react";
import Beranda from "./components/Beranda";
import Inventaris from "./components/Inventaris";
import Transaksi from "./components/Transaksi";

function App() {
  // state untuk melacak halaman mana yang sedang diakses
  const [halamanAktif, setHalamanAktif] = useState("Beranda");

  // state penyimpan data barang & transaksi (menggantikan variabel "data" di script.js lama)
  const [dataBarang, setDataBarang] = useState([]);
  const [dataTransaksi, setDataTransaksi] = useState([]);

  // useEffect dipanggil sekali di awal untuk meload localStorage saat pertama kali
  // (menggantikan fungsi loadInventaris() & loadTransaksi() di script.js lama)
  useEffect(() => {
    const barangLokal = JSON.parse(localStorage.getItem("inventaris")) || [
      { id: "001", nama: "Paracetamol 500mg", stok: 250, beli: 2000, jual: 3000 },
      { id: "002", nama: "Amoxicillin 500mg", stok: 120, beli: 5000, jual: 8000 },
    ];
    const transaksiLokal = JSON.parse(localStorage.getItem("transaksi")) || [];

    setDataBarang(barangLokal);
    setDataTransaksi(transaksiLokal);
    localStorage.setItem("inventaris", JSON.stringify(barangLokal));
  }, []);

  // sinkronkan data barang ke localStorage setiap kali berubah
  // (menggantikan localStorage.setItem('inventaris', ...) yang tersebar di script.js lama)
  const simpanBarang = (dataBaru) => {
    setDataBarang(dataBaru);
    localStorage.setItem("inventaris", JSON.stringify(dataBaru));
  };

  // sinkronkan data transaksi ke localStorage setiap kali berubah
  const simpanTransaksi = (dataBaru) => {
    setDataTransaksi(dataBaru);
    localStorage.setItem("transaksi", JSON.stringify(dataBaru));
  };

  return (
    <>
      {/* --- Bagian HEADER/NAVBAR (menggantikan navbar statis di index.html/inventaris.html/transaksi.html) --- */}
      <div className="site-header">
        <header>
          <h1>Sehati Laris</h1>
          <p>Manajemen Inventaris & Penjualan Terintegrasi</p>
        </header>

        <nav>
          <ul className="nav-menu">
            <li>
              <a
                href="#"
                className={halamanAktif === "Beranda" ? "active" : ""}
                onClick={() => setHalamanAktif("Beranda")}
              >
                Beranda
              </a>
            </li>
            <li>
              <a
                href="#"
                className={halamanAktif === "Inventaris" ? "active" : ""}
                onClick={() => setHalamanAktif("Inventaris")}
              >
                Inventaris
              </a>
            </li>
            <li>
              <a
                href="#"
                className={halamanAktif === "Transaksi" ? "active" : ""}
                onClick={() => setHalamanAktif("Transaksi")}
              >
                Transaksi
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* --- Konten Dinamis Berdasarkan Tab Terpilih (menggantikan 3 file .html terpisah) --- */}
      <main>
        {halamanAktif === "Beranda" && (
          <Beranda dataBarang={dataBarang} dataTransaksi={dataTransaksi} />
        )}

        {halamanAktif === "Inventaris" && (
          <Inventaris dataBarang={dataBarang} onSimpanBarang={simpanBarang} />
        )}

        {halamanAktif === "Transaksi" && (
          <Transaksi
            dataBarang={dataBarang}
            onSimpanBarang={simpanBarang}
            dataTransaksi={dataTransaksi}
            onSimpanTransaksi={simpanTransaksi}
          />
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h2>Sehati Laris</h2>
            <p>
              Sistem manajemen inventaris & penjualan terintegrasi untuk
              bisnis Anda.
            </p>
          </div>
          <div className="footer-links">
            <h4>Navigasi</h4>
            <ul className="footer-nav">
              <li>
                <a href="#" onClick={() => setHalamanAktif("Beranda")}>
                  Beranda
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setHalamanAktif("Inventaris")}>
                  Inventaris
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setHalamanAktif("Transaksi")}>
                  Transaksi
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2026 Sehati Laris - Manajemen Inventaris & Penjualan
            Terintegrasi
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;

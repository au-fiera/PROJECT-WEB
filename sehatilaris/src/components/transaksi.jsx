import { useState } from "react";

export default function Transaksi({ dataBarang, onSimpanBarang, dataTransaksi, onSimpanTransaksi }) {
  const [namaProduk, setNamaProduk] = useState("");
  const [qty, setQty] = useState("");

  const tanganiSubmit = (e) => {
    e.preventDefault();

    const qtyAngka = parseInt(qty);

    if (!namaProduk || isNaN(qtyAngka) || qtyAngka <= 0) {
      alert("Mohon isi Nama Produk dan Quantity dengan benar!");
      return;
    }

    const barang = dataBarang.find((item) => item.nama === namaProduk);
    if (!barang) {
      alert("Barang tidak ditemukan!");
      return;
    }

    if (qtyAngka > barang.stok) {
      alert(`Stok tidak cukup! Stok ${namaProduk} saat ini hanya ${barang.stok}`);
      return;
    }

    const harga = barang.jual;
    const total = qtyAngka * harga;

    const transaksiBaru = {
      produk: namaProduk,
      qty: qtyAngka,
      harga,
      total,
      tanggal: new Date().toISOString().split("T")[0],
    };
    onSimpanTransaksi([...dataTransaksi, transaksiBaru]);

    const dataBarangBaru = dataBarang.map((item) =>
      item.nama === namaProduk ? { ...item, stok: item.stok - qtyAngka } : item
    );
    onSimpanBarang(dataBarangBaru);

    setNamaProduk("");
    setQty("");
    alert(`✅ Transaksi berhasil!\nStok ${namaProduk} tersisa ${barang.stok - qtyAngka}`);
  };

  const hapusTransaksi = (index) => {
    if (confirm("Yakin hapus transaksi ini?")) {
      const dataBaru = [...dataTransaksi];
      dataBaru.splice(index, 1);
      onSimpanTransaksi(dataBaru);
    }
  };

  return (
    <>
      <section className="content-header">
        <h2>Data Transaksi Penjualan</h2>
      </section>

      <div className="table-section">
        <div className="card">
          <table id="tabel-transaksi">
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Produk</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Total</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="body-transaksi">
              {dataTransaksi.map((item, index) => (
                <tr key={index}>
                  <td>#{String(index + 1).padStart(3, "0")}</td>
                  <td>{item.produk}</td>
                  <td>{item.qty}</td>
                  <td>Rp {item.harga.toLocaleString()}</td>
                  <td>Rp {item.total.toLocaleString()}</td>
                  <td>{item.tanggal}</td>
                  <td>
                    <button className="btn-small delete" onClick={() => hapusTransaksi(index)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-section card">
        <h3>Input Transaksi Baru</h3>
        <form onSubmit={tanganiSubmit} className="form-card">
          <fieldset>
            <legend>Data Penjualan</legend>
            <div className="form-group">
              <label>Nama Produk</label>
              <select value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} required>
                <option value="">- Pilih Produk -</option>
                {dataBarang.map((item) => (
                  <option key={item.id} value={item.nama}>
                    {item.nama} (Stok: {item.stok})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" placeholder="0" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn">Proses Penjualan</button>
            <button type="reset" className="btn" style={{ backgroundColor: "#64748b" }} onClick={() => { setNamaProduk(""); setQty(""); }}>Reset</button>
          </fieldset>
        </form>
      </div>
    </>
  );
}
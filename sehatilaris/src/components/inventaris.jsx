import { useState } from "react";

export default function Inventaris({ dataBarang, onSimpanBarang }) {
  const [namaBarang, setNamaBarang] = useState("");
  const [stok, setStok] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  const [hargaJual, setHargaJual] = useState("");

  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editStok, setEditStok] = useState("");
  const [editBeli, setEditBeli] = useState("");
  const [editJual, setEditJual] = useState("");

  const statusBarang = (item) => {
    if (item.stok === 0) return { label: "Habis", kelas: "low" };
    if (item.stok <= 20) return { label: "Rendah", kelas: "low" };
    return { label: "Cukup", kelas: "ok" };
  };

  const tanganiTambah = (e) => {
    e.preventDefault();

    const nama = namaBarang.trim();
    const stokAngka = parseInt(stok);
    const beliAngka = parseInt(hargaBeli);
    const jualAngka = parseInt(hargaJual);

    if (!nama || isNaN(stokAngka) || stokAngka <= 0 || isNaN(beliAngka) || beliAngka <= 0 || isNaN(jualAngka) || jualAngka <= 0) {
      alert("Mohon isi semua field dengan benar!");
      return;
    }

    const sudahAda = dataBarang.find((item) => item.nama.toLowerCase() === nama.toLowerCase());
    if (sudahAda) {
      alert("Barang dengan nama tersebut sudah ada!");
      return;
    }

    const barangBaru = {
      id: String(dataBarang.length + 1).padStart(3, "0"),
      nama,
      stok: stokAngka,
      beli: beliAngka,
      jual: jualAngka,
    };

    onSimpanBarang([...dataBarang, barangBaru]);

    setNamaBarang("");
    setStok("");
    setHargaBeli("");
    setHargaJual("");
    alert("✅ Barang berhasil ditambahkan!");
  };

  const hapusBarang = (id) => {
    if (confirm("Yakin hapus barang ini?")) {
      onSimpanBarang(dataBarang.filter((item) => item.id !== id));
    }
  };

  const tambahStok = (id) => {
    const jumlah = prompt("Masukkan jumlah stok yang ingin ditambahkan:", "10");
    const qty = parseInt(jumlah);

    if (isNaN(qty) || qty <= 0) {
      alert("Masukkan jumlah yang valid!");
      return;
    }

    const dataBaru = dataBarang.map((item) =>
      item.id === id ? { ...item, stok: item.stok + qty } : item
    );
    onSimpanBarang(dataBaru);

    const barang = dataBaru.find((item) => item.id === id);
    alert(`Stok ${barang.nama} berhasil ditambah ${qty} menjadi ${barang.stok}`);
  };

  const bukaModalEdit = (barang) => {
    setEditId(barang.id);
    setEditNama(barang.nama);
    setEditStok(barang.stok);
    setEditBeli(barang.beli);
    setEditJual(barang.jual);
    setModalTerbuka(true);
  };

  const tutupModal = () => setModalTerbuka(false);

  const tanganiEdit = (e) => {
    e.preventDefault();
    const dataBaru = dataBarang.map((item) =>
      item.id === editId
        ? {
            ...item,
            nama: editNama.trim(),
            stok: parseInt(editStok),
            beli: parseInt(editBeli),
            jual: parseInt(editJual),
          }
        : item
    );
    onSimpanBarang(dataBaru);
    setModalTerbuka(false);
    alert("✅ Barang berhasil diupdate!");
  };

  return (
    <>
      {modalTerbuka && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <h3>Edit Barang</h3>
            <form onSubmit={tanganiEdit}>
              <div className="form-group">
                <label>Nama Barang</label>
                <input type="text" value={editNama} onChange={(e) => setEditNama(e.target.value)} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stok</label>
                  <input type="number" min="0" value={editStok} onChange={(e) => setEditStok(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Harga Beli (Rp)</label>
                  <input type="number" min="0" value={editBeli} onChange={(e) => setEditBeli(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>Harga Jual (Rp)</label>
                <input type="number" min="0" value={editJual} onChange={(e) => setEditJual(e.target.value)} required />
              </div>
              <button type="submit" className="btn">Simpan Perubahan</button>
              <button type="button" onClick={tutupModal} className="btn" style={{ backgroundColor: "#64748b" }}>Batal</button>
            </form>
          </div>
        </div>
      )}

      <section className="content-header">
        <h2>Data Stok Barang</h2>
      </section>

      <div className="table-section">
        <div className="card">
          <table id="tabel-inventaris">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Barang</th>
                <th>Stok</th>
                <th>Harga Beli</th>
                <th>Harga Jual</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="body-inventaris">
              {dataBarang.map((item) => {
                const status = statusBarang(item);
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nama}</td>
                    <td>{item.stok}</td>
                    <td>Rp {item.beli.toLocaleString()}</td>
                    <td>Rp {item.jual.toLocaleString()}</td>
                    <td><span className={`status ${status.kelas}`}>{status.label}</span></td>
                    <td>
                      <button className="btn-small" onClick={() => bukaModalEdit(item)}>Edit</button>
                      <button className="btn-small" onClick={() => tambahStok(item.id)}>+ Stok</button>
                      <button className="btn-small delete" onClick={() => hapusBarang(item.id)}>Hapus</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-section card">
        <h3>Tambah Barang Baru</h3>
        <form onSubmit={tanganiTambah} className="form-card">
          <fieldset>
            <legend>Data Barang</legend>
            <div className="form-row">
              <div className="form-group">
                <label>Nama Barang</label>
                <input type="text" placeholder="Contoh: Paracetamol" value={namaBarang} onChange={(e) => setNamaBarang(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Stok Awal</label>
                <input type="number" placeholder="0" min="0" value={stok} onChange={(e) => setStok(e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Harga Beli (Rp)</label>
                <input type="number" placeholder="0" min="0" value={hargaBeli} onChange={(e) => setHargaBeli(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Harga Jual (Rp)</label>
                <input type="number" placeholder="0" min="0" value={hargaJual} onChange={(e) => setHargaJual(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn">Simpan Barang</button>
            <button type="reset" className="btn" style={{ backgroundColor: "#64748b" }} onClick={() => { setNamaBarang(""); setStok(""); setHargaBeli(""); setHargaJual(""); }}>Reset</button>
          </fieldset>
        </form>
      </div>
    </>
  );
}
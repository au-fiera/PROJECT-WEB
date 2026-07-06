export default function Beranda({ dataBarang, dataTransaksi }) {
  const totalProduk = dataBarang.length;
  const stokRendah = dataBarang.filter((item) => item.stok < 20).length;
  const totalPenjualan = dataTransaksi.reduce((sum, t) => sum + (t.total || 0), 0);

  const productMap = {};
  dataTransaksi.forEach((t) => {
    if (!productMap[t.produk]) productMap[t.produk] = { qty: 0, total: 0 };
    productMap[t.produk].qty += t.qty;
    productMap[t.produk].total += t.total;
  });

  const topProduk = Object.entries(productMap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  return (
    <>
      <section className="hero">
        <h2>Selamat Datang, Admin</h2>
        <p>Pantau stok barang dan penjualan harian Anda di sini.</p>
      </section>

      <div className="stats-grid">
        <div className="card">
          <h3>Total Produk</h3>
          <p>{totalProduk} Item</p>
        </div>
        <div className="card">
          <h3>Stok Rendah</h3>
          <p>{stokRendah} Item</p>
        </div>
        <div className="card">
          <h3>Penjualan Hari Ini</h3>
          <p>Rp {totalPenjualan.toLocaleString()}</p>
        </div>
      </div>

      <section className="table-section">
        <h3>Top 5 Produk Terlaris</h3>
        <div className="card">
          <table id="tabel-top-produk">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Terjual</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody id="body-top-produk">
              {topProduk.map(([nama, data]) => (
                <tr key={nama}>
                  <td>{nama}</td>
                  <td>{data.qty}</td>
                  <td>Rp {data.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
// script.js - Sehati Laris

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('body-inventaris')) loadInventaris();
    if (document.getElementById('body-transaksi')) loadTransaksi();
    updateDashboardStats();
    updateTopProducts();
    if (document.getElementById('nama-produk'))
    loadProdukToDropdown();

});

// ==================== INVENTARIS ====================
function loadInventaris() {
    let data = JSON.parse(localStorage.getItem('inventaris')) || [
        {id: "001", nama: "Paracetamol 500mg", stok: 250, beli: 2000, jual: 3000, status: "ok"},
        {id: "002", nama: "Amoxicillin 500mg", stok: 120, beli: 5000, jual: 8000, status: "ok"},
        {id: "003", nama: "Vitamin C 500mg", stok: 15, beli: 1500, jual: 3000, status: "low"}
    ];

    localStorage.setItem('inventaris', JSON.stringify(data));
    renderTabelInventaris(data);
}

function renderTabelInventaris(data) {
    const tbody = document.getElementById('body-inventaris');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nama}</td>
            <td>${item.stok}</td>
            <td>Rp ${item.beli.toLocaleString()}</td>
            <td>Rp ${item.jual.toLocaleString()}</td>
            <td><span class="status ${item.status}">${item.status === 'ok' ? 'Cukup' : 'Rendah'}</span></td>
            <td><button class="btn-small delete" onclick="hapusBarang('${item.id}')">Hapus</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Form Tambah Barang
document.getElementById('form-tambah-barang')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const nama = document.getElementById('nama-barang').value.trim();
    const stok = parseInt(document.getElementById('stok').value);
    const beli = parseInt(document.getElementById('harga-beli').value);
    const jual = parseInt(document.getElementById('harga-jual').value);

    if (!nama || isNaN(stok) || isNaN(beli) || isNaN(jual)) {
        alert("Mohon isi semua field dengan benar!");
        return;
    }

    let data = JSON.parse(localStorage.getItem('inventaris')) || [];

    const newItem = {
        id: String(data.length + 1).padStart(3, '0'),
        nama: nama,
        stok: stok,
        beli: beli,
        jual: jual,
        status: stok > 20 ? 'ok' : 'low'
    };

    data.push(newItem);
    localStorage.setItem('inventaris', JSON.stringify(data));
    renderTabelInventaris(data);

    this.reset();
    alert("✅ Barang berhasil ditambahkan!");
});

function hapusBarang(id) {
    if (!confirm("Yakin hapus barang ini?")) return;

    let data = JSON.parse(localStorage.getItem('inventaris')) || [];
    data = data.filter(item => item.id !== id);
    localStorage.setItem('inventaris', JSON.stringify(data));
    renderTabelInventaris(data);
}

// ==================== TRANSAKSI ====================
function loadTransaksi() {
    let data = JSON.parse(localStorage.getItem('transaksi')) || [];
    renderTabelTransaksi(data);
}

function renderTabelTransaksi(data) {
    const tbody = document.getElementById('body-transaksi');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${String(index + 1).padStart(3, '0')}</td>
            <td>${item.produk}</td>
            <td>${item.qty}</td>
            <td>Rp ${item.harga.toLocaleString()}</td>
            <td>Rp ${item.total.toLocaleString()}</td>
            <td>${item.tanggal}</td>
            <td><button class="btn-small delete" onclick="hapusTransaksi(${index})">Hapus</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Form Transaksi
document.getElementById('form-transaksi')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const produk = document.getElementById('nama-produk').value.trim();
    const qty = parseInt(document.getElementById('qty').value);
    const harga = parseInt(document.getElementById('harga-unit').value);

    if (!produk || isNaN(qty) || isNaN(harga)) {
        alert("Mohon isi semua field dengan benar!");
        return;
    }

    const total = qty * harga;

    let data = JSON.parse(localStorage.getItem('transaksi')) || [];
    
    data.push({
        produk: produk,
        qty: qty,
        harga: harga,
        total: total,
        tanggal: new Date().toISOString().split('T')[0]
    });

    localStorage.setItem('transaksi', JSON.stringify(data));
    renderTabelTransaksi(data);

    this.reset();
    alert("✅ Transaksi berhasil diproses!");
});

function hapusTransaksi(index) {
    if (confirm("Yakin hapus transaksi ini?")) {
        let data = JSON.parse(localStorage.getItem('transaksi')) || [];
        data.splice(index, 1);
        localStorage.setItem('transaksi', JSON.stringify(data));
        renderTabelTransaksi(data);
    }
}

// Update Stats di Beranda
function updateDashboardStats() {
    const inventaris = JSON.parse(localStorage.getItem('inventaris')) || [];
    const transaksi = JSON.parse(localStorage.getItem('transaksi')) || [];

    const cards = document.querySelectorAll('.stats-grid .card p');

    // Total Produk
    if (cards[0]) cards[0].textContent = `${inventaris.length} Item`;

    // Stok Rendah
    const stokRendah = inventaris.filter(item => (item.stok || 0) < 20).length;
    if (cards[1]) cards[1].textContent = `${stokRendah} Item`;

    // Penjualan Hari Ini
    const totalPenjualan = transaksi.reduce((sum, t) => sum + (t.total || 0), 0);
    if (cards[2]) cards[2].textContent = `Rp ${totalPenjualan.toLocaleString()}`;
}

// Top 5 Produk Terlaris
function updateTopProducts() {
    const transaksi = JSON.parse(localStorage.getItem('transaksi')) || [];
    const productMap = {};

    transaksi.forEach(t => {
        if (!productMap[t.produk]) {
            productMap[t.produk] = { qty: 0, total: 0 };
        }
        productMap[t.produk].qty += t.qty;
        productMap[t.produk].total += t.total;
    });

    const sorted = Object.entries(productMap)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5);

    const tbody = document.getElementById('body-top-produk');
    if (!tbody) return;

    tbody.innerHTML = '';

    sorted.forEach(([nama, data]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${nama}</td>
            <td>${data.qty}</td>
            <td>Rp ${data.total.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Load produk ke dropdown transaksi
function loadProdukToDropdown() {
    const select = document.getElementById('nama-produk');
    if (!select) return;

    const inventaris = JSON.parse(localStorage.getItem('inventaris')) || [];
    
    select.innerHTML = '<option value="">- Pilih Produk -</option>';
    
    inventaris.forEach(item => {
        const option = document.createElement('option');
        option.value = item.nama;
        option.textContent = item.nama;
        select.appendChild(option);
    });
}

// Load produk ke dropdown di Transaksi
function loadProdukToDropdown() {
    const select = document.getElementById('nama-produk');
    if (!select) return;

    const inventaris = JSON.parse(localStorage.getItem('inventaris')) || [];
    
    select.innerHTML = '<option value="">- Pilih Produk -</option>';
    
    inventaris.forEach(item => {
        const option = document.createElement('option');
        option.value = item.nama;
        option.textContent = `${item.nama} (Stok: ${item.stok})`;
        select.appendChild(option);
    });
}
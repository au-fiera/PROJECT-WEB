document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('body-inventaris')) loadInventaris();
    if (document.getElementById('body-transaksi')) loadTransaksi();
    if (document.getElementById('nama-produk')) loadProdukToDropdown();
    updateDashboardStats();
    updateTopProducts();
});

function loadInventaris() {
    let data = JSON.parse(localStorage.getItem('inventaris')) || [
        {id: "001", nama: "Paracetamol 500mg", stok: 250, beli: 2000, jual: 3000, status: "ok"},
        {id: "002", nama: "Amoxicillin 500mg", stok: 120, beli: 5000, jual: 8000, status: "ok"}
    ];

    localStorage.setItem('inventaris', JSON.stringify(data));
    renderTabelInventaris(data);
}

function renderTabelInventaris(data) {
    const tbody = document.getElementById('body-inventaris');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    data.forEach(item => {
        let statusHTML = '';
        if (item.stok === 0) {
            statusHTML = `<span class="status low">Habis</span>`;
        } else if (item.stok <= 20) {
            statusHTML = `<span class="status low">Rendah</span>`;
        } else {
            statusHTML = `<span class="status ok">Cukup</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nama}</td>
            <td>${item.stok}</td>
            <td>Rp ${item.beli.toLocaleString()}</td>
            <td>Rp ${item.jual.toLocaleString()}</td>
            <td>${statusHTML}</td>
            <td>
                <button class="btn-small" onclick="editBarang('${item.id}')">Edit</button>
                <button class="btn-small delete" onclick="hapusBarang('${item.id}')">Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('form-tambah-barang')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const nama = document.getElementById('nama-barang').value.trim();
    const stok = parseInt(document.getElementById('stok').value);
    const beli = parseInt(document.getElementById('harga-beli').value);
    const jual = parseInt(document.getElementById('harga-jual').value);

    if (!nama || isNaN(stok) || stok <= 0 || isNaN(beli) || beli <= 0 || isNaN(jual) || jual <= 0) {
        alert("Mohon isi semua field dengan benar!");
        return;
    }

    let data = JSON.parse(localStorage.getItem('inventaris')) || [];

    const existing = data.find(item => item.nama.toLowerCase() === nama.toLowerCase());
    if (existing) {
        alert("Barang dengan nama tersebut sudah ada!");
        return;
    }

    const newItem = {
        id: String(data.length + 1).padStart(3, '0'),
        nama: nama,
        stok: stok,
        beli: beli,
        jual: jual,
        status: stok > 20 ? 'ok' : (stok > 0 ? 'low' : 'habis')
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

function editBarang(id) {
    let data = JSON.parse(localStorage.getItem('inventaris')) || [];
    const barang = data.find(item => item.id === id);
    if (!barang) return;

    document.getElementById('edit-id').value = barang.id;
    document.getElementById('edit-nama').value = barang.nama;
    document.getElementById('edit-stok').value = barang.stok;
    document.getElementById('edit-beli').value = barang.beli;
    document.getElementById('edit-jual').value = barang.jual;

    document.getElementById('modal-edit').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-edit').style.display = 'none';
}

document.getElementById('form-edit')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;
    const nama = document.getElementById('edit-nama').value.trim();
    const stok = parseInt(document.getElementById('edit-stok').value);
    const beli = parseInt(document.getElementById('edit-beli').value);
    const jual = parseInt(document.getElementById('edit-jual').value);

    let data = JSON.parse(localStorage.getItem('inventaris')) || [];
    const barang = data.find(item => item.id === id);

    if (barang) {
        barang.nama = nama;
        barang.stok = stok;
        barang.beli = beli;
        barang.jual = jual;
        barang.status = stok > 20 ? 'ok' : (stok > 0 ? 'low' : 'habis');

        localStorage.setItem('inventaris', JSON.stringify(data));
        renderTabelInventaris(data);
        closeModal();
        alert("✅ Barang berhasil diupdate!");
    }
});

function tambahStok(id) {
    const jumlah = prompt("Masukkan jumlah stok yang ingin ditambahkan:", "10");
    const qty = parseInt(jumlah);

    if (isNaN(qty) || qty <= 0) {
        alert("Masukkan jumlah yang valid!");
        return;
    }

    let data = JSON.parse(localStorage.getItem('inventaris')) || [];
    const barang = data.find(item => item.id === id);

    if (barang) {
        barang.stok += qty;
        barang.status = barang.stok > 20 ? 'ok' : (barang.stok > 0 ? 'low' : 'habis');

        localStorage.setItem('inventaris', JSON.stringify(data));
        renderTabelInventaris(data);
        
        alert(`Stok ${barang.nama} berhasil ditambah ${qty} menjadi ${barang.stok}`);
    }
}

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

document.getElementById('form-transaksi')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const produk = document.getElementById('nama-produk').value;
    const qty = parseInt(document.getElementById('qty').value);

    if (!produk || isNaN(qty) || qty <= 0) {
        alert("Mohon isi Nama Produk dan Quantity dengan benar!");
        return;
    }

    const inventaris = JSON.parse(localStorage.getItem('inventaris')) || [];
    const indexBarang = inventaris.findIndex(item => item.nama === produk);

    if (indexBarang === -1) {
        alert("Barang tidak ditemukan!");
        return;
    }

    const barang = inventaris[indexBarang];

    if (qty > barang.stok) {
        alert(`Stok tidak cukup! Stok ${produk} saat ini hanya ${barang.stok}`);
        return;
    }

    const harga = barang.jual;
    const total = qty * harga;

    let dataTransaksi = JSON.parse(localStorage.getItem('transaksi')) || [];
    dataTransaksi.push({
        produk: produk,
        qty: qty,
        harga: harga,
        total: total,
        tanggal: new Date().toISOString().split('T')[0]
    });

    localStorage.setItem('transaksi', JSON.stringify(dataTransaksi));

    barang.stok -= qty;
    localStorage.setItem('inventaris', JSON.stringify(inventaris));

    renderTabelTransaksi(dataTransaksi);
    loadInventaris();
    loadProdukToDropdown();

    this.reset();
    alert(`✅ Transaksi berhasil!\nStok ${produk} tersisa ${barang.stok}`);
});

function hapusTransaksi(index) {
    if (confirm("Yakin hapus transaksi ini?")) {
        let data = JSON.parse(localStorage.getItem('transaksi')) || [];
        data.splice(index, 1);
        localStorage.setItem('transaksi', JSON.stringify(data));
        renderTabelTransaksi(data);
    }
}

function updateDashboardStats() {
    const inventaris = JSON.parse(localStorage.getItem('inventaris')) || [];
    const transaksi = JSON.parse(localStorage.getItem('transaksi')) || [];

    const cards = document.querySelectorAll('.stats-grid .card p');

    if (cards[0]) cards[0].textContent = `${inventaris.length} Item`;
    if (cards[1]) cards[1].textContent = `${inventaris.filter(i => i.stok < 20).length} Item`;

    const totalPenjualan = transaksi.reduce((sum, t) => sum + (t.total || 0), 0);
    if (cards[2]) cards[2].textContent = `Rp ${totalPenjualan.toLocaleString()}`;
}

function updateTopProducts() {
    const transaksi = JSON.parse(localStorage.getItem('transaksi')) || [];
    const productMap = {};

    transaksi.forEach(t => {
        if (!productMap[t.produk]) productMap[t.produk] = { qty: 0, total: 0 };
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

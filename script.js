const gameList = {
  'MLBB': 'Mobile Legends',
  'FF': 'Free Fire',
  'PUBG': 'PUBG Mobile',
  'GI': 'Genshin Impact',
};

window.onload = () => {
  const gameSelect = document.getElementById("game");
  for (let kode in gameList) {
    const opt = document.createElement("option");
    opt.value = kode;
    opt.text = gameList[kode];
    gameSelect.appendChild(opt);
  }
};

async function loadProduk() {
  const game = document.getElementById("game").value;
  const produkSelect = document.getElementById("produk");
  produkSelect.innerHTML = `<option>Loading...</option>`;

  try {
    const res = await fetch(`https://vip-reseller.co.id/api/game-feature?key=${API_KEY}&sign=${SIGN}&type=layanan&id=${API_ID}&game=${game}`);
    const json = await res.json();
    if (json.status) {
      produkSelect.innerHTML = `<option value="">-- Pilih Nominal --</option>`;
      json.data.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.kode;
        opt.text = `${item.nama} - Rp${item.harga}`;
        produkSelect.appendChild(opt);
      });
    } else {
      produkSelect.innerHTML = `<option>Gagal load produk</option>`;
    }
  } catch (err) {
    produkSelect.innerHTML = `<option>Gagal konek ke API</option>`;
  }
}

async function submitOrder() {
  const game = document.getElementById("game").value;
  const uid = document.getElementById("uid").value.trim();
  const zone = document.getElementById("zone").value.trim();
  const produk = document.getElementById("produk").value;

  if (!game || !uid || !produk) return alert("Lengkapi semua data!");

  const target = zone ? `${uid}:${zone}` : uid;

  const statusDiv = document.getElementById("status");
  statusDiv.innerText = "Mengirim pesanan...";

  try {
    const res = await fetch("/api/order.js", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        api_id: API_ID,
        api_key: API_KEY,
        sign: SIGN,
        target,
        produk
      })
    });
    const json = await res.json();
    if (json.status) {
      statusDiv.innerHTML = `<span style="color:green;">✅ Berhasil: ${json.data.trxid}</span>`;
    } else {
      statusDiv.innerHTML = `<span style="color:red;">❌ Gagal: ${json.pesan}</span>`;
    }
  } catch (e) {
    statusDiv.innerText = "❌ Error menghubungi server";
  }
}

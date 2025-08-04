// api/order.js
export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);
  const { api_id, api_key, sign, target, produk } = body;

  const form = new URLSearchParams({
    key: api_key,
    sign: sign,
    type: "order",
    id: api_id,
    layanan: produk,
    target: target
  });

  try {
    const res = await fetch("https://vip-reseller.co.id/api/game-feature", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form
    });
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: false, pesan: "Server error" })
    };
  }
}

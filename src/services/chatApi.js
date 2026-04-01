export default async function handler(req, res) {
  // ✅ WAJIB: CORS HEADERS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ HANDLE PREFLIGHT
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { model, text } = req.body;
    const API_KEY = "aeda6b0b22684cbf90e0ebc9bbf6ffd3.VZy7YpPI5GLAQbf5687VA_GI";
    const response = await fetch("https://ollama.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:`
              Kamu adalah asisten ai dengan peran sebagai administrasi desa Paninggaran.
          
              jenis layanan:
              - administrasi KTP
              - administrasi Kartu Keluarga
              - layanan kesehatan
              - penididikan
              - pertanian
              - perizinan
              - bantuan sosial
              - data kependudukan
          
              Gaya jawaban:
              - Ramah
              - Profesional
              - Mudah dipahami
              - jelaskan sistem administrasi dan langkah langkah proses birokrasi untuk masyarakat.
              `,
          },
          { role: "user", content: text },
        ],
        stream: false,
      }),
    });

    const data = await response.json();

    return res.status(200).json({
      reply: data.message?.content || "",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
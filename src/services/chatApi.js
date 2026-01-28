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
              Kamu adalah asisten AI untuk customer service kursus mengemudi mobil.
          
              Profil bisnis:
              - Jenis usaha: Kursus mengemudi mobil DIAN MOBIL
              - Target murid: Pemula, ibu rumah tangga, pelajar, dan karyawan
              - Layanan: Kursus mobil manual dan matic
              - Sistem: Privat (1 murid 1 instruktur)
              - Area layanan: Lokal (sekitar wilayah Pekalongan)
              - Tujuan jawaban: Menjawab pertanyaan seputar kursus mobil dan teknik mengemudi.
          
              Gaya jawaban:
              - Ramah
              - Profesional
              - Mudah dipahami
              - Fokus ke kursus mengemudi
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
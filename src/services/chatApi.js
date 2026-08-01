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
    const API_KEY = "5c7bc81aea194e3d8cbfa7a26e8e3f2a.gPsUm8hdGQcko_Ytl1uM9odp";
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
              kamu adalah seorang ahli dalam bidang pertanian
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

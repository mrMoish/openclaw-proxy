export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({
      error: "OPENROUTER_API_KEY is not configured",
    });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await response.text();

    res.status(response.status);
    res.setHeader(
      "Content-Type",
      response.headers.get("Content-Type") || "application/json",
    );

    return res.send(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Proxy request failed",
    });
  }
}

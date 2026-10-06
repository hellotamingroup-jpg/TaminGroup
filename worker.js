export default {
  async fetch(request, env) {
    var cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    var data;
    try {
      data = await request.json();
    } catch (err) {
      return new Response("Bad request", { status: 400, headers: cors });
    }

    var name = String(data.name || "").slice(0, 100);
    var email = String(data.email || "").slice(0, 150);
    var message = String(data.message || "").slice(0, 2000);
    if (!name || !email || !message) {
      return new Response("Missing fields", { status: 400, headers: cors });
    }

    var text = "Новая заявка с сайта\n\nИмя: " + name + "\nПочта: " + email + "\n\n" + message;

    var tg = await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text: text })
    });

    if (!tg.ok) {
      return new Response("Telegram error", { status: 502, headers: cors });
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: Object.assign({ "Content-Type": "application/json" }, cors)
    });
  }
};

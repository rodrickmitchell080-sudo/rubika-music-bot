const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

// ⚠️ توکن رباتت رو اینجا جایگزین کن
const BOT_TOKEN = "توکن_ربات_شما"; 

app.post('/', async (req, res) => {
    const update = req.body;
    let msg = update.message || update.new_message || update.inline_message;
    
    if (update.type === "StartedBot" || (update.action && update.action === "StartedBot")) {
        const chatId = update.chat_id || update.object_guid;
        await sendMenu(chatId);
    } else if (msg && msg.text) {
        const chatId = msg.object_guid || msg.chat_id;
        const text = msg.text;

        if (text === "/start" || text === "شروع") {
            await sendMenu(chatId);
        }
        // اینجا بقیه منطق هنرمندان و آهنگ‌ها رو بعداً اضافه می‌کنیم
    }
    res.status(200).send('OK');
});

async function sendMenu(chatId) {
    const payload = {
        chat_id: chatId,
        text: "🌹 به ربات موزیک خوش آمدید!\nلطفاً از دکمه‌های زیر استفاده کنید:",
        inline_keypad: {
            rows: [
                { buttons: [{ id: "btn_artists", type: "Simple", button_text: "🎤 لیست هنرمندان" }] }
            ]
        }
    };
    await callApi("sendMessage", payload);
}

async function callApi(method, payload) {
    return await fetch(`https://botapi.rubika.ir/v3/${BOT_TOKEN}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
}

app.get('/', (req, res) => res.send('Bot is Live! 🚀'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

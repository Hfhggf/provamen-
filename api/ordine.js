export default async function handler(req, res) {
    // Vercel legge questi dati dalle "Environment Variables" che hai impostato
    const token = process.env.TELEGRAM_TOKEN;
    const chat_id = process.env.CHAT_ID;
    
    // Riceve il messaggio dal sito
    const { messaggio } = req.body;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chat_id,
                text: messaggio,
                parse_mode: "Markdown" // Rende l'ordine più leggibile
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

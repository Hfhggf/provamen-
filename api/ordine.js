export default async function handler(req, res) {
    // 1. Controllo Metodo (Accetta solo POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metodo non consentito' });
    }
 
    const token = process.env.TELEGRAM_TOKEN;
    const chat_id = process.env.CHAT_ID;
    const { messaggio } = req.body;

    // 2. Controllo Variabili (Se mancano, il log di Vercel ce lo dirà)
    if (!token || !chat_id) {
        console.error("ERRORE: Variabili d'ambiente mancanti!");
        return res.status(500).json({ error: 'Configurazione server errata' });
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const telegramRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chat_id,
                text: messaggio || "Nuovo ordine ricevuto (testo vuoto)",
                parse_mode: "Markdown"
            })
        });

        const data = await telegramRes.json();

        if (telegramRes.ok) {
            return res.status(200).json({ success: true });
        } else {
            console.error("Errore Telegram:", data);
            return res.status(500).json({ error: 'Telegram ha rifiutato la richiesta' });
        }
    } catch (error) {
        console.error("Errore Fetch:", error);
        return res.status(500).json({ error: 'Errore interno di connessione' });
    }
}

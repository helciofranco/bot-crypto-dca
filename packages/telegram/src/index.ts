import axios, { type AxiosInstance } from 'axios';

export class TelegramService {
  private chatId: string;
  private enabled: boolean;
  private client: AxiosInstance;

  constructor(chatId: string, token: string, enabled: boolean) {
    this.chatId = chatId;
    this.enabled = enabled;
    this.client = axios.create({
      baseURL: `https://api.telegram.org/bot${token}/`,
    });
  }

  async sendMessage(message: string): Promise<void> {
    console.log(message);

    if (!this.enabled) {
      return;
    }

    await this.client.post('sendMessage', {
      chat_id: this.chatId,
      text: message,
    });
  }
}

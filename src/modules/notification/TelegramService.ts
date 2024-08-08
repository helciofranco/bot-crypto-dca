import axios, { type AxiosInstance } from 'axios';
import { config } from '../../config';

export class TelegramService {
  private chatId: string;
  private client: AxiosInstance;

  constructor() {
    this.chatId = config.telegram.chatId;
    this.client = axios.create({
      baseURL: `https://api.telegram.org/bot${config.telegram.token}/`,
    });
  }

  async sendMessage(message: string): Promise<void> {
    await this.client.post('sendMessage', {
      chat_id: this.chatId,
      text: message,
    });
  }
}

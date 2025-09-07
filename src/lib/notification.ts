import type AccountAPI from '@service/v2/account';
import { unread, notifications } from '@stores/notification.svelte';

export default class NotificationService {
  protected socket: WebSocket | null = null;
  protected api: AccountAPI;

  constructor(api: AccountAPI, socket?: WebSocket) {
    this.api = api;
    this.socket = socket || null;
  }

  async connect(token: string) {
    // Connect to the notification WebSocket
    this.socket = new WebSocket(
      `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/notifications?token=${token}`,
    );

    this.socket.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'notification') {
        notifications.update((n) => [msg, ...n].slice(0, 100));
        unread.update((c) => c + 1);
      } else if (msg.type === 'unread') {
        unread.set(msg.count);
      }
    };

    this.socket.onclose = () => {
      setTimeout(() => this.connect(token), 1500); // reconnect
    };
  }

  async disconnect() {
    // Disconnect the WebSocket
    this.socket?.close();
  }

  async fetchInitialInbox(page_size: number) {
    // Fetch initial inbox notifications
    const { status, message, data } = await this.api.notificationInbox(
      1,
      page_size,
    );

    if (status === 'error') {
      console.error(message || 'Unknown error occurred');
      return;
    }

    if (!data || !Array.isArray(data.notifications)) {
      console.error('Invalid data format for notifications');
      return;
    }

    notifications.set(data.notifications);
    unread.set(data.unreadCount);
  }

  async markRead(id: string) {
    // Mark a notification as read
    const { status, message, data } = await this.api.markNotificationRead(id);
    if (status === 'error') {
      console.error(message || 'Unknown error occurred');
      return;
    }

    unread.update((c) => Math.max(0, c - 1));
    notifications.update((list) =>
      list.map((it: AccountNotification) =>
        it.id === id ? { ...it, read_at: new Date().toISOString() } : it,
      ),
    );
  }
}

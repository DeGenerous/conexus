import type AccountAPI from '@service/v2/account';
import { unread, notifications } from '@stores/notification.svelte';

/**
 * Coordinates notification WebSocket connections and inbox state.
 */
export default class NotificationService {
  protected socket: WebSocket | null = null;
  protected api: AccountAPI;

  /**
   * Create a new notification service instance.
   * @param api - The account API client to use.
   * @param socket - Optional pre-existing WebSocket connection.
   */
  constructor(api: AccountAPI, socket?: WebSocket) {
    this.api = api;
    this.socket = socket || null;
  }

  /**
   * Establish a WebSocket connection for real-time notifications.
   * @param token - The authentication token to authorize the connection.
   */
  async connect(token: string) {
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

  /**
   * Close the current WebSocket connection if present.
   */
  async disconnect() {
    this.socket?.close();
  }

  /**
   * Load the initial notification inbox via the REST API.
   * @param page_size - The number of notifications to fetch.
   */
  async fetchInitialInbox(page_size: number) {
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

  /**
   * Mark a notification as read and update local UI state.
   * @param id - The notification identifier to mark as read.
   */
  async markRead(id: string) {
    const { status, message } = await this.api.markNotificationRead(id);
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

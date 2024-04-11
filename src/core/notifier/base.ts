export interface Notifier {
  sendNotification(text: string, mediaUrl?: string): Promise<void>;
}

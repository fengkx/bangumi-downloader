export interface Notifier {
  sendNotification(text: string): Promise<void>;
}

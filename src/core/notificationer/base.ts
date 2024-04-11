export interface Notificationer {
    sendNotification(markdownText: string): Promise<void>
}
export type NotificationType =
  | 'INFO'
  | 'SUCCESS'
  | 'WARNING'
  | 'ERROR';

export interface Notification {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: NotificationType;
  lida: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface UnreadNotificationCount {
  quantidade: number;
}
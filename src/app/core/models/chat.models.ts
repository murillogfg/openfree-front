export type ConversationStatus =
  | 'ATIVA'
  | 'ENCERRADA';

export type MessageSenderType =
  | 'FREELANCER'
  | 'EMPRESA';

export interface Conversation {
  id: number;
  candidaturaId: number;
  vagaId: number;
  vagaTitulo: string;
  empresaId: number;
  empresaNome: string;
  usuarioId: number;
  usuarioNome: string;
  status: ConversationStatus;
  mensagensNaoLidas: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  remetenteId: number;
  remetenteNome: string;
  tipoRemetente: MessageSenderType;
  conteudo: string;
  lida: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface SendMessageRequest {
  conteudo: string;
}
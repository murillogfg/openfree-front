import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  ApiResponse
} from '../models/api-response';

import {
  Conversation,
  Message,
  SendMessageRequest
} from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/chat`;

  listarConversas():
    Observable<ApiResponse<Conversation[]>> {

    return this.http.get<
      ApiResponse<Conversation[]>
    >(
      `${this.apiUrl}/conversations`
    );
  }

  listarMensagens(
    conversationId: number
  ): Observable<ApiResponse<Message[]>> {

    return this.http.get<
      ApiResponse<Message[]>
    >(
      `${this.apiUrl}/conversations/${conversationId}/messages`
    );
  }

  enviarMensagem(
    conversationId: number,
    request: SendMessageRequest
  ): Observable<ApiResponse<Message>> {

    return this.http.post<
      ApiResponse<Message>
    >(
      `${this.apiUrl}/conversations/${conversationId}/messages`,
      request
    );
  }

  marcarComoLidas(
    conversationId: number
  ): Observable<ApiResponse<void>> {

    return this.http.patch<
      ApiResponse<void>
    >(
      `${this.apiUrl}/conversations/${conversationId}/read`,
      {}
    );
  }

  encerrarConversa(
    conversationId: number
  ): Observable<ApiResponse<Conversation>> {

    return this.http.patch<
      ApiResponse<Conversation>
    >(
      `${this.apiUrl}/conversations/${conversationId}/close`,
      {}
    );
  }
}
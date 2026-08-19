import { CommonModule } from '@angular/common';

import {
  Component,
  DestroyRef,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  interval
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import { AuthService } from '../../core/services/auth.service';
import { ChatService } from '../../core/services/chat.service';

import {
  Conversation,
  Message
} from '../../core/models/chat.models';

@Component({
  selector: 'app-chat',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit {

  private readonly chatService =
    inject(ChatService);

  private readonly authService =
    inject(AuthService);

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly destroyRef =
    inject(DestroyRef);

  conversations: Conversation[] = [];

  messages: Message[] = [];

  selectedConversation:
    Conversation | null = null;

  loadingConversations = true;
  loadingMessages = false;

  sending = false;
  closingConversation = false;

  errorMessage = '';
  successMessage = '';

  messageForm =
    this.formBuilder.nonNullable.group({

      conteudo: [
        '',
        [
          Validators.required,
          Validators.maxLength(2000)
        ]
      ]

    });

  ngOnInit(): void {

    this.carregarConversas();

    this.iniciarAtualizacaoAutomatica();
  }

  get isCompany(): boolean {

    return this.authService
      .isCompany();
  }

  get conversaEncerrada(): boolean {

    return (
      this.selectedConversation?.status
      === 'ENCERRADA'
    );
  }

  carregarConversas(
    mostrarLoading = true
  ): void {

    if (mostrarLoading) {
      this.loadingConversations = true;
    }

    this.chatService
      .listarConversas()
      .subscribe({

        next: response => {

          this.conversations =
            response.data ?? [];

          this.loadingConversations =
            false;

          /*
           * Mantemos a conversa atualmente
           * selecionada sincronizada.
           */
          if (this.selectedConversation) {

            const atualizada =
              this.conversations.find(
                conversation =>
                  conversation.id
                  === this.selectedConversation?.id
              );

            if (atualizada) {

              this.selectedConversation =
                atualizada;
            }
          }

          /*
           * Primeira conversa automática.
           */
          if (
            !this.selectedConversation
            && this.conversations.length > 0
          ) {

            this.selecionarConversa(
              this.conversations[0]
            );
          }
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loadingConversations =
            false;

          if (mostrarLoading) {

            this.errorMessage =
              error.error?.message
              ?? 'Não foi possível carregar as conversas.';
          }
        }

      });
  }

  selecionarConversa(
    conversation: Conversation
  ): void {

    this.selectedConversation =
      conversation;

    this.loadingMessages = true;

    this.messages = [];

    this.errorMessage = '';
    this.successMessage = '';

    this.carregarMensagens(
      conversation.id,
      true
    );
  }

  private carregarMensagens(
    conversationId: number,
    mostrarLoading = false
  ): void {

    if (mostrarLoading) {
      this.loadingMessages = true;
    }

    this.chatService
      .listarMensagens(
        conversationId
      )
      .subscribe({

        next: response => {

          /*
           * A resposta pode chegar depois de
           * o usuário trocar de conversa.
           */
          if (
            this.selectedConversation?.id
            !== conversationId
          ) {
            return;
          }

          this.messages =
            response.data ?? [];

          this.loadingMessages =
            false;

          if (
            this.selectedConversation
          ) {

            this.selectedConversation
              .mensagensNaoLidas = 0;
          }
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loadingMessages =
            false;

          if (mostrarLoading) {

            this.errorMessage =
              error.error?.message
              ?? 'Não foi possível carregar as mensagens.';
          }
        }

      });
  }

  enviar(): void {

    if (
      !this.selectedConversation
      || this.conversaEncerrada
      || this.messageForm.invalid
      || this.sending
    ) {
      return;
    }

    const conteudo =
      this.messageForm
        .controls
        .conteudo
        .value
        .trim();

    if (!conteudo) {
      return;
    }

    this.sending = true;

    this.errorMessage = '';
    this.successMessage = '';

    this.chatService
      .enviarMensagem(
        this.selectedConversation.id,
        {
          conteudo
        }
      )
      .subscribe({

        next: response => {

          this.messages = [
            ...this.messages,
            response.data
          ];

          this.messageForm.reset({
            conteudo: ''
          });

          this.sending = false;

          /*
           * Atualiza ordem/data das conversas.
           */
          this.carregarConversas(
            false
          );
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.sending = false;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível enviar a mensagem.';
        }

      });
  }

  marcarComoLidas(
    conversation: Conversation
  ): void {

    if (
      conversation.mensagensNaoLidas
      <= 0
    ) {
      return;
    }

    this.chatService
      .marcarComoLidas(
        conversation.id
      )
      .subscribe({

        next: () => {

          conversation
            .mensagensNaoLidas = 0;
        },

        error: error => {

          console.error(
            'Erro ao marcar mensagens como lidas:',
            error
          );
        }

      });
  }

  encerrarConversa(): void {

    if (
      !this.isCompany
      || !this.selectedConversation
      || this.conversaEncerrada
      || this.closingConversation
    ) {
      return;
    }

    const confirmou =
      window.confirm(
        'Deseja realmente encerrar esta conversa? Novas mensagens não poderão ser enviadas.'
      );

    if (!confirmou) {
      return;
    }

    this.closingConversation =
      true;

    this.errorMessage = '';
    this.successMessage = '';

    const conversationId =
      this.selectedConversation.id;

    this.chatService
      .encerrarConversa(
        conversationId
      )
      .subscribe({

        next: response => {

          this.closingConversation =
            false;

          this.selectedConversation =
            response.data;

          this.conversations =
            this.conversations.map(
              conversation =>
                conversation.id
                === response.data.id
                  ? response.data
                  : conversation
            );

          this.successMessage =
            'Conversa encerrada com sucesso.';
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.closingConversation =
            false;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível encerrar a conversa.';
        }

      });
  }

  private iniciarAtualizacaoAutomatica():
    void {

    /*
     * Mensagens da conversa aberta:
     * atualização a cada 5 segundos.
     */
    interval(5000)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe(() => {

        const conversationId =
          this.selectedConversation?.id;

        if (!conversationId) {
          return;
        }

        this.carregarMensagens(
          conversationId,
          false
        );
      });

    /*
     * Lista de conversas / não lidas:
     * atualização a cada 10 segundos.
     */
    interval(10000)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe(() => {

        this.carregarConversas(
          false
        );
      });
  }

  nomeContato(
    conversation: Conversation
  ): string {

    return this.isCompany
      ? conversation.usuarioNome
      : conversation.empresaNome;
  }

  get nomeContatoSelecionado():
    string {

    if (
      !this.selectedConversation
    ) {
      return '';
    }

    return this.nomeContato(
      this.selectedConversation
    );
  }

  mensagemEhMinha(
    message: Message
  ): boolean {

    if (this.isCompany) {

      return (
        message.tipoRemetente
        === 'EMPRESA'
      );
    }

    return (
      message.tipoRemetente
      === 'FREELANCER'
    );
  }
}
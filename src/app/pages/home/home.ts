import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LegalSeoService } from '../../core/services/legal-seo.service';

type Lado = 'empresas' | 'freelancers';

interface Passo {
  titulo: string;
  texto: string;
}

interface Pergunta {
  pergunta: string;
  resposta: string;
}

/*
 * Página inicial pública (landing page) do OpenFree.
 *
 * Quem já está logado é levado direto ao painel
 * pelo homeGuard, então esta tela é só para
 * visitantes.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  private readonly seo = inject(LegalSeoService);

  readonly ano = new Date().getFullYear();

  readonly lado = signal<Lado>('empresas');

  readonly passos: Record<Lado, Passo[]> = {
    empresas: [
      {
        titulo: 'Publique a vaga',
        texto: 'Descreva o projeto, o prazo e o valor. Em poucos minutos a vaga fica visível para profissionais de todo o Brasil.'
      },
      {
        titulo: 'Escolha o freelancer',
        texto: 'Receba candidaturas, veja o perfil de cada profissional, converse pelo chat e aceite quem mais combina com o seu projeto.'
      },
      {
        titulo: 'Feche o contrato',
        texto: 'Formalize o trabalho dentro da plataforma e acompanhe a entrega e os pagamentos em um só lugar.'
      }
    ],
    freelancers: [
      {
        titulo: 'Crie seu perfil',
        texto: 'Conte o que você faz, suas habilidades e seu portfólio. É o seu cartão de visitas para quem contrata.'
      },
      {
        titulo: 'Candidate-se às vagas',
        texto: 'Encontre oportunidades, salve as favoritas e envie sua proposta com mensagem e valor em poucos cliques.'
      },
      {
        titulo: 'Trabalhe e receba',
        texto: 'Converse pelo chat, acompanhe o contrato e veja seus ganhos no painel, tudo registrado na plataforma.'
      }
    ]
  };

  readonly perguntas: Pergunta[] = [
    {
      pergunta: 'O que é o OpenFree?',
      resposta: 'O OpenFree é uma plataforma brasileira que conecta empresas e pessoas que precisam de um trabalho a profissionais freelancers.'
    },
    {
      pergunta: 'Quanto custa para usar?',
      resposta: 'Criar conta, publicar vagas e se candidatar é gratuito.'
    },
    {
      pergunta: 'Que tipo de trabalho posso encontrar?',
      resposta: 'Trabalhos remotos e presenciais de várias áreas, como tecnologia, design, eventos e gastronomia. Cada vaga mostra prazo, local e valor.'
    },
    {
      pergunta: 'Como a empresa escolhe o freelancer?',
      resposta: 'Ela recebe as candidaturas, vê o perfil e as avaliações de cada profissional, conversa pelo chat e aceita quem mais combina com o projeto.'
    },
    {
      pergunta: 'Uma pessoa pode ser freelancer e empresa ao mesmo tempo?',
      resposta: 'Hoje cada conta é de um tipo: freelancer ou contratante. Se você quiser trabalhar e também contratar, pode criar uma conta para cada lado.'
    },
    {
      pergunta: 'Meus dados estão seguros?',
      resposta: 'Sim. As senhas são guardadas criptografadas e seu e-mail e telefone não aparecem no perfil público. O contato entre as partes acontece pelo chat da plataforma.'
    }
  ];

  ngOnInit(): void {
    this.seo.setPage(
      'OpenFree | Publique vagas e encontre freelancers',
      'O OpenFree conecta empresas que precisam de um trabalho a profissionais freelancers: vaga, candidatura, contrato e conversa no mesmo lugar.',
      '/'
    );
  }

  escolherLado(lado: Lado): void {
    this.lado.set(lado);
  }
}

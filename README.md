# Rumo: Your Coding Path

Crie uma plataforma de estudos de programação chamada RUMO.

## IDENTIDADE VISUAL

- Paleta exclusivamente preto e branco: fundo #0a0a0a (quase preto), 

  textos e elementos em #ffffff e tons de cinza (#888, #333, #f0f0f0)

- Tipografia: use "Geist" ou "Space Mono" para títulos e elementos 

  de destaque, e "Inter" para corpo de texto

- Estética minimalista editorial — muito espaço negativo, linhas finas, 

  sem excessos

- Sem gradientes coloridos, sem sombras pesadas, sem cores além do 

  preto/branco/cinza

## ANIMAÇÕES (muito importante)

- Transições de página suaves com fade + slight upward slide (translateY 

  de 20px para 0)

- Hover nos cards: borda branca aparece com transition 300ms ease

- Texto de título com efeito de reveal letra por letra ao entrar na página

- Loading states com skeleton shimmer em cinza escuro

- Botões com ripple effect sutil ao clicar

- Scroll com parallax leve nos elementos de background

## PÁGINAS A CRIAR

### 1. Landing Page (/)

- Hero com título grande: "Aprenda a programar com o apoio da IA"

- Subtítulo: "Trilhas de exercícios com feedback inteligente e personalizado"

- Botão "Começar agora" e "Entrar"

- Seção de features com 3 cards: Trilhas, Feedback IA, Progresso

- Footer minimalista

### 2. Login/Cadastro (/login)

- Formulário centralizado, campo de email e senha

- Alternância suave entre "Entrar" e "Criar conta" sem trocar de página

- Botão de submit com animação de loading

### 3. Dashboard do Aluno (/dashboard)

- Saudação: "Olá, [nome] 👋"

- Cards de trilhas disponíveis: Python Básico, Lógica, Web, etc.

- Barra de progresso em cada trilha

- Últimas atividades

### 4. Tela de Exercício (/exercicio/:id)

- Enunciado do exercício em destaque

- Campo de resposta (textarea grande e limpo)

- Botão "Enviar para análise"

- Área de feedback da IA que aparece com animação após envio:

  borda esquerda branca, texto do feedback surgindo com typewriter effect

### 5. Painel do Professor (/professor)

- Tabela com alunos, exercícios feitos e taxa de acerto

- Visual de dashboard simples e limpo

## COMPONENTES GERAIS

- Navbar fixa com logo "RUMO" à esquerda e menu à direita

- Logo: apenas o texto "RUMO" em fonte bold, letra-spacing amplo

- Todos os botões primários: fundo branco, texto preto, sem bordas 

  arredondadas (border-radius: 2px)

- Botões secundários: borda branca fina, fundo transparente, texto branco

## STACK

- React + Tailwind CSS

- Usar Framer Motion para todas as animações

- Supabase para autenticação e banco de dados (já conectar a estrutura)

## ESTRUTURA DO BANCO (Supabase)

Criar as seguintes tabelas:

- usuarios (id, nome, email, tipo: 'aluno' | 'professor')

- trilhas (id, nome, descricao, ordem)

- exercicios (id, trilha_id, enunciado, resposta_correta, ordem)

- respostas (id, usuario_id, exercicio_id, resposta, feedback_ia, 

  acertou, criado_em)

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7cabe38c-184d-4e0c-a37a-6897350422ba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

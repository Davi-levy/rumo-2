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



 Tela de Exercício (/exercicio/:id)

- Enunciado do exercício em destaque

- Campo de resposta (textarea grande e limpo)

- Botão "Enviar para análise"

- Área de feedback da IA que aparece com animação após envio:

  borda esquerda branca, texto do feedback surgindo com typewriter effect


stack: 

- React + Tailwind CSS

- Usar Framer Motion para todas as animações

- Supabase para autenticação e banco de dados 

 ESTRUTURA DO BANCO

- usuarios (id, nome, email, tipo: 'aluno' | 'professor')

- trilhas (id, nome, descricao, ordem)

- exercicios (id, trilha_id, enunciado, resposta_correta, ordem)

- respostas (id, usuario_id, exercicio_id, resposta, feedback_ia, 

  acertou, criado_em)

npm run dev
```

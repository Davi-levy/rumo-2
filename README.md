
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

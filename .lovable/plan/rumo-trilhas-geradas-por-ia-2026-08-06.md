# RUMO — Trilhas geradas por IA

Não preciso de nenhuma chave sua: o Gemini já está disponível pela IA integrada, e o banco de dados + login também são internos.

## Sobre o seu JSON/schema

A estrutura de 3 tabelas está boa. Ajustes que valem a pena:

- `nivel` como enum (`iniciante`, `intermediario`, `avancado`) em vez de texto livre — evita valores inconsistentes vindos da IA.
- `modulos`: `conteudo` guarda o texto de estudo em Markdown (com blocos de código para os exemplos). `ordem` obrigatório para garantir a sequência.
- `exercicios`: adicionar `ordem`, `dica` (opcional) e `explicacao` (por que a resposta é essa) — a IA já gera isso de graça na mesma chamada e melhora o feedback.
- Falta a tabela de **progresso**: uma tabela `respostas` (usuário, exercício, resposta, acertou, feedback) e um `modulos_concluidos` derivado dela. Sem isso não há progresso salvo.
- Trocar `timestamp` por `timestamptz`.

## O que vou construir

1. **Banco (novo schema)**
   - Apagar trilhas/exercícios/respostas antigos (dados de exemplo Python/Lógica/Web).
   - `trilhas` (usuario_id, linguagem, nivel, titulo, descricao) → `modulos` (titulo, conteudo, ordem) → `exercicios` (pergunta, resposta_esperada, dica, explicacao, ordem).
   - `respostas` (usuario_id, exercicio_id, resposta, acertou, feedback) para o progresso.
   - Segurança: cada usuário só vê e altera as próprias trilhas, módulos, exercícios e respostas.

2. **Login de volta**
   - Email/senha + entrar com Google.
   - `profiles` (nome, email) criado automaticamente no cadastro.
   - Dashboard e trilhas ficam protegidos; landing page continua pública.

3. **Geração da trilha (IA)**
   - Tela "Nova trilha": o usuário digita a linguagem/framework (ex: React, Rust, Django) e escolhe o nível.
   - Uma única chamada à IA gera a trilha completa: 6–8 módulos com conteúdo, exemplos de código e 3–4 exercícios cada.
   - Tudo é salvo no banco na hora; tela de carregamento animada durante a geração (~1 min).

4. **Correção econômica (sem IA)**
   - A resposta do usuário é comparada com a `resposta_esperada` por similaridade de texto (normalização + tokens em comum), não exigindo igualdade exata.
   - Feedback avaliativo montado a partir do resultado: acertou / quase (mostra o que faltou) / errou, sempre acompanhado da `explicacao` gerada junto com o exercício.
   - Zero consumo de IA nas correções — só na geração da trilha.

5. **Progresso**
   - Barra de progresso por trilha no dashboard, módulos marcados como concluídos ao acertar seus exercícios, e status por exercício.

## Detalhes técnicos

- Geração via server function TanStack (`createServerFn`) chamando o Lovable AI Gateway com `google/gemini-3.6-flash`, saída em JSON estruturado; inserção de trilha/módulos/exercícios em uma transação lógica.
- Correção 100% client-side (`src/lib/correcao.ts`): normalização (minúsculas, sem acentos/pontuação), similaridade por Jaccard/Dice com limiar para "acertou" e "quase".
- Rotas protegidas sob `_authenticated`; landing pública em `/`.
- Páginas antigas de professor e o progresso em localStorage são removidos.

# Frete Fluido Sistema

Front-end em React + Vite + TypeScript para controle de NF, pendencias, usuarios e relatorios.

## Como rodar

```bash
npm install
npm run dev
```

## Validacao

```bash
npm run build
npm run lint
npm run test
```

## Deploy na Vercel

O projeto ja esta pronto para publicar como SPA no Vercel. A regra de rewrite em [`vercel.json`](./vercel.json) garante que rotas como `/login` e `/relatorios` continuem funcionando ao recarregar a pagina.

Passos:

1. Suba este diretorio para um repositório no GitHub.
2. Importe o projeto no Vercel.
3. Use as configuracoes padrao de Vite, se a plataforma nao detectar automaticamente:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Adicione as variaveis de ambiente no painel da Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_BASE_URL` se a API externa for usada
5. Faça o deploy.

Se quiser testar localmente o mesmo build do Vercel, rode `npm run build` e depois `npm run preview`.

## Proxima etapa

O projeto ja esta organizado para evoluir em tres frentes:

1. Front-end atual com rotas, layout e telas operacionais.
2. Camada de backend/API para trocar os mocks por dados reais.
3. Integracao com Supabase usando as variaveis do `.env`.

## Backend com Supabase

Para gravar as notas e manter o historico automaticamente:

1. Crie um projeto no Supabase.
2. Copie as variaveis para o arquivo `.env`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

3. Execute o SQL do arquivo `supabase/schema.sql` no SQL Editor do Supabase.
4. Rode o projeto com `npm run dev`.
5. Crie um usuario no Supabase Auth para acessar o sistema.
6. Desative signups publicos no Auth se o sistema for usado apenas por voce.

O backend salva tudo na tabela `pendencias`, e qualquer inclusao, edicao ou exclusao gera registro em `activity_logs`.
Quando `data_pagamento` for preenchida, o banco marca automaticamente `frete_pago = true`.
Com o login ativo, apenas o usuario autenticado consegue ler e alterar os dados.

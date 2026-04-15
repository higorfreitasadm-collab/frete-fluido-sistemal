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

O backend salva tudo na tabela `pendencias`, e qualquer inclusao, edicao ou exclusao gera registro em `activity_logs`.
Quando `data_pagamento` for preenchida, o banco marca automaticamente `frete_pago = true`.

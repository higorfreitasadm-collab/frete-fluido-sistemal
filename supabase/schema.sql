-- Tabelas principais para o fluxo de NFs e pendencias.
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.pendencias (
  id uuid primary key default gen_random_uuid(),
  module text not null check (module in ('pend-pte', 'pend-sal')),
  numero_nf text not null,
  remetente text not null,
  destinatario text not null,
  cidade text not null,
  data_chegada date not null,
  data_entrega date null,
  frete numeric(12,2) not null default 0,
  data_pagamento date null,
  frete_pago boolean not null default false,
  status text not null default 'pendente' check (status in ('pendente', 'entregue', 'atrasada')),
  observacoes text not null default '',
  usuario text not null default 'Sistema',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pendencias_module_idx on public.pendencias (module);
create index if not exists pendencias_status_idx on public.pendencias (status);
create index if not exists pendencias_pago_idx on public.pendencias (frete_pago);
create index if not exists pendencias_created_at_idx on public.pendencias (created_at desc);
create index if not exists pendencias_cidade_idx on public.pendencias (cidade);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  usuario text not null default 'Sistema',
  data timestamptz not null default now(),
  tipo text not null check (tipo in ('criacao', 'edicao', 'entrega', 'exclusao')),
  entidade text null,
  registro_id uuid null,
  module text null check (module in ('pend-pte', 'pend-sal'))
);

create index if not exists activity_logs_data_idx on public.activity_logs (data desc);
create index if not exists activity_logs_tipo_idx on public.activity_logs (tipo);
create index if not exists activity_logs_module_idx on public.activity_logs (module);

alter table public.pendencias add column if not exists owner_id uuid default auth.uid();
alter table public.activity_logs add column if not exists owner_id uuid default auth.uid();

alter table public.pendencias enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists "allow full access to pendencias" on public.pendencias;
drop policy if exists "allow full access to activity logs" on public.activity_logs;

drop policy if exists "pendencias_select_own" on public.pendencias;
drop policy if exists "pendencias_insert_own" on public.pendencias;
drop policy if exists "pendencias_update_own" on public.pendencias;
drop policy if exists "pendencias_delete_own" on public.pendencias;
drop policy if exists "activity_logs_select_own" on public.activity_logs;
drop policy if exists "activity_logs_insert_own" on public.activity_logs;
drop policy if exists "activity_logs_update_own" on public.activity_logs;
drop policy if exists "activity_logs_delete_own" on public.activity_logs;

create policy "pendencias_select_own"
  on public.pendencias
  for select
  using (auth.uid() is not null and (owner_id = auth.uid() or owner_id is null));

create policy "pendencias_insert_own"
  on public.pendencias
  for insert
  with check (owner_id = auth.uid());

create policy "pendencias_update_own"
  on public.pendencias
  for update
  using (auth.uid() is not null and (owner_id = auth.uid() or owner_id is null))
  with check (auth.uid() is not null and owner_id = auth.uid());

create policy "pendencias_delete_own"
  on public.pendencias
  for delete
  using (auth.uid() is not null and (owner_id = auth.uid() or owner_id is null));

create policy "activity_logs_select_own"
  on public.activity_logs
  for select
  using (auth.uid() is not null and (owner_id = auth.uid() or owner_id is null));

create policy "activity_logs_insert_own"
  on public.activity_logs
  for insert
  with check (owner_id = auth.uid());

create policy "activity_logs_update_own"
  on public.activity_logs
  for update
  using (auth.uid() is not null and (owner_id = auth.uid() or owner_id is null))
  with check (auth.uid() is not null and owner_id = auth.uid());

create policy "activity_logs_delete_own"
  on public.activity_logs
  for delete
  using (auth.uid() is not null and (owner_id = auth.uid() or owner_id is null));

create or replace function public.sync_pendencia_payment_state()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if tg_op = 'INSERT' then
    new.created_at = coalesce(new.created_at, now());
  end if;

  if new.data_pagamento is not null then
    new.frete_pago = true;
  elsif coalesce(new.frete_pago, false) then
    new.data_pagamento = coalesce(new.data_pagamento, current_date);
    new.frete_pago = true;
  else
    new.frete_pago = false;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_sync_pendencia_payment_state on public.pendencias;
create trigger trg_sync_pendencia_payment_state
before insert or update on public.pendencias
for each row
execute function public.sync_pendencia_payment_state();

create or replace function public.archive_pendencia_activity()
returns trigger
language plpgsql
as $$
declare
  v_tipo text;
  v_descricao text;
begin
  if tg_op = 'INSERT' then
    v_tipo := 'criacao';
    v_descricao := format('Registro %s criado no módulo %s', new.numero_nf, upper(replace(new.module, 'pend-', '')));
    insert into public.activity_logs (owner_id, descricao, usuario, data, tipo, entidade, registro_id, module)
    values (new.owner_id, v_descricao, coalesce(new.usuario, 'Sistema'), now(), v_tipo, 'pendencia', new.id, new.module);
    return null;
  elsif tg_op = 'UPDATE' then
    v_tipo := case when old.frete_pago is distinct from new.frete_pago or old.data_pagamento is distinct from new.data_pagamento then 'edicao' else 'edicao' end;

    if old.frete_pago is distinct from new.frete_pago or old.data_pagamento is distinct from new.data_pagamento then
      if new.frete_pago then
        v_descricao := format('Registro %s marcado como frete pago', new.numero_nf);
      else
        v_descricao := format('Registro %s atualizado com ajuste de pagamento', new.numero_nf);
      end if;
    else
      v_descricao := format('Registro %s atualizado', new.numero_nf);
    end if;

    insert into public.activity_logs (owner_id, descricao, usuario, data, tipo, entidade, registro_id, module)
    values (new.owner_id, v_descricao, coalesce(new.usuario, 'Sistema'), now(), v_tipo, 'pendencia', new.id, new.module);
    return null;
  elsif tg_op = 'DELETE' then
    v_tipo := 'exclusao';
    v_descricao := format('Registro %s excluído do módulo %s', old.numero_nf, upper(replace(old.module, 'pend-', '')));
    insert into public.activity_logs (owner_id, descricao, usuario, data, tipo, entidade, registro_id, module)
    values (old.owner_id, v_descricao, coalesce(old.usuario, 'Sistema'), now(), v_tipo, 'pendencia', old.id, old.module);
    return null;
  end if;

  return null;
end;
$$;

drop trigger if exists trg_archive_pendencia_activity on public.pendencias;
create trigger trg_archive_pendencia_activity
after insert or update or delete on public.pendencias
for each row
execute function public.archive_pendencia_activity();



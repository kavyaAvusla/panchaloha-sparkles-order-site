-- Order site — tables, Row Level Security and policies.
-- Run this whole block ONCE in the Supabase SQL editor (Dashboard → SQL editor → New query → Run).
--
-- Two tables:
--   items  — what the shop sells, with prices and a photo path
--   orders — one row for every order the customer saves from the page

-- ---------------------------------------------------------------------------
-- items
-- ---------------------------------------------------------------------------
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  description text,
  price       numeric(10,2) not null default 0,
  category    text,
  image       text
);

alter table public.items enable row level security;

drop policy if exists items_select on public.items;
drop policy if exists items_insert on public.items;
drop policy if exists items_update on public.items;
drop policy if exists items_delete on public.items;

create policy items_select on public.items for select using (true);
create policy items_insert on public.items for insert with check (true);
create policy items_update on public.items for update using (true) with check (true);
create policy items_delete on public.items for delete using (true);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  item        text not null,
  price       numeric(10,2)
);

alter table public.orders enable row level security;

drop policy if exists orders_select on public.orders;
drop policy if exists orders_insert on public.orders;
drop policy if exists orders_update on public.orders;
drop policy if exists orders_delete on public.orders;

create policy orders_select on public.orders for select using (true);
create policy orders_insert on public.orders for insert with check (true);
create policy orders_update on public.orders for update using (true) with check (true);
create policy orders_delete on public.orders for delete using (true);

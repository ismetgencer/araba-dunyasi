-- Supabase SQL Editor'da bir kez çalıştır.
-- Deneme projesi: anonim anahtar ilan ekleyebilir, listeleyebilir, güncelleyebilir ve silebilir.

create table if not exists public.ilanlar (
    id uuid primary key default gen_random_uuid(),
    marka text not null,
    series text not null,
    model text not null,
    price integer not null,
    year integer not null,
    kilometre integer not null,
    fuel text not null,
    transmission text not null,
    body text not null,
    drive text not null,
    color text not null,
    doors integer,
    power text,
    guarantee text,
    summary text not null,
    created_at timestamptz not null default now()
);

alter table public.ilanlar enable row level security;

grant select, insert, update, delete on table public.ilanlar to anon;

drop policy if exists "ilanlar_select" on public.ilanlar;
drop policy if exists "ilanlar_insert" on public.ilanlar;
drop policy if exists "ilanlar_update" on public.ilanlar;
drop policy if exists "ilanlar_delete" on public.ilanlar;

create policy "ilanlar_select"
    on public.ilanlar
    for select
    to anon
    using (true);

create policy "ilanlar_insert"
    on public.ilanlar
    for insert
    to anon
    with check (true);

create policy "ilanlar_update"
    on public.ilanlar
    for update
    to anon
    using (true)
    with check (true);

create policy "ilanlar_delete"
    on public.ilanlar
    for delete
    to anon
    using (true);

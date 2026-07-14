-- Run this in the Supabase SQL editor for your project.

create extension if not exists pgcrypto;

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  room_type text not null,
  price numeric not null check (price >= 0),
  capacity int not null check (capacity >= 1),
  size_sqm numeric not null check (size_sqm >= 0),
  features text[] not null default '{}',
  amenities jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists room_images (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  storage_path text not null,
  url text not null,
  is_primary boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists room_images_room_id_idx on room_images(room_id);

alter table rooms enable row level security;
alter table room_images enable row level security;

-- Public (anon) read-only access; all writes go through the Express backend
-- using the service role key, which bypasses RLS entirely.
create policy "Public read access to rooms" on rooms
  for select using (true);

create policy "Public read access to room_images" on room_images
  for select using (true);

-- Storage bucket for room images (public read, writes via service role only).
insert into storage.buckets (id, name, public)
values ('room-images', 'room-images', true)
on conflict (id) do nothing;

create policy "Public read access to room-images bucket" on storage.objects
  for select using (bucket_id = 'room-images');

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  room_id uuid references rooms(id),
  check_in date not null,
  check_out date not null,
  adults int not null default 1,
  children int not null default 0,
  rooms_count int not null default 1,
  enhancements jsonb not null default '[]',
  subtotal numeric not null,
  taxes numeric not null,
  total numeric not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on bookings(user_id);

alter table bookings enable row level security;

-- Only the authenticated owner can see or create their own bookings.
-- The backend inserts using a per-request client authenticated as that
-- user (their JWT), so auth.uid() below resolves to the real caller —
-- never trusting a user_id passed in the request body.
create policy "Users can read their own bookings" on bookings
  for select using (auth.uid() = user_id);

create policy "Users can create their own bookings" on bookings
  for insert with check (auth.uid() = user_id);

-- Enable uuid extension for primary keys
create extension if not exists "uuid-ossp";

-- Core entities
create table if not exists public.rooms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  building text not null,
  floor integer not null,
  room_number text,
  capacity integer not null,
  status text not null default 'free',
  image_url text,
  area text,
  climate text,
  lighting text,
  wing text,
  nearest_entrance text,
  latitude double precision,
  longitude double precision,
  door_status text default 'locked',
  device_status text default 'off',
  occupancy_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint rooms_unique_name unique (name, building, floor)
);

create table if not exists public.room_equipment (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  name text not null,
  icon text
);

create table if not exists public.room_images (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  url text not null,
  alt text
);

create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_email text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'reserved',
  purpose text,
  created_at timestamptz default now()
);

create table if not exists public.room_activity_logs (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  action text not null,
  by_user text not null,
  details jsonb,
  success boolean default true,
  created_at timestamptz default now()
);

-- Seed rooms
with ins as (
  insert into public.rooms (name, building, floor, room_number, capacity, status, image_url, door_status, device_status, occupancy_count)
  values
    ('Innovation Lab',       'Engineering Building', 3, '301', 25, 'free',     'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a', 'unlocked', 'on', 6),
    ('Conference Room A',    'Business School',      2, '205', 50, 'in-use',   'https://images.unsplash.com/photo-1545239351-1141bd82e8a6',   'locked',   'on', 22),
    ('Study Room 12',        'Main Library',         1, '104', 8,  'free',     'https://images.unsplash.com/photo-1616594039964-c2c3c64f0b68','unlocked', 'off', 0),
    ('Lecture Hall B',       'Science Complex',      4, '401', 120,'reserved', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b','locked',   'off', 0),
    ('Creative Studio',      'Arts & Humanities',    2, '202', 15, 'free',     'https://images.unsplash.com/photo-1505691938895-1758d7feb511','unlocked', 'on', 4),
    ('Research Lab 3',       'Medical Sciences',     5, '501', 20, 'in-use',   'https://images.unsplash.com/photo-1504384308090-c894fdcc538d','locked',   'on', 8)
  on conflict (name, building, floor) do update set updated_at = now()
  returning id, name
)
select * from ins;

-- Seed equipment
insert into public.room_equipment (room_id, name)
select r.id, e.name
from public.rooms r
join (values
  ('Innovation Lab',    'Projector'),
  ('Innovation Lab',    'Whiteboard'),
  ('Innovation Lab',    'Computer'),
  ('Innovation Lab',    'Video Conference'),
  ('Conference Room A', 'Projector'),
  ('Conference Room A', 'Audio System'),
  ('Conference Room A', 'Video Conference'),
  ('Study Room 12',     'Whiteboard'),
  ('Study Room 12',     'Computer'),
  ('Lecture Hall B',    'Projector'),
  ('Lecture Hall B',    'Audio System'),
  ('Lecture Hall B',    'Smart Board'),
  ('Lecture Hall B',    'Video Conference'),
  ('Creative Studio',   'Whiteboard'),
  ('Creative Studio',   'Projector'),
  ('Creative Studio',   'Audio System'),
  ('Research Lab 3',    'Computer'),
  ('Research Lab 3',    'Whiteboard'),
  ('Research Lab 3',    'Video Conference')
) as e(room_name, name) on r.name = e.room_name
on conflict do nothing;

-- Seed images (1 per room)
insert into public.room_images (room_id, url, alt)
select r.id, i.url, i.alt
from public.rooms r
join (values
  ('Innovation Lab',    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a', 'Innovation Lab'),
  ('Conference Room A', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6',    'Conference Room A'),
  ('Study Room 12',     'https://images.unsplash.com/photo-1616594039964-c2c3c64f0b68', 'Study Room 12'),
  ('Lecture Hall B',    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', 'Lecture Hall B'),
  ('Creative Studio',   'https://images.unsplash.com/photo-1505691938895-1758d7feb511', 'Creative Studio'),
  ('Research Lab 3',    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d', 'Research Lab 3')
) as i(room_name, url, alt) on r.name = i.room_name
on conflict do nothing;

-- Sample bookings for testing
insert into public.bookings (room_id, user_email, start_time, end_time, status, purpose)
select r.id, b.user_email, b.start_time, b.end_time, b.status, b.purpose
from public.rooms r
join (values
  ('Innovation Lab',  'student1@example.com', now() + interval '1 hour',  now() + interval '3 hours',  'reserved', 'Project collaboration'),
  ('Innovation Lab',  'student2@example.com', now() - interval '4 hour',  now() - interval '2 hours',  'completed', 'Morning study'),
  ('Conference Room A','staff@example.com',   now() + interval '4 hours',  now() + interval '6 hours', 'reserved', 'Faculty meeting'),
  ('Lecture Hall B',  'events@example.com',   now() + interval '2 hours',  now() + interval '5 hours', 'reserved', 'Seminar booking')
) as b(room_name, user_email, start_time, end_time, status, purpose) on r.name = b.room_name
on conflict do nothing;

-- Sample activity logs
insert into public.room_activity_logs (room_id, action, by_user, details, success)
select r.id, a.action, a.by_user, a.details::jsonb, a.success
from public.rooms r
join (values
  ('Innovation Lab',  'unlock',    'admin@example.com', '{"source":"seed"}', true),
  ('Conference Room A','device_on','ops@example.com',   '{"source":"seed"}', true),
  ('Research Lab 3',  'lock',      'security@example.com','{"source":"seed"}', true)
) as a(room_name, action, by_user, details, success) on r.name = a.room_name
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- SECURITY / RLS POLICIES
-- Lưu ý: service_role (backend) sẽ bypass RLS, nhưng vẫn tạo policy rõ ràng.
-- Chạy lại seed an toàn vì DROP POLICY IF EXISTS trước khi CREATE.
-- ---------------------------------------------------------------------------

-- Enable RLS
alter table public.rooms enable row level security;
alter table public.room_equipment enable row level security;
alter table public.room_images enable row level security;
alter table public.bookings enable row level security;
alter table public.room_activity_logs enable row level security;

-- Rooms
drop policy if exists rooms_select_anon on public.rooms;
create policy rooms_select_anon on public.rooms
for select using (true);

drop policy if exists rooms_update_service on public.rooms;
create policy rooms_update_service on public.rooms
for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists rooms_insert_service on public.rooms;
create policy rooms_insert_service on public.rooms
for insert with check (auth.role() = 'service_role');

drop policy if exists rooms_delete_service on public.rooms;
create policy rooms_delete_service on public.rooms
for delete using (auth.role() = 'service_role');

-- Room equipment
drop policy if exists room_equipment_select_anon on public.room_equipment;
create policy room_equipment_select_anon on public.room_equipment
for select using (true);

drop policy if exists room_equipment_modify_service on public.room_equipment;
create policy room_equipment_modify_service on public.room_equipment
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Room images
drop policy if exists room_images_select_anon on public.room_images;
create policy room_images_select_anon on public.room_images
for select using (true);

drop policy if exists room_images_modify_service on public.room_images;
create policy room_images_modify_service on public.room_images
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Bookings
drop policy if exists bookings_select_anon on public.bookings;
create policy bookings_select_anon on public.bookings
for select using (true);

drop policy if exists bookings_modify_service on public.bookings;
create policy bookings_modify_service on public.bookings
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Activity logs
drop policy if exists logs_select_service on public.room_activity_logs;
create policy logs_select_service on public.room_activity_logs
for select using (auth.role() = 'service_role');

drop policy if exists logs_insert_service on public.room_activity_logs;
create policy logs_insert_service on public.room_activity_logs
for insert with check (auth.role() = 'service_role');

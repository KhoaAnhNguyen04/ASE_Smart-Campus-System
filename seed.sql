
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
drop policy if exists bookings_select_authenticated on public.bookings;
create policy bookings_select_authenticated on public.bookings
for select using (auth.role() = 'authenticated' or auth.role() = 'service_role');

drop policy if exists bookings_insert_authenticated on public.bookings;
create policy bookings_insert_authenticated on public.bookings
for insert with check (auth.role() = 'authenticated' or auth.role() = 'service_role');

drop policy if exists bookings_update_service on public.bookings;
create policy bookings_update_service on public.bookings
for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists bookings_delete_service on public.bookings;
create policy bookings_delete_service on public.bookings
for delete using (auth.role() = 'service_role');

-- Activity logs
drop policy if exists logs_select_service on public.room_activity_logs;
create policy logs_select_service on public.room_activity_logs
for select using (auth.role() = 'service_role');

drop policy if exists logs_insert_service on public.room_activity_logs;
create policy logs_insert_service on public.room_activity_logs
for insert with check (auth.role() = 'service_role');

# ASE_Smart-Campus-System

## Backend (Express + Supabase)
### Environment
Create `.env` in project root:
```
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # only backend
PORT=4000
```
Frontend uses anon/publishable key:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Database seed
- Open Supabase SQL Editor, run `seed.sql`. It creates tables (`rooms`, `room_equipment`, `room_images`, `bookings`, `room_activity_logs`, `users`), inserts sample data, and sets RLS policies.

### Run backend
```
npm install
npm run api
```
API at `http://localhost:4000`.

### Key endpoints
- Health: `GET /health`
- Buildings: `GET /buildings`
- Rooms: `GET /rooms` (filters + pagination), `GET /rooms/:id`, `POST /rooms`, `PATCH /rooms/:id`, `DELETE /rooms/:id`, `POST /rooms/:id/control`
- Bookings: `GET /bookings` (filters + pagination), `POST /bookings`, `PATCH /bookings/:id`, `DELETE /bookings/:id`
- Availability: `POST /availability-check`
- Activity logs: `GET /activity-logs`, `POST /activity-logs`
- Auth / Users:
  - `POST /auth/signup` (service role) creates a Supabase user + user row
  - `GET /users/me` (Bearer access token) returns current user row (alias: `/profiles/me`)
  - `PATCH /users/me` (Bearer access token) updates user.full_name (alias: `/profiles/me`)

### RLS (summary)
- `rooms`, `room_equipment`, `room_images`, `bookings`: anonymous can read; mutations require `service_role`.
- `room_activity_logs`: only `service_role` read/insert.
- `users`: users can read/update their own row; `service_role` full access. Access token required for `/users/me`.

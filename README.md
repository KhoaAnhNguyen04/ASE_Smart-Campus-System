# ASE_Smart-Campus-System

## Backend (Express + Supabase)

### Môi trường
Tạo `.env` ở thư mục gốc:
```
SUPABASE_URL=<project-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # chỉ dùng backend
PORT=4000
```
Frontend dùng:
```
VITE_SUPABASE_URL=<project-url>
VITE_SUPABASE_ANON_KEY=<anon-or-publishable-key>
```

### Khởi chạy
```
npm install
npm run api
```
API mặc định: `http://localhost:4000`

### Seed database
- Mở Supabase Dashboard → SQL Editor → dán toàn bộ `seed.sql` → Run.
- Seed tạo bảng + dữ liệu mẫu + bật RLS + policy.

### Auth
- Các endpoint cần Bearer token (Supabase Auth access_token): `GET/POST/ PATCH/DELETE /bookings`, `POST /availability-check`, `GET/POST /activity-logs`, `POST /rooms/:id/control`.
- Header: `Authorization: Bearer <access_token>`.
- Backend dùng service role key; RLS: bookings chỉ authenticated/service_role, activity_logs chỉ service_role; rooms/equipment/images cho đọc công khai.

### Endpoint chính
- `GET /health` — kiểm tra DB.
- `GET /buildings` — danh sách tòa nhà + tầng.
- `GET /rooms` — lọc + phân trang (search, building, capacity, equipment, availability window).
- `POST /rooms`, `PATCH /rooms/:id`, `DELETE /rooms/:id`.
- `GET /rooms/:id` — chi tiết phòng + bookings + activity logs.
- `GET /bookings` — lọc room_id/user_email/status/upcoming + phân trang (cần Bearer).
- `POST /bookings` — tạo booking (chặn trùng); `PATCH /bookings/:id`; `DELETE /bookings/:id` (cần Bearer). Nếu không gửi `user_email`, server dùng email từ token.
- `POST /availability-check` — kiểm tra sẵn sàng phòng/time window (cần Bearer).
- `POST /rooms/:id/control` — cập nhật door/device/occupancy/status và ghi log (cần Bearer).
- `GET|POST /activity-logs` — đọc/ghi log thao tác (cần Bearer, có phân trang).

# ASE_Smart-Campus-System

## Backend (Express + Supabase)
1) Tạo file `.env` ở thư mục gốc với các biến:
```
SUPABASE_URL=<project-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # chỉ dùng ở backend
PORT=4000
```
Frontend dùng key công khai:
```
VITE_SUPABASE_URL=<project-url>
VITE_SUPABASE_ANON_KEY=<anon-or-publishable-key>
```

2) Chuẩn bị database Supabase
- Mở SQL Editor và chạy `seed.sql` để tạo bảng + dữ liệu mẫu.
- Bảng chính: `rooms`, `room_equipment`, `room_images`, `bookings`, `room_activity_logs`.

3) Chạy backend
```
npm install
npm run api
```
API mặc định tại `http://localhost:4000`.

Các endpoint chính:
- `GET /health` kiểm tra kết nối DB.
- `GET /buildings` lấy danh sách tòa nhà và tầng.
- `GET /rooms` lọc + phân trang (search, building, capacity, equipment, availability window).
- `POST /rooms` tạo phòng; `PATCH /rooms/:id` cập nhật; `DELETE /rooms/:id` xoá (cascade).
- `GET /rooms/:id` chi tiết phòng kèm bookings & logs.
- `GET /bookings` danh sách (lọc room_id/user_email/status/upcoming + phân trang).
- `POST /bookings` tạo booking (chặn trùng giờ); `PATCH /bookings/:id` cập nhật (chặn trùng); `DELETE /bookings/:id` xoá.
- `POST /availability-check` kiểm tra sẵn sàng cho 1 phòng/time window.
- `POST /rooms/:id/control` cập nhật trạng thái cửa/thiết bị/occupancy và ghi log.
- `GET|POST /activity-logs` đọc/ghi log thao tác (có phân trang).
# Hệ Thống Quản Lý Nhà Trọ & Tự Động Hóa Hóa Đơn (Full-Stack)

Hệ thống quản lý nhà trọ hiện đại, toàn diện phân quyền **Chủ trọ (Landlord)** và **Khách thuê (Tenant)**, tích hợp hàng đợi **BullMQ (Redis)** tự động tạo hóa đơn hằng tháng và lưu trữ ảnh minh chứng hóa đơn/ảnh phòng trên **MinIO Object Storage**.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend**: Vue.js 3 (`<script setup lang="ts">`), Vite, Pinia Store, Vue Router (RBAC Guards), TailwindCSS, VietQR API.
- **Backend**: NestJS (TypeScript, Modular Architecture, JWT & OTP Authentication, Multer Stream).
- **Database & ORM**: PostgreSQL 16 + Prisma ORM (Relations, Indexes, Enums, Migrations & Seeding).
- **Object Storage**: MinIO (S3-Compatible Object Storage) với Presigned Download URLs.
- **Queue & Background Jobs**: BullMQ + Redis 7 (Cron Job `0 0 1 * *` tự động quét hợp đồng và tạo hóa đơn nháp).
- **Containerization**: Docker & Docker Compose.

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```text
d:/abcd/
├── docker-compose.yml            # Chạy PostgreSQL, Redis, MinIO và Backend
├── .env.example                  # Biến môi trường mẫu
├── backend/                      # NestJS API Backend
│   ├── prisma/
│   │   ├── schema.prisma         # Định nghĩa cấu trúc Database (PostgreSQL)
│   │   └── seed.ts               # Dữ liệu mẫu (Users, Motels, Rooms, Contracts, Invoices)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/             # Xác thực OTP & JWT
│   │   │   ├── motels/           # Quản lý nhà trọ, đơn giá điện nước
│   │   │   ├── rooms/            # Quản lý phòng & Bộ lọc tìm kiếm
│   │   │   ├── contracts/        # Quản lý hợp đồng & Thanh lý
│   │   │   ├── invoices/         # Duyệt hóa đơn & Đối soát bill
│   │   │   ├── storage/          # MinIO Service (S3 client, Presigned URL)
│   │   │   └── queue/            # BullMQ Processor (Monthly Cron ngày 1 & Notifications)
│   │   └── main.ts
│   └── package.json
└── frontend/                     # Vue 3 Frontend (Vite + TailwindCSS)
    ├── src/
    │   ├── components/           # TenantBillPaymentModal (VietQR, MinIO upload), LandlordInvoiceReviewModal
    │   ├── layouts/              # LandlordLayout, TenantLayout
    │   ├── views/                # InvoicesView, RoomsView, ContractsView, ExploreRoomsView, MyRoomView
    │   ├── stores/               # Auth Store (Demo Switcher), Rental Store
    │   └── router/               # Vue Router với RBAC Guards
    └── package.json
```

---

## 🚀 Hướng Dẫn Khởi Chạy (Quickstart Guide)

### 1. Khởi chạy Hạ tầng Docker (Postgres, Redis, MinIO)
```bash
docker-compose up -d postgres redis minio
```
- **PostgreSQL**: `localhost:5432` (User: `nhatro_user`, Pass: `nhatro_password`, DB: `nhatro_db`)
- **Redis**: `localhost:6379`
- **MinIO S3 API**: `http://localhost:9000`
- **MinIO Web Console**: `http://localhost:9001` (User: `minioadmin`, Pass: `minioadminpassword`)

### 2. Khởi chạy Backend (NestJS)
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run start:dev
```
Backend API sẽ chạy tại: `http://localhost:3000`

### 3. Khởi chạy Frontend (Vue 3)
```bash
cd frontend
npm install
npm run dev
```
Truy cập giao diện tại: `http://localhost:5173`

---

## 🔑 Tài Khoản Demo Sẵn Có (1-Click Switcher)

Hệ thống tích hợp thanh **Role Switcher Bar** trên cùng giúp chuyển đổi góc nhìn ngay lập tức mà không cần gõ lại mật khẩu:
1. 👑 **Nguyễn Văn Chủ Trọ (Landlord)**: SĐT `0901234567` (Quản lý 2 dãy trọ, duyệt hóa đơn, đối soát bill MinIO).
2. 👤 **Trần Thị Thuê Nhà (Tenant - Phòng 101)**: SĐT `0912345678` (Xem hóa đơn, quét VietQR, upload bill).
3. 👤 **Lê Văn An (Tenant - Phòng 102)**: SĐT `0987654321` (Xem hóa đơn và hợp đồng thuê).

*Mã OTP Demo*: `123456`

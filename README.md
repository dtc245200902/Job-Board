# ĐỀ TÀI THỰC HÀNH: WEBSITE TUYỂN DỤNG / JOB BOARD (ĐỀ 33)

**Môn học:** Triển khai và Quản trị Hệ thống Phần mềm  
**Học viên / Sinh viên:** `dtc245200902`  
**Repository GitHub:** [https://github.com/dtc245200902/Job-Board](https://github.com/dtc245200902/Job-Board)  
**Công nghệ:** Node.js (Express), MySQL 8.0, phpMyAdmin, Nginx (SSL/TLS Reverse Proxy), Prometheus, Grafana, Loki, Promtail, Docker Compose.

---

## 1. Giới thiệu Đề tài
Dự án triển khai một nền tảng tuyển dụng trực tuyến toàn diện (**Job Board**) cho phép:
- **Ứng viên:** Tìm kiếm việc làm theo ngành nghề, địa điểm, mức lương; xem chi tiết mô tả công việc; nộp hồ sơ ứng tuyển kèm CV trực tuyến (định dạng PDF/DOC/DOCX).
- **Nhà tuyển dụng:** Đăng tin tuyển dụng mới với các tiêu chí chi tiết (mức lương, hạn nộp, chế độ đãi ngộ).
- **Ban quản trị:** Bảng điều khiển quản lý danh sách việc làm và duyệt hồ sơ ứng viên (chờ duyệt, đang lọc, phỏng vấn, tiếp nhận, từ chối).

Hệ thống được thiết kế theo tiêu chuẩn DevOps & Cloud Native:
- Container hóa 100% bằng **Docker Compose**.
- Đảm bảo an toàn qua **Nginx Reverse Proxy** với chứng chỉ **HTTPS (SSL/TLS)** và các **Security Headers** nghiêm ngặt.
- Hệ thống giám sát thời gian thực với **Prometheus + Grafana** (theo dõi Container, Web Server, Database MySQL, Nginx).
- Hệ thống thu thập và phân tích log tập trung với **Loki + Promtail**, hỗ trợ truy vấn chuyên sâu bằng **LogQL**.
- Áp dụng các kỹ thuật **System Hardening** (non-root containers, network isolation, least-privilege DB users, rate limiting).

---

## 2. Kiến trúc Hệ thống (System Architecture)

```
                              [ Client / Browser ]
                                       │
                         HTTPS :443 / HTTP :80 (Redirect)
                                       ▼
                       ┌───────────────────────────────┐
                       │      Nginx Reverse Proxy      │
                       │   (SSL/TLS + Security Headers │
                       │    + Rate Limiting + Gzip)    │
                       └───────────────┬───────────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                ▼                      ▼                      ▼
        ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
        │  Web App :3000│      │ phpMyAdmin:80 │      │  Grafana :3000│
        │(Node/Express) │      │  (Database UI)│      │  (Dashboards) │
        └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
                │                      │                      │
                └──────────────┬───────┘                      │
                               ▼                              │
                       ┌───────────────┐                      │
                       │  MySQL 8.0 DB │                      │
                       │ (Data Storage)│                      │
                       └───────┬───────┘                      │
                               │                              │
                     ┌─────────┴─────────┐                    │
                     ▼                   ▼                    │
            ┌─────────────────┐ ┌─────────────────┐           │
            │ mysqld-exporter │ │node-exporter:9100│          │
            └────────┬────────┘ └────────┬────────┘           │
                     │                   │                    │
                     └─────────┬─────────┘                    │
                               ▼                              │
                       ┌───────────────┐                      │
                       │Prometheus:9090│ ─────────────────────┘
                       └───────────────┘
                               ▲
                               │
                       ┌───────────────┐      ┌───────────────┐
                       │ Promtail :9080│ ───► │  Loki :3100   │
                       │ (Log Shipper) │      │ (Log Engine)  │
                       └───────────────┘      └───────────────┘
```

---

## 3. Cấu trúc Thư mục Dự án

```
.
├── app/                              # Mã nguồn ứng dụng Web Node.js/Express
│   ├── public/                       # Static assets (CSS, JS, Uploads CV)
│   ├── views/                        # EJS templates (UI/UX hiện đại)
│   ├── db.js                         # Kết nối MySQL Connection Pool
│   ├── metrics.js                    # Prometheus Client Metrics
│   ├── server.js                     # Express Server & Routing
│   ├── package.json
│   └── Dockerfile                    # Multi-stage / Non-root Container
├── database/
│   └── init.sql                      # Khởi tạo Schema, Index, Seed Data mẫu
├── nginx/
│   ├── ssl/                          # Chứng chỉ SSL tự ký (jobboard.crt, jobboard.key)
│   ├── conf.d/default.conf           # Cấu hình Virtual Host, HTTPS, Reverse Proxy
│   ├── nginx.conf                    # Tối ưu hóa, Hardening & Rate Limiting
│   └── Dockerfile
├── monitoring/                       # Giám sát Prometheus & Grafana
│   ├── prometheus/prometheus.yml
│   └── grafana/
│       ├── provisioning/             # Tự động nạp datasources và dashboards
│       └── dashboards/               # Dashboards JSON có sẵn
├── logging/                          # Log tập trung Loki & Promtail
│   ├── loki/loki-config.yml
│   ├── promtail/promtail-config.yml
│   └── LOGQL_QUERIES.md              # Tài liệu các câu truy vấn LogQL mẫu
├── docs/                             # Báo cáo tổng hợp chi tiết (>10 trang)
│   ├── BAO_CAO_THUC_HANH_DE33_dtc245200902.md
│   └── BAO_CAO_THUC_HANH_DE33_dtc245200902.html
├── docker-compose.yml                # File điều phối 11 dịch vụ container
├── .env.example                      # Biến môi trường mẫu
└── README.md
```

---

## 4. Danh mục Cổng và Đường dẫn Dịch vụ

| Dịch vụ | Địa chỉ truy cập | Ghi chú |
| :--- | :--- | :--- |
| **Website Tuyển dụng (HTTPS)** | `https://localhost` | Truy cập qua Nginx Reverse Proxy (SSL cổng 443) |
| **Website Tuyển dụng (HTTP)** | `http://localhost` | Tự động chuyển hướng (Redirect 301) sang HTTPS |
| **Đăng tin tuyển dụng** | `https://localhost/post-job` | Dành cho Nhà tuyển dụng đăng tin mới |
| **Quản lý & Duyệt CV** | `https://localhost/manage` | Bảng điều khiển theo dõi hồ sơ ứng viên |
| **phpMyAdmin Web UI** | `https://localhost/pma/` hoặc `http://localhost:8081` | Quản trị Cơ sở dữ liệu MySQL |
| **Grafana Dashboards** | `https://localhost/grafana/` hoặc `http://localhost:3001` | Trực quan hóa Metrics giám sát |
| **Prometheus Web UI** | `http://localhost:9090` | Thu thập và truy vấn Metrics hệ thống |
| **Application Metrics** | `https://localhost/metrics` | Endpoint Prometheus metrics từ Web App |
| **Service Health Check** | `https://localhost/health` | Kiểm tra trạng thái hoạt động hệ thống |
| **Loki Log Engine** | `http://localhost:3100` | Cổng API nhận và truy vấn Log tập trung |

---

## 5. Bảng Tài khoản & Mật khẩu Đăng nhập

| Dịch vụ | Vai trò / Quyền hạn | Tên đăng nhập (Username) | Mật khẩu (Password) | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **phpMyAdmin** | **Quản trị tối cao (Root)** | `root` | `RootSecurePass_2026!` | Toàn quyền quản trị cơ sở dữ liệu MySQL |
| **phpMyAdmin** | **Ứng dụng (App User)** | `jobboard_user` | `JobBoardSecretPass_2026!` | Tài khoản quản lý database `job_board_db` |
| **Grafana** | **Quản trị giám sát (Admin)** | `admin` | `AdminGrafanaPass_2026!` | Đã mở Anonymous (xem trực tiếp không cần login) |
| **MySQL Engine** | **Root Database** | `root` | `RootSecurePass_2026!` | Cổng nội bộ 3306 (mạng `backend-net`) |
| **MySQL Engine** | **App User Database** | `jobboard_user` | `JobBoardSecretPass_2026!` | Web App dùng kết nối cơ sở dữ liệu |

---

## 6. Hướng dẫn Cài đặt & Khởi chạy Hệ thống

### 6.1. Khởi chạy Ứng dụng
1. Tạo file cấu hình môi trường từ mẫu:
   ```bash
   cp .env.example .env
   ```

2. Khởi động toàn bộ 11 dịch vụ với Docker Compose:
   ```bash
   docker compose up -d --build
   ```

3. Kiểm tra trạng thái hoạt động của các container:
   ```bash
   docker compose ps
   ```

---

## 6. Truy vấn Nhật ký Tập trung với LogQL (Loki + Promtail)

Hệ thống cung cấp sẵn các câu truy vấn LogQL trong menu **Explore** của Grafana:

1. **Truy vấn người dùng duyệt danh sách việc làm:**
   ```logql
   {job="nginx", log_type="access"} |= "GET /jobs"
   ```
2. **Truy vấn các lỗi hệ thống (HTTP 4xx và 5xx):**
   ```logql
   {job="nginx"} |~ "(40[0-9]|429|50[0-9])"
   ```
3. **Thống kê phân bổ mã trạng thái HTTP theo thời gian:**
   ```logql
   sum by (status) (count_over_time({job="nginx"} [1m]))
   ```
4. **Truy vết sự kiện ứng viên nộp hồ sơ CV trực tuyến:**
   ```logql
   {job="containers"} |= "[CV_SUBMITTED]"
   ```
5. **Kiểm toán nhật ký tạo mới hoặc xóa tin tuyển dụng:**
   ```logql
   {job="containers"} |~ "(\\[JOB_POSTED\\]|\\[JOB_DELETED\\])"
   ```

Chi tiết xem tại tài liệu: [`logging/LOGQL_QUERIES.md`](file:///d:/Job%20Board/logging/LOGQL_QUERIES.md).

---

## 7. Các Biện pháp Hardening & An ninh Hệ thống

Hệ thống đã triển khai đầy đủ 5 biện pháp bảo mật:
1. **Non-root Container:** Web App chạy dưới user `node` (UID 1000), Prometheus chạy dưới user `nobody` (UID 65534). Kích hoạt cờ `no-new-privileges:true` cho toàn bộ container.
2. **Network Isolation:** Phân chia 3 bridge networks độc lập (`frontend-net`, `backend-net`, `monitoring-net`). Cổng MySQL 3306 hoàn toàn không expose ra ngoài host.
3. **Mật khẩu mạnh & Phân quyền tối thiểu (Least Privilege):** Mật khẩu phức tạp, user ứng dụng `jobboard_user` chỉ có quyền SELECT, INSERT, UPDATE, DELETE trên schema `job_board_db`. Tạo user riêng `mysqld_exporter` cho Prometheus.
4. **Nginx Security Headers & SSL:** HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy, tắt `server_tokens off;`, TLS v1.2 & v1.3.
5. **Rate Limiting & Giới hạn tài nguyên:** Nginx giới hạn tốc độ 25 req/s (burst 30), giới hạn kích thước upload 10MB, Docker memory limits cho từng container.

---

## 8. Báo cáo Tổng hợp Môn học

Báo cáo chi tiết trên 10 trang theo định dạng chuẩn của bài tập lớn thực hành được lưu trữ tại:
- Định dạng Markdown: [`docs/BAO_CAO_THUC_HANH_DE33_dtc245200902.md`](file:///d:/Job%20Board/docs/BAO_CAO_THUC_HANH_DE33_dtc245200902.md)
- Định dạng HTML sẵn sàng in/xuất PDF: [`docs/BAO_CAO_THUC_HANH_DE33_dtc245200902.html`](file:///d:/Job%20Board/docs/BAO_CAO_THUC_HANH_DE33_dtc245200902.html)
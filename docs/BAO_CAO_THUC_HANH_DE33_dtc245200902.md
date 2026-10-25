# BỘ GIÁO DỤC VÀ ĐÀO TẠO
## TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG
### KHOA CÔNG NGHỆ THÔNG TIN

---

<br><br><br>

# BÁO CÁO BÀI TẬP LỚN / THỰC HÀNH MÔN HỌC
## MÔN: TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM

<br>

### **ĐỀ TÀI SỐ 33:**
# XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG WEBSITE TUYỂN DỤNG (JOB BOARD) TRÊN NỀN TẢNG DOCKER COMPOSE, NGINX REVERSE PROXY, GIÁM SÁT PROMETHEUS - GRAFANA, QUẢN TRỊ LOG LOKI VÀ HARDENING TOÀN DIỆN

<br><br><br>

**Sinh viên thực hiện:** dtc245200902  
**Mã số sinh viên:** `dtc245200902`  
**Lớp / Khóa:** Công nghệ Thông tin  
**Repository GitHub:** [https://github.com/dtc245200902/Job-Board](https://github.com/dtc245200902/Job-Board)  
**Giảng viên hướng dẫn:** Bộ môn Quản trị Hệ thống Phần mềm  

<br><br>

---
**Hà Nội, Năm 2026**

\newpage

# MỤC LỤC

1. [LỜI NÓI ĐẦU](#1-lời-nói-đầu)
2. [CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI VÀ KIẾN TRÚC HỆ THỐNG](#chương-1-tổng-quan-đề-tài-và-kiến-trúc-hệ-thống)
   - 1.1. Bối cảnh và yêu cầu đề tài số 33
   - 1.2. Mục tiêu kỹ thuật
   - 1.3. Sơ đồ kiến trúc tổng thể (System Architecture)
   - 1.4. Thiết kế phân vùng mạng Docker Networks
3. [CHƯƠNG 2: TRIỂN KHAI ỨNG DỤNG WEB VÀ CƠ SỞ DỮ LIỆU MYSQL](#chương-2-triển-khai-ứng-dụng-web-và-cơ-sở-dữ-liệu-mysql)
   - 2.1. Thiết kế và công nghệ ứng dụng Web Job Board
   - 2.2. Thiết kế Cơ sở dữ liệu quan hệ MySQL 8.0
   - 2.3. Tích hợp Công cụ quản trị trực quan phpMyAdmin
   - 2.4. Quy trình ứng viên nộp CV và Quản lý tin tuyển dụng
4. [CHƯƠNG 3: CẤU HÌNH NGINX REVERSE PROXY VÀ BẢO MẬT SSL/TLS](#chương-3-cấu-hình-nginx-reverse-proxy-và-bảo-mật-ssltls)
   - 3.1. Vai trò của Nginx Reverse Proxy
   - 3.2. Cấu hình HTTPS với Chứng chỉ SSL tự ký
   - 3.3. Cơ chế tự động chuyển hướng HTTP sang HTTPS
   - 3.4. Định tuyến đa dịch vụ (Subpath Routing)
   - 3.5. Cấu hình Stub Status phục vụ giám sát
5. [CHƯƠNG 4: HỆ THỐNG GIÁM SÁT THỜI GIAN THỰC VỚI PROMETHEUS VÀ GRAFANA](#chương-4-hệ-thống-giám-sát-thời-gian-thực-với-prometheus-và-grafana)
   - 4.1. Kiến trúc hệ thống giám sát Metrics
   - 4.2. Cấu hình Prometheus Server thu thập số liệu
   - 4.3. Các Metrics Exporters được tích hợp
   - 4.4. Tự động nạp cấu hình Datasources và Dashboards trên Grafana
   - 4.5. Phân tích các Dashboard giám sát chuyên sâu
6. [CHƯƠNG 5: HỆ THỐNG QUẢN TRỊ LOG TẬP TRUNG LOKI, PROMTAIL VÀ TRUY VẤN LOGQL](#chương-5-hệ-thống-quản-trị-log-tập-trung-loki-promtail-và-truy-vấn-logql)
   - 5.1. Thách thức của Logging truyền thống và giải pháp Grafana Loki
   - 5.2. Cấu hình Loki Server lưu trữ và xử lý Index
   - 5.3. Cấu hình Promtail Agent thu thập nhật ký
   - 5.4. Kỹ thuật truy vấn phân tích nhật ký bằng ngôn ngữ LogQL
7. [CHƯƠNG 6: TRIỂN KHAI CÁC BIỆN PHÁP BẢO MẬT VÀ HARDENING HỆ THỐNG](#chương-6-triển-khai-các-biện-pháp-bảo-mật-và-hardening-hệ-thống)
   - 6.1. Biện pháp 1: Non-root Container Execution
   - 6.2. Biện pháp 2: Phân vùng mạng độc lập (Network Isolation)
   - 6.3. Biện pháp 3: Quản lý mật khẩu mạnh và Nguyên tắc đặc quyền tối thiểu (Least Privilege)
   - 6.4. Biện pháp 4: Thiết lập Security Headers toàn diện trên Nginx
   - 6.5. Biện pháp 5: Giới hạn lưu lượng (Rate Limiting) và Giới hạn tài nguyên phần cứng
8. [CHƯƠNG 7: KẾT QUẢ THỰC NGHIỆM, HƯỚNG DẪN VẬN HÀNH VÀ ĐÁNH GIÁ](#chương-7-kết-quả-thực-nghiệm-hướng-dẫn-vận-hành-và-đánh-giá)
   - 7.1. Hướng dẫn vận hành hệ thống từng bước
   - 7.2. Kết quả kiểm thử các ca sử dụng (Test Cases)
   - 7.3. Minh chứng và bằng chứng thực nghiệm
   - 7.4. Đánh giá ưu điểm và hạn chế
9. [KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#kết-luận-và-hướng-phát-triển)
10. [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)

\newpage

---

# 1. LỜI NÓI ĐẦU

Trong kỷ nguyên số hóa hiện nay, việc phát triển một ứng dụng phần mềm chỉ là một nửa chặng đường. Nửa chặng đường quan trọng còn lại là quá trình **Triển khai (Deployment)**, **Vận hành (Operation)**, **Giám sát (Monitoring)** và **Bảo vệ an toàn thông tin (Hardening)** cho toàn bộ hạ tầng phần mềm.

Được sự hướng dẫn của giảng viên bộ môn *Triển khai và Quản trị Hệ thống Phần mềm*, sinh viên đã tiến hành nghiên cứu, thiết kế và hiện thực hóa đề tài thực hành: **"Đề số 33: Website Tuyển dụng / Job Board"**. Báo cáo này trình bày chi tiết toàn bộ chu trình xây dựng hệ thống từ mã nguồn ứng dụng, cơ sở dữ liệu, cổng trung gian đảo ngược (Reverse Proxy), hệ sinh thái giám sát Metrics thời gian thực, quản lý nhật ký tập trung cho tới các kỹ thuật phòng thủ bảo mật chuyên sâu. Toàn bộ mã nguồn và lịch sử commit được quản lý nghiêm túc trên nền tảng GitHub theo đúng quy chuẩn mã sinh viên `dtc245200902`.

---

# CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI VÀ KIẾN TRÚC HỆ THỐNG

## 1.1. Bối cảnh và yêu cầu đề tài số 33
Theo nội dung phân công bài tập thực hành, Đề tài 33 yêu cầu triển khai một hệ thống Website Tuyển dụng / Job Board với các tính năng nghiệp vụ cốt lõi:
- **Đăng tin tuyển dụng:** Cho phép nhà tuyển dụng khởi tạo các vị trí việc làm mới với đầy đủ thông tin (vị trí, yêu cầu, đãi ngộ, mức lương, hạn nộp).
- **Ứng viên nộp CV:** Cho phép người tìm việc duyệt việc làm, tìm kiếm theo từ khóa/địa điểm/ngành nghề và gửi hồ sơ kèm file CV trực tuyến.
- **Quản lý tin tuyển dụng và hồ sơ:** Cung cấp bảng điều khiển cho phép theo dõi số lượng hồ sơ đã nộp, thay đổi trạng thái duyệt ứng viên và quản trị tin đăng.
- **Cơ sở dữ liệu:** Sử dụng hệ quản trị cơ sở dữ liệu quan hệ **MySQL 8.0** kết hợp công cụ quản lý giao diện web **phpMyAdmin**.

## 1.2. Mục tiêu kỹ thuật
Hệ thống phải đáp ứng đồng thời 6 yêu cầu kỹ thuật nền tảng:
1. **Quản lý mã nguồn trên GitHub:** Toàn bộ source code, file cấu hình docker-compose, nginx, prometheus, loki được push lên repository của sinh viên (`dtc245200902/Job-Board`) với ít nhất 03 commit rõ ràng và file `README.md` chi tiết.
2. **Container hóa toàn diện:** Triển khai 100% bằng Docker Compose.
3. **Cổng bảo mật Nginx Reverse Proxy:** Định tuyến an toàn bằng giao thức HTTPS (chứng chỉ SSL/TLS tự ký), chuyển hướng tự động cổng 80 sang 443 và cấu hình đầy đủ các tiêu đề an ninh (Security Headers).
4. **Hệ thống giám sát hiệu năng (Prometheus + Grafana):** Tự động cào dữ liệu từ máy chủ web, container, cơ sở dữ liệu và trực quan hóa qua các Dashboard chuyên nghiệp.
5. **Hệ thống nhật ký tập trung (Loki + Promtail):** Tự động thu thập log từ Nginx và Docker, cung cấp cú pháp truy vấn LogQL đa dạng.
6. **Hardening hệ thống:** Áp dụng tối thiểu 4-5 biện pháp bảo mật hạ tầng chuyên sâu.

## 1.3. Sơ đồ kiến trúc tổng thể (System Architecture)

Dưới đây là sơ đồ kiến trúc tổng thể của hệ thống Job Board triển khai bằng Docker Compose:

```
                                [ Người Dùng / Ứng Viên / Nhà Tuyển Dụng ]
                                                    │
                                      Port 80 (HTTP) -> 301 Redirect
                                      Port 443 (HTTPS - TLS v1.2/1.3)
                                                    ▼
                       ┌────────────────────────────────────────────────────────┐
                       │               NGINX REVERSE PROXY GATEWAY              │
                       │  - SSL Termination (jobboard.crt / jobboard.key)       │
                       │  - Rate Limiting (25r/s, burst=30)                     │
                       │  - Security Headers (HSTS, CSP, X-Frame, X-Content)    │
                       │  - Subpath Proxy: / -> Web | /pma/ -> DB | /grafana/   │
                       └────────────────────────────┬───────────────────────────┘
                                                    │
                ┌───────────────────────────────────┼───────────────────────────────────┐
                ▼                                   ▼                                   ▼
      [ frontend-net ]                      [ frontend-net ]                    [ frontend-net ]
   ┌──────────────────────┐              ┌──────────────────────┐            ┌──────────────────────┐
   │    Web Application   │              │      phpMyAdmin      │            │       Grafana        │
   │  Node.js 20 Express  │              │   Web UI Quản Trị    │            │ Dashboards Giám Sát  │
   │  Port 3000 (Internal)│              │  Port 80 (Internal)  │            │ Port 3000 (Internal) │
   └──────────┬───────────┘              └──────────┬───────────┘            └──────────┬───────────┘
              │ [backend-net]                       │ [backend-net]                     │ [monitoring-net]
              └───────────────────┬─────────────────┘                                   │
                                  ▼                                                     │
                       ┌──────────────────────┐                                         │
                       │   MySQL 8.0 Server   │                                         │
                       │  Database: job_board │                                         │
                       │ Port 3306 (Internal) │                                         │
                       └──────────┬───────────┘                                         │
                                  │ [backend-net]                                       │
                                  ▼                                                     │
                       ┌──────────────────────┐                                         │
                       │   mysqld-exporter    │                                         │
                       │  Port 9104 (Metrics) │ ──────────────────┐                     │
                       └──────────────────────┘                   │                     │
                                                                  ▼                     ▼
                       ┌──────────────────────┐         ┌───────────────────┐ ┌───────────────────┐
                       │  nginx-prometheus-   │ ──────► │ Prometheus Server │ │   Grafana Loki    │
                       │  exporter (Port 9113)│         │ Port 9090(Metrics)│ │ Port 3100 (Logs)  │
                       └──────────────────────┘         └─────────┬─────────┘ └─────────▲─────────┘
                                                                  │ [monitoring-net]    │
                       ┌──────────────────────┐                   │                     │
                       │    node-exporter     │ ──────────────────┘                     │
                       │  Port 9100 (Host)    │                                         │
                       └──────────────────────┘                                         │
                                                                                        │
                       ┌────────────────────────────────────────────────────────┐       │
                       │                     Promtail Agent                     │ ──────┘
                       │  Thu thập Access/Error Log Nginx & Docker JSON Logs    │
                       └────────────────────────────────────────────────────────┘
```

## 1.4. Thiết kế phân vùng mạng Docker Networks
Hệ thống áp dụng kỹ thuật **Network Isolation** bằng cách tách thành 3 Bridge Networks độc lập:
1. `frontend-net`: Kết nối Nginx Gateway với Web Application, phpMyAdmin và Grafana.
2. `backend-net`: Mạng nội bộ riêng biệt kết nối Web Application, phpMyAdmin, MySQL Database và MySQL Exporter. Các client từ Internet hoặc mạng ngoài **hoàn toàn không thể kết nối trực tiếp** tới cổng MySQL 3306.
3. `monitoring-net`: Mạng nội bộ cô lập kết nối Prometheus, Grafana, Loki, Promtail và toàn bộ các Exporters để trao đổi số liệu và nhật ký mà không làm ảnh hưởng đến lưu lượng của người dùng cuối.

---

# CHƯƠNG 2: TRIỂN KHAI ỨNG DỤNG WEB VÀ CƠ SỞ DỮ LIỆU MYSQL

## 2.1. Thiết kế và công nghệ ứng dụng Web Job Board
Ứng dụng Web được xây dựng trên nền tảng **Node.js (v20)** kết hợp framework **Express**:
- **View Engine:** Sử dụng EJS (Embedded JavaScript) để kết xuất giao diện server-side rendering (SSR), tối ưu hiệu năng và khả năng lập chỉ mục SEO.
- **Giao diện hiện đại (UI/UX Design System):** Thiết kế theo phong cách hiện đại với font chữ Plus Jakarta Sans, phối màu HSL cao cấp (Indigo/Violet/Emerald), hiệu ứng vi chuyển động (Micro-animations), thẻ chỉ số trực quan và bố cục tương thích hoàn hảo trên cả thiết bị di động (Responsive).
- **Thư viện xử lý File Upload:** Sử dụng thư viện `multer` để tiếp nhận hồ sơ CV ứng tuyển với các quy chuẩn kiểm tra định dạng (.pdf, .doc, .docx) và giới hạn kích thước tối đa 10MB.
- **Prometheus Metrics Middleware:** Tích hợp trực tiếp thư viện `prom-client` để tự động tính toán số lượng request theo route, thời gian xử lý (duration histogram) và các chỉ số kinh doanh (số tin tuyển dụng, số lượt nộp hồ sơ).

## 2.2. Thiết kế Cơ sở dữ liệu quan hệ MySQL 8.0
Cơ sở dữ liệu mang tên `job_board_db` sử dụng bộ mã ký tự `utf8mb4` và collation `utf8mb4_unicode_ci` hỗ trợ hiển thị tiếng Việt hoàn hảo. Mô hình dữ liệu gồm 4 bảng chính:
1. **`categories` (Danh mục ngành nghề):** `id`, `name`, `slug`, `icon`, `description`.
2. **`companies` (Doanh nghiệp tuyển dụng):** `id`, `name`, `slug`, `logo`, `website`, `location`, `industry`, `description`.
3. **`jobs` (Tin tuyển dụng):** `id`, `title`, `slug`, `company_id` (FK), `category_id` (FK), `location`, `job_type`, `salary_range`, `experience_level`, `description`, `requirements`, `benefits`, `status`, `views`, `deadline`.
4. **`applications` (Hồ sơ ứng viên nộp):** `id`, `job_id` (FK), `candidate_name`, `candidate_email`, `candidate_phone`, `cv_filename`, `cover_letter`, `status`, `applied_at`.

Script khởi tạo `database/init.sql` được mount trực tiếp vào thư mục `/docker-entrypoint-initdb.d/` của container MySQL, tự động khởi tạo dữ liệu mẫu phong phú gồm 6 tập đoàn công nghệ hàng đầu Việt Nam (VNG, FPT Software, Viettel Solutions, VinAI, MoMo, Shopee), hơn 10 vị trí việc làm hot và nhiều hồ sơ ứng viên với các trạng thái xử lý khác nhau.

## 2.3. Tích hợp Công cụ quản trị trực quan phpMyAdmin
- Dịch vụ phpMyAdmin được triển khai tại container `jobboard_phpmyadmin` trên nền image chính thức `phpmyadmin/phpmyadmin:latest`.
- Được cấu hình biến môi trường `PMA_ABSOLUTE_URI: https://localhost/pma/` cho phép quản trị viên truy cập tiện lợi thông qua Reverse Proxy của Nginx mà không cần mở trực tiếp cổng ứng dụng ra ngoài Internet.
- Hỗ trợ thao tác truy vấn SQL trực quan, sao lưu/phục hồi dữ liệu và kiểm tra cấu trúc bảng.

## 2.4. Quy trình ứng viên nộp CV và Quản lý tin tuyển dụng
- **Ứng viên:** Truy cập chi tiết công việc tại `/jobs/:id`, nhập thông tin cá nhân (Họ tên, Email, Điện thoại), đính kèm file CV và gửi lên server. Server xử lý lưu file vào `/usr/src/app/public/uploads`, ghi nhận bản ghi vào MySQL và tăng biến đếm `jobboard_applications_submitted_total` cho Prometheus.
- **Quản trị viên / Nhà tuyển dụng:** Truy cập trang `/manage` để:
  - Xem danh sách toàn bộ hồ sơ nộp, mở file CV để thẩm định.
  - Cập nhật trạng thái ứng viên (Chờ duyệt -> Đang lọc -> Phỏng vấn -> Trúng tuyển -> Từ chối).
  - Quản lý danh sách tin tuyển dụng, xóa các tin hết hạn hoặc đăng tin tuyển dụng mới qua biểu mẫu tại `/post-job`.

---

# CHƯƠNG 3: CẤU HÌNH NGINX REVERSE PROXY VÀ BẢO MẬT SSL/TLS

## 3.1. Vai trò của Nginx Reverse Proxy
Nginx đóng vai trò là "Cổng vào duy nhất" (Single Entrypoint) bảo vệ toàn bộ các dịch vụ nội bộ phía sau:
- Tiếp nhận toàn bộ lưu lượng người dùng bên ngoài qua hai cổng tiêu chuẩn: 80 (HTTP) và 443 (HTTPS).
- Ẩn giấu hoàn toàn địa chỉ IP, cổng nội bộ và kiến trúc mạng của các container phía sau.
- Thực hiện giải mã SSL (SSL Termination) giúp giảm tải xử lý mã hóa cho ứng dụng Node.js.

## 3.2. Cấu hình HTTPS với Chứng chỉ SSL tự ký
Chứng chỉ số SSL/TLS tự ký (Self-signed Certificate) được tạo lập thông qua OpenSSL với thuật toán RSA 2048-bit tiêu chuẩn, thời hạn 365 ngày:
- File khóa bí mật: `nginx/ssl/jobboard.key` (được phân quyền bảo mật nghiêm ngặt `chmod 600`).
- File chứng chỉ công khai: `nginx/ssl/jobboard.crt` (`chmod 644`).
- Cấu hình Nginx thiết lập giao thức an toàn hiện đại `TLSv1.2` và `TLSv1.3`, vô hiệu hóa hoàn toàn các giao thức cũ tiềm ẩn lỗ hổng như SSLv3, TLSv1.0 và TLSv1.1.

## 3.3. Cơ chế tự động chuyển hướng HTTP sang HTTPS
Trong file `nginx/conf.d/default.conf`, khối máy chủ (Server Block) cổng 80 được cấu hình tự động trả về mã chuyển hướng vĩnh viễn HTTP 301 sang HTTPS:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name localhost;

    location / {
        return 301 https://$host$request_uri;
    }
}
```
Cơ chế này bảo đảm mọi người dùng dù gõ địa chỉ không có tiền tố bảo mật vẫn tự động được mã hóa toàn bộ dữ liệu truyền nhận qua giao thức TLS.

## 3.4. Định tuyến đa dịch vụ (Subpath Routing)
Nginx phân phối lưu lượng truy cập tới từng dịch vụ tương ứng thông qua các Upstream backend:
- `location /`: Định tuyến tới ứng dụng Web Tuyển dụng `web:3000`.
- `location /pma/`: Định tuyến tới công cụ cơ sở dữ liệu `phpmyadmin:80` với cấu hình ghi đè header `X-Forwarded-Prefix`.
- `location /grafana/`: Định tuyến tới nền tảng giám sát `grafana:3000`.

## 3.5. Cấu hình Stub Status phục vụ giám sát
Nginx mở một khối máy chủ nội bộ lắng nghe tại cổng `8080`:
```nginx
server {
    listen 8080;
    server_name 127.0.0.1 localhost;

    location /stub_status {
        stub_status;
        allow all;
    }
}
```
Endpoint này cung cấp các số liệu hoạt động của Nginx (kết nối hiện thời, số request đã xử lý) để container `nginx-prometheus-exporter` thu thập và gửi về Prometheus.

---

# CHƯƠNG 4: HỆ THỐNG GIÁM SÁT THỜI GIAN THỰC VỚI PROMETHEUS VÀ GRAFANA

## 4.1. Kiến trúc hệ thống giám sát Metrics
Mô hình giám sát sử dụng cơ chế kéo dữ liệu (Pull-based Model):
- **Prometheus Server:** Đóng vai trò là Time-Series Database định kỳ gửi HTTP request tới các endpoint `/metrics` của từng mục tiêu (targets) để lấy dữ liệu về lưu trữ.
- **Grafana Server:** Nền tảng hiển thị, kết nối với Prometheus để truy vấn và vẽ các biểu đồ trực quan hóa dữ liệu thời gian thực.

## 4.2. Cấu hình Prometheus Server thu thập số liệu
File cấu hình `monitoring/prometheus/prometheus.yml` định nghĩa 5 công việc cào số liệu (Scrape Jobs):
1. `prometheus`: Tự giám sát sức khỏe của chính máy chủ Prometheus (`localhost:9090`).
2. `jobboard-webapp`: Cào số liệu từ ứng dụng Web tại `web:3000/metrics` chu kỳ 5 giây/lần.
3. `mysql-database`: Thu thập thông số nội bộ của MySQL qua `mysqld-exporter:9104`.
4. `nginx-proxy`: Thu thập trạng thái của Reverse Proxy qua `nginx-exporter:9113`.
5. `node-exporter`: Thu thập tài nguyên phần cứng máy chủ qua `node-exporter:9100`.

## 4.3. Các Metrics Exporters được tích hợp
1. **Web App Prom-Client:** Cung cấp các thông số độc quyền của ứng dụng:
   - `jobboard_http_requests_total`: Số lượng request theo method, route và HTTP status code.
   - `jobboard_http_request_duration_seconds`: Histogram đo thời gian phản hồi của API/Web.
   - `jobboard_active_jobs_total`: Gauge thể hiện tổng số việc làm đang tuyển dụng.
   - `jobboard_applications_total`: Gauge thể hiện tổng số hồ sơ đã nộp trong database.
2. **MySQL Exporter (`prom/mysqld-exporter`):** Thu thập số lượng truy vấn/giây (QPS), số kết nối đồng thời, kích thước InnoDB buffer pool và số câu truy vấn chậm (slow queries).
3. **Nginx Exporter (`nginx/nginx-prometheus-exporter`):** Thu thập số kết nối active, waiting, reading, writing và số lượng request được phân phối.
4. **Node Exporter (`prom/node-exporter`):** Đo đạc phần trăm sử dụng CPU, bộ nhớ RAM khả dụng và lưu lượng truyền nhận qua giao diện mạng (Network Rx/Tx).

## 4.4. Tự động nạp cấu hình Datasources và Dashboards trên Grafana
Hệ thống sử dụng cơ chế **Grafana Provisioning** tự động mà không đòi hỏi thao tác thủ công từ người dùng:
- `datasources.yml`: Khởi tạo sẵn Data Source `Prometheus` (default) và `Loki`.
- `dashboards.yml`: Tự động nạp toàn bộ các file JSON dashboard trong thư mục `/etc/grafana/provisioning/dashboards/json`.

## 4.5. Phân tích các Dashboard giám sát chuyên sâu
Hệ thống đã xây dựng sẵn 3 bộ Dashboard chuyên nghiệp:
1. **Job Board - Giám Sát Web & Hệ Thống Tuyển Dụng (`jobboard-web-overview`):**
   - KPI thống kê số tin tuyển dụng đang mở và tổng số CV ứng viên đã nộp.
   - Tần suất request thời gian thực (QPS) và biểu đồ phân bổ lưu lượng theo từng Route (`/`, `/jobs`, `/jobs/:id`, `/manage`).
   - Tỷ lệ mã lỗi HTTP và thời gian đáp ứng trung bình (Latency).
   - Biểu đồ theo dõi dung lượng bộ nhớ Heap RAM của tiến trình Node.js.
2. **Job Board - Giám Sát Cơ Sở Dữ Liệu MySQL (`mysql-database-monitoring`):**
   - Trạng thái sống (Uptime) của MySQL.
   - Số kết nối đang hoạt động (Threads Connected).
   - Tần suất thực thi các lệnh cơ bản: `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
   - Dung lượng trang nhớ bộ đệm InnoDB Buffer Pool Data vs Free.
3. **Job Board - Giám Sát Hạ Tầng & Container (`container-system-monitoring`):**
   - Mức độ tải của CPU phân rã theo User Mode và System Mode.
   - Dung lượng bộ nhớ RAM đã sử dụng so với tổng RAM máy chủ.
   - Băng thông mạng truyền nhận (Bytes/sec).

---

# CHƯƠNG 5: HỆ THỐNG QUẢN TRỊ LOG TẬP TRUNG LOKI, PROMTAIL VÀ TRUY VẤN LOGQL

## 5.1. Thách thức của Logging truyền thống và giải pháp Grafana Loki
Trong môi trường microservices hoặc đa container, việc truy cập từng container bằng lệnh `docker logs` gây lãng phí thời gian, khó đối chiếu sự cố và không thể lưu trữ lâu dài.
**Grafana Loki** giải quyết bài toán này theo cách tiếp cận độc đáo: Loki chỉ lập chỉ mục (index) các nhãn metadata giống như Prometheus thay vì lập chỉ mục toàn bộ nội dung văn bản (như Elasticsearch). Nhờ đó, Loki tiêu tốn cực kỳ ít tài nguyên RAM và lưu trữ, tối ưu tuyệt vời cho hệ thống container.

## 5.2. Cấu hình Loki Server lưu trữ và xử lý Index
File `logging/loki/loki-config.yml` cấu hình Loki hoạt động ở chế độ Single-binary với công cụ lưu trữ `TSDB` và lưu các khối dữ liệu (chunks) trực tiếp trên volume `loki_data`, thời gian lưu trữ được đặt là 168 giờ (7 ngày).

## 5.3. Cấu hình Promtail Agent thu thập nhật ký
Promtail đóng vai trò là log shipper agent:
- Định kỳ giám sát và đọc dòng mới từ các file log của Nginx Reverse Proxy (`/var/log/nginx/access.log` và `/var/log/nginx/error.log`).
- Đọc nhật ký tiêu chuẩn của các container Docker (`/var/lib/docker/containers/*/*-json.log`).
- Gắn các nhãn siêu dữ liệu tương ứng: `{job="nginx", log_type="access"}`, `{job="nginx", log_type="error"}`, `{job="containers"}` và đẩy về API `http://loki:3100/loki/api/v1/push`.

## 5.4. Kỹ thuật truy vấn phân tích nhật ký bằng ngôn ngữ LogQL
LogQL chia làm hai nhóm lệnh: **Log Queries** (truy xuất bản ghi log) và **Metric Queries** (biến đổi log thành chuỗi thời gian để vẽ đồ thị). Hệ thống cung cấp các câu truy vấn tiêu biểu sau:

### Câu truy vấn 1: Lọc người dùng truy cập danh sách việc làm
```logql
{job="nginx", log_type="access"} |= "GET /jobs"
```
*Ứng dụng:* Phân tích tần suất và các địa chỉ IP của ứng viên đang tìm kiếm cơ hội nghề nghiệp.

### Câu truy vấn 2: Truy vết toàn bộ lỗi hệ thống (HTTP 4xx và 5xx)
```logql
{job="nginx"} |~ "(40[0-9]|429|50[0-9])"
```
*Ứng dụng:* Phát hiện kịp thời các đường dẫn hỏng (404 Not Found), tình trạng bị nghẽn giới hạn tần suất (429 Too Many Requests) hoặc lỗi sập server (500 Internal Server Error).

### Câu truy vấn 3: Tính toán biểu đồ lưu lượng Request theo thời gian (Metric Query)
```logql
sum by (status) (count_over_time({job="nginx"} [1m]))
```
*Ứng dụng:* Trực quan hóa số lượng truy cập được phục vụ thành công (200) hoặc thất bại theo từng phút.

### Câu truy vấn 4: Giám sát nhật ký nộp hồ sơ CV của ứng viên
```logql
{job="containers"} |= "[CV_SUBMITTED]"
```
*Ứng dụng:* Theo dõi chi tiết ứng viên nào vừa nộp CV, gửi cho công việc mã số bao nhiêu.

### Câu truy vấn 5: Kiểm toán thao tác đăng và xóa tin tuyển dụng
```logql
{job="containers"} |~ "(\\[JOB_POSTED\\]|\\[JOB_DELETED\\])"
```
*Ứng dụng:* Phục vụ công tác kiểm tra bảo mật (Audit Log) đối với các hành vi quản trị hệ thống.

---

# CHƯƠNG 6: TRIỂN KHAI CÁC BIỆN PHÁP BẢO MẬT VÀ HARDENING HỆ THỐNG

An ninh thông tin là một tiêu chí trọng tâm được chấm điểm trong đề tài (1.5 điểm). Hệ thống đã triển khai nghiêm túc 5 lớp phòng thủ bảo mật (Hardening):

## 6.1. Biện pháp 1: Non-root Container Execution
- **Nguy cơ:** Khi một container chạy dưới quyền `root` bị khai thác lỗ hổng Remote Code Execution (RCE), kẻ tấn công có thể thoát khỏi container (Container Escape) và chiếm quyền điều khiển máy chủ vật lý.
- **Khắc phục:**
  - Trong `app/Dockerfile`, ứng dụng Web chuyển sang người dùng không có đặc quyền: `USER node` (UID 1000).
  - Trong `docker-compose.yml`, Prometheus chạy dưới tài khoản `user: "65534:65534"` (`nobody:nogroup`).
  - Toàn bộ các container được kích hoạt cờ bảo mật `security_opt: [ "no-new-privileges:true" ]`, ngăn chặn tuyệt đối tiến trình con nâng quyền qua các cơ chế SUID/SGID.

## 6.2. Biện pháp 2: Phân vùng mạng độc lập (Network Isolation)
- Hệ thống phân chia ranh giới rõ rệt giữa các vùng mạng (`frontend-net`, `backend-net`, `monitoring-net`).
- Container MySQL Database nằm trọn trong `backend-net`, hoàn toàn không ánh xạ cổng 3306 ra máy chủ vật lý (`no host port binding`). Nhờ đó, các cuộc tấn công brute force hoặc khai thác lỗ hổng MySQL từ Internet hoàn toàn bị triệt tiêu từ lớp mạng.

## 6.3. Biện pháp 3: Quản lý mật khẩu mạnh và Nguyên tắc đặc quyền tối thiểu (Least Privilege)
- Mật khẩu root và mật khẩu người dùng MySQL được thiết lập phức tạp (kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt, độ dài trên 16 ký tự).
- **Tài khoản ứng dụng Web (`jobboard_user`):** Chỉ được cấp các quyền thao tác dữ liệu cơ bản (`SELECT, INSERT, UPDATE, DELETE`) trên schema `job_board_db`. Tuyệt đối không được cấp quyền quản trị hệ thống (`SUPER, GRANT, DROP DATABASE`).
- **Tài khoản Prometheus Exporter (`mysqld_exporter`):** Được tạo riêng biệt với đặc quyền đọc tối thiểu (`PROCESS, REPLICATION CLIENT, SELECT`), bảo đảm không có quyền can thiệp thay đổi dữ liệu của người dùng.

## 6.4. Biện pháp 4: Thiết lập Security Headers toàn diện trên Nginx
Nginx được bổ sung bộ tiêu đề bảo mật đạt chuẩn cấp độ ngân hàng (A+ Security Rating):
1. `Strict-Transport-Security (HSTS)`: Bắt buộc trình duyệt luôn giao tiếp qua HTTPS trong vòng 1 năm.
2. `X-Frame-Options: SAMEORIGIN`: Ngăn chặn tấn công Clickjacking bằng cách cấm nhúng trang web vào iframe lạ.
3. `X-Content-Type-Options: nosniff`: Ngăn chặn trình duyệt tự ý đoán định dạng MIME (MIME-type sniffing).
4. `X-XSS-Protection: 1; mode=block`: Kích hoạt bộ lọc chống tấn công Cross-Site Scripting (XSS).
5. `Referrer-Policy: strict-origin-when-cross-origin`: Bảo vệ sự riêng tư của URL khi chuyển hướng.
6. `Content-Security-Policy (CSP)`: Kiểm soát chặt chẽ nguồn nạp tài nguyên (Scripts, Styles, Fonts, Images), chống tấn công chèn mã độc.
7. `server_tokens off;`: Ẩn hoàn toàn thông tin phiên bản Nginx trong HTTP response header, ngăn kẻ xấu thăm dò lỗ hổng đã biết.

## 6.5. Biện pháp 5: Giới hạn lưu lượng (Rate Limiting) và Giới hạn tài nguyên phần cứng
- **Nginx Rate Limiting:** Cấu hình bộ nhớ lưu trữ `limit_req_zone` theo IP với tốc độ 25 request/giây và lượng tích lũy burst tối đa 30 request. Nếu một IP gửi truy vấn dồn dập (tấn công từ chối dịch vụ DoS hoặc quét tự động), hệ thống sẽ lập tức chặn lại và trả về mã lỗi `HTTP 429 Too Many Requests`.
- **Giới hạn kích thước tải lên:** `client_max_body_size 10M` ngăn chặn việc gửi các tệp CV dung lượng khổng lồ làm tràn ngập bộ nhớ.
- **Giới hạn tài nguyên Docker (Resource Limits):** Toàn bộ các dịch vụ trên `docker-compose.yml` đều được cấu hình trần bộ nhớ (`memory limits` từ 64M đến 512M) nhằm ngăn ngừa tình trạng một tiến trình bị tràn bộ nhớ (Memory Leak) làm ảnh hưởng tới sự sống còn của toàn hệ thống (OOM Killer).

---

# CHƯƠNG 7: KẾT QUẢ THỰC NGHIỆM, HƯỚNG DẪN VẬN HÀNH VÀ ĐÁNH GIÁ

## 7.1. Hướng dẫn vận hành hệ thống từng bước
1. **Kiểm tra môi trường:** Máy tính đã cài đặt Docker Engine và Docker Compose.
2. **Khởi chạy toàn bộ hệ thống:**
   ```bash
   # Di chuyển vào thư mục dự án
   cd "D:\Job Board"

   # Sao chép cấu hình môi trường
   cp .env.example .env

   # Xây dựng và khởi chạy tất cả 11 dịch vụ ở chế độ chạy nền
   docker compose up -d --build
   ```
3. **Kiểm tra trạng thái các container:**
   ```bash
   docker compose ps
   ```
   Tất cả các dịch vụ (`jobboard_nginx`, `jobboard_web`, `jobboard_mysql`, `jobboard_phpmyadmin`, `jobboard_prometheus`, `jobboard_grafana`, `jobboard_loki`, `jobboard_promtail`...) đều phải hiển thị trạng thái `Up` (healthy).

## 7.2. Kết quả kiểm thử các ca sử dụng (Test Cases)

| Mã kiểm thử | Tên ca kiểm thử | Thao tác thực hiện | Kết quả kỳ vọng | Đánh giá |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | Kiểm tra chuyển hướng HTTPS | Truy cập `http://localhost` | Tự động chuyển sang `https://localhost` (301) | **ĐẠT** |
| **TC-02** | Xem danh sách việc làm | Truy cập `https://localhost/jobs` | Hiển thị danh sách việc làm với đầy đủ bộ lọc | **ĐẠT** |
| **TC-03** | Tìm kiếm và lọc công việc | Tìm từ khóa "Node.js", chọn "Hồ Chí Minh" | Danh sách lọc chính xác công việc phù hợp | **ĐẠT** |
| **TC-04** | Ứng viên nộp hồ sơ CV | Điền form và upload file PDF tại `/jobs/1` | Lưu file vào server, ghi DB, hiển thị thông báo | **ĐẠT** |
| **TC-05** | Nhà tuyển dụng đăng tin | Điền form tại `/post-job` | Tin xuất hiện ngay trên trang chủ và trang việc làm | **ĐẠT** |
| **TC-06** | Quản trị viên duyệt CV | Truy cập `/manage`, đổi trạng thái CV | Cập nhật tức thì vào MySQL, giao diện đổi màu badge | **ĐẠT** |
| **TC-07** | Quản trị DB qua phpMyAdmin | Truy cập `https://localhost/pma/` | Đăng nhập thành công, xem được 4 bảng dữ liệu | **ĐẠT** |
| **TC-08** | Giám sát Web trên Grafana | Truy cập `https://localhost/grafana/` | Dashboard nạp tự động, hiển thị QPS và Active Jobs | **ĐẠT** |
| **TC-09** | Truy vấn Log với LogQL | Mở Explore -> Loki, chạy query Nginx/Web | Xuất hiện các dòng log chi tiết thời gian thực | **ĐẠT** |
| **TC-10** | Kiểm tra Rate Limiting | Dùng tool gửi > 35 req/giây | Nhận về mã lỗi HTTP 429 Too Many Requests | **ĐẠT** |

## 7.3. Minh chứng và bằng chứng thực nghiệm
- **Minh chứng Git GitHub:** Repository tại `https://github.com/dtc245200902/Job-Board` có tối thiểu 3 commit rõ ràng:
  - Commit 1: Triển khai Ứng dụng Web Job Board, MySQL, phpMyAdmin và Nginx SSL Reverse Proxy.
  - Commit 2: Tích hợp hệ thống giám sát Prometheus và Grafana Dashboards.
  - Commit 3: Tích hợp hệ thống log tập trung Loki + Promtail, tài liệu hóa LogQL, Hardening và Báo cáo hoàn chỉnh.
- **Minh chứng Giao diện Web:** Giao diện trực quan, chuyên nghiệp, hỗ trợ tiếng Việt hoàn chỉnh, có biểu đồ thống kê số liệu và thông tin sinh viên `dtc245200902` ở chân trang.
- **Minh chứng An ninh:** Trình duyệt nhận diện chứng chỉ SSL bảo mật, phản hồi chứa đầy đủ các header `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`.

## 7.4. Đánh giá ưu điểm và hạn chế
- **Ưu điểm:**
  - Hệ thống hoàn chỉnh 100%, tuân thủ chặt chẽ tiêu chí chấm điểm của đề bài.
  - Tự động hóa cao: Chỉ cần một lệnh `docker compose up -d` là toàn bộ cơ sở dữ liệu, ứng dụng, chứng chỉ SSL, dashboard giám sát và log collector tự động cấu hình và kết nối với nhau.
  - Tính thực tế cao: Ứng dụng web được lập trình tỉ mỉ, có tính năng nộp và duyệt CV thực tế, không dùng dữ liệu giả lập sơ sài.
- **Hạn chế:** Chứng chỉ SSL hiện đang sử dụng dạng tự ký (Self-signed) nên trình duyệt sẽ cảnh báo khi truy cập lần đầu trên môi trường cục bộ; khi triển khai sản xuất thực tế trên Internet cần gắn tên miền và sử dụng chứng chỉ Let's Encrypt / Certbot.

---

# KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## Kết luận
Qua quá trình thực hiện Đề tài 33: "Website Tuyển dụng / Job Board", sinh viên đã củng cố và nâng cao toàn diện kỹ năng thực hành môn học *Triển khai và Quản trị Hệ thống Phần mềm*:
1. Nắm vững kỹ thuật đóng gói ứng dụng đa dịch vụ bằng Docker và Docker Compose.
2. Hiểu sâu cơ chế định tuyến, tối ưu hóa và bảo mật với Nginx Reverse Proxy.
3. Làm chủ quy trình xây dựng hệ thống quan sát (Observability) hiện đại kết hợp giữa **Metrics (Prometheus + Grafana)** và **Logs (Loki + Promtail + LogQL)**.
4. Nâng cao nhận thức và năng lực áp dụng các tiêu chuẩn an ninh hệ thống (Hardening) ngay từ giai đoạn thiết kế kiến trúc hạ tầng.

## Hướng phát triển
- Tích hợp thêm hệ thống thông báo sự kiện (Alertmanager) gửi cảnh báo tự động về Telegram hoặc Discord khi dịch vụ bị gián đoạn hoặc CPU quá tải.
- Bổ sung cơ chế CI/CD Pipeline (GitHub Actions) để tự động kiểm thử mã nguồn và xây dựng Docker Image tự động mỗi khi có thay đổi.
- Nghiên cứu chuyển đổi sang mô hình Kubernetes (K8s) để hỗ trợ khả năng tự động co giãn (Horizontal Pod Autoscaler - HPA) khi lượng ứng viên truy cập tăng đột biến.

---

# TÀI LIỆU THAM KHẢO

1. **Docker Documentation:** *Docker Compose file reference and best practices.* [https://docs.docker.com/compose/](https://docs.docker.com/compose/)
2. **Nginx Documentation:** *Alphabetical index of Nginx directives and Security Hardening.* [https://nginx.org/en/docs/](https://nginx.org/en/docs/)
3. **Prometheus Documentation:** *Querying Prometheus with PromQL and configuring scrape targets.* [https://prometheus.io/docs/](https://prometheus.io/docs/)
4. **Grafana Labs:** *Dashboards provisioning, Datasources setup, and LogQL guide.* [https://grafana.com/docs/](https://grafana.com/docs/)
5. **Open Web Application Security Project (OWASP):** *REST Security Cheat Sheet and Docker Security Guidelines.* [https://cheatsheetseries.owasp.org/](https://cheatsheetseries.owasp.org/)

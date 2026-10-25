# HƯỚNG DẪN TRUY VẤN LOG TẬP TRUNG BẰNG LOGQL

**Học viên / Sinh viên:** `dtc245200902`  
**Đề tài:** Đề 33: Website Tuyển dụng / Job Board  
**Hệ thống Log:** Grafana Loki + Promtail  

---

## 1. Giới thiệu LogQL trong Hệ thống
LogQL (Log Query Language) là ngôn ngữ truy vấn mạnh mẽ của Grafana Loki, lấy cảm hứng từ cú pháp của Prometheus PromQL. Hệ thống Job Board sử dụng Promtail để tự động gom log từ Nginx Reverse Proxy, Web Application Node.js, MySQL Database và gửi về Loki.

Để thực hiện các câu truy vấn dưới đây:
1. Mở trình duyệt truy cập Grafana: `https://localhost/grafana/` hoặc `http://localhost:3001`
2. Đăng nhập tài khoản: `admin` / `AdminGrafanaPass_2026!`
3. Chọn menu **Explore** (biểu tượng la bàn ở thanh công cụ bên trái).
4. Chọn Data Source: **Loki**.
5. Nhập các câu truy vấn LogQL dưới đây vào thanh tìm kiếm và nhấn **Run query**.

---

## 2. Danh mục Các Câu Truy Vấn LogQL Mẫu (Kèm Giải Thích)

### Câu truy vấn 1: Lọc log truy cập danh sách việc làm (Nginx Access Log)
- **Mục đích:** Theo dõi người dùng truy cập và tìm kiếm danh sách việc làm trên website.
- **Cú pháp LogQL:**
  ```logql
  {job="nginx", log_type="access"} |= "GET /jobs"
  ```
- **Ý nghĩa:**
  - `{job="nginx", log_type="access"}`: Bộ chọn nhãn (Stream selector) lấy log truy cập từ Nginx.
  - `|= "GET /jobs"`: Bộ lọc dòng (Line filter) chỉ hiển thị các bản ghi chứa chuỗi `GET /jobs`.

---

### Câu truy vấn 2: Truy vấn log lỗi phát sinh trong hệ thống (HTTP 4xx / 5xx)
- **Mục đích:** Phát hiện kịp thời các lỗi phía client (404 Not Found, 429 Rate Limit) hoặc lỗi server (500, 502, 504 Bad Gateway).
- **Cú pháp LogQL:**
  ```logql
  {job="nginx"} |~ "(40[0-9]|429|50[0-9])"
  ```
  *Hoặc lọc chi tiết lỗi cấp phát Nginx:*
  ```logql
  {job="nginx", log_type="error"}
  ```
- **Ý nghĩa:**
  - Sử dụng biểu thức chính quy (Regex filter `|~`) để lọc tất cả các dòng log có mã phản hồi lỗi HTTP 4xx hoặc 5xx.

---

### Câu truy vấn 3: Thống kê số lượng Request theo Mã phản hồi HTTP (Metric Query)
- **Mục đích:** Tạo biểu đồ thống kê lưu lượng request theo thời gian thực phân bổ theo mã HTTP Status (200 OK, 301 Redirect, 404 Not Found).
- **Cú pháp LogQL:**
  ```logql
  sum by (status) (count_over_time({job="nginx"} [1m]))
  ```
- **Ý nghĩa:**
  - `count_over_time(... [1m])`: Đếm số lượng dòng log xuất hiện trong mỗi khoảng cửa sổ 1 phút.
  - `sum by (status)`: Gom nhóm tổng hợp số lượng theo nhãn trạng thái phản hồi.

---

### Câu truy vấn 4: Truy vết sự kiện ứng viên nộp hồ sơ CV trực tuyến
- **Mục đích:** Giám sát nhật ký hoạt động nộp đơn ứng tuyển của các ứng viên gửi về backend.
- **Cú pháp LogQL:**
  ```logql
  {job="containers"} |= "[CV_SUBMITTED]"
  ```
- **Ý nghĩa:**
  - Truy xuất các bản ghi nhật ký ghi nhận hành động ứng viên gửi thành công file CV và thông tin liên hệ vào cơ sở dữ liệu.

---

### Câu truy vấn 5: Giám sát nhật ký tạo mới và quản lý tin tuyển dụng
- **Mục đích:** Kiểm tra thao tác đăng tin và quản trị từ phía nhà tuyển dụng.
- **Cú pháp LogQL:**
  ```logql
  {job="containers"} |~ "(\\[JOB_POSTED\\]|\\[JOB_DELETED\\])"
  ```
- **Ý nghĩa:**
  - Theo dõi toàn bộ lịch sử khi có nhà tuyển dụng thêm mới một vị trí việc làm hoặc quản trị viên xóa một tin tuyển dụng khỏi hệ thống.

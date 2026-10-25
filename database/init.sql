-- ========================================================
-- Database Initialization Script for Job Board System
-- Student: dtc245200902
-- Subject: Trien khai va Quan tri He thong Phan mem
-- Topic 33: Website Tuyen dung / Job Board
-- ========================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS `job_board_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `job_board_db`;
SET NAMES utf8mb4;

-- Drop tables if exist
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `companies`;
DROP TABLE IF EXISTS `categories`;

-- Table: Categories
CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `icon` VARCHAR(50) DEFAULT 'briefcase',
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: Companies
CREATE TABLE `companies` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `logo` VARCHAR(255) DEFAULT NULL,
    `website` VARCHAR(255) DEFAULT NULL,
    `location` VARCHAR(150) NOT NULL,
    `industry` VARCHAR(100) DEFAULT 'Công nghệ thông tin',
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: Jobs
CREATE TABLE `jobs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(200) NOT NULL,
    `company_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `location` VARCHAR(150) NOT NULL,
    `job_type` ENUM('Full-time', 'Part-time', 'Remote', 'Internship') DEFAULT 'Full-time',
    `salary_range` VARCHAR(100) NOT NULL,
    `experience_level` VARCHAR(50) DEFAULT '1-3 năm',
    `description` TEXT NOT NULL,
    `requirements` TEXT NOT NULL,
    `benefits` TEXT NOT NULL,
    `status` ENUM('active', 'closed') DEFAULT 'active',
    `views` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `deadline` DATE DEFAULT NULL,
    FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
    INDEX `idx_jobs_status` (`status`),
    INDEX `idx_jobs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: Applications
CREATE TABLE `applications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `job_id` INT NOT NULL,
    `candidate_name` VARCHAR(150) NOT NULL,
    `candidate_email` VARCHAR(150) NOT NULL,
    `candidate_phone` VARCHAR(30) NOT NULL,
    `cv_filename` VARCHAR(255) NOT NULL,
    `cover_letter` TEXT,
    `status` ENUM('pending', 'reviewing', 'interviewed', 'accepted', 'rejected') DEFAULT 'pending',
    `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE,
    INDEX `idx_applications_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data: Categories
INSERT INTO `categories` (`name`, `slug`, `icon`, `description`) VALUES
('Phát triển Phần mềm / IT', 'software-development', 'laptop-code', 'Kỹ sư phần mềm, lập trình viên Backend, Frontend, Fullstack, Mobile'),
('DevOps & Cloud Systems', 'devops-cloud', 'server', 'Kỹ sư Cloud, DevOps, Quản trị hệ thống Linux, Docker, Kubernetes'),
('Thiết kế UI/UX & Sáng tạo', 'design-ui-ux', 'palette', 'Thiết kế giao diện sản phẩm số, đồ họa, trải nghiệm người dùng'),
('Dữ liệu & Trí tuệ Nhân tạo', 'data-ai', 'brain', 'Data Analyst, Data Engineer, Machine Learning Specialist, AI Engineer'),
('Quản lý Sản phẩm / Product', 'product-management', 'tasks', 'Product Owner, Product Manager, Scrum Master'),
('Marketing & Kinh doanh', 'marketing-business', 'chart-line', 'Digital Marketing, Content Creator, SEO Specialist, Business Development');

-- Seed Data: Companies
INSERT INTO `companies` (`name`, `slug`, `logo`, `website`, `location`, `industry`, `description`) VALUES
('VNG Corporation', 'vng-corporation', 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=60', 'https://vng.com.vn', 'TP. Hồ Chí Minh', 'Công nghệ & Giải trí số', 'Kỳ lân công nghệ hàng đầu Việt Nam sở hữu Zalo, ZaloPay, VNG Games và các nền tảng số.'),
('FPT Software', 'fpt-software', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=60', 'https://fpt-software.com', 'Hà Nội', 'Xuất khẩu Phần mềm', 'Công ty công nghệ toàn cầu với mạng lưới văn phòng tại Nhật Bản, Mỹ, Châu Âu và APAC.'),
('Viettel Solutions', 'viettel-solutions', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&auto=format&fit=crop&q=60', 'https://solutions.viettel.vn', 'Hà Nội', 'Viễn thông & Giải pháp số', 'Tổng công ty Giải pháp Doanh nghiệp Viettel - tiên phong chuyển đổi số quốc gia.'),
('MoMo (M_Service)', 'momo-fintech', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=60', 'https://momo.vn', 'TP. Hồ Chí Minh', 'Fintech', 'Siêu ứng dụng tài chính hàng đầu tại Việt Nam phục vụ hơn 30 triệu người dùng.'),
('VinAI Research', 'vinai-research', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=60', 'https://vinai.io', 'Hà Nội', 'Nghiên cứu Trí tuệ Nhân tạo', 'Viện nghiên cứu AI đẳng cấp thế giới thuộc tập đoàn Vingroup.'),
('Shopee Vietnam', 'shopee-vietnam', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=60', 'https://shopee.vn', 'TP. Hồ Chí Minh', 'Thương mại Điện tử', 'Nền tảng thương mại điện tử hàng đầu khu vực Đông Nam Á và Đài Loan.');

-- Seed Data: Jobs
INSERT INTO `jobs` (`title`, `slug`, `company_id`, `category_id`, `location`, `job_type`, `salary_range`, `experience_level`, `description`, `requirements`, `benefits`, `status`, `views`, `deadline`) VALUES
(
    'Senior Node.js Backend Engineer (High Traffic)',
    'senior-nodejs-backend-engineer',
    1, 1, 'TP. Hồ Chí Minh', 'Full-time', '35 - 55 triệu VNĐ', '3-5 năm',
    'Tham gia phát triển hạ tầng backend phục vụ hàng chục triệu người dùng đồng thời. Thiết kế kiến trúc Microservices chịu tải cao, tối ưu hóa caching với Redis và cơ sở dữ liệu MySQL phân tán.',
    '- Tối thiểu 3 năm kinh nghiệm với Node.js, Express/NestJS, TypeScript.\n- Thành thạo thiết kế Database MySQL, tối ưu query, indexing.\n- Hiểu sâu về Message Broker (Kafka/RabbitMQ) và kiến trúc Event-Driven.\n- Kinh nghiệm với Docker, CI/CD pipeline.',
    '- Thu nhập cạnh tranh, thưởng tháng 13 + thưởng hiệu quả kinh doanh lên tới 3-5 tháng lương.\n- Gói bảo hiểm sức khỏe cao cấp VIP cho bản thân và gia đình.\n- Môi trường làm việc năng động, chuẩn quốc tế tại VNG Campus.\n- Cơm trưa miễn phí, khu thể thao gym, bơi lội, yoga.',
    'active', 245, '2026-12-31'
),
(
    'DevOps / SRE Engineer (Kubernetes & Monitoring)',
    'devops-sre-engineer-kubernetes',
    2, 2, 'Hà Nội', 'Full-time', '28 - 45 triệu VNĐ', '2-4 năm',
    'Xây dựng và vận hành hạ tầng Cloud (AWS/GCP), tự động hóa quy trình CI/CD cho các dự án quy mô lớn. Giám sát hệ thống với Prometheus, Grafana, Loki và bảo đảm SLA 99.99%.',
    '- Có kinh nghiệm triển khai Docker, Docker Compose, Kubernetes.\n- Thành thạo Nginx reverse proxy, SSL/TLS, Linux security hardening.\n- Sử dụng tốt các công cụ monitoring: Prometheus, Grafana, Loki, ELK.\n- Kỹ năng scripting tốt với Bash, Python.',
    '- Xét tăng lương 2 lần/năm, hỗ trợ thi các chứng chỉ quốc tế (CKA, AWS, GCP).\n- Du lịch hàng năm, teambuilding thường xuyên.\n- Cơ hội on-site làm việc ngắn hạn hoặc dài hạn tại Nhật Bản, Singapore, Châu Âu.',
    'active', 189, '2026-11-30'
),
(
    'Lead UI/UX Designer (Fintech Products)',
    'lead-ui-ux-designer-fintech',
    4, 3, 'TP. Hồ Chí Minh', 'Full-time', '30 - 45 triệu VNĐ', '3-5 năm',
    'Chịu trách nhiệm thiết kế trải nghiệm người dùng trên Siêu ứng dụng MoMo. Nghiên cứu hành vi người dùng, xây dựng User Flow, Wireframe, Prototype và duy trì Design System toàn diện.',
    '- Tối thiểu 3 năm kinh nghiệm thiết kế UI/UX trên ứng dụng di động iOS/Android.\n- Sử dụng xuất sắc Figma, FigJam, Protopie.\n- Tư duy sản phẩm nhạy bén, khả năng phân tích dữ liệu trải nghiệm (A/B testing, heatmap).\n- Portfolio ấn tượng thể hiện tư duy thiết kế giải quyết bài toán phức tạp.',
    '- Thưởng hiệu quả dự án và thưởng cuối năm hấp dẫn.\n- Cung cấp MacBook Pro M-series mới nhất.\n- Làm việc hybrid linh hoạt (2 ngày làm việc tại nhà / tuần).\n- Bảo hiểm sức khỏe quốc tế PVI.',
    'active', 312, '2026-12-15'
),
(
    'AI / Computer Vision Research Engineer',
    'ai-computer-vision-research-engineer',
    5, 4, 'Hà Nội', 'Full-time', '40 - 70 triệu VNĐ', '2-5 năm',
    'Nghiên cứu và phát triển các mô hình Trí tuệ Nhân tạo hiện đại ứng dụng trong xe tự hành, camera thông minh và nhận diện khuôn mặt. Tối ưu hóa mô hình Deep Learning chạy trên thiết bị Edge.',
    '- Tốt nghiệp ĐH/Thạc sĩ/Tiến sĩ chuyên ngành CNTT, Toán tin hoặc liên quan.\n- Nắm vững kiến thức Deep Learning, CNN, Transformers, Vision Transformers.\n- Thành thạo PyTorch, TensorFlow, TensorRT, OpenCV.\n- Có bài báo tại các hội nghị uy tín (CVPR, ICCV, ECCV, NeurIPS) là điểm cộng rất lớn.',
    '- Mức lương top thị trường, thưởng cổ phiếu và dự án.\n- Làm việc cùng các chuyên gia đầu ngành AI trên thế giới.\n- Cụm siêu máy tính GPU NVIDIA A100/H100 phục vụ nghiên cứu.\n- Hỗ trợ chi phí tham dự các hội nghị khoa học quốc tế.',
    'active', 415, '2026-12-25'
),
(
    'Product Manager (E-commerce Growth)',
    'product-manager-ecommerce-growth',
    6, 5, 'TP. Hồ Chí Minh', 'Full-time', '35 - 50 triệu VNĐ', '3-5 năm',
    'Định hình chiến lược phát triển tính năng tăng trưởng người dùng cho nền tảng Shopee. Phối hợp chặt chẽ với đội ngũ Kỹ thuật, Thiết kế, Vận hành và Tiếp thị để mang lại trải nghiệm mua sắm mượt mà.',
    '- 3+ năm kinh nghiệm vị trí Product Manager trong lĩnh vực E-commerce hoặc Tech.\n- Kỹ năng phân tích số liệu xuất sắc (SQL, Tableau, Google Analytics).\n- Năng lực giao tiếp và quản lý các bên liên quan (Stakeholder Management).\n- Tiếng Anh lưu loát trong công việc.',
    '- Môi trường làm việc quốc tế, thăng tiến nhanh theo năng lực.\n- Trợ cấp ăn trưa, điện thoại, gửi xe.\n- Voucher mua sắm ưu đãi Shopee độc quyền cho nhân viên.',
    'active', 156, '2026-11-20'
),
(
    'Fullstack Web Developer (Express + Vue/React)',
    'fullstack-web-developer-express',
    3, 1, 'Hà Nội', 'Full-time', '22 - 35 triệu VNĐ', '1-3 năm',
    'Phát triển các cổng thông tin và hệ thống chuyển đổi số doanh nghiệp cho các cơ quan và tập đoàn lớn. Xây dựng RESTful API và giao diện web hiện đại, chuẩn SEO và bảo mật cao.',
    '- Thành thạo JavaScript/TypeScript, Node.js (Express), HTML5, CSS3.\n- Có kinh nghiệm với React hoặc Vue.js, TailwindCSS.\n- Nắm chắc kiến thức REST API, MySQL, Nginx.\n- Tinh thần trách nhiệm cao, ham học hỏi công nghệ mới.',
    '- Chế độ đãi ngộ chuẩn tập đoàn Viettel: 15-18 tháng lương/năm.\n- Cơ hội thăng tiến lên Tech Lead/Architect.\n- Trợ cấp đồng phục, ăn trưa, công tác phí chu đáo.',
    'active', 280, '2026-12-10'
),
(
    'Cloud Security Specialist',
    'cloud-security-specialist',
    2, 2, 'Hà Nội', 'Full-time', '35 - 55 triệu VNĐ', '3-5 năm',
    'Thiết kế kiến trúc bảo mật đám mây, kiểm toán mã nguồn (SAST/DAST), thiết lập chính sách Container Hardening, Network Segmentation và giám sát an ninh mạng SOC/SIEM.',
    '- Hiểu biết chuyên sâu về kiến trúc bảo mật Linux, Docker Security, Kubernetes NetworkPolicy.\n- Có chứng chỉ bảo mật (CISSP, CISM, CEH, AWS Security Specialty) là lợi thế.\n- Khả năng xử lý sự cố an ninh và phòng thủ tấn công DDoS, Web Exploits.',
    '- Lương tháng 13 + thưởng hoàn thành dự án lớn.\n- Bảo hiểm y tế quốc tế.\n- Môi trường làm việc mở, khuyến khích sáng tạo giải pháp bảo mật.',
    'active', 98, '2026-12-30'
),
(
    'Junior / Fresher DevOps Engineer',
    'junior-devops-engineer',
    1, 2, 'TP. Hồ Chí Minh', 'Full-time', '15 - 22 triệu VNĐ', '0-1 năm',
    'Tham gia cùng team vận hành hệ thống máy chủ, triển khai container hóa với Docker, thiết lập dashboard giám sát Grafana và theo dõi log tập trung với Promtail/Loki.',
    '- Tốt nghiệp ĐH chuyên ngành CNTT, An toàn thông tin hoặc Điện tử viễn thông.\n- Nắm vững kiến thức hệ điều hành Linux, mạng máy tính (TCP/IP, DNS, HTTP/HTTPS).\n- Biết sử dụng Git, Docker, Docker Compose, Nginx cơ bản.\n- Đam mê tự động hóa và quản trị hệ thống phần mềm.',
    '- Được đào tạo bài bản từ các Senior SRE/DevOps giàu kinh nghiệm.\n- Hỗ trợ lương cạnh tranh ngay khi mới tốt nghiệp.\n- Môi trường công nghệ hiện đại bậc nhất Việt Nam.',
    'active', 520, '2026-11-15'
);

-- Seed Data: Sample Applications
INSERT INTO `applications` (`job_id`, `candidate_name`, `candidate_email`, `candidate_phone`, `cv_filename`, `cover_letter`, `status`, `applied_at`) VALUES
(1, 'Nguyễn Văn An', 'nguyenvanan.dev@gmail.com', '0912345678', 'CV_NguyenVanAn_NodeJS.pdf', 'Tôi có 4 năm kinh nghiệm làm việc với hệ thống Node.js chịu tải cao tại các fintech và thương mại điện tử. Rất mong có cơ hội cống hiến cho VNG.', 'interviewed', '2026-10-20 09:30:00'),
(1, 'Trần Minh Đức', 'duc.tranminh@outlook.com', '0987654321', 'CV_TranMinhDuc_Backend.pdf', 'Kính gửi nhà tuyển dụng, tôi thành thạo Microservices và MySQL optimization, rất mong được gia nhập team Backend.', 'reviewing', '2026-10-21 14:15:00'),
(2, 'Lê Hoàng Nam', 'namle.devops@gmail.com', '0903112233', 'CV_LeHoangNam_DevOps.pdf', 'Tôi đã triển khai thành công hệ thống Kubernetes, Prometheus và Loki giám sát cho hơn 50 microservices tại công ty cũ.', 'accepted', '2026-10-18 10:00:00'),
(2, 'Phạm Quốc Hùng', 'hung.pq.sre@gmail.com', '0945667788', 'CV_PhamQuocHung_SRE.pdf', 'Đam mê SRE, tự động hóa với Ansible, Terraform và đảm bảo SLA 99.99%.', 'pending', '2026-10-22 16:45:00'),
(3, 'Đỗ Thị Mai Hương', 'maihuong.ux@gmail.com', '0977889900', 'CV_DoThiMaiHuong_UIUX.pdf', 'Em có 3 năm kinh nghiệm thiết kế app thanh toán điện tử, kính gửi quý công ty xem qua Portfolio.', 'interviewed', '2026-10-19 11:20:00'),
(4, 'Vũ Hoàng Long', 'long.vh.ai@vinai-candidate.vn', '0933221100', 'CV_VuHoangLong_AI.pdf', 'Tác giả 02 bài báo tại CVPR 2025 về Object Detection trên Edge Devices.', 'reviewing', '2026-10-23 08:30:00'),
(6, 'Hoàng Thảo Linh', 'linh.hoangthao@gmail.com', '0911223344', 'CV_HoangThaoLinh_Fullstack.pdf', 'Thành thạo Express, Vue.js và MySQL. Mong muốn ứng tuyển vào vị trí Fullstack Web Developer tại Viettel Solutions.', 'pending', '2026-10-23 15:10:00');

-- Dedicated Prometheus MySQL Exporter User (Hardening: Least Privilege)
CREATE USER IF NOT EXISTS 'mysqld_exporter'@'%' IDENTIFIED BY 'ExporterSecPass_2026!';
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'mysqld_exporter'@'%';
FLUSH PRIVILEGES;

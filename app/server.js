const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const multer = require('multer');
const db = require('./db');
const {
    register,
    metricsMiddleware,
    totalJobsGauge,
    totalApplicationsGauge,
    applicationsSubmittedCounter
} = require('./metrics');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'CV-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file định dạng PDF, DOC, DOCX!'));
        }
    }
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Structured Logging for Promtail/Loki
morgan.token('client-ip', (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress);
const logFormat = '[:date[iso]] [client-ip::client-ip] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms';
app.use(morgan(logFormat));

// Prometheus Metrics Middleware
app.use(metricsMiddleware);

// Periodically update gauges for Prometheus
async function updateGauges() {
    try {
        const jobCountRes = await db.query('SELECT COUNT(*) as count FROM jobs WHERE status = "active"');
        const appCountRes = await db.query('SELECT COUNT(*) as count FROM applications');
        totalJobsGauge.set(jobCountRes[0]?.count || 0);
        totalApplicationsGauge.set(appCountRes[0]?.count || 0);
    } catch (err) {
        // Silently skip if DB is initializing
    }
}
setInterval(updateGauges, 15000);

// ================= ROUTES ================= //

// Prometheus Metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        await updateGauges();
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (err) {
        res.status(500).end(err.message);
    }
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.status(200).json({ status: 'UP', database: 'CONNECTED', timestamp: new Date() });
    } catch (err) {
        res.status(500).json({ status: 'DOWN', database: 'ERROR', error: err.message });
    }
});

// Home Page
app.get('/', async (req, res) => {
    try {
        const categories = await db.query(`
            SELECT c.*, COUNT(j.id) as job_count 
            FROM categories c 
            LEFT JOIN jobs j ON c.id = j.category_id AND j.status = 'active'
            GROUP BY c.id
        `);

        const featuredJobs = await db.query(`
            SELECT j.*, comp.name as company_name, comp.logo as company_logo, comp.location as company_location, cat.name as category_name
            FROM jobs j
            JOIN companies comp ON j.company_id = comp.id
            JOIN categories cat ON j.category_id = cat.id
            WHERE j.status = 'active'
            ORDER BY j.created_at DESC
            LIMIT 6
        `);

        const statsQuery = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM jobs WHERE status = 'active') as active_jobs,
                (SELECT COUNT(*) FROM companies) as total_companies,
                (SELECT COUNT(*) FROM applications) as total_applications
        `);

        const stats = statsQuery[0] || { active_jobs: 0, total_companies: 0, total_applications: 0 };

        res.render('index', {
            categories,
            featuredJobs,
            stats,
            title: 'Hệ Thống Tuyển Dụng & Việc Làm Hàng Đầu'
        });
    } catch (err) {
        console.error('[Error] GET /:', err.message);
        res.status(500).render('error', { error: err.message });
    }
});

// Job Listing & Search Page
app.get('/jobs', async (req, res) => {
    try {
        const { search, category, type, location } = req.query;

        let sql = `
            SELECT j.*, comp.name as company_name, comp.logo as company_logo, cat.name as category_name
            FROM jobs j
            JOIN companies comp ON j.company_id = comp.id
            JOIN categories cat ON j.category_id = cat.id
            WHERE j.status = 'active'
        `;
        const params = [];

        if (search) {
            sql += ` AND (j.title LIKE ? OR j.description LIKE ? OR comp.name LIKE ?)`;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        if (category) {
            sql += ` AND (cat.slug = ? OR cat.id = ?)`;
            params.push(category, category);
        }

        if (type) {
            sql += ` AND j.job_type = ?`;
            params.push(type);
        }

        if (location) {
            sql += ` AND j.location LIKE ?`;
            params.push(`%${location}%`);
        }

        sql += ` ORDER BY j.created_at DESC`;

        const jobs = await db.query(sql, params);
        const categories = await db.query('SELECT * FROM categories');

        res.render('jobs', {
            jobs,
            categories,
            filters: { search, category, type, location },
            title: 'Danh Sách Việc Làm Mới Nhất'
        });
    } catch (err) {
        console.error('[Error] GET /jobs:', err.message);
        res.status(500).render('error', { error: err.message });
    }
});

// Job Details Page
app.get('/jobs/:id', async (req, res) => {
    try {
        const jobId = req.params.id;

        // Increment views
        await db.query('UPDATE jobs SET views = views + 1 WHERE id = ?', [jobId]);

        const jobs = await db.query(`
            SELECT j.*, comp.name as company_name, comp.logo as company_logo, comp.website as company_website,
                   comp.description as company_desc, cat.name as category_name
            FROM jobs j
            JOIN companies comp ON j.company_id = comp.id
            JOIN categories cat ON j.category_id = cat.id
            WHERE j.id = ?
        `, [jobId]);

        if (jobs.length === 0) {
            return res.status(404).render('error', { error: 'Không tìm thấy việc làm này.' });
        }

        const relatedJobs = await db.query(`
            SELECT j.*, comp.name as company_name, comp.logo as company_logo
            FROM jobs j
            JOIN companies comp ON j.company_id = comp.id
            WHERE j.category_id = ? AND j.id != ? AND j.status = 'active'
            LIMIT 3
        `, [jobs[0].category_id, jobId]);

        res.render('job-detail', {
            job: jobs[0],
            relatedJobs,
            success: req.query.applied === 'true',
            title: `${jobs[0].title} - ${jobs[0].company_name}`
        });
    } catch (err) {
        console.error('[Error] GET /jobs/:id:', err.message);
        res.status(500).render('error', { error: err.message });
    }
});

// Candidate Applies with CV (Nộp CV)
app.post('/jobs/:id/apply', upload.single('cv_file'), async (req, res) => {
    try {
        const jobId = req.params.id;
        const { candidate_name, candidate_email, candidate_phone, cover_letter } = req.body;
        const cv_filename = req.file ? req.file.filename : 'CV_Default.pdf';

        if (!candidate_name || !candidate_email || !candidate_phone) {
            return res.status(400).render('error', { error: 'Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại!' });
        }

        await db.query(`
            INSERT INTO applications (job_id, candidate_name, candidate_email, candidate_phone, cv_filename, cover_letter, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        `, [jobId, candidate_name, candidate_email, candidate_phone, cv_filename, cover_letter || '']);

        // Prometheus counter
        applicationsSubmittedCounter.inc();

        console.log(`[CV_SUBMITTED] Candidate ${candidate_name} (${candidate_email}) applied for Job ID ${jobId}`);

        res.redirect(`/jobs/${jobId}?applied=true`);
    } catch (err) {
        console.error('[Error] POST /jobs/:id/apply:', err.message);
        res.status(500).render('error', { error: err.message });
    }
});

// Post a New Job Page (Nhà tuyển dụng đăng tin)
app.get('/post-job', async (req, res) => {
    try {
        const categories = await db.query('SELECT * FROM categories');
        const companies = await db.query('SELECT * FROM companies');

        res.render('post-job', {
            categories,
            companies,
            success: req.query.success === 'true',
            title: 'Đăng Tin Tuyển Dụng Mới'
        });
    } catch (err) {
        console.error('[Error] GET /post-job:', err.message);
        res.status(500).render('error', { error: err.message });
    }
});

// Submit New Job Post
app.post('/post-job', async (req, res) => {
    try {
        const {
            title, company_id, category_id, location, job_type,
            salary_range, experience_level, description, requirements, benefits, deadline
        } = req.body;

        if (!title || !company_id || !category_id || !description || !requirements) {
            return res.status(400).render('error', { error: 'Vui lòng điền đầy đủ các thông tin bắt buộc!' });
        }

        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Date.now();

        await db.query(`
            INSERT INTO jobs (title, slug, company_id, category_id, location, job_type, salary_range, experience_level, description, requirements, benefits, deadline, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        `, [title, slug, company_id, category_id, location, job_type, salary_range, experience_level, description, requirements, benefits, deadline || null]);

        console.log(`[JOB_POSTED] New job created: "${title}" at company ID ${company_id}`);

        res.redirect('/post-job?success=true');
    } catch (err) {
        console.error('[Error] POST /post-job:', err.message);
        res.status(500).render('error', { error: err.message });
    }
});

// Management Dashboard (Quản lý tin tuyển dụng & Hồ sơ ứng viên)
app.get('/manage', async (req, res) => {
    try {
        const jobs = await db.query(`
            SELECT j.*, comp.name as company_name, cat.name as category_name,
                   (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as application_count
            FROM jobs j
            JOIN companies comp ON j.company_id = comp.id
            JOIN categories cat ON j.category_id = cat.id
            ORDER BY j.created_at DESC
        `);

        const applications = await db.query(`
            SELECT a.*, j.title as job_title, comp.name as company_name
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN companies comp ON j.company_id = comp.id
            ORDER BY a.applied_at DESC
        `);

        const statsQuery = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM jobs) as total_jobs,
                (SELECT COUNT(*) FROM applications) as total_applications,
                (SELECT COUNT(*) FROM applications WHERE status = 'pending') as pending_applications,
                (SELECT COUNT(*) FROM applications WHERE status = 'accepted') as accepted_applications
        `);

        res.render('manage', {
            jobs,
            applications,
            stats: statsQuery[0] || {},
            title: 'Hệ Thống Quản Lý Tin Tuyển Dụng & CV'
        });
    } catch (err) {
        console.error('[Error] GET /manage:', err.message);
        res.status(500).render('error', { error: err.message });
    }
});

// Delete Job API
app.post('/api/jobs/:id/delete', async (req, res) => {
    try {
        const jobId = req.params.id;
        await db.query('DELETE FROM jobs WHERE id = ?', [jobId]);
        console.log(`[JOB_DELETED] Job ID ${jobId} was deleted.`);
        res.redirect('/manage');
    } catch (err) {
        console.error('[Error] DELETE /api/jobs/:id:', err.message);
        res.status(500).render('error', { error: err.message });
    }
});

// Update Application Status API
app.post('/api/applications/:id/status', async (req, res) => {
    try {
        const appId = req.params.id;
        const { status } = req.body;
        await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, appId]);
        console.log(`[APPLICATION_STATUS_UPDATED] Application ID ${appId} status changed to ${status}`);
        res.redirect('/manage');
    } catch (err) {
        console.error('[Error] POST /api/applications/:id/status:', err.message);
        res.status(500).render('error', { error: err.message });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('error', { error: 'Trang bạn yêu cầu không tồn tại (404 Not Found)!' });
});

// Start Server after verifying DB connection
async function startServer() {
    try {
        console.log('[App] Starting Job Board Application...');
        await db.checkConnection();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`[App] Job Board Server is running at http://0.0.0.0:${PORT}`);
        });
    } catch (err) {
        console.error('[App] Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();

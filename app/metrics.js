const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Add default metrics (CPU, RAM, Event Loop, GC)
client.collectDefaultMetrics({
    register,
    prefix: 'jobboard_'
});

// Custom Metrics
const httpRequestsTotal = new client.Counter({
    name: 'jobboard_http_requests_total',
    help: 'Total number of HTTP requests processed',
    labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestsTotal);

const httpRequestDuration = new client.Histogram({
    name: 'jobboard_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});
register.registerMetric(httpRequestDuration);

const totalJobsGauge = new client.Gauge({
    name: 'jobboard_active_jobs_total',
    help: 'Total number of active job postings in the system'
});
register.registerMetric(totalJobsGauge);

const totalApplicationsGauge = new client.Gauge({
    name: 'jobboard_applications_total',
    help: 'Total number of job applications submitted'
});
register.registerMetric(totalApplicationsGauge);

const applicationsSubmittedCounter = new client.Counter({
    name: 'jobboard_applications_submitted_total',
    help: 'Counter of newly submitted applications'
});
register.registerMetric(applicationsSubmittedCounter);

function metricsMiddleware(req, res, next) {
    if (req.path === '/metrics' || req.path === '/health') {
        return next();
    }

    const start = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const durationInSeconds = diff[0] + diff[1] / 1e9;
        const route = req.route ? req.route.path : req.path;
        const statusCode = res.statusCode ? res.statusCode.toString() : 'unknown';

        httpRequestsTotal.inc({
            method: req.method,
            route: route,
            status_code: statusCode
        });

        httpRequestDuration.observe({
            method: req.method,
            route: route,
            status_code: statusCode
        }, durationInSeconds);
    });

    next();
}

module.exports = {
    register,
    metricsMiddleware,
    totalJobsGauge,
    totalApplicationsGauge,
    applicationsSubmittedCounter
};

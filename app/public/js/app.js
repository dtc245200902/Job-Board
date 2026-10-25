// Client-side interactions for Job Board
document.addEventListener('DOMContentLoaded', () => {
    // Validate file upload size before submitting
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const maxSizeBytes = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSizeBytes) {
                    alert('File quá lớn! Vui lòng chọn file CV có dung lượng dưới 10MB.');
                    e.target.value = '';
                }
            }
        });
    });

    // Auto-dismiss alerts after 6 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 6000);
    });
});

// Xử lý các tương tác thời gian (Hôm nay, 7 ngày, 30 ngày)
document.addEventListener('DOMContentLoaded', () => {
    const timeButtons = document.querySelectorAll('.bg-slate-150, .bg-slate-100 button');
    
    timeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            timeButtons.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
                b.classList.add('text-slate-600');
            });
            e.currentTarget.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
            e.currentTarget.classList.remove('text-slate-600');
        });
    });
});
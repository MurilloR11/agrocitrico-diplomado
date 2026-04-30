// static/js/dashboard.js

(function () {
    const meters = document.querySelectorAll('.harvest-meter');

    meters.forEach(function (meter) {
        const progress = Math.max(0, Math.min(100, Number(meter.dataset.progress || 0)));
        const bar = meter.querySelector('div');

        if (bar) {
            requestAnimationFrame(function () {
                bar.style.width = progress + '%';
            });
        }
    });
}());

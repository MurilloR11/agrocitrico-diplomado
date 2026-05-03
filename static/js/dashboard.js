// static/js/dashboard.js

(function () {

    // Inicializa iconos Lucide
    if (window.lucide) {
        lucide.createIcons();
    }

    // Fecha en el topbar
    var dateEl = document.getElementById('js-date');
    if (dateEl) {
        var now = new Date();
        var opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('es-CO', opts);
    }

    // Anima la barra de progreso de cosecha
    document.querySelectorAll('.harvest-bar').forEach(function (bar) {
        var progress = Math.max(0, Math.min(100, Number(bar.dataset.progress || 0)));
        var fill = bar.querySelector('div');
        if (fill) {
            requestAnimationFrame(function () {
                fill.style.width = progress + '%';
            });
        }
    });

}());

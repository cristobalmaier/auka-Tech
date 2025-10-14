document.addEventListener('DOMContentLoaded', async () => {
    const faqList = document.getElementById('faq-list');
    const searchInput = document.getElementById('faq-search');
    const countEl = document.getElementById('faq-count');

    const getCards = () => Array.from(faqList.querySelectorAll('.faq-card'));

    function setCount(n) {
        if (countEl) countEl.textContent = n + (n === 1 ? ' resultado' : ' resultados');
    }

    const attachToggle = (card) => {
        const btn = card.querySelector('.faq-card-question');
        const answer = card.querySelector('.faq-card-answer');
        if (!btn || !answer) return;

        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';

        const open = () => {
            btn.setAttribute('aria-expanded', 'true');
            answer.classList.add('show');
            const h = answer.scrollHeight;
            answer.style.maxHeight = h + 'px';
        };

        const close = () => {
            btn.setAttribute('aria-expanded', 'false');
            // set maxHeight to current height then to 0 to trigger transition
            answer.style.maxHeight = answer.scrollHeight + 'px';
            requestAnimationFrame(() => {
                answer.style.maxHeight = '0px';
                answer.classList.remove('show');
            });
        };

        const toggle = () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            if (expanded) close(); else open();
        };

        btn.addEventListener('click', toggle);
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    };

    // Inicializar toggles para tarjetas ya renderizadas
    getCards().forEach(attachToggle);

    // Función de filtrado por texto
    const filterCards = (term) => {
        const q = (term || '').trim().toLowerCase();
        let visible = 0;
        getCards().forEach(card => {
            const title = card.querySelector('.faq-card-title').textContent.toLowerCase();
            const body = card.querySelector('.faq-card-answer').textContent.toLowerCase();
            const matches = !q || title.includes(q) || body.includes(q);
            card.style.display = matches ? '' : 'none';
            if (matches) visible++;
        });
        setCount(visible);
    };

    // Búsqueda en vivo
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterCards(e.target.value);
        });
    }

    // Inicializar contador
    setCount(getCards().length);
});
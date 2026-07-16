document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Select all elements to animate
    const animateElements = document.querySelectorAll('.fade-up');
    animateElements.forEach(el => observer.observe(el));

    // Hero glow follows the cursor
    const hero = document.querySelector('.hero');
    const glow = document.querySelector('.hero-glow');
    if (hero && glow) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            glow.style.setProperty('--x', x + '%');
            glow.style.setProperty('--y', y + '%');
        });
    }

    // Animated stat counters, triggered once when in view
    const statNums = document.querySelectorAll('.stat-num');
    if (statNums.length) {
        const statObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10) || 0;
                const duration = 1200;
                const start = performance.now();
                const step = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                obs.unobserve(el);
            });
        }, { threshold: 0.6 });
        statNums.forEach(el => statObserver.observe(el));
    }

    // --- Offre limitée : compte à rebours + places restantes ---
    // À MODIFIER PAR MAGNUM :
    // 1) OFFER_DEADLINE : date/heure réelle de fin de l'offre (fixe pour tout le monde, pas par visiteur, pour rester honnête).
    // 2) PLACES_RESTANTES : à décrémenter manuellement dans ce fichier au fur et à mesure des réservations (pas de suivi automatique sans CRM).
    const OFFER_DEADLINE = new Date('2026-07-19T23:59:59+01:00'); // 72h à partir du 16/07/2026
    const PLACES_RESTANTES = 20;

    const placesEl = document.getElementById('places-restantes');
    if (placesEl) placesEl.textContent = PLACES_RESTANTES;

    const cdH = document.getElementById('cd-h');
    const cdM = document.getElementById('cd-m');
    const cdS = document.getElementById('cd-s');
    if (cdH && cdM && cdS) {
        const updateCountdown = () => {
            const now = new Date();
            let diff = OFFER_DEADLINE - now;
            if (diff <= 0) {
                cdH.textContent = '00';
                cdM.textContent = '00';
                cdS.textContent = '00';
                clearInterval(countdownInterval);
                return;
            }
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            cdH.textContent = String(hours).padStart(2, '0');
            cdM.textContent = String(minutes).padStart(2, '0');
            cdS.textContent = String(seconds).padStart(2, '0');
        };
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    // --- Modales vidéo (aperçu formation gratuit + félicitations diplômés) ---
    document.querySelectorAll('.video-trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const modal = document.getElementById(`video-modal-${trigger.dataset.video}`);
            if (!modal) return;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    document.querySelectorAll('.video-modal').forEach((modal) => {
        const closeModal = () => {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            const video = modal.querySelector('video');
            if (video) video.pause();
        };
        modal.querySelector('.video-modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });
    });

    // Subtle tilt on interactive cards
    const tiltCards = document.querySelectorAll('.service-card, .system-step, .price-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            const isFeatured = card.classList.contains('featured');
            const baseScale = isFeatured ? 1.05 : 1;
            card.style.transform = `perspective(800px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) scale(${baseScale})`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});
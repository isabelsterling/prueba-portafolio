/* ============================================================
   MAIN.JS - PORTAFOLIO DE ISABEL STERLING
   Versión 12.0 - Optimizado para HTML simplificado
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    initAOS();
    initMobileMenu();
    initBackToTop();
    initScrollProgress();
    initNavbarScroll();
    initTheme();
    initCertCarousel();
    initFaqAccordion();
    initProjectsPage();
    initProjectFilters();
    initSmoothScroll();
    updateCurrentYear();
    showConsoleWelcome();
    initReducedMotion();
});

/* ============================================================
   1. INICIALIZAR AOS
   ============================================================ */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-in-out'
        });
    }
}

/* ============================================================
   2. MENÚ HAMBURGUESA
   ============================================================ */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const navbar = document.querySelector('.navbar');
    
    if (!menuToggle || !menu) return;
    
    function closeMenu() {
        menu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        document.body.style.overflow = '';
    }
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    
    document.querySelectorAll('.menu a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (e) => { if (navbar && !navbar.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu(); });
}

/* ============================================================
   3. BOTÓN SUBIR ARRIBA
   ============================================================ */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    let isVisible = false;
    
    window.addEventListener('scroll', () => {
        const shouldShow = window.scrollY > 300;
        if (shouldShow !== isVisible) {
            isVisible = shouldShow;
            backToTopBtn.classList.toggle('visible', isVisible);
        }
    });
    
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   4. BARRA DE PROGRESO SCROLL
   ============================================================ */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    
    let isVisible = false;
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        
        const shouldShow = scrolled > 2;
        if (shouldShow !== isVisible) {
            isVisible = shouldShow;
            progressBar.classList.toggle('visible', isVisible);
        }
        
        progressBar.style.width = scrolled + '%';
    });
}

/* ============================================================
   5. NAVBAR SCROLL EFFECT
   ============================================================ */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let isScrolled = false;
    
    window.addEventListener('scroll', () => {
        const shouldScrolled = window.scrollY > 50;
        if (shouldScrolled !== isScrolled) {
            isScrolled = shouldScrolled;
            navbar.classList.toggle('scrolled', isScrolled);
        }
    });
}

/* ============================================================
   6. GESTIÓN DE TEMA (Claro/Oscuro)
   ============================================================ */
function getSystemTheme() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        const moonIcon = toggleBtn.querySelector('.moon-icon');
        const sunIcon = toggleBtn.querySelector('.sun-icon');
        if (theme === 'dark') {
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'block';
        } else {
            if (moonIcon) moonIcon.style.display = 'block';
            if (sunIcon) sunIcon.style.display = 'none';
        }
    }
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = theme === 'dark' ? '#050510' : '#F7F5FC';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme || getSystemTheme());
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

/* ============================================================
   7. CARRUSEL DE CERTIFICADOS (solo index.html)
   ============================================================ */
function initCertCarousel() {
    const carousel = document.getElementById('certCarousel');
    const prevBtn = document.getElementById('certPrev');
    const nextBtn = document.getElementById('certNext');
    const dots = document.querySelectorAll('.cert-dots .dot');
    
    if (!carousel || !prevBtn || !nextBtn || dots.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = dots.length;
    let autoPlayInterval = null;
    const autoPlayDelay = 5000;
    
    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentIndex = index;
        carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        resetAutoPlay();
    }
    
    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }
    
    function resetAutoPlay() {
        if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; }
        startAutoPlay();
    }
    
    function startAutoPlay() {
        if (autoPlayInterval) return;
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; }
    }
    
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        nextSlide();
        stopAutoPlay();
        setTimeout(startAutoPlay, 3000);
    });
    
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        prevSlide();
        stopAutoPlay();
        setTimeout(startAutoPlay, 3000);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
            goToSlide(index);
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        });
    });
    
    const container = carousel.closest('.cert-carousel-container');
    if (container) {
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);
        container.addEventListener('touchstart', stopAutoPlay);
        container.addEventListener('touchend', startAutoPlay);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        }
    });
    
    startAutoPlay();
    goToSlide(0);
}

/* ============================================================
   8. FAQ ACORDEÓN (solo contacto.html)
   ============================================================ */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length === 0) return;
    
    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(function(el) {
                el.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) {
        firstFaq.classList.add('active');
    }
}

/* ============================================================
   9. PROYECTOS DINÁMICOS (solo proyectos.html)
   ============================================================ */
function initProjectsPage() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    
    // =============================================
    // DATOS DE PROYECTOS
    // =============================================
    const projectsData = {
        javascript: {
            title: 'JavaScript',
            icon: 'fab fa-js',
            description: 'Aplicaciones interactivas con lógica de programación y manipulación del DOM',
            projects: [
                { title: 'Calculadora Básica', description: 'Implementación de operaciones aritméticas con interfaz de usuario interactiva. Practica manejo de eventos y lógica de programación.', tech: ['HTML5', 'CSS3', 'JavaScript', 'Eventos'], complexity: 2, demo: 'proyectos/calculadora/index.html', featured: false },
                { title: 'Conversor de Monedas', description: 'Consumo de API REST para obtener tasas de cambio en tiempo real. Implementación de gráficos, historial y persistencia de datos.', tech: ['HTML5', 'CSS3', 'JavaScript', 'API REST', 'Chart.js'], complexity: 4, demo: 'proyectos/conversor-de-monedas/index.html', featured: true },
                { title: 'Reloj Mundial', description: 'Manejo de zonas horarias con la API Date de JavaScript. Actualización en tiempo real y visualización de múltiples ciudades.', tech: ['HTML5', 'CSS3', 'JavaScript', 'Date API'], complexity: 3, demo: 'proyectos/world-clock/index.html', featured: false },
                { title: 'Trivia Interactiva', description: 'Desarrollo de un juego de preguntas con sistema de puntuación, temporizador y múltiples niveles de dificultad.', tech: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API'], complexity: 3, demo: 'proyectos/trivia/index.html', featured: false },
                { title: 'Notas con LocalStorage', description: 'CRUD completo con persistencia en el navegador. Implementación de categorías, búsqueda y exportación de datos.', tech: ['HTML5', 'CSS3', 'JavaScript', 'localStorage'], complexity: 3, demo: 'proyectos/notes-app/index.html', featured: false },
                { title: 'Agenda / Calendario', description: 'Calendario interactivo con eventos, drag & drop, recordatorios y persistencia en localStorage.', tech: ['HTML5', 'CSS3', 'JavaScript', 'localStorage', 'Drag & Drop'], complexity: 4, demo: 'proyectos/calendar/index.html', featured: true },
                { title: 'Generador de Contraseñas', description: 'Algoritmo de generación de contraseñas seguras con análisis de entropía en tiempo real.', tech: ['HTML5', 'CSS3', 'JavaScript', 'Algoritmos'], complexity: 3, demo: 'proyectos/password-generator/index.html', featured: false }
            ]
        },
        productividad: {
            title: 'Productividad',
            icon: 'fas fa-chart-line',
            description: 'Herramientas para la organización personal y gestión del tiempo',
            projects: [
                { title: 'Lista de Tareas', description: 'To-Do List con CRUD completo, filtros por estado y persistencia. Practica manipulación del DOM y manejo de eventos.', tech: ['HTML5', 'CSS3', 'JavaScript', 'DOM'], complexity: 2, demo: 'proyectos/to-do-list/index.html', featured: false },
                { title: 'Administrador de Hábitos', description: 'Seguimiento de hábitos diarios con estadísticas de racha, categorías y progreso semanal.', tech: ['HTML5', 'CSS3', 'JavaScript', 'localStorage'], complexity: 3, demo: 'proyectos/habit-tracker/index.html', featured: false },
                { title: 'Planificador Semanal', description: 'Organización de tareas por día con drag & drop, prioridades, horarios y persistencia.', tech: ['HTML5', 'CSS3', 'JavaScript', 'Drag & Drop'], complexity: 4, demo: 'proyectos/weekly-planner/index.html', featured: true },
                { title: 'Organizador de Apuntes', description: 'Sistema de notas con categorías, etiquetas, búsqueda y colores personalizables.', tech: ['HTML5', 'CSS3', 'JavaScript', 'localStorage'], complexity: 3, demo: 'proyectos/notes-organizer/index.html', featured: false },
                { title: 'Agenda de Cumpleaños', description: 'Gestión de cumpleaños con recordatorios, filtros por mes, notificaciones y organización por fechas.', tech: ['HTML5', 'CSS3', 'JavaScript', 'localStorage'], complexity: 3, demo: 'proyectos/birthday-agenda/index.html', featured: false }
            ]
        },
        ia: {
            title: 'Inteligencia Artificial',
            icon: 'fas fa-brain',
            description: 'Aplicaciones que integran NLP y Machine Learning',
            projects: [
                { title: 'Chatbot con NLP', description: 'Implementación de un bot conversacional que utiliza Procesamiento de Lenguaje Natural para reconocer intenciones.', tech: ['HTML5', 'CSS3', 'JavaScript', 'NLP', 'IA'], complexity: 4, demo: 'proyectos/chatbot/index.html', featured: true }
            ]
        },
        python: {
            title: 'Python',
            icon: 'fab fa-python',
            description: 'Desarrollos en backend, automatización y lógica de programación',
            projects: [
                { title: 'Generador de Contraseñas (Python)', description: 'Programa en Python que genera contraseñas aleatorias seguras con cálculo de entropía, análisis de seguridad y persistencia de historial.', tech: ['Python', 'Random', 'Seguridad', 'JSON'], complexity: 3, demo: 'proyectos/password-generator/index.html', featured: false },
                { title: 'Adivina el Número', description: 'Juego de consola interactivo donde el usuario adivina un número aleatorio. Implementación de bucles, condicionales y manejo de entrada.', tech: ['Python', 'Bucles', 'Condicionales', 'Consola'], complexity: 1, demo: 'proyectos/adivina-numero/index.html', featured: false }
            ]
        },
        herramientas: {
            title: 'Herramientas Online',
            icon: 'fas fa-tools',
            description: 'Utilidades web para el día a día',
            projects: [
                { title: 'Link Tools', description: 'Suite de herramientas para gestión de enlaces: acortador de URLs, generador de códigos QR, verificador de enlaces y constructor UTM.', tech: ['HTML5', 'CSS3', 'JavaScript', 'API'], complexity: 3, demo: 'proyectos/link-tools/index.html', featured: false }
            ]
        },
        juegos: {
            title: 'Videojuegos',
            icon: 'fas fa-gamepad',
            description: 'Colección de juegos desarrollados con HTML5 Canvas y JavaScript',
            games: [
                { icon: '🐍', name: 'Snake' },
                { icon: '🧩', name: 'Tetris' },
                { icon: '🐦', name: 'Flappy Bird' },
                { icon: '🎴', name: 'Memorama' },
                { icon: '🏓', name: 'Ping Pong' },
                { icon: '🧱', name: 'Breakout' },
                { icon: '🏎️', name: 'Carreras' },
                { icon: '🎱', name: 'Billiards' },
                { icon: '🚀', name: 'Nave Espacial' },
                { icon: '🧟', name: 'Zombie Survival' },
                { icon: '🧩', name: '2048' },
                { icon: '✊', name: 'Piedra, Papel o Tijera' },
                { icon: '🎨', name: 'Pixel Art' }
            ]
        }
    };

    // =============================================
    // GENERAR TARJETA DE PROYECTO
    // =============================================
    function renderProjectCard(project, isFeatured = false) {
        const complexityDots = '●'.repeat(project.complexity) + '○'.repeat(5 - project.complexity);
        const cardClass = isFeatured ? 'project-card featured' : 'project-card';
        
        return `
            <article class="${cardClass}" data-aos="fade-up">
                <div class="project-preview">
                    <div class="project-preview-icon"><i class="fas fa-code"></i></div>
                    ${isFeatured ? `<span class="featured-badge"><i class="fas fa-star"></i> Destacado</span>` : ''}
                </div>
                <div class="project-body">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-stack">${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                    <div class="project-complexity">
                        <span class="complexity-label">Complejidad:</span>
                        <span class="complexity-dots">${complexityDots}</span>
                    </div>
                    <div class="project-links">
                        <a href="${project.demo}" class="btn-project demo" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i> Ver Demo
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    // =============================================
    // GENERAR CATEGORÍA COMPLETA
    // =============================================
    function renderCategory(key, data) {
        const projects = data.projects || [];
        const games = data.games || [];
        
        const projectsHTML = projects.map(p => renderProjectCard(p, false)).join('');
        
        const gamesHTML = games.length > 0 ? `
            <div class="games-showcase">
                <div class="games-info">
                    <div class="games-icon"><i class="fas fa-gamepad"></i></div>
                    <div class="games-description">
                        <h3>🎮 Sector de Videojuegos</h3>
                        <p>Esta colección representa mi enfoque en el desarrollo de experiencias interactivas. Cada juego implementa diferentes conceptos de programación: física, inteligencia artificial básica, manejo de colisiones y diseño de interfaces responsivas.</p>
                        <div class="games-tech">
                            <span class="tech-tag">HTML5</span>
                            <span class="tech-tag">CSS3</span>
                            <span class="tech-tag">JavaScript</span>
                            <span class="tech-tag">Canvas API</span>
                            <span class="tech-tag">DOM</span>
                        </div>
                    </div>
                </div>
                <div class="games-list">
                    ${games.map(g => `<div class="game-badge"><span class="game-icon">${g.icon}</span><span class="game-name">${g.name}</span></div>`).join('')}
                </div>
                <a href="proyectos/juegos/index.html" class="btn-games">
                    <i class="fas fa-play"></i> Ver todos los juegos
                </a>
            </div>
        ` : '';
        
        const count = games.length > 0 ? `${games.length} juegos` : `${projects.length} proyectos`;
        
        return `
            <div class="category-wrapper" data-category="${key}">
                <div class="category-header">
                    <div>
                        <h2><i class="${data.icon}"></i> ${data.title}</h2>
                        <p>${data.description}</p>
                    </div>
                    <span class="category-count">${count}</span>
                </div>
                ${projects.length > 0 ? `<div class="projects-grid">${projectsHTML}</div>` : ''}
                ${gamesHTML}
            </div>
        `;
    }

    // =============================================
    // RENDERIZAR TODO
    // =============================================
    const categoriesHTML = Object.entries(projectsData)
        .map(([key, data]) => renderCategory(key, data))
        .join('');
    
    container.innerHTML = categoriesHTML;
    
    // =============================================
    // PROYECTOS DESTACADOS
    // =============================================
    const allProjects = Object.values(projectsData)
        .flatMap(data => data.projects || []);
    const featured = allProjects.filter(p => p.featured);
    const featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid) {
        featuredGrid.innerHTML = featured.map(p => renderProjectCard(p, true)).join('');
    }
    
    // =============================================
    // ACTUALIZAR CONTADORES
    // =============================================
    const totalProjects = document.querySelectorAll('.project-card').length;
    const jsProjects = projectsData.javascript.projects.length;
    const pythonProjects = projectsData.python.projects.length;
    const gamesProjects = projectsData.juegos.games.length;
    
    const totalEl = document.getElementById('totalProjects');
    const jsEl = document.getElementById('jsProjects');
    const pyEl = document.getElementById('pythonProjects');
    const gamesEl = document.getElementById('gamesProjects');
    
    // Animar contadores
    animateCounter(totalEl, totalProjects);
    animateCounter(jsEl, jsProjects);
    animateCounter(pyEl, pythonProjects);
    animateCounter(gamesEl, gamesProjects);
    
    // =============================================
    // REFRESCAR AOS
    // =============================================
    if (typeof AOS !== 'undefined') AOS.refresh();
}

/* ============================================================
   10. ANIMACIÓN DE CONTADOR
   ============================================================ */
function animateCounter(element, target) {
    if (!element || target === undefined || target === null) return;
    
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    function update() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

/* ============================================================
   11. FILTROS DE PROYECTOS (solo proyectos.html)
   ============================================================ */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categoryWrappers = document.querySelectorAll('.category-wrapper');
    
    if (filterBtns.length === 0 || categoryWrappers.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            categoryWrappers.forEach(wrapper => {
                if (filterValue === 'all') {
                    wrapper.style.display = 'block';
                    wrapper.style.animation = 'fadeIn 0.4s ease';
                } else {
                    const category = wrapper.getAttribute('data-category');
                    wrapper.style.display = category === filterValue ? 'block' : 'none';
                }
            });
        });
    });
}

/* ============================================================
   12. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================================
   13. AÑO DINÁMICO EN FOOTER
   ============================================================ */
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }
    
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = currentYear;
    });
}

/* ============================================================
   14. CONSOLA DE BIENVENIDA
   ============================================================ */
function showConsoleWelcome() {
    console.log('%c🚀 Portafolio de Isabel Sterling', 'color: #7C3AED; font-size: 18px; font-weight: bold;');
    console.log('%c📌 Ingeniería de Software con Inteligencia Artificial', 'color: #A855F7; font-size: 14px;');
    console.log('%c💻 GitHub: https://github.com/isabelsterling', 'color: #94A3B8; font-size: 12px;');
    console.log('%c📧 Email: 1663551@senati.pe', 'color: #94A3B8; font-size: 12px;');
    console.log('%c✨ ¡Gracias por visitar mi portafolio!', 'color: #34D399; font-size: 14px; font-weight: bold;');
}

/* ============================================================
   15. RESPETAR prefers-reduced-motion
   ============================================================ */
function initReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.querySelectorAll('[data-aos]').forEach(function(el) {
            el.removeAttribute('data-aos');
        });
    }
}
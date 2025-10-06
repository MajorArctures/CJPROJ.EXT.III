// Carrossel de Depoimentos
class TestimonialCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.carouselTrack = document.getElementById('carouselTrack');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 segundos
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Event listeners para botões
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Pausar autoplay ao hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Iniciar autoplay
        this.startAutoPlay();
        
        // Atualizar controles iniciais
        this.updateControls();
    }
    
    goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.slides.length) return;
        
        // Remover classe active do slide atual
        this.slides[this.currentSlide]?.classList.remove('active');
        this.indicators[this.currentSlide]?.classList.remove('active');
        
        // Atualizar índice atual
        this.currentSlide = slideIndex;
        
        // Adicionar classe active ao novo slide
        this.slides[this.currentSlide]?.classList.add('active');
        this.indicators[this.currentSlide]?.classList.add('active');
        
        // Mover o track
        if (this.carouselTrack) {
            this.carouselTrack.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        
        // Atualizar controles
        this.updateControls();
        
        // Anunciar mudança para leitores de tela
        this.announceSlideChange();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }
    
    updateControls() {
        // Atualizar botões (opcional: desabilitar se necessário)
        if (this.prevBtn) {
            this.prevBtn.disabled = false; // Sempre habilitado para carrossel circular
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = false; // Sempre habilitado para carrossel circular
        }
    }
    
    handleKeyboard(e) {
        // Verificar se o foco está no carrossel
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer?.contains(document.activeElement)) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.slides.length - 1);
                break;
        }
    }
    
    startAutoPlay() {
        this.pauseAutoPlay(); // Limpar qualquer intervalo existente
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    announceSlideChange() {
        // Criar anúncio para leitores de tela
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Depoimento ${this.currentSlide + 1} de ${this.slides.length}`;
        
        document.body.appendChild(announcement);
        
        // Remover após um tempo
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Animações de entrada
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Verificar se Intersection Observer é suportado
        if (!('IntersectionObserver' in window)) {
            // Fallback: mostrar todos os elementos
            this.showAllElements();
            return;
        }
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );
        
        // Observar elementos animáveis
        const animatableElements = document.querySelectorAll(
            '.testimonial-card, .video-item, .video-info, .carousel-container'
        );
        
        animatableElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(element);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateElement(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
    
    showAllElements() {
        const elements = document.querySelectorAll(
            '.testimonial-card, .video-item, .video-info, .carousel-container'
        );
        elements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
}

// Melhorias de acessibilidade para vídeos
class VideoAccessibility {
    constructor() {
        this.init();
    }
    
    init() {
        const videos = document.querySelectorAll('.testimonial-video');
        
        videos.forEach(video => {
            // Adicionar controles personalizados se necessário
            video.addEventListener('loadedmetadata', () => {
                this.setupVideoControls(video);
            });
            
            // Pausar outros vídeos quando um começar a tocar
            video.addEventListener('play', () => {
                this.pauseOtherVideos(video);
            });
        });
    }
    
    setupVideoControls(video) {
        // Adicionar atributos de acessibilidade
        video.setAttribute('aria-label', 'Vídeo depoimento');
        
        // Verificar se há legendas
        const tracks = video.querySelectorAll('track[kind="captions"]');
        if (tracks.length > 0) {
            video.setAttribute('aria-describedby', 'video-caption-info');
        }
    }
    
    pauseOtherVideos(currentVideo) {
        const allVideos = document.querySelectorAll('.testimonial-video');
        allVideos.forEach(video => {
            if (video !== currentVideo && !video.paused) {
                video.pause();
            }
        });
    }
}

// Navegação suave
class SmoothNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        // Adicionar comportamento de scroll suave para links internos
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Focar no elemento de destino para acessibilidade
                    targetElement.focus();
                }
            });
        });
    }
}

// Utilitários de acessibilidade
class AccessibilityUtils {
    constructor() {
        this.init();
    }
    
    init() {
        // Adicionar classe sr-only para elementos apenas para leitores de tela
        this.addScreenReaderOnlyClass();
        
        // Melhorar foco visível
        this.enhanceFocusVisibility();
        
        // Adicionar skip links se necessário
        this.addSkipLinks();
    }
    
    addScreenReaderOnlyClass() {
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            .sr-only:focus {
                position: static;
                width: auto;
                height: auto;
                padding: inherit;
                margin: inherit;
                overflow: visible;
                clip: auto;
                white-space: inherit;
            }
        `;
        document.head.appendChild(style);
    }
    
    enhanceFocusVisibility() {
        // Adicionar indicador de foco mais visível para elementos interativos
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focused');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('focused');
            });
        });
    }
    
    addSkipLinks() {
        // Adicionar link para pular para o conteúdo principal
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 9999;
            background: #000;
            color: #fff;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
        `;
        
        // Mostrar quando focado
        skipLink.addEventListener('focus', () => {
            skipLink.classList.remove('sr-only');
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.classList.add('sr-only');
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Adicionar id ao main se não existir
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main';
            main.setAttribute('tabindex', '-1');
        }
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas as funcionalidades
    new TestimonialCarousel();
    new ScrollAnimations();
    new VideoAccessibility();
    new SmoothNavigation();
    new AccessibilityUtils();
    
    // Adicionar indicador de carregamento concluído
    document.body.classList.add('loaded');
    
    // Log para debug (remover em produção)
    console.log('Página de depoimentos carregada com sucesso!');
});

// Tratamento de erros globais
window.addEventListener('error', (e) => {
    console.error('Erro na página:', e.error);
    // Em produção, você pode enviar erros para um serviço de monitoramento
});

// Otimização de performance
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Tarefas de baixa prioridade podem ser executadas aqui
        console.log('Otimizações de performance aplicadas');
    });
}

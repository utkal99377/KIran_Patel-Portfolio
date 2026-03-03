// ================================================
// KIRAN PATEL - PORTFOLIO JAVASCRIPT
// Interactive Features & Animations
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initCursor();
    initParticles();
    initTypingEffect();
    initSmoothScroll();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initSkillBars();
    init3DTilt();
});

// ================================================
// CUSTOM CURSOR
// ================================================
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        cursor.style.left = cursorX - 5 + 'px';
        cursor.style.top = cursorY - 5 + 'px';
    });
    
    // Smooth follower movement
    const updateFollower = () => {
        followerX += (cursorX - followerX) * 0.1;
        followerY += (cursorY - followerY) * 0.1;
        
        follower.style.left = followerX - 15 + 'px';
        follower.style.top = followerY - 15 + 'px';
        
        requestAnimationFrame(updateFollower);
    };
    updateFollower();
    
    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .certification-card, .education-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            follower.style.transform = 'scale(1.5)';
            follower.style.opacity = '0.8';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
            follower.style.opacity = '0.6';
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '0.6';
    });
}

// ================================================
// PARTICLE BACKGROUND
// ================================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Skip particles on mobile devices for performance
    if (isMobile || isTouchDevice) {
        canvas.style.display = 'none';
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let lastTime = 0;
    let animationFrameId;
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = this.getRandomColor();
        }
        
        getRandomColor() {
            const colors = ['#00d4ff', '#a855f7', '#ec4899', '#3b82f6'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // Create particles with optimized count for performance
    function createParticles() {
        particles = [];
        // Reduce particle count for better performance
        const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 30000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Optimized connections drawing
    function drawConnections() {
        // Only draw connections every other frame for performance
        if (performance.now() - lastTime < 33) return;
        lastTime = performance.now();
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#00d4ff';
                    ctx.globalAlpha = (150 - distance) / 150 * 0.1;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    // Optimized animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        drawConnections();
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
    
    // Recreate particles on resize with debouncing
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            createParticles();
        }, 100);
    });
    
    // Cleanup function
    return function cleanup() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}

// ================================================
// TYPING EFFECT
// ================================================
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = "Hi, I'm Kiran Patel – Frontend Developer | Python & AIML Enthusiast";
    let index = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        if (isDeleting) {
            typingElement.textContent = text.substring(0, index - 1);
            index--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = text.substring(0, index + 1);
            index++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && index === text.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && index === 0) {
            isDeleting = false;
            typingSpeed = 500; // Pause before restart
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing after a short delay
    setTimeout(type, 1000);
}

// ================================================
// SMOOTH SCROLL
// ================================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link, .btn');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only smooth scroll to sections
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ================================================
// NAVBAR SCROLL EFFECT
// ================================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ================================================
// MOBILE MENU
// ================================================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ================================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ================================================
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;
    
    // Mobile detection for optimized scroll behavior
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const observerOptions = {
        threshold: isMobile ? 0.2 : 0.1, // Higher threshold on mobile for better reliability
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
    
    // Add reveal class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
    });
    
    // Trigger initial check with longer delay on mobile
    const delay = isMobile ? 200 : 100;
    setTimeout(() => {
        sections.forEach(section => observer.observe(section));
    }, delay);
    
    // Fallback for mobile devices that might have scroll issues
    if (isMobile) {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    revealElements.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        const isVisible = rect.top < window.innerHeight - 50 && rect.bottom > 50;
                        
                        if (isVisible && !el.classList.contains('active')) {
                            el.classList.add('active');
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// ================================================
// SKILL BARS ANIMATION
// ================================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (skillBars.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const targetWidth = progress.getAttribute('data-progress');
                
                // Animate the skill bar
                setTimeout(() => {
                    progress.style.width = targetWidth + '%';
                }, 200);
                
                // Stop observing after animation
                observer.unobserve(progress);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ================================================
// 3D TILT EFFECT
// ================================================
function init3DTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (tiltElements.length === 0) return;
    
    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Skip tilt effects on mobile devices for better touch experience
    if (isMobile || isTouchDevice) {
        // Add hover effects for touch devices instead
        tiltElements.forEach(element => {
            element.addEventListener('touchstart', handleTouchTilt);
            element.addEventListener('touchend', resetTouchTilt);
            element.addEventListener('touchcancel', resetTouchTilt);
        });
        return;
    }
    
    // Desktop mouse-based tilt effects
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', handle3DTilt);
        element.addEventListener('mouseleave', reset3DTilt);
    });
    
    function handle3DTilt(e) {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        
        // Calculate mouse position relative to element center
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        // Apply transform
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Add glow effect
        element.style.boxShadow = `
            ${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0, 212, 255, 0.2),
            ${rotateY * 2}px ${-rotateX * 2}px 30px rgba(168, 85, 247, 0.2)
        `;
    }
    
    function reset3DTilt(e) {
        const element = e.currentTarget;
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        element.style.boxShadow = '';
    }
    
    // Touch-based effects for mobile
    function handleTouchTilt(e) {
        const element = e.currentTarget;
        element.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg) scale3d(1.02, 1.02, 1.02)';
        element.style.boxShadow = `
            -10px 10px 30px rgba(0, 212, 255, 0.2),
            10px -10px 30px rgba(168, 85, 247, 0.2)
        `;
    }
    
    function resetTouchTilt(e) {
        const element = e.currentTarget;
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        element.style.boxShadow = '';
    }
}

// ================================================
// CONTACT FORM HANDLING
// ================================================


// ================================================
// DOWNLOAD RESUME HANDLER
// ================================================
const downloadBtn = document.getElementById('download-resume');
if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // In production, link to actual resume file
        alert('Please add your resume PDF file path. Update the href in index.html to point to your resume.');
    });
}

// ================================================
// PERFORMANCE OPTIMIZATION
// ================================================

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Lazy load images
const images = document.querySelectorAll('img[data-src]');
if (images.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, {
        threshold: isMobile ? 0.1 : 0.0,
        rootMargin: isMobile ? '50px' : '100px'
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Reduce animations on mobile
if (isMobile || isTouchDevice) {
    document.documentElement.style.setProperty('--transition-medium', '0.1s');
    document.documentElement.style.setProperty('--transition-slow', '0.2s');
    
    // Disable heavy animations on mobile
    const heavyAnimations = document.querySelectorAll('.floating-icons, .hero-bg-mesh');
    heavyAnimations.forEach(el => {
        if (el) {
            el.style.animation = 'none';
            el.style.transition = 'none';
        }
    });
}

// Optimize scroll performance on mobile
if (isMobile) {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Throttle scroll events for better performance
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        }, 10);
    }, { passive: true });
}

// Memory management for animations
if (isMobile) {
    // Reduce animation frequency
    const originalRAF = window.requestAnimationFrame;
    let rafCount = 0;
    window.requestAnimationFrame = function(callback) {
        rafCount++;
        if (rafCount % 2 === 0) { // Skip every other frame on mobile
            return originalRAF.call(window, callback);
        }
        return setTimeout(callback, 16);
    };
}

// ================================================
// ACCESSIBILITY
// ================================================

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// Focus visible for accessibility
const focusableElements = document.querySelectorAll('a, button, input, textarea');
focusableElements.forEach(el => {
    el.addEventListener('focus', () => {
        el.style.outline = '2px solid #00d4ff';
        el.style.outlineOffset = '2px';
    });
    
    el.addEventListener('blur', () => {
        el.style.outline = '';
        el.style.outlineOffset = '';
    });
});

// ================================================
// DEBUG: Log initialization
// ================================================
console.log('✨ Kiran Patel Portfolio - Initialized Successfully!');
console.log('Version: 1.0.0');
console.log('Built with ❤️ using HTML, CSS, and JavaScript');

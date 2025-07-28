// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');

    // Update ARIA attribute
    const isExpanded = navMenu.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isExpanded.toString());
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

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

// Header background on scroll
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }

    lastScrollY = currentScrollY;
});

// Animated counters for statistics
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            if (!counter.classList.contains('animated')) {
                counter.classList.add('animated');
                animateCounter(counter);
            }
        }
    });
}, observerOptions);

// Observe all stat numbers
document.querySelectorAll('.stat-number').forEach(counter => {
    counterObserver.observe(counter);
});

// Donation button
document.querySelectorAll('.donate-desktop, .donate-mobile').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = "https://www.gofundme.com/f/donate-to-sophias-hope-ranch-a-sanctuary-for-families?attribution_id=sl:b7abd3b8-69fd-44a8-8910-bdb8f9b8d409&utm_campaign=donation_cta&utm_medium=button&utm_source=website";
    });
});

// Board Bios
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".board-card").forEach(img => {
        img.addEventListener("click", () => {
            toggleBio(img);
        });
        img.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                toggleBio(img);
                e.preventDefault();
            }
        });
    });
});
const toggleBio = (img) => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const card = img.closest('.board-card');
    if (isMobile) {
        // Mobile accordion style
        document.querySelectorAll('.board-card').forEach(c => {
            if (c !== card) c.classList.remove('open');
        });
        card.classList.toggle('open');
    } else {
        // Desktop: extract bio and show it in a shared container
        const bio = card.querySelector('.board-bio');
        const bioContainer = document.getElementById('board-bio-desktop');
        const isAlreadyOpen = bioContainer.innerHTML === bio.innerHTML && bioContainer.style.display === 'block';
        if (bio && bioContainer) {
            if (isAlreadyOpen) {
                bioContainer.innerHTML = '';
                bioContainer.style.display = 'none';
            } else {
                bioContainer.innerHTML = bio.innerHTML;
                bioContainer.style.display = 'block';
                const boardBioDesktop = document.getElementById('board-bio-desktop');
                if (boardBioDesktop) {
                    setTimeout(() => {
                        const boardBioDesktop = document.getElementById('board-bio-desktop');
                        if (boardBioDesktop) {
                            const offset = -400;
                            const y = boardBioDesktop.getBoundingClientRect().top + window.scrollY + offset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                    }, 0);
                }
            }
        }
    }
};

// Fade in animation for elements
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Apply fade animation to cards and sections
const fadeElements = document.querySelectorAll('.service-card, .program-card, .testimonial-card, .about-text, .about-image');
fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

// Phone validation
document.getElementById("phone").addEventListener("input", function (e) {
    let input = e.target;
    let numbers = input.value.replace(/\D/g, ""); // strip non-digits

    if (numbers.length > 10) numbers = numbers.slice(0, 10); // limit to 10 digits

    let formatted = numbers;

    if (numbers.length > 6) {
        formatted = `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    } else if (numbers.length > 3) {
        formatted = `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length > 0) {
        formatted = `(${numbers}`;
    }

    input.value = formatted;
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Simple form validation
        const requiredFields = ['name', 'email', 'subject', 'message'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = this.querySelector(`[name="${field}"]`);
            if (!formObject[field] || formObject[field].trim() === '') {
                input.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                input.style.borderColor = '#e0e0e0';
            }
        });
        // Phone number validation
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        const phoneInput = this.querySelector('[name="phone"]');
        if (!phoneRegex.test(formObject.phone)) {
            phoneInput.style.borderColor = '#e74c3c';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = this.querySelector('[name="email"]');
        if (!emailRegex.test(formObject.email)) {
            emailInput.style.borderColor = '#e74c3c';
            isValid = false;
        }

        if (isValid) {
            // Construct email
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            let subject = document.getElementById("subject").value.trim();
            subject = `Sophia's Hope Form - ${subject}`
            const message = document.getElementById("message").value.trim();

            const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`);

            const mailtoLink = `mailto:sophiashoperanch@proton.me?subject=${encodeURIComponent(subject)}&body=${body}`;

            window.location.href = mailtoLink;

            // Show success message
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = '#27ae60';
            submitBtn.disabled = true;

            // Reset form after 3 seconds
            setTimeout(() => {
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        } else {
            // Show error message
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Please fill all required fields';
            submitBtn.style.background = '#e74c3c';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 1000);
        }
    });
}

// Keyboard navigation improvements
document.addEventListener('keydown', function (e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
    }
});

// Focus management for mobile menu
navToggle.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
    }
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px 0px'
});

// Observe all images for lazy loading
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Add loading animation
const style = document.createElement('style');
style.textContent = `
  img {
    transition: opacity 0.3s ease;
  }
  img:not(.loaded) {
    opacity: 0.5;
  }
  img.loaded {
    opacity: 1;
  }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handler
const debouncedScrollHandler = debounce(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Accessibility: Announce page changes for screen readers
const announcePageChange = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

// Announce when sections come into view
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('aria-labelledby');
            if (sectionName) {
                const heading = document.getElementById(sectionName);
                if (heading) {
                    announcePageChange(`Now viewing ${heading.textContent} section`);
                }
            }
        }
    });
}, {
    threshold: 0.5
});

// Observe main sections
document.querySelectorAll('section[aria-labelledby]').forEach(section => {
    sectionObserver.observe(section);
});


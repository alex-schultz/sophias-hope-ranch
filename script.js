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

// Footer copyright year, kept current automatically
const copyrightYearEl = document.getElementById('copyright-year');
if (copyrightYearEl) copyrightYearEl.textContent = new Date().getFullYear();

// Board Bios: clicking a card opens the member's photo, name, role, and bio
// in a native <dialog>. The .board-bio markup inside each card is the data
// source and is never displayed directly.
document.addEventListener("DOMContentLoaded", () => {
    const dialog = document.getElementById('board-dialog');
    if (!dialog) return;

    const dialogImg = dialog.querySelector('.dialog-img');
    const dialogName = dialog.querySelector('#board-dialog-name');
    const dialogRole = dialog.querySelector('.dialog-role');
    const dialogBio = dialog.querySelector('.dialog-bio');

    const openBio = (card) => {
        const img = card.querySelector('.board-img');
        const role = card.querySelector('span.accent');
        dialogImg.src = img.src;
        dialogImg.alt = img.alt;
        dialogName.textContent = card.querySelector('h4').textContent;
        dialogRole.textContent = role ? role.textContent : '';
        dialogBio.innerHTML = card.querySelector('.board-bio').innerHTML;
        dialog.showModal();
        dialog.scrollTop = 0;
    };

    document.querySelectorAll('.board-card').forEach(card => {
        card.addEventListener('click', () => openBio(card));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openBio(card);
            }
        });
    });

    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    // The dialog has no padding of its own, so a click whose target is the
    // dialog element can only land on the ::backdrop
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
    });
});

// Fade in animation for elements (starts before entering the viewport so
// fast scrollers never see blank sections; skipped under reduced motion)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0,
    rootMargin: '0px 0px 100px 0px'
});

// Apply fade animation to cards and sections
if (!prefersReducedMotion) {
    const fadeElements = document.querySelectorAll('.service-card, .program-card, .testimonial-card, .about-text, .about-image, .board-card');
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(16px)';
        element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        fadeObserver.observe(element);
    });
}

// Click-to-load YouTube facades: swap the thumbnail button for the real
// iframe only when the visitor asks for it (keeps initial page load light)
document.querySelectorAll('.video-facade').forEach(facade => {
    facade.addEventListener('click', function () {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${this.dataset.videoId}?autoplay=1`;
        iframe.title = (this.getAttribute('aria-label') || 'Video').replace('Play video: ', '');
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        this.replaceWith(iframe);
    });
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

// Form submission handling (Web3Forms)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
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
            const name = formObject.name.trim();
            const email = formObject.email.trim();
            const phone = formObject.phone.trim();
            const subject = `Sophia's Hope Form - ${formObject.subject.trim()}`;
            const message = formObject.message.trim();

            // Mailto fallback in case the submission service is unreachable
            const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:theresa@sophiashoperanch.org?subject=${encodeURIComponent(subject)}&body=${body}`;

            const submitBtn = this.querySelector('button[type="submit"]');
            const statusEl = this.querySelector('.form-status');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
            statusEl.textContent = '';

            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: this.access_key.value,
                        from_name: this.from_name.value,
                        subject: subject,
                        name: name,
                        email: email, // Web3Forms sets the Reply-To from this
                        phone: phone,
                        message: message,
                        botcheck: this.botcheck.checked
                    })
                });
                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.message || 'Submission failed');
                }

                // Show success message
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#27ae60';
                statusEl.textContent = "Thank you! Your message has been sent. We'll be in touch soon.";

                // Reset form after 4 seconds
                setTimeout(() => {
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 4000);
            } catch (err) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                statusEl.textContent = 'Sorry, something went wrong sending your message. ';
                const fallback = document.createElement('a');
                fallback.href = mailtoLink;
                fallback.textContent = 'Click here to email us directly instead.';
                statusEl.appendChild(fallback);
            }
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

// Mailing list signup (MailerLite embedded-form endpoint)
// IDs come from the form's embed snippet action URL:
//   https://assets.mailerlite.com/jsonp/ACCOUNT_ID/forms/FORM_ID/subscribe
// The snippet's email field must stay named "fields[email]". If CORS ever blocks reading
// the response, switch the fetch to { mode: 'no-cors' } and treat submission as success.
const ML_ACCOUNT_ID = '2524205';
const ML_FORM_ID = '193638968839898489';
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[name="email"]');
        const statusEl = this.querySelector('.form-status');
        const submitBtn = this.querySelector('button[type="submit"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.style.borderColor = '#e74c3c';
            statusEl.textContent = 'Please enter a valid email address.';
            return;
        }
        emailInput.style.borderColor = '#e0e0e0';

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing…';
        statusEl.textContent = '';

        const body = new URLSearchParams();
        body.set('fields[email]', emailInput.value.trim());
        body.set('ml-submit', '1');
        body.set('anticsrf', 'true');

        try {
            const res = await fetch(`https://assets.mailerlite.com/jsonp/${ML_ACCOUNT_ID}/forms/${ML_FORM_ID}/subscribe`, {
                method: 'POST',
                body: body
            });
            const data = await res.json();
            if (!data.success) {
                throw new Error('Subscribe failed');
            }

            submitBtn.textContent = 'Subscribed!';
            submitBtn.style.background = '#27ae60';
            statusEl.textContent = 'Thanks for subscribing! Please check your inbox to confirm.';
            this.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 4000);
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            statusEl.textContent = 'Sorry, something went wrong. Please try again later.';
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

// Consolidated DOMContentLoaded handler for donate buttons and flyer viewer
document.addEventListener('DOMContentLoaded', () => {
    // Donate button handler with mobile app detection
    const donateButtons = document.querySelectorAll('.donate-btn');

    donateButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const paymentType = button.getAttribute('data-payment');
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            let url;

            if (paymentType === 'venmo') {
                if (isMobile) {
                    // Try to open Venmo app first, fallback to web
                    url = 'venmo://paycharge?txn=pay&recipients=sophiashoperanch';
                    // Set a timeout to redirect to web version if app doesn't open
                    const webUrl = 'https://www.venmo.com/u/sophiashoperanch';
                    window.location.href = url;
                    setTimeout(() => {
                        window.location.href = webUrl;
                    }, 1500);
                    return;
                } else {
                    // Desktop: open Venmo web
                    url = 'https://www.venmo.com/u/sophiashoperanch';
                }
            } else if (paymentType === 'cashapp') {
                // Cash App URL works universally and opens app on mobile automatically
                url = 'https://cash.app/$sophiashoperanch';
            }

            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
    });

    // Flyer view handler - prevents auto-download on Windows
    const flyerLink = document.querySelector('.view-flyer-link');

    if (flyerLink) {
        flyerLink.addEventListener('click', (e) => {
            // Detect Windows OS
            const isWindows = /Windows/i.test(navigator.userAgent);

            if (isWindows) {
                // Prevent default download behavior on Windows
                e.preventDefault();

                // Open PDF in a new window with specific dimensions
                // This forces the browser to display it rather than download it
                const pdfUrl = flyerLink.getAttribute('href');
                const width = Math.min(1200, window.screen.width * 0.9);
                const height = Math.min(800, window.screen.height * 0.9);
                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2;

                window.open(
                    pdfUrl,
                    'FlyerViewer',
                    `width=${width},height=${height},left=${left},top=${top},toolbar=yes,location=yes,menubar=yes,scrollbars=yes,resizable=yes`
                );
            }
            // For non-Windows systems, let the default behavior work (opens in new tab)
        });
    }
});


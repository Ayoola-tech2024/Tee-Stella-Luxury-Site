// Main JavaScript file for Tee Stella's Fabrics & Stitches website

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeProductFilters();
    initializeProductGalleries();
    initializeTestimonialSlider();
    initializeContactForm();
    initializeScrollAnimations();
    initializeWhatsAppFunctions();
});

// Animation initialization
function initializeAnimations() {
    // Typewriter effect for hero tagline
    if (document.getElementById('typed-tagline')) {
        new Typed('#typed-tagline', {
            strings: ['Where Luxury Meets Perfection', 'Crafting Elegance Since 2019', 'Premium African Fashion'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Navigation functionality
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
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
}

// Product filtering functionality
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');
    const noResults = document.getElementById('no-results');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter products
                let visibleCount = 0;
                products.forEach(product => {
                    const category = product.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        product.style.display = 'block';
                        visibleCount++;
                        
                        // Animate in
                        anime({
                            targets: product,
                            opacity: [0, 1],
                            translateY: [30, 0],
                            duration: 600,
                            delay: visibleCount * 100,
                            easing: 'easeOutQuart'
                        });
                    } else {
                        product.style.display = 'none';
                    }
                });
                
                // Show/hide no results message
                if (noResults) {
                    if (visibleCount === 0) {
                        noResults.classList.remove('hidden');
                    } else {
                        noResults.classList.add('hidden');
                    }
                }
            });
        });
    }
}

// Product gallery functionality
function initializeProductGalleries() {
    const galleries = document.querySelectorAll('.product-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('.gallery-image');
        const prevBtn = gallery.querySelector('.gallery-nav.prev');
        const nextBtn = gallery.querySelector('.gallery-nav.next');
        const imagesContainer = gallery.querySelector('.gallery-images');
        
        if (images.length > 1 && prevBtn && nextBtn && imagesContainer) {
            let currentIndex = 0;
            
            function updateGallery() {
                const offset = -currentIndex * 100;
                imagesContainer.style.transform = `translateX(${offset}%)`;
            }
            
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateGallery();
            });
            
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % images.length;
                updateGallery();
            });
            
            // Auto-advance gallery
            setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                updateGallery();
            }, 4000);
        }
    });
}

// Testimonial slider initialization
function initializeTestimonialSlider() {
    const testimonialSlider = document.getElementById('testimonial-slider');
    
    if (testimonialSlider) {
        new Splide('#testimonial-slider', {
            type: 'loop',
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            arrows: false,
            pagination: true,
            gap: '2rem',
            breakpoints: {
                768: {
                    gap: '1rem'
                }
            }
        }).mount();
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!data.name || !data.email || !data.subject || !data.message) {
                showMessage(errorMessage, 'Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // In a real implementation, you would send this to your backend
                console.log('Form submission:', data);
                
                // Show success message
                showMessage(successMessage, 'Thank you for your message! We\'ll get back to you within 24 hours.');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    function showMessage(messageElement, text) {
        messageElement.textContent = text;
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// WhatsApp integration functions
function initializeWhatsAppFunctions() {
    // WhatsApp floating button is already handled in HTML
    // Additional WhatsApp functions can be added here
}

// Global WhatsApp functions for product ordering
function openWhatsApp(productName, price, imageUrl) {
    const message = `Hello Tee Stella's, I'm interested in this product.

Product: ${productName}
Price: ₦${parseInt(price).toLocaleString()}
Picture: ${imageUrl}

Please confirm availability.`;
    
    const whatsappUrl = `https://wa.me/2347034931255?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Global WhatsApp function for bespoke orders
function openBespokeWhatsApp(packageName) {
    const message = `Hello Tee Stella's, I'm interested in your ${packageName} package.

I'd like to discuss:
- Design preferences
- Measurements
- Timeline
- Fabric options

Please contact me to begin the consultation process.`;
    
    const whatsappUrl = `https://wa.me/2347034931255?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Utility functions
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

// Add loading states and error handling
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #FDF9F4;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    loader.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 60px; height: 60px; border: 4px solid #D4AF37; border-top: 4px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <div style="font-family: 'Playfair Display', serif; font-size: 18px; color: #D4AF37;">Loading...</div>
        </div>
    `;
    
    document.body.appendChild(loader);
    
    // Remove loader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
    
    // Add CSS for spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

// Error handling for missing elements
function safeQuerySelector(selector, callback) {
    const element = document.querySelector(selector);
    if (element && callback) {
        callback(element);
    }
    return element;
}

function safeQuerySelectorAll(selector, callback) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0 && callback) {
        callback(elements);
    }
    return elements;
}

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizeImages);

// Console welcome message
console.log(`
👗 Welcome to Tee Stella's Fabrics & Stitches! 
🌟 Where Luxury Meets Perfection
📱 Contact: +234 703 493 1255
✉️ Email: olutadehormololar@gmail.com

Built with ❤️ and attention to detail.
`);

// Export functions for global access
window.openWhatsApp = openWhatsApp;
window.openBespokeWhatsApp = openBespokeWhatsApp;
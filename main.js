// ==========================================================================
// Tee Stella's Fabrics & Stitches — Core JavaScript Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeAnimations();
    initializeProductFilters();
    initializeProductGalleries();
    initializeTestimonialSlider();
    initializeContactForm();
    initializeScrollAnimations();
});

// --------------------------------------------------------------------------
// 1. Navigation Management
// --------------------------------------------------------------------------
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking any nav link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.classList.add('hidden');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Smooth scrolling for in-page anchors
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// --------------------------------------------------------------------------
// 2. Typewriter & Micro-animations
// --------------------------------------------------------------------------
function initializeAnimations() {
    const taglineElement = document.getElementById('typed-tagline');
    if (taglineElement && typeof Typed !== 'undefined') {
        new Typed('#typed-tagline', {
            strings: [
                'Where Luxury Meets Perfection',
                'Stay Classic with the Touch of Tee Stella\'s',
                'Fashion Is Life — Bespoke & RTW African Couture',
                'Crafting Elegance Since 2019'
            ],
            typeSpeed: 45,
            backSpeed: 25,
            backDelay: 2200,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// --------------------------------------------------------------------------
// 3. Product Filtering, Live Search & Sorting (Catalogue)
// --------------------------------------------------------------------------
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const noResults = document.getElementById('no-results');

    if (!productsGrid) return;

    let activeCategory = 'all';
    let searchQuery = '';
    let currentSort = 'default';

    function applyFilters() {
        const products = Array.from(productsGrid.querySelectorAll('.product-card'));
        let visibleCount = 0;

        products.forEach(product => {
            const category = (product.getAttribute('data-category') || '').toLowerCase();
            const name = (product.getAttribute('data-name') || product.querySelector('h3')?.textContent || '').toLowerCase();
            const description = (product.querySelector('p')?.textContent || '').toLowerCase();

            const matchesCategory = (activeCategory === 'all' || category === activeCategory);
            const matchesSearch = !searchQuery || name.includes(searchQuery) || description.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                product.style.display = '';
                product.classList.add('visible');
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });

        // Apply sorting to visible products
        if (currentSort !== 'default') {
            const sortedProducts = products.sort((a, b) => {
                const priceA = parseFloat(a.getAttribute('data-price')) || 0;
                const priceB = parseFloat(b.getAttribute('data-price')) || 0;
                const nameA = (a.getAttribute('data-name') || '').toLowerCase();
                const nameB = (b.getAttribute('data-name') || '').toLowerCase();

                if (currentSort === 'price-low') return priceA - priceB;
                if (currentSort === 'price-high') return priceB - priceA;
                if (currentSort === 'name-asc') return nameA.localeCompare(nameB);
                if (currentSort === 'name-desc') return nameB.localeCompare(nameA);
                return 0;
            });

            sortedProducts.forEach(prod => productsGrid.appendChild(prod));
        }

        // Toggle No-Results notification
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }
    }

    // Category Buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            activeCategory = (this.getAttribute('data-filter') || 'all').toLowerCase();
            applyFilters();
        });
    });

    // Search Input
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function (e) {
            searchQuery = e.target.value.trim().toLowerCase();
            applyFilters();
        }, 200));
    }

    // Sort Dropdown
    if (sortSelect) {
        sortSelect.addEventListener('change', function (e) {
            currentSort = e.target.value;
            applyFilters();
        });
    }
}

// --------------------------------------------------------------------------
// 4. Product Gallery Carousel (Controlled & Non-Conflicting)
// --------------------------------------------------------------------------
function initializeProductGalleries() {
    const galleries = document.querySelectorAll('.product-gallery');

    galleries.forEach(gallery => {
        const imagesContainer = gallery.querySelector('.gallery-images');
        const images = gallery.querySelectorAll('.gallery-image');
        const prevBtn = gallery.querySelector('.gallery-nav.prev');
        const nextBtn = gallery.querySelector('.gallery-nav.next');

        if (!imagesContainer || images.length <= 1) return;

        let currentIndex = 0;
        let hoverInterval = null;

        // Render dot indicators
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'gallery-dots';
        images.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = `gallery-dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(idx);
            });
            dotsContainer.appendChild(dot);
        });
        gallery.appendChild(dotsContainer);

        function updateGallery() {
            imagesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = dotsContainer.querySelectorAll('.gallery-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = (index + images.length) % images.length;
            updateGallery();
        }

        if (prevBtn) {
            prevBtn.setAttribute('aria-label', 'Previous image');
            prevBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                goToSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.setAttribute('aria-label', 'Next image');
            nextBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                goToSlide(currentIndex + 1);
            });
        }

        // Only auto-slide when hovered, stopping on mouse leave
        gallery.addEventListener('mouseenter', function () {
            hoverInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 3000);
        });

        gallery.addEventListener('mouseleave', function () {
            if (hoverInterval) {
                clearInterval(hoverInterval);
                hoverInterval = null;
            }
        });
    });
}

// --------------------------------------------------------------------------
// 5. Testimonial Carousel (Splide.js)
// --------------------------------------------------------------------------
function initializeTestimonialSlider() {
    const testimonialSlider = document.getElementById('testimonial-slider');

    if (testimonialSlider && typeof Splide !== 'undefined') {
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

// --------------------------------------------------------------------------
// 6. Contact Form (Direct WhatsApp & Live Submission Option)
// --------------------------------------------------------------------------
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        if (!data.name || !data.email || !data.subject || !data.message) {
            showMessage(errorMessage, 'Please fill in all required fields.');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Construct message for instant WhatsApp forwarding
        const formattedMsg = `*New Inquiry via Website*\n\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Phone:* ${data.phone || 'N/A'}\n*Subject:* ${data.subject}\n\n*Message:*\n${data.message}`;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            contactForm.reset();

            showMessage(successMessage, 'Thank you for your message! Opening WhatsApp to connect directly with our atelier...');

            // Forward to WhatsApp with prefilled message
            const waUrl = `https://wa.me/2347034931255?text=${encodeURIComponent(formattedMsg)}`;
            window.open(waUrl, '_blank');
        }, 800);
    });

    function showMessage(element, text) {
        if (!element) return;
        element.textContent = text;
        element.style.display = 'block';

        setTimeout(() => {
            element.style.display = 'none';
        }, 6000);
    }
}

// --------------------------------------------------------------------------
// 7. Scroll Animations (IntersectionObserver)
// --------------------------------------------------------------------------
function initializeScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// --------------------------------------------------------------------------
// 8. WhatsApp Order Helpers
// --------------------------------------------------------------------------
function openWhatsApp(productName, price, imageUrl) {
    const numPrice = parseInt(price, 10);
    const formattedPrice = isNaN(numPrice) ? price : `₦${numPrice.toLocaleString()}`;

    // Resolve relative URL to absolute URL if needed
    let fullImageUrl = imageUrl;
    if (imageUrl && !imageUrl.startsWith('http')) {
        fullImageUrl = `${window.location.origin}/${imageUrl.replace(/^\//, '')}`;
    }

    const message = `Hello Tee Stella's,\n\nI am interested in ordering this piece:\n\n*Product:* ${productName}\n*Price:* ${formattedPrice}\n*Item Reference:* ${fullImageUrl}\n\nPlease confirm availability and sizing options.`;

    const whatsappUrl = `https://wa.me/2347034931255?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function openBespokeWhatsApp(packageName) {
    const message = `Hello Tee Stella's Atelier,\n\nI am interested in your *${packageName}* package.\n\nI would like to discuss:\n- Design concept & preferences\n- Measurements & fitting schedule\n- Fabric selection & production timeline\n\nPlease let me know when we can schedule our consultation.`;

    const whatsappUrl = `https://wa.me/2347034931255?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// --------------------------------------------------------------------------
// 9. Utilities
// --------------------------------------------------------------------------
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Global exposure for inline onclick handlers
window.openWhatsApp = openWhatsApp;
window.openBespokeWhatsApp = openBespokeWhatsApp;

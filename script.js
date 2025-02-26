document.addEventListener('DOMContentLoaded', () => {
    // Enable smooth scrolling globally
    document.documentElement.style.scrollBehavior = 'smooth';

    // =============== PAGE LOAD ===============
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
        scrollFunction(); // Call on load to set initial state

        // Add fade-in effect to headings
        setupHeadingFadeEffects();
    });

    // =========== Mobile Menu Toggle ===========
    const menuBtn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.nav-links');
    const menuLinks = document.querySelectorAll('.nav-links li a');

    menuBtn?.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        menu?.classList.toggle('active');
    });

    menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            menuBtn?.classList.remove('active');
            menu?.classList.remove('active');
        });
    });

    // =========== Home Section Scroll Effect ===========
    const homeSection = document.querySelector('.home');
    const scrollFunction = () => {
        homeSection?.classList.toggle('active', window.scrollY > 60);
    };

    window.addEventListener('scroll', scrollFunction);

    // =========== CV Download ===========
    const downloadBtn = document.getElementById('downloadCV');
    downloadBtn?.addEventListener('click', function () {
        const pdfUrl = './assets/azmarifCV.pdf';

        fetch(pdfUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = "A. Z. M. Arif's CV.pdf";
                link.click();
                URL.revokeObjectURL(link.href); // Free up memory
            })
            .catch((err) => console.error('Download failed:', err));
    });

    // Portfolio Section Starts
    // =============== FILTER GALLERY ===============
    const setupGallery = () => {
        const $gallery = $('.gallery');
        if (!$gallery.length) return;

        const imgLoad = imagesLoaded($gallery);

        imgLoad.on('always', function () {
            const $galleryContainer = $gallery.isotope({
                itemSelector: '.item',
                layoutMode: 'fitRows',
            });

            $('.button-group .button').on('click', function () {
                $('.button-group .button').removeClass('active');
                $(this).addClass('active');
                const value = $(this).attr('data-filter');
                $galleryContainer.isotope({
                    filter: value,
                });
            });

            // Delayed layout refresh
            setTimeout(() => $galleryContainer.isotope('layout'), 1000);
        });

        // =============== MAGNIFIC POPUP WITH IFRAME ===============
        $gallery.magnificPopup({
            delegate: '.overlay a',
            type: 'iframe',
            gallery: {
                enabled: false,
            },
            callbacks: {
                open: function () {
                    const popupInstance = $.magnificPopup.instance;
                    const currentUrl = popupInstance.currItem.src;

                    // Create link button
                    const openTabBtn = $(`<a href="${currentUrl}" target="_blank" class="mfp-open-tab">🔗</a>`);

                    openTabBtn.on('click', function (e) {
                        e.preventDefault();
                        window.open(currentUrl, '_blank').focus();
                        $.magnificPopup.close();
                    });

                    $('.mfp-content').append(openTabBtn);
                },
            },
        });
    };

    // Call gallery setup
    setupGallery();

    // Testimonials Section Starts
    const setupTestimonials = () => {
        const $testimonials = $('.testimonials-container');
        if (!$testimonials.length) return;

        $testimonials.owlCarousel({
            loop: true,
            autoplay: true,
            autoplayTimeout: 6000, // Fixed the property name (autoplayTime -> autoplayTimeout)
            margin: 10,
            nav: true,
            navText: ["<i class='fa-solid fa-arrow-left'></i>", "<i class='fa-solid fa-arrow-right'></i>"],
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                },
                600: {
                    items: 1,
                    nav: true,
                },
                768: {
                    items: 2,
                },
            },
        });
    };

    // Call testimonials setup
    setupTestimonials();

    // =========== Contact Form Submission ===========
    const setupContactForm = () => {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        // Add CSS for the spinner
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255,255,255,.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
                margin-left: 10px;
                vertical-align: middle;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .btn-disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitButton = contactForm.querySelector('button[type="submit"]');

            if (!nameInput || !emailInput || !messageInput || !submitButton) return;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Email validation regex
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!name || !email || !message) {
                showToast('⚠️ Complete all the fields!', 'error');
                return;
            }

            if (!emailPattern.test(email)) {
                showToast('❌ Please give a valid email address!', 'error');
                return;
            }

            // Save original button text
            const originalButtonText = submitButton.innerHTML;

            // Add spinner and disable button
            submitButton.classList.add('btn-disabled');
            submitButton.disabled = true;

            // Create spinner element
            const spinner = document.createElement('span');
            spinner.className = 'spinner';

            // Update button text and add spinner
            submitButton.innerHTML = 'Sending... ';
            submitButton.appendChild(spinner);

            // Use EmailJS to send email
            emailjs
                .send('portfolio-service', 'portfolio-template', {
                    from_name: name,
                    from_email: email,
                    message: message,
                })
                .then(
                    function (response) {
                        // Show success toast
                        showToast('✅ Your email has been sent, get the answer soon!', 'success');

                        // Clear form fields
                        nameInput.value = '';
                        emailInput.value = '';
                        messageInput.value = '';

                        // Scroll to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    },
                    function (error) {
                        console.error('Email sending failed:', error);
                        showToast('❌ Sorry, the email could not be sent. Try again later!', 'error');
                    },
                )
                .finally(() => {
                    // Restore button to original state regardless of success/failure
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('btn-disabled');
                });
        });
    };

    // Call contact form setup
    setupContactForm();

    // Toast Notification Function
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.textContent = message;

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            color: 'white',
            fontSize: '14px',
            opacity: '1',
            transition: 'opacity 0.5s ease-in-out',
            background: type === 'success' ? '#05555c' : '#F57F17',
        });

        document.body.appendChild(toast);

        // Auto remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // =========== Lazy Loading Images ===========
    const setupLazyLoading = () => {
        const lazyImages = document.querySelectorAll('img.lazy-image');
        if (!lazyImages.length) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach((img) => imageObserver.observe(img));
    };

    // Call lazy loading setup
    setupLazyLoading();

    // =========== NEW FEATURE: Heading Fade-In Effects ===========
    const setupHeadingFadeEffects = () => {
        // Add styles for fade-in animation
        const style = document.createElement('style');
        style.textContent = `
            .fade-in-heading {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            .fade-in-heading.visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);

        // Get all section headings
        const headings = document.querySelectorAll('h1, h2, h3, .section-title');

        headings.forEach((heading) => {
            heading.classList.add('fade-in-heading');
        });

        // Create intersection observer for headings
        const headingObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        headingObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 },
        );

        // Observe each heading
        headings.forEach((heading) => {
            headingObserver.observe(heading);
        });
    };

    // =========== NEW FEATURE: Scroll To Top Button ===========
    const setupScrollToTopButton = () => {
        // Create the scroll to top button
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');

        // Style the button
        Object.assign(scrollTopBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#05555c',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'none',
            fontSize: '20px',
            zIndex: '99',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
        });

        // Hover effect
        scrollTopBtn.addEventListener('mouseover', () => {
            scrollTopBtn.style.backgroundColor = '#044a50';
            scrollTopBtn.style.transform = 'translateY(-3px)';
        });

        scrollTopBtn.addEventListener('mouseout', () => {
            scrollTopBtn.style.backgroundColor = '#05555c';
            scrollTopBtn.style.transform = 'translateY(0)';
        });

        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'block';
                scrollTopBtn.style.opacity = '1';
            } else {
                scrollTopBtn.style.opacity = '0';
                setTimeout(() => {
                    if (window.scrollY <= 300) {
                        scrollTopBtn.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Add click event
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Add to document
        document.body.appendChild(scrollTopBtn);
    };

    // Call scroll to top button setup
    setupScrollToTopButton();

    // =========== NEW FEATURE: Scroll Progress Bar ===========
    const setupScrollProgressBar = () => {
        // Create progress bar element
        const progressBar = document.createElement('div');

        // Style the progress bar
        Object.assign(progressBar.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            height: '3px',
            backgroundColor: '#05555c',
            width: '0%',
            transition: 'width 0.1s',
            zIndex: '1000',
        });

        // Add to document
        document.body.appendChild(progressBar);

        // Update progress bar width on scroll
        window.addEventListener('scroll', () => {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    };

    // Call scroll progress bar setup
    setupScrollProgressBar();

    // =========== NEW FEATURE: Offline Detection ===========
    const setupOfflineDetection = () => {
        // Add CSS for offline notification
        const style = document.createElement('style');
        style.textContent = `
            .offline-notification {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                padding: 10px;
                background-color: #F57F17;
                color: white;
                text-align: center;
                font-weight: bold;
                z-index: 10000;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            }
            .offline-notification.visible {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);

        // Create offline notification element
        const offlineNotification = document.createElement('div');
        offlineNotification.className = 'offline-notification';
        offlineNotification.textContent = '🔌 You are currently offline. Some features may not work properly.';

        // Add to document
        document.body.appendChild(offlineNotification);

        // Check online status and show/hide notification
        const updateOnlineStatus = () => {
            if (navigator.onLine) {
                offlineNotification.classList.remove('visible');
                showToast('✅ You are back online!', 'success');
            } else {
                offlineNotification.classList.add('visible');
            }
        };

        // Add event listeners for online/offline events
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // Initial check
        updateOnlineStatus();
    };

    // Call offline detection setup
    setupOfflineDetection();
});

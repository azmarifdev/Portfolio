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
    const scrollProgressBar = document.querySelector('.scroll-progress');

    const scrollFunction = () => {
        homeSection?.classList.toggle('active', window.scrollY > 60);

        // Update scroll progress bar
        if (scrollProgressBar) {
            const scrollTop = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollTop / documentHeight) * 100;
            scrollProgressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
        }
    };

    window.addEventListener('scroll', scrollFunction);

    // =========== Hero Motion ===========
    const setupHeroMotion = () => {
        const hero = document.querySelector('.hero');
        if (!hero || window.innerWidth < 992) return;

        const motionItems = hero.querySelectorAll('[data-depth]');
        const heroImage = hero.querySelector('.hero-image');
        const heroOrbits = hero.querySelectorAll('.hero-orbit');

        const updateHeroMotion = (event) => {
            const rect = hero.getBoundingClientRect();
            const offsetX = event.clientX - rect.left - rect.width / 2;
            const offsetY = event.clientY - rect.top - rect.height / 2;

            motionItems.forEach((item) => {
                const depth = Number(item.dataset.depth || 10);
                const moveX = (offsetX / rect.width) * depth;
                const moveY = (offsetY / rect.height) * depth;
                item.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            if (heroImage) {
                heroImage.style.transform = `rotate(40deg) translate(${offsetX * 0.015}px, ${offsetY * 0.01}px)`;
            }

            heroOrbits.forEach((orbit, index) => {
                const amount = index === 0 ? 10 : 16;
                orbit.style.transform = `translate(${offsetX / amount}px, ${offsetY / amount}px)`;
            });
        };

        window.addEventListener('mousemove', updateHeroMotion);

        window.addEventListener('blur', () => {
            motionItems.forEach((item) => {
                item.style.transform = '';
            });

            if (heroImage) {
                heroImage.style.transform = 'rotate(40deg)';
            }

            heroOrbits.forEach((orbit) => {
                orbit.style.transform = '';
            });
        });
    };

    setupHeroMotion();

    // =========== CV Download ===========
    const downloadBtn = document.getElementById('downloadCV');
    downloadBtn?.addEventListener('click', function () {
        const pdfUrl = './assets/A.%20Z.%20M.%20ARIF_RESUME.pdf';

        fetch(pdfUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'A. Z. M. ARIF_RESUME.pdf';
                link.click();
                URL.revokeObjectURL(link.href); // Free up memory
            })
            .catch((err) => console.error('Download failed:', err));
    });

    // Portfolio Section Starts
    const appendPopupControls = (targetUrl) => {
        const $content = $('.mfp-content');
        $content.find('.mfp-open-tab, .mfp-custom-close').remove();

        const openTabBtn = $(
            `<a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="mfp-open-tab" aria-label="Open in new tab">Open in new tab</a>`
        );

        const closeBtn = $(
            '<button type="button" class="mfp-custom-close" aria-label="Close modal">Close</button>'
        );

        openTabBtn.on('click', function (e) {
            e.preventDefault();
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
            $.magnificPopup.close();
        });

        closeBtn.on('click', function () {
            $.magnificPopup.close();
        });

        $content.append(openTabBtn, closeBtn);
    };

    const openIframePopup = (previewUrl, openUrl, popupClass = '') => {
        if (!previewUrl || typeof $.magnificPopup?.open !== 'function') return;

        $.magnificPopup.open({
            items: {
                src: previewUrl,
            },
            type: 'iframe',
            mainClass: popupClass,
            callbacks: {
                open: function () {
                    const targetUrl = openUrl || previewUrl;
                    appendPopupControls(targetUrl);
                },
            },
        });
    };

    // =============== FILTER GALLERY ===============
    const setupGallery = () => {
        const $gallery = $('.gallery');
        if (!$gallery.length) return;

        const blockedIframeHosts = [
            'github.com',
            'www.github.com',
            'marketplace.visualstudio.com',
            'npmjs.com',
            'www.npmjs.com',
        ];

        const showBlockedPreviewNotice = (url) => {
            const existingNotice = document.querySelector('.project-open-notice');
            if (existingNotice) {
                existingNotice.remove();
            }

            const notice = document.createElement('div');
            notice.className = 'project-open-notice';
            notice.innerHTML = `
                <p>
                    This website does not allow iframe previews. I opened it in a new tab for you.
                    You can close the modal now if you want.
                </p>
                <div class="project-open-notice-actions">
                    <button type="button" class="project-open-notice-modal-close" aria-label="Close modal">Close Modal</button>
                </div>
            `;

            const closeNotice = () => {
                notice.classList.remove('show');
                setTimeout(() => notice.remove(), 220);
            };

            notice.querySelector('.project-open-notice-modal-close')?.addEventListener('click', () => {
                if (typeof $.magnificPopup?.close === 'function') {
                    $.magnificPopup.close();
                }
                closeNotice();
            });
            document.body.appendChild(notice);

            requestAnimationFrame(() => {
                notice.classList.add('show');
            });

            if (url) {
                notice.setAttribute('data-opened-url', url);
            }
        };

        const shouldOpenInNewTabOnly = (url) => {
            if (!url) return false;

            try {
                const parsedUrl = new URL(url, window.location.origin);
                return blockedIframeHosts.includes(parsedUrl.hostname);
            } catch (error) {
                return false;
            }
        };

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
        });

        // =============== MAGNIFIC POPUP WITH IFRAME ===============
        $gallery.magnificPopup({
            delegate: '.overlay a',
            type: 'iframe',
            mainClass: 'project-popup',
            gallery: {
                enabled: false,
            },
            callbacks: {
                beforeOpen: function () {
                    const clickedUrl = this.st.el?.attr('href');

                    if (!shouldOpenInNewTabOnly(clickedUrl)) return true;

                    window.open(clickedUrl, '_blank', 'noopener,noreferrer');
                    showBlockedPreviewNotice(clickedUrl);
                    return false;
                },
                open: function () {
                    const popupInstance = $.magnificPopup.instance;
                    const currentUrl = popupInstance.currItem.src;
                    appendPopupControls(currentUrl);
                },
            },
        });

    };

    // Call gallery setup
    setupGallery();

    const setupCertificateModal = () => {
        $(document).on('click', '.course-view-btn[data-certificate-url]', function (event) {
            event.preventDefault();

            const previewUrl = this.dataset.certificateUrl;
            const openUrl = previewUrl ? previewUrl.replace('/preview', '/view') : '';

            openIframePopup(previewUrl, openUrl, 'certificate-popup');
        });
    };

    setupCertificateModal();

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
        const contactSection = document.getElementById('contactForm');
        if (!contactSection) return;

        const contactForm = contactSection.querySelector('.form-2');
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
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            Object.assign(toastContainer.style, {
                position: 'fixed',
                bottom: 'max(16px, env(safe-area-inset-bottom))',
                right: 'max(16px, env(safe-area-inset-right))',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                zIndex: '2147483647',
                pointerEvents: 'none',
            });
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.textContent = message;

        Object.assign(toast.style, {
            maxWidth: 'min(92vw, 360px)',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            color: 'white',
            fontSize: '14px',
            opacity: '1',
            lineHeight: '1.4',
            transform: 'translateY(-6px)',
            transition: 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out',
            background: type === 'success' ? '#05555c' : '#F57F17',
        });

        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
        });

        // Auto remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-6px)';
            setTimeout(() => toast.remove(), 420);
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
        const updateOnlineStatus = (notifyOnline = false) => {
            if (navigator.onLine) {
                offlineNotification.classList.remove('visible');
                if (notifyOnline) {
                    showToast('✅ You are back online!', 'success');
                }
            } else {
                offlineNotification.classList.add('visible');
            }
        };

        // Add event listeners for online/offline events
        window.addEventListener('online', () => updateOnlineStatus(true));
        window.addEventListener('offline', () => updateOnlineStatus(false));

        // Initial check
        updateOnlineStatus(false);
    };

    // Call offline detection setup
    setupOfflineDetection();

    // =========== Scroll Reveal Animation ===========
    const setupScrollReveal = () => {
        const revealElements = document.querySelectorAll('.achievement-card, .contact-info-card');

        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            },
        );

        revealElements.forEach((element) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(element);
        });
    };

    // Call scroll reveal setup
    setupScrollReveal();

    // =========== Professional Skills Animation ===========
    const setupProfessionalSkillsAnimation = () => {
        const skillDomains = document.querySelectorAll('.skill-domain');

        const skillsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
                        entry.target.classList.add('animate');

                        // Animate the domain with delay
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 200);

                        // Animate progress bar
                        const progressBar = entry.target.querySelector('.progress-line[data-percent]');
                        if (progressBar) {
                            const percent = progressBar.getAttribute('data-percent');
                            
                            setTimeout(() => {
                                progressBar.style.setProperty('--progress-width', `${percent}%`);
                                progressBar.style.width = `${percent}%`;
                                progressBar.classList.add('animate');
                            }, (index * 200) + 400);
                        }

                        // Animate tech badges
                        const techBadges = entry.target.querySelectorAll('.tech-badge');
                        techBadges.forEach((badge, badgeIndex) => {
                            setTimeout(() => {
                                badge.style.opacity = '1';
                                badge.style.transform = 'translateY(0) scale(1)';
                            }, (index * 200) + 600 + (badgeIndex * 100));
                        });
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px',
            },
        );

        // Set initial styles for animation
        skillDomains.forEach((domain) => {
            domain.style.opacity = '0';
            domain.style.transform = 'translateY(30px)';
            domain.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            const techBadges = domain.querySelectorAll('.tech-badge');
            techBadges.forEach((badge) => {
                badge.style.opacity = '0';
                badge.style.transform = 'translateY(20px) scale(0.95)';
                badge.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            });
        });

        // Observe skill domains
        skillDomains.forEach((domain) => {
            skillsObserver.observe(domain);
        });
    };

    // Call professional skills animation setup
    setupProfessionalSkillsAnimation();

    // =========== Tech Stack Hover Effects ===========
    const setupTechStackInteractions = () => {
        const techItems = document.querySelectorAll('.tech-item');

        techItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                const category = item.getAttribute('data-category');

                // Highlight related items
                techItems.forEach((otherItem) => {
                    if (otherItem.getAttribute('data-category') === category) {
                        otherItem.style.borderColor = 'var(--links-clr)';
                        otherItem.style.background = 'var(--primary-light-clr)';
                    } else {
                        otherItem.style.opacity = '0.6';
                    }
                });
            });

            item.addEventListener('mouseleave', () => {
                techItems.forEach((otherItem) => {
                    otherItem.style.borderColor = '';
                    otherItem.style.background = '';
                    otherItem.style.opacity = '';
                });
            });
        });
    };

    // Call tech stack interactions setup
    setupTechStackInteractions();
});

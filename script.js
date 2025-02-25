document.addEventListener('DOMContentLoaded', function () {
    // Enable smooth scrolling globally
    document.documentElement.style.scrollBehavior = 'smooth';

    // =============== PAGE LOAD হলে স্ক্রল টপে সেট করো ===============
    window.onload = function () {
        window.scrollTo(0, 0);
    };

    // =========== Mobile Menu Toggle ===========
    const menuBtn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.nav-links');
    const menuLinks = document.querySelectorAll('.nav-links li a');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        menu.classList.toggle('active');
    });

    menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            menu.classList.remove('active');
        });
    });

    // =========== Home Section Scroll Effect ===========
    const homeSection = document.querySelector('.home');
    const scrollFunction = () => {
        homeSection.classList.toggle('active', window.scrollY > 60);
    };

    window.addEventListener('scroll', scrollFunction);
    window.addEventListener('load', scrollFunction);

    // =========== CV Download ===========
    document.getElementById('downloadCV').addEventListener('click', function () {
        const pdfUrl = './assets/azmarifCV.pdf';
        fetch(pdfUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = "A. Z. M. Arif's CV.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    });

    // Portfolio Section Starts
    // =============== FILTER GALLERY ===============
    let $galleryContainer = $('.gallery').isotope({
        itemSelector: '.item',
        layoutMode: 'fitRows',
    });

    $('.button-group .button').on('click', function () {
        $('.button-group .button').removeClass('active');
        $(this).addClass('active');

        let value = $(this).attr('data-filter');
        $galleryContainer.isotope({
            filter: value,
        });
    });

    // =============== MAGNIFIC POPUP WITH IFRAME ===============
    $('.gallery').magnificPopup({
        delegate: '.overlay a',
        type: 'iframe',
        gallery: {
            enabled: false,
        },
        callbacks: {
            open: function () {
                let popupInstance = $.magnificPopup.instance;
                let currentUrl = popupInstance.currItem.src;

                // 🔗
                let openTabBtn = $('<a href="' + currentUrl + '" target="_blank" class="mfp-open-tab">🔗</a>');

                openTabBtn.on('click', function (e) {
                    e.preventDefault();
                    window.open(currentUrl, '_blank').focus();
                    $.magnificPopup.close();
                });

                $('.mfp-content').append(openTabBtn);
            },
        },
    });

    // Portfolio Section Ends

    // Testimonials Section Starts
    $('.testimonials-container').owlCarousel({
        loop: true,
        autoplay: true,
        autoplayTime: 6000,
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

    // =========== Contact Form Submission ===========
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Email validation regex
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!name || !email || !message) {
            showToast('⚠️ সবগুলো ফিল্ড পূরণ করুন!', 'error');
            return;
        }

        if (!emailPattern.test(email)) {
            showToast('❌ অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা দিন!', 'error');
            return;
        }

        // Use EmailJS to send email
        emailjs
            .send('portfolio-service', 'portfolio-template', {
                from_name: name,
                from_email: email,
                message: message,
            })
            .then(
                function (response) {
                    console.log('SUCCESS!', response.status, response.text);

                    // Show success toast
                    showToast('✅ আপনার ইমেইল পাঠানো হয়েছে, শীঘ্রই উত্তর পাবেন!', 'success');

                    // Clear form fields manually
                    nameInput.value = '';
                    emailInput.value = '';
                    messageInput.value = '';

                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
                function (error) {
                    console.log('FAILED...', error);

                    // Show error toast
                    showToast('❌ দুঃখিত, ইমেইল পাঠানো যায়নি। পরে আবার চেষ্টা করুন!', 'error');
                },
            );
    });

    // Toast Notification Function
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '12px 16px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        toast.style.color = 'white';
        toast.style.fontSize = '14px';
        toast.style.opacity = '1';
        toast.style.transition = 'opacity 0.5s ease-in-out';

        // Toast color based on type
        if (type === 'success') {
            toast.style.background = '#0AC2CE';
        } else if (type === 'error') {
            toast.style.background = '#F57F17';
        }

        document.body.appendChild(toast);

        // Auto remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
});

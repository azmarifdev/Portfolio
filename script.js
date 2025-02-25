document.addEventListener('DOMContentLoaded', function () {
    // Enable smooth scrolling globally
    document.documentElement.style.scrollBehavior = 'smooth';

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

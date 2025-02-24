// Script File

// Home Section Starts
let menuBtn = document.querySelector('.menu-btn');
let menu = document.querySelector('.nav-links');
let menuLinks = document.querySelectorAll('.nav-links li a');

menuBtn.addEventListener('click', activeClass);

function activeClass() {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');
}

for (i = 0; i < menuLinks.length; i++) {
    menuLinks[i].addEventListener('click', menuItemClicked);
}

function menuItemClicked() {
    menuBtn.classList.remove('active');
    menu.classList.remove('active');
}

let homeSection = document.querySelector('.home');
window.addEventListener('scroll', scrollFunction);
window.addEventListener('load', scrollFunction);

function scrollFunction() {
    if (window.scrollY > 60) {
        homeSection.classList.add('active');
    } else {
        homeSection.classList.remove('active');
    }
}

// CV download
document.getElementById('downloadCV').addEventListener('click', function () {
    const pdfUrl = './assets/azmarifCV.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = "A. Z. M. Arif's CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Home Section Ends

// Portfolio Section Starts
/* let $galleryContainer = $('.gallery').isotope({
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

// magnific popup
$('.gallery').magnificPopup({
    delegate: '.overlay a',
    type: 'image',
    gallery: {
        enabled: true,
    },
}); */

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

// contact form section starts

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Use EmailJS to send email
    emailjs
        .send('BrmtseVaBhEyJudPn4oEi', 'portfolio', {
            from_name: name,
            from_email: email,
            message: message,
        })
        .then(
            function (response) {
                alert('Message sent successfully!');
            },
            function (error) {
                alert('Failed to send message. Please try again.');
            },
        );
});

// contact form section ends

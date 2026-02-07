
// right-sidebar
function open_aside() {
    "use strict";
    const sidepanel = document.getElementById("mySidenav");
    if (sidepanel) {
        sidepanel.style.left = "0";
    } else {
        console.error("Error: Side panel element not found!");
    }
}
function close_aside() {
    "use strict";
    const sidepanel = document.getElementById("mySidenav");
    if (sidepanel) {
        sidepanel.style.left = "-355px";
    } else {
        console.error("Error: Side panel element not found!");
    }
}

let slid = document.getElementById("slid-btn");
if (slid !== null) {
    slid.onclick = () => {
        let dropdwon = document.getElementById("slid-drop");
        dropdwon.classList.toggle("aside-dropdwon");
    }
}


/*========= DropDown menu slide section =========*/
const dropdowns = document.querySelectorAll('.navbar .dropdown');
dropdowns.forEach(dropdown => {
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    dropdownMenu.style.maxHeight = '0';
    dropdown.addEventListener('mouseenter', () => {
        dropdownMenu.style.maxHeight = `${dropdownMenu.scrollHeight}px`;
        dropdownMenu.style.visibility = 'visible';
    });
    dropdown.addEventListener('mouseleave', () => {
        dropdownMenu.style.visibility = 'hidden';
        dropdownMenu.style.maxHeight = '0';
    });
});
/*========= End of DropDown menu slide section =========*/



// ======== 1.5. ShowCase section ========
if ($('.RoomSlider').length > 0) {
    $('.RoomSlider').slick({
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        cssEase: 'linear',
        prevArrow: false,
        nextArrow: false,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
}
// ======== End of 1.5. ShowCase section ========



// ======== 1.9. TesSlider section ========
if ($('.TesSlider').length > 0) {
    $(document).ready(function () {
        $('.TesSlider').slick({
            dots: true,
            arrows: false,
            autoplay: true,
            slidesToShow: 1,
            autoplaySpeed: 3000
        });
    });
}
// ======== 1.9. TesSlider section ========


// ======== 1.5. ReviewsSlider section ========
if ($('.reviewsslider').length > 0) {
    $('.reviewsslider').slick({
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        cssEase: 'linear',
        prevArrow: false,
        nextArrow: false,
    });
}

// ======== 1.5. ConnectSlider section ========
if ($('.ConnectSlider').length > 0) {
    $('.ConnectSlider').slick({
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 5.8,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        cssEase: 'linear',
        prevArrow: false,
        nextArrow: false,
        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 3,

                }
            },
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3.7,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2.7,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 361,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });
}
// ======== End of 1.5. ConnectSlider section ========




//  13.1 Coming soon
if (document.querySelector(".counters") !== null) {
    document.addEventListener("DOMContentLoaded", function () {
        const counter = document.querySelector(".counters");
        const daysSpan = counter.querySelector(".days");
        const hoursSpan = counter.querySelector(".hours");
        const minutesSpan = counter.querySelector(".minutes");
        const secondsSpan = counter.querySelector(".seconds");

        const targetDate = new Date("October 30, 2024 00:00:00").getTime();

        function updateCounter() {
            const now = new Date().getTime();
            const remainingTime = targetDate - now;

            if (remainingTime >= 0) {
                const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

                daysSpan.textContent = days.toString().padStart(2, '0');
                hoursSpan.textContent = hours.toString().padStart(2, '0');
                minutesSpan.textContent = minutes.toString().padStart(2, '0');
                secondsSpan.textContent = seconds.toString().padStart(2, '0');
            } else {
                daysSpan.textContent = '00';
                hoursSpan.textContent = '00';
                minutesSpan.textContent = '00';
                secondsSpan.textContent = '00';
            }
        }

        setInterval(updateCounter, 1000);
        updateCounter();
    });
}

// End of 13.1 Coming soon




// Back to top button js
if (document.querySelector('.back-to-top') !== null) {
    const backToTopButton = document.querySelector('.back-to-top');
    let scrollTimeout;
    let isHovered = false;

    function handleScroll() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }

        clearTimeout(scrollTimeout);
        if (!isHovered) {
            scrollTimeout = setTimeout(() => {
                backToTopButton.classList.remove('show');
            }, 5000);
        }
    }

    window.addEventListener('mousemove', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTopButton.addEventListener('mouseenter', () => {
        isHovered = true;
        clearTimeout(scrollTimeout);
    });

    backToTopButton.addEventListener('mouseleave', () => {
        isHovered = false;
        scrollTimeout = setTimeout(() => {
            if (!isHovered) {
                backToTopButton.classList.remove('show');
            }
        }, 5000);
    });
}

window.addEventListener('scroll', handleScroll);

// back top button js end



// ========  1.11. Newsletter section ========

if (document.querySelector('.modal1') !== null) {
    const successModal = new bootstrap.Modal(document.querySelector('.successModal'));
    document.querySelector('.modal1').addEventListener('submit', function (event) {
        event.preventDefault();

        const successModal = new bootstrap.Modal(document.querySelector('.successModal'));
        successModal.show();

        document.querySelector('.modal1').reset();

        setTimeout(function () {
            successModal.hide();
        }, 3000);
    });
}


// ========  1.11. End of Newsletter section ========



// ======== Counters section ========
function animateNumbers(num, finalValue, duration, isDecimal) {
    let start = null;
    const finalValueStr = num.getAttribute("data-final-value");
    const charCount = finalValueStr.length;
    num.style.display = "inline-block";
    num.style.width = `${charCount}ch`;
    const decimalPlaces = isDecimal ? (finalValueStr.split(".")[1] || "").length : 0;
    const numberFormatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const currentValue = progress * finalValue;
        num.textContent = numberFormatter.format(
            isDecimal ? currentValue.toFixed(decimalPlaces) : Math.floor(currentValue)
        );
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            num.style.display = "inline";
        }
    }
    window.requestAnimationFrame(step);
}
function startNumberAnimation() {
    const numbers = document.querySelectorAll(".number");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const finalValueStr = entry.target.getAttribute("data-final-value");
                    const isDecimal = finalValueStr.includes(".");
                    const finalValue = isDecimal
                        ? parseFloat(finalValueStr)
                        : parseInt(finalValueStr, 10);
                    animateNumbers(entry.target, finalValue, 2000, isDecimal);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    numbers.forEach((num) => observer.observe(num));
}
startNumberAnimation();
window.addEventListener("load", startNumberAnimation);
// ======== End of Counters section ========

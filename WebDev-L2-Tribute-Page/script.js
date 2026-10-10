/* =========================================================
   MAHATMA GANDHI TRIBUTE PAGE
   OASIS INFOBYTE - WEB DEVELOPMENT LEVEL 2
   Task 2: Tribute Page
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       PAGE LOADER
       ========================================================= */

    const pageLoader = document.querySelector("#page-loader");

    function hideLoader() {
        if (!pageLoader) return;

        pageLoader.classList.add("hide");

        setTimeout(() => {
            pageLoader.style.display = "none";
        }, 700);
    }

    window.addEventListener("load", hideLoader);

    // Fallback in case some resource takes too long
    setTimeout(hideLoader, 2500);


    /* =========================================================
       MOBILE NAVIGATION
       ========================================================= */

    const menuToggle = document.querySelector("#menu-toggle");
    const navWrapper = document.querySelector("#nav-wrapper");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navWrapper) {

        menuToggle.addEventListener("click", () => {
            const isOpen = navWrapper.classList.toggle("open");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navWrapper.classList.remove("open");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                navWrapper.classList.remove("open");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }


    /* =========================================================
       HEADER SCROLL EFFECT
       ========================================================= */

    const header = document.querySelector("#site-header");

    function updateHeader() {
        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, { passive: true });

    updateHeader();


    /* =========================================================
       DARK / LIGHT MODE
       ========================================================= */

    const themeToggle = document.querySelector("#theme-toggle");
    const themeIcon = themeToggle?.querySelector("i");

    const savedTheme = localStorage.getItem("gandhi-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    function updateThemeIcon() {
        if (!themeIcon) return;

        if (document.body.classList.contains("dark-mode")) {
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
        } else {
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
        }
    }

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const isDark = document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "gandhi-theme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();
        });
    }


    /* =========================================================
       SCROLL REVEAL ANIMATION
       ========================================================= */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =========================================================
       TIMELINE
       ========================================================= */

    const timelineCards = document.querySelectorAll(".timeline-card");

    const journeyImage = document.querySelector("#journey-image");
    const journeyYear = document.querySelector("#journey-year");
    const journeyTitle = document.querySelector("#journey-title");
    const journeyDescription = document.querySelector("#journey-description");
    const journeyProgressText = document.querySelector("#journey-progress-text");
    const journeyProgressFill = document.querySelector("#journey-progress-fill");

    const timelineData = [
        {
            year: "1869",
            title: "Birth in Porbandar",
            description:
                "Mohandas Karamchand Gandhi was born on 2 October 1869 in Porbandar, Gujarat, beginning the life of one of history's most influential advocates of nonviolence.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait%20Gandhi.jpg"
        },
        {
            year: "1888",
            title: "Journey to London",
            description:
                "At the age of nineteen, Gandhi travelled to London to study law. His years abroad broadened his worldview and shaped his personal discipline.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Mahatma%20Gandhi%2C%20ca.%201930.jpg"
        },
        {
            year: "1893",
            title: "South Africa",
            description:
                "Gandhi travelled to South Africa as a young lawyer. Experiences of racial discrimination became an important turning point in his development as a social and political leader.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Mahatma%20Gandhi%2C%20close-up%20portrait.jpg"
        },
        {
            year: "1915",
            title: "Return to India",
            description:
                "Gandhi returned to India and gradually became a major voice in the Indian independence movement, promoting truth, discipline and nonviolent resistance.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Gandhi%20at%20the%20spinning%20wheel.jpg"
        },
        {
            year: "1930",
            title: "The Salt March",
            description:
                "Gandhi led the historic Salt March to the Arabian Sea in protest against British salt laws. The campaign became a powerful symbol of civil disobedience.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Salt_March.jpg"
        },
        {
            year: "1942",
            title: "Quit India Movement",
            description:
                "During the Second World War, Gandhi and the Indian National Congress launched the Quit India Movement, demanding an end to British rule in India.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Nehru%20Gandhi%201942.jpg"
        },
        {
            year: "1948",
            title: "Legacy Begins",
            description:
                "Gandhi was assassinated on 30 January 1948. His ideas of nonviolence, truth and peaceful resistance continued to influence movements around the world.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Gandhi%20portrait%201940.jpg"
        }
    ];

    let activeTimelineIndex = 4;

    function updateTimeline(index) {

        if (!timelineCards.length) return;

        activeTimelineIndex = index;

        const item = timelineData[index];

        if (!item) return;

        timelineCards.forEach((card, cardIndex) => {
            card.classList.toggle(
                "active",
                cardIndex === index
            );
        });

        if (journeyImage) {
            journeyImage.style.opacity = "0";

            setTimeout(() => {
                journeyImage.src = item.image;
                journeyImage.alt = `${item.title} - Mahatma Gandhi`;
                journeyImage.style.opacity = "1";
            }, 180);
        }

        if (journeyYear) {
            journeyYear.textContent = item.year;
        }

        if (journeyTitle) {
            journeyTitle.textContent = item.title;
        }

        if (journeyDescription) {
            journeyDescription.textContent = item.description;
        }

        if (journeyProgressText) {
            journeyProgressText.textContent =
                `${index + 1} / ${timelineData.length}`;
        }

        if (journeyProgressFill) {
            const progress =
                ((index + 1) / timelineData.length) * 100;

            journeyProgressFill.style.width = `${progress}%`;
        }
    }

    timelineCards.forEach((card, index) => {

        card.addEventListener("click", () => {
            updateTimeline(index);
        });

        card.addEventListener("keydown", event => {

            if (event.key === "Enter" || event.key === " ") {

                event.preventDefault();

                updateTimeline(index);
            }

        });

    });

    updateTimeline(activeTimelineIndex);


    /* =========================================================
       IMAGE JOURNEY SLIDER
       ========================================================= */

    const storyImage = document.querySelector("#story-image");
    const storyDate = document.querySelector("#story-date");
    const storyTitle = document.querySelector("#story-title");
    const storyDescription = document.querySelector("#story-description");

    const storyThumbs = document.querySelectorAll(".story-thumb");

    const previousStory = document.querySelector("#story-prev");
    const nextStory = document.querySelector("#story-next");

    const storyData = [
        {
            date: "1930",
            title: "The Salt March",
            description:
                "Gandhi walks toward the sea in one of the most iconic acts of civil disobedience in modern history.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Salt_March.jpg"
        },
        {
            date: "1920s",
            title: "Ashram Life",
            description:
                "Simple living, spinning, prayer and community discipline were central elements of Gandhi's daily philosophy.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Gandhi%20at%20the%20spinning%20wheel.jpg"
        },
        {
            date: "1930s",
            title: "Public Life",
            description:
                "Gandhi became a powerful symbol of peaceful resistance and inspired millions through public campaigns.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Mahatma%20Gandhi%2C%20close-up%20portrait.jpg"
        },
        {
            date: "1942",
            title: "The Final Years",
            description:
                "During the final years of his life, Gandhi continued to advocate for peace, unity and freedom.",
            image:
                "https://commons.wikimedia.org/wiki/Special:FilePath/Nehru%20Gandhi%201942.jpg"
        }
    ];

    let currentStoryIndex = 0;
    let storyTimer = null;

    function updateStory(index) {

        if (!storyData.length) return;

        currentStoryIndex =
            (index + storyData.length) % storyData.length;

        const story = storyData[currentStoryIndex];

        if (storyImage) {

            storyImage.style.opacity = "0";
            storyImage.style.transform = "scale(1.03)";

            setTimeout(() => {

                storyImage.src = story.image;
                storyImage.alt = story.title;

                storyImage.style.opacity = "1";
                storyImage.style.transform = "scale(1)";

            }, 180);
        }

        if (storyDate) {
            storyDate.textContent = story.date;
        }

        if (storyTitle) {
            storyTitle.textContent = story.title;
        }

        if (storyDescription) {
            storyDescription.textContent =
                story.description;
        }

        storyThumbs.forEach((thumb, thumbIndex) => {

            thumb.classList.toggle(
                "active",
                thumbIndex === currentStoryIndex
            );

        });
    }

    function nextStorySlide() {
        updateStory(currentStoryIndex + 1);
    }

    function previousStorySlide() {
        updateStory(currentStoryIndex - 1);
    }

    if (nextStory) {
        nextStory.addEventListener(
            "click",
            nextStorySlide
        );
    }

    if (previousStory) {
        previousStory.addEventListener(
            "click",
            previousStorySlide
        );
    }

    storyThumbs.forEach((thumb, index) => {

        thumb.addEventListener("click", () => {
            updateStory(index);
            restartStoryAutoplay();
        });

    });

    function startStoryAutoplay() {

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        clearInterval(storyTimer);

        storyTimer = setInterval(() => {
            nextStorySlide();
        }, 6500);
    }

    function restartStoryAutoplay() {
        clearInterval(storyTimer);
        startStoryAutoplay();
    }

    const storySection = document.querySelector("#journey");

    if (storySection) {

        storySection.addEventListener("mouseenter", () => {
            clearInterval(storyTimer);
        });

        storySection.addEventListener("mouseleave", () => {
            startStoryAutoplay();
        });
    }

    updateStory(0);
    startStoryAutoplay();


    /* =========================================================
       TOUCH SWIPE FOR STORY SLIDER
       ========================================================= */

    let touchStartX = 0;
    let touchEndX = 0;

    if (storyImage) {

        storyImage.addEventListener(
            "touchstart",
            event => {
                touchStartX = event.changedTouches[0].screenX;
            },
            { passive: true }
        );

        storyImage.addEventListener(
            "touchend",
            event => {

                touchEndX =
                    event.changedTouches[0].screenX;

                const distance =
                    touchEndX - touchStartX;

                if (Math.abs(distance) < 50) return;

                if (distance < 0) {
                    nextStorySlide();
                } else {
                    previousStorySlide();
                }

                restartStoryAutoplay();
            },
            { passive: true }
        );
    }


   /* =========================================
   GALLERY FILTER
========================================= */

const galleryFilters = document.querySelectorAll(".gallery-filter");
const galleryItems = document.querySelectorAll(".gallery-item");
const galleryGrid = document.querySelector(".vintage-gallery");

galleryFilters.forEach(filter => {

    filter.addEventListener("click", () => {

        /* Active button */
        galleryFilters.forEach(btn => {
            btn.classList.remove("active");
        });

        filter.classList.add("active");

        const selectedFilter = filter.dataset.filter;

        /* ALL — restore original luxury layout */
        if (selectedFilter === "all") {

            galleryGrid.classList.remove("is-filtered");

            galleryItems.forEach(item => {
                item.style.display = "";
            });

            return;
        }


        /* FILTERED VIEW */
        galleryGrid.classList.add("is-filtered");

        galleryItems.forEach(item => {

            const category = item.dataset.category;

            if (category === selectedFilter) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }

        });

    });

});


    /* =========================================================
       GALLERY LIGHTBOX
       ========================================================= */

    const lightbox =
        document.querySelector("#lightbox");

    const lightboxImage =
        document.querySelector("#lightbox-image");

    const lightboxCaption =
        document.querySelector("#lightbox-caption");

    const lightboxClose =
        document.querySelector("#lightbox-close");

    const lightboxPrev =
        document.querySelector("#lightbox-prev");

    const lightboxNext =
        document.querySelector("#lightbox-next");

    let currentGalleryIndex = 0;

    function getVisibleGalleryItems() {

        return Array.from(galleryItems)
            .filter(item => !item.hidden);

    }

    function openLightbox(item) {

        if (!lightbox || !lightboxImage) return;

        const visibleItems =
            getVisibleGalleryItems();

        currentGalleryIndex =
            visibleItems.indexOf(item);

        if (currentGalleryIndex < 0) {
            currentGalleryIndex = 0;
        }

        showLightboxImage();

        lightbox.classList.add("active");
        document.body.classList.add("lightbox-open");

    }

    function showLightboxImage() {

        const visibleItems =
            getVisibleGalleryItems();

        if (!visibleItems.length) return;

        const item =
            visibleItems[currentGalleryIndex];

        const image =
            item.querySelector("img");

        if (!image) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        if (lightboxCaption) {
            lightboxCaption.textContent =
                image.alt || "Mahatma Gandhi";
        }
    }

    function closeLightbox() {

        if (!lightbox) return;

        lightbox.classList.remove("active");

        document.body.classList.remove(
            "lightbox-open"
        );
    }

    function showPreviousGalleryImage() {

        const items =
            getVisibleGalleryItems();

        if (!items.length) return;

        currentGalleryIndex =
            (currentGalleryIndex - 1 + items.length) %
            items.length;

        showLightboxImage();
    }

    function showNextGalleryImage() {

        const items =
            getVisibleGalleryItems();

        if (!items.length) return;

        currentGalleryIndex =
            (currentGalleryIndex + 1) %
            items.length;

        showLightboxImage();
    }

    galleryItems.forEach(item => {

        item.addEventListener("click", () => {
            openLightbox(item);
        });

    });

    if (lightboxClose) {
        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener(
            "click",
            showPreviousGalleryImage
        );
    }

    if (lightboxNext) {
        lightboxNext.addEventListener(
            "click",
            showNextGalleryImage
        );
    }

    if (lightbox) {

        lightbox.addEventListener("click", event => {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });
    }


    /* =========================================================
       KEYBOARD CONTROLS
       ========================================================= */

    document.addEventListener("keydown", event => {

        const activeElement =
            document.activeElement;

        const isTyping =
            activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA" ||
                activeElement.tagName === "SELECT"
            );

        if (isTyping) return;

        if (
            lightbox &&
            lightbox.classList.contains("active")
        ) {

            if (event.key === "ArrowLeft") {
                showPreviousGalleryImage();
            }

            if (event.key === "ArrowRight") {
                showNextGalleryImage();
            }

            if (event.key === "Escape") {
                closeLightbox();
            }

            return;
        }

        if (event.key === "ArrowRight") {
            nextStorySlide();
            restartStoryAutoplay();
        }

        if (event.key === "ArrowLeft") {
            previousStorySlide();
            restartStoryAutoplay();
        }

    });


    /* =========================================================
       QUOTE ROTATOR
       ========================================================= */

    const quoteText =
        document.querySelector("#quote-text");

    const nextQuote =
        document.querySelector("#next-quote");

    const quotes = [
        "My life is my message.",
        "The weak can never forgive. Forgiveness is the attribute of the strong.",
        "In matters of conscience, the law of majority has no place."
    ];

    let currentQuote = 0;

    function changeQuote() {

        if (!quoteText) return;

        quoteText.style.opacity = "0";
        quoteText.style.transform =
            "translateY(8px)";

        setTimeout(() => {

            quoteText.textContent =
                `“${quotes[currentQuote]}”`;

            quoteText.style.opacity = "1";
            quoteText.style.transform =
                "translateY(0)";

            currentQuote =
                (currentQuote + 1) % quotes.length;

        }, 250);
    }

    if (nextQuote) {
        nextQuote.addEventListener(
            "click",
            changeQuote
        );
    }


    /* =========================================================
       BACK TO TOP
       ========================================================= */

    const backToTop =
        document.querySelector("#back-to-top");

    function updateBackToTop() {

        if (!backToTop) return;

        if (window.scrollY > 600) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    }

    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );

    updateBackToTop();

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });
    }


    /* =========================================================
       MOVEMENT BUTTONS
       ========================================================= */

    const movementLinks =
        document.querySelectorAll(".movement-link");

    const gallerySection =
        document.querySelector("#gallery");

    movementLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            if (gallerySection) {

                gallerySection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =========================================================
       HERO PARALLAX
       ========================================================= */

    const hero =
        document.querySelector("#home");

    const heroImage =
        document.querySelector(".hero-image");

    let parallaxRunning = false;

    function updateParallax() {

        if (!hero || !heroImage) return;

        if (
            window.innerWidth <= 768 ||
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {

            heroImage.style.transform = "";
            return;
        }

        if (parallaxRunning) return;

        parallaxRunning = true;

        requestAnimationFrame(() => {

            const scrollY =
                window.scrollY;

            if (scrollY < window.innerHeight) {

                heroImage.style.transform =
                    `translateY(${scrollY * 0.08}px)`;
            }

            parallaxRunning = false;

        });
    }

    window.addEventListener(
        "scroll",
        updateParallax,
        { passive: true }
    );


    /* =========================================================
       VISUAL EFFECT CONTROL
       ========================================================= */

    const visualControl =
        document.querySelector("#visual-control");

    if (visualControl) {

        visualControl.setAttribute(
            "title",
            "Toggle visual effects"
        );

        visualControl.addEventListener("click", () => {

            document.body.classList.toggle(
                "reduced-effects"
            );

            const reduced =
                document.body.classList.contains(
                    "reduced-effects"
                );

            visualControl.setAttribute(
                "aria-pressed",
                reduced
            );

            localStorage.setItem(
                "gandhi-effects",
                reduced ? "reduced" : "full"
            );

        });

        if (
            localStorage.getItem(
                "gandhi-effects"
            ) === "reduced"
        ) {

            document.body.classList.add(
                "reduced-effects"
            );
        }
    }


    /* =========================================================
       IMAGE ERROR CHECK
       ========================================================= */

    const allImages =
        document.querySelectorAll("img");

    allImages.forEach(image => {

        image.addEventListener("error", () => {

            console.warn(
                "Image could not be loaded:",
                image.src
            );

            image.classList.add(
                "image-load-error"
            );

        });

    });


    /* =========================================================
       SMOOTH NAVIGATION WITH HEADER OFFSET
       ========================================================= */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 80;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    /* =========================================================
       INITIALIZATION
       ========================================================= */

    document.documentElement.classList.add(
        "js-enabled"
    );

    console.log(
        "Mahatma Gandhi Tribute Page initialized successfully."
    );

});
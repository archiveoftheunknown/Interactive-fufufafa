document.addEventListener('DOMContentLoaded', function() {
    // --- Existing Functionality ---
    const tabs = document.querySelectorAll('.tab-button');
    const panes = document.querySelectorAll('.tab-pane');
    const evidenceCards = document.querySelectorAll('.evidence-card');
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Tab functionality with press animation
    tabs.forEach(tab => {
        // Add press animation on mousedown/touchstart
        tab.addEventListener('mousedown', () => {
            tab.classList.add('pressing');
        });
        
        tab.addEventListener('mouseup', () => {
            tab.classList.remove('pressing');
        });
        
        tab.addEventListener('touchstart', () => {
            tab.classList.add('pressing');
        });
        
        tab.addEventListener('touchend', () => {
            tab.classList.remove('pressing');
        });
        
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            const currentActivePane = document.querySelector('.tab-pane.active');

            if (currentActivePane && currentActivePane.id === targetId) return;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (currentActivePane) {
                currentActivePane.classList.add('is-exiting');
                currentActivePane.classList.remove('active');
            }

            const targetPane = document.getElementById(targetId);
            targetPane.classList.remove('hidden');
            targetPane.classList.add('active');

            setTimeout(() => {
                if(currentActivePane) {
                   currentActivePane.classList.remove('is-exiting');
                }
                panes.forEach(p => {
                    if (p.id !== targetId) {
                        p.classList.remove('active');
                    }
                });
            }, 500);
        });
    });

    // Modal functionality
    let activeModalOrigin = null;

    const modalData = {
        modal1: {
            title: "Koneksi 'Chilli Pari'",
            content: "Titik balik krusial dalam investigasi ini adalah penemuan unggahan paralel. Pada tanggal 3 November 2014, akun Kaskus 'fufufafa' dan akun Twitter '@Chilli_Pari' (yang diketahui sebagai akun bisnis katering milik Gibran) sama-sama mengunggah pertanyaan yang identik: di mana bisa membeli 'gunting yg kayak di Steak Gunting PIK'. Kesamaan yang spesifik dan terjadi pada waktu yang berdekatan ini menjadi pilar utama yang menghubungkan kedua identitas digital tersebut."
        },
        modal2: {
            title: "Peretasan Anonim dan Kebocoran Data",
            content: "Momen paling menentukan datang ketika kelompok peretas 'Anonymous Indonesia' mengklaim telah membocorkan informasi pribadi yang terkait dengan akun 'fufufafa' dan '@Chilli_Pari'. Data yang dibocorkan mencakup Nomor Induk Kependudukan (NIK), nomor telepon, dan alamat email. Warganet dengan cepat menelusuri detail ini dan menemukan bahwa data tersebut merujuk langsung kepada Gibran Rakabuming Raka."
        },
        modal3: {
            title: "Hubungan Nomor Telepon: Tautan Definitif",
            content: "Verifikasi silang menunjukkan bahwa nomor telepon yang bocor adalah nomor yang sama dengan yang digunakan Gibran saat mendaftar sebagai calon Walikota Surakarta pada Pilkada 2020 di KPU. Lebih jauh lagi, ketika warganet mencoba melakukan transaksi finansial menggunakan nomor tersebut melalui dompet digital, nama lengkap 'Gibran Rakabuming Raka' muncul sebagai pemiliknya. Ini adalah mata rantai bukti yang paling kuat dan sulit dibantah."
        }
    };

    const openModal = (modalId, originCard) => {
        const data = modalData[modalId];
        if (!data) return;

        activeModalOrigin = originCard;
        const cardRect = originCard.getBoundingClientRect();
        const modalRect = modalContent.getBoundingClientRect();

        const scaleX = cardRect.width / modalRect.width;
        const scaleY = cardRect.height / modalRect.height;
        const translateX = cardRect.left - modalRect.left;
        const translateY = cardRect.top - modalRect.top;

        modalContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
        modalContent.style.opacity = '0';

        modalBody.innerHTML = `<h3 class="text-2xl font-bold text-[#A0522D] mb-4">${data.title}</h3><p class="text-gray-700">${data.content}</p>`;
        modalContainer.classList.remove('hidden');
        modalContainer.classList.add('flex');

        requestAnimationFrame(() => {
            modalContainer.style.opacity = '1';
            modalContent.style.transform = 'translate(0, 0) scale(1)';
            modalContent.style.opacity = '1';
        });
    };

    const closeModal = () => {
        if (!activeModalOrigin) return;

        const cardRect = activeModalOrigin.getBoundingClientRect();
        const modalRect = modalContent.getBoundingClientRect();

        const scaleX = cardRect.width / modalRect.width;
        const scaleY = cardRect.height / modalRect.height;
        const translateX = cardRect.left - modalRect.left;
        const translateY = cardRect.top - modalRect.top;

        modalContainer.style.opacity = '0';
        modalContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
        modalContent.style.opacity = '0';

        setTimeout(() => {
            modalContainer.classList.add('hidden');
            activeModalOrigin = null;
        }, 400);
    };

    evidenceCards.forEach(card => card.addEventListener('click', () => openModal(card.dataset.modal, card)));
    closeModalBtn.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', (e) => e.target === modalContainer && closeModal());

    // Mobile menu toggle with slide animation
    menuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        
        if (isOpen) {
            mobileMenu.classList.remove('open');
            menuBtn.classList.remove('open');
            document.body.classList.remove('menu-open');
        } else {
            mobileMenu.classList.add('open');
            menuBtn.classList.add('open');
            document.body.classList.add('menu-open');
        }
    });
    
    // Close mobile menu when clicking links
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            mobileMenu.classList.remove('open');
            menuBtn.classList.remove('open');
            document.body.classList.remove('menu-open');
        }
    });

    // Smooth scroll navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-scroll-to');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const offset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Active link highlighting on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const headerOffset = document.querySelector('header').offsetHeight + 20;
        sections.forEach(section => {
            if (pageYOffset >= section.offsetTop - headerOffset) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.scrollTo === current) {
                link.classList.add('active');
            }
        });
        // Move pill on scroll
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) moveNavPill(activeLink);
    });

    // --- NEW: Component-Specific Enhancements ---

    // Navigation Pill
    const navPill = document.getElementById('nav-pill');
    const mainNav = document.querySelector('.hidden.md\\:flex');

    function moveNavPill(target) {
        if (!target || !navPill) return;
        navPill.style.width = `${target.offsetWidth}px`;
        navPill.style.left = `${target.offsetLeft}px`;
        navPill.style.top = `${target.offsetTop}px`;
        navPill.style.height = `${target.offsetHeight}px`;
    }

    // Initial position
    setTimeout(() => {
        const initialActiveLink = document.querySelector('.nav-link.active') || navLinks[0];
        if (initialActiveLink) {
            initialActiveLink.classList.add('active');
            moveNavPill(initialActiveLink);
        }
    }, 100);

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => moveNavPill(e.currentTarget));
    });

    if(mainNav) {
        mainNav.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) moveNavPill(activeLink);
        });
    }


    // --- NEW: Core Interactivity & Animations ---

    // 1. Scroll-based Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Hero Parallax Effect
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });

    // 3. 3D Card Tilt Effect
    evidenceCards.forEach(card => {
        const glare = document.createElement('div');
        glare.className = 'evidence-card-glare';
        card.appendChild(glare);

        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const rotateX = (y / height - 0.5) * -20;
            const rotateY = (x / width - 0.5) * 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

            const glareX = (x / width) * 100;
            const glareY = (y / height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            glare.style.background = 'none';
        });
    });

    // Add CSS for the glare effect
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        .evidence-card { position: relative; overflow: hidden; }
        .evidence-card-glare {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            transition: background 0.1s linear;
        }
    `;
    document.head.appendChild(styleSheet);


    // 4. Micro-interactions for Clicks
    const interactiveElements = document.querySelectorAll('button, a, .cursor-pointer');
    interactiveElements.forEach(el => {
        el.addEventListener('mousedown', () => el.classList.add('active-press'));
        el.addEventListener('mouseup', () => el.classList.remove('active-press'));
        el.addEventListener('mouseleave', () => el.classList.remove('active-press'));
    });
});
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, Flip);

document.addEventListener('DOMContentLoaded', function() {
    // Lenis Smooth Scrolling
    const lenis = new Lenis({
        lerp: 0.08, // Lower for a smoother, more 'buttery' feel
        wheelMultiplier: 0.8,
        gestureRecognizers: [
            (e) => {
                // prevent smooth scroll on modal content
                if (e.target.closest('#modal-content')) {
                    return false;
                }
            },
        ],
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

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

    // GSAP-powered Tab Functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            const currentActivePane = document.querySelector('.tab-pane.active');
            const targetPane = document.getElementById(targetId);

            if (currentActivePane === targetPane) return;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tl = gsap.timeline({
                defaults: { duration: 0.4, ease: 'power3.inOut' }
            });

            if (currentActivePane) {
                // Animate out the current pane
                tl.to(currentActivePane, {
                    x: -30,
                    opacity: 0,
                    onComplete: () => {
                        currentActivePane.classList.remove('active');
                        currentActivePane.classList.add('hidden');
                    }
                });
            }

            // Animate in the new pane
            targetPane.classList.remove('hidden');
            gsap.set(targetPane, { x: 30, opacity: 0 }); // Set initial state

            tl.to(targetPane, {
                x: 0,
                opacity: 1,
                onStart: () => {
                    targetPane.classList.add('active');
                }
            }, currentActivePane ? "-=0.2" : 0); // Overlap animations slightly
        });
    });

    // GSAP Flip-based Modal Animation
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
        const state = Flip.getState(originCard);

        modalBody.innerHTML = `<h3 class="text-fluid-h3 font-semibold text-[#A0522D] mb-4">${data.title}</h3><p class="text-fluid-body text-gray-700">${data.content}</p>`;
        modalContainer.classList.remove('hidden');
        modalContainer.classList.add('flex');
        modalContent.style.opacity = 1; // Make it visible for the FLIP animation

        originCard.style.opacity = 0; // Hide original card

        Flip.from(state, {
            target: modalContent,
            duration: 0.6,
            ease: "power4.inOut",
            scale: true,
            onStart: () => {
                gsap.to(modalContainer, { opacity: 1, duration: 0.4 });
            },
        });
    };

    const closeModal = () => {
        if (!activeModalOrigin) return;

        const state = Flip.getState(modalContent);

        Flip.from(state, {
            target: activeModalOrigin,
            duration: 0.6,
            ease: "power4.inOut",
            scale: true,
            onStart: () => {
                gsap.to(modalContainer, { opacity: 0, duration: 0.4 });
            },
            onComplete: () => {
                modalContainer.classList.add('hidden');
                modalContent.style.opacity = 0;
                activeModalOrigin.style.opacity = 1;
                activeModalOrigin = null;
            }
        });
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

    // Lenis-powered Smooth Scroll & Scrollspy
    const header = document.querySelector('header');
    const headerOffset = header ? header.offsetHeight : 80;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-scroll-to');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, { offset: -headerOffset });
            }
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                menuBtn.classList.remove('open');
                document.body.classList.remove('menu-open');
            }
        });
    });

    lenis.on('scroll', (e) => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset - 50; // 50px buffer
            if (e.scroll >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.scrollTo === current) {
                link.classList.add('active');
            }
        });

        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) moveNavPill(activeLink);
    });

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

    // 1. GSAP Scroll-based Reveal Animations
    gsap.utils.toArray('.reveal-on-scroll').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power4.out',
        });
    });

    // Staggered animation for evidence cards (they are also reveal-on-scroll, but we give them a special animation)
    gsap.from(".evidence-card", {
        scrollTrigger: {
            trigger: "#jejak", // The container for the cards
            start: "top 75%",
        },
        duration: 0.8,
        opacity: 0,
        y: 50,
        stagger: 0.15,
        ease: "power4.out"
    });

    // 2. GSAP Hero Parallax Effect
    gsap.to(".hero-section", {
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        backgroundPositionY: "30%",
        ease: "none"
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
            gsap.to(card, {
                duration: 0.8,
                transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
                ease: 'elastic.out(1, 0.75)'
            });
            gsap.to(glare, {
                background: 'none',
                duration: 0.8
            })
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
const videoOverlay = document.getElementById('video-overlay');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let followX = mouseX;
let followY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateFollower() {
    // Sluggish, smooth follow effect for the aura
    followX += (mouseX - followX) * 0.08;
    followY += (mouseY - followY) * 0.08;
    
    if(videoOverlay) {
        // Create the "aura lights" hole in the dark overlay
        const maskStr = `radial-gradient(circle at ${followX}px ${followY}px, transparent 0%, transparent 60px, black 220px)`;
        videoOverlay.style.webkitMaskImage = maskStr;
        videoOverlay.style.maskImage = maskStr;
    }
    
    requestAnimationFrame(animateFollower);
}

animateFollower();

// Background Switcher Logic
const liveBackground = document.getElementById('live-background');
const bgSources = [
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4', aura: true, speed: 1.0, align: 'center' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4', aura: true, speed: 1.0, align: 'center' },
    { type: 'm3u8', url: 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8', aura: true, speed: 0.6, align: 'top' }
];
let currentBgIdx = 0;
let hlsInstance = null;

function loadBackground(index) {
    const bg = bgSources[index];
    
    // Toggle Aura Overlay
    if(videoOverlay) {
        videoOverlay.style.display = bg.aura ? 'block' : 'none';
    }

    // Apply alignment
    liveBackground.style.objectPosition = bg.align;

    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }

    if (bg.type === 'm3u8') {
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            hlsInstance = new Hls({
                capLevelToPlayerSize: false // Allow highest resolution
            });
            hlsInstance.loadSource(bg.url);
            hlsInstance.attachMedia(liveBackground);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, function() {
                // Force maximum available quality for crystal clear resolution
                hlsInstance.currentLevel = hlsInstance.levels.length - 1;
            });
        } else if (liveBackground.canPlayType('application/vnd.apple.mpegurl')) {
            liveBackground.src = bg.url;
        }
    } else {
        liveBackground.src = bg.url;
    }
    
    liveBackground.oncanplay = () => {
        liveBackground.playbackRate = bg.speed;
    };
    
    liveBackground.play().catch(e => console.log("Autoplay prevented:", e));
}

const bgPrev = document.getElementById('bg-prev');
const bgNext = document.getElementById('bg-next');

if(bgPrev && bgNext) {
    bgPrev.addEventListener('click', () => {
        currentBgIdx = (currentBgIdx - 1 + bgSources.length) % bgSources.length;
        loadBackground(currentBgIdx);
    });
    
    bgNext.addEventListener('click', () => {
        currentBgIdx = (currentBgIdx + 1) % bgSources.length;
        loadBackground(currentBgIdx);
    });
}

// Accountant AI Mock Logic
const aiInput = document.getElementById('ai-search-input');
const aiBox = document.getElementById('ai-suggestion-box');
const aiContent = document.getElementById('ai-response-content');
let aiTimeout;

if(aiInput && aiBox) {
    aiInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' && aiInput.value.trim() !== '') {
            showAiResponse();
        }
    });
}

function generateAIResponse(query) {
    const q = query.toLowerCase();
    let response = "";
    
    if (q.includes("tax") || q.includes("income")) {
        response = "Based on your query regarding taxation, it's crucial to evaluate your current income streams and deductions under the latest tax slabs. Proper tax planning can legally minimize your liabilities and maximize your savings. Our experts at Rajnish Arvind & Associates can help structure your investments and file your returns seamlessly.";
    } else if (q.includes("gst")) {
        response = "Navigating GST compliance requires careful attention to your input tax credits and accurate, timely filing of GSTR returns. Depending on your business model, you might be eligible for specific exemptions or the composition scheme. We highly recommend a consultation to review your supply chain and ensure you are fully compliant without overpaying.";
    } else if (q.includes("audit") || q.includes("assurance")) {
        response = "Auditing isn't just about compliance; it's a vital health check for your business operations and financial controls. A thorough statutory or internal audit can uncover inefficiencies, mitigate risks, and build trust with your stakeholders. Our firm provides rigorous audit services tailored to your industry standards.";
    } else if (q.includes("company") || q.includes("corporate") || q.includes("business") || q.includes("startup")) {
        response = "Starting or scaling a business involves complex corporate compliances, from ROC filings to structuring your equity properly. A solid financial foundation is key to attracting investors and avoiding legal hurdles down the road. We provide end-to-end corporate advisory to ensure your business grows sustainably and legally.";
    } else {
        response = "That is a great financial question. Navigating the complexities of accounting and financial regulations requires a tailored approach based on your specific circumstances. Our team of Chartered Accountants is equipped to analyze your situation deeply and provide strategic, compliant, and growth-oriented solutions.";
    }
    
    return `
        <p>${response}</p>
        <br>
        <p><a href="#contact" style="color: #d4af37; text-decoration: none; font-weight: 500;">Schedule a detailed consultation &rarr;</a></p>
    `;
}

function showAiResponse() {
    const query = aiInput.value.trim();
    if(!query) return;

    // Show box and loading state
    aiBox.classList.add('active');
    aiContent.innerHTML = `<div class="loading"><span></span><span></span><span></span></div>`;
    
    // Simulate API delay
    clearTimeout(aiTimeout);
    aiTimeout = setTimeout(() => {
        aiContent.innerHTML = generateAIResponse(query);
    }, 1500);
}

// Close box when clicking outside
document.addEventListener('click', (e) => {
    if(!e.target.closest('.search-bar-wrapper') && aiBox) {
        aiBox.classList.remove('active');
    }
});

// Contact Form Logic
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.submit-btn');
        btn.textContent = 'Sending...';
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        fetch("https://formsubmit.co/ajax/staff.rajnisharvind@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            btn.textContent = 'Send Message';
            if (data.success) {
                formStatus.style.color = '#d4af37';
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
            } else {
                formStatus.style.color = '#ff6b6b';
                formStatus.textContent = 'Oops! Something went wrong. Please try again.';
            }
            
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        })
        .catch(error => {
            btn.textContent = 'Send Message';
            formStatus.style.color = '#ff6b6b';
            formStatus.textContent = 'Network error. Please try sending an email directly.';
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        });
    });
}

// GST Calculator Logic
const gstAmountInput = document.getElementById('gst-amount');
const gstRateInput = document.getElementById('gst-rate');
const resGstTax = document.getElementById('res-gst-tax');
const resGstTotal = document.getElementById('res-gst-total');

// Utility for animating numbers
function animateNumber(element, start, end, duration) {
    let startTime = null;
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = `₹ ${value.toLocaleString('en-IN')}`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function calculateGST() {
    const amount = parseFloat(gstAmountInput.value) || 0;
    const rate = parseFloat(gstRateInput.value) || 0;
    const tax = (amount * rate) / 100;
    const total = amount + tax;
    
    // Animate the results
    const currentTaxText = resGstTax.textContent.replace(/[^\d]/g, '');
    const currentTotalText = resGstTotal.textContent.replace(/[^\d]/g, '');
    const currentTax = parseInt(currentTaxText) || 0;
    const currentTotal = parseInt(currentTotalText) || 0;
    
    animateNumber(resGstTax, currentTax, tax, 300);
    animateNumber(resGstTotal, currentTotal, total, 300);
}

if(gstAmountInput) {
    gstAmountInput.addEventListener('input', calculateGST);
    gstRateInput.addEventListener('change', calculateGST);
}

// Income Tax Calculator Logic (Simplified New Regime FY 24-25)
const taxIncomeInput = document.getElementById('tax-income');
const resIncomeTax = document.getElementById('res-income-tax');
const resIncomeHand = document.getElementById('res-income-hand');

function calculateIncomeTax() {
    const income = parseFloat(taxIncomeInput.value) || 0;
    let tax = 0;
    
    // New Regime Slabs FY 2024-25 (Simplified)
    if (income <= 300000) tax = 0;
    else if (income <= 600000) tax = (income - 300000) * 0.05;
    else if (income <= 900000) tax = 15000 + (income - 600000) * 0.10;
    else if (income <= 1200000) tax = 45000 + (income - 900000) * 0.15;
    else if (income <= 1500000) tax = 90000 + (income - 1200000) * 0.20;
    else tax = 150000 + (income - 1500000) * 0.30;
    
    const netIncome = income - tax;
    const monthly = Math.round(netIncome / 12);

    const currentTaxText = resIncomeTax.textContent.replace(/[^\d]/g, '');
    const currentHandText = resIncomeHand.textContent.replace(/[^\d]/g, '');
    const currentTax = parseInt(currentTaxText) || 0;
    const currentHand = parseInt(currentHandText) || 0;
    
    animateNumber(resIncomeTax, currentTax, tax, 300);
    animateNumber(resIncomeHand, currentHand, monthly, 300);
}

if(taxIncomeInput) {
    taxIncomeInput.addEventListener('input', calculateIncomeTax);
}

// Chatbot Logic
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const botInput = document.getElementById('bot-input');
const botSend = document.getElementById('bot-send');
const chatMessages = document.getElementById('chatbot-messages');

if(chatbotToggle) {
    chatbotToggle.addEventListener('click', () => chatbotWindow.classList.toggle('active'));
    chatbotClose.addEventListener('click', () => chatbotWindow.classList.remove('active'));
    
    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.className = sender === 'bot' ? 'bot-msg' : 'user-msg';
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    
    const handleBotResponse = (input) => {
        const val = input.toLowerCase();
        let reply = "I'm not sure about that. Would you like to schedule a call with CA Rajnish to discuss further?";
        
        if (val.includes('gst')) reply = "GST registration and filing are our specialties! We can help you file in 24-48 hours. Should I have a team member contact you?";
        else if (val.includes('itr') || val.includes('income tax')) reply = "ITR filing is easy with us. We handle everything from document review to e-filing. Want to see our pricing?";
        else if (val.includes('price') || val.includes('cost') || val.includes('fee')) reply = "Our fees are transparent and competitive. For a custom quote, please leave your email below!";
        else if (val.includes('@')) reply = "Thank you! I've recorded your email. Our team will reach out to you within 2 business hours.";
        
        setTimeout(() => addMessage(reply, 'bot'), 600);
    };

    botSend.addEventListener('click', () => {
        const text = botInput.value.trim();
        if(text) {
            addMessage(text, 'user');
            botInput.value = '';
            handleBotResponse(text);
        }
    });

    botInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') botSend.click();
    });
}

// Register GSAP Plugin
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// GSAP Reveal Animations
function initGSAP() {
    if (typeof gsap === 'undefined') return;

    // Set initial states to avoid flashes and ensure visibility if JS fails
    gsap.set(".reveal", { opacity: 0, y: 40 });
    gsap.set(".service-card", { opacity: 0, y: 60 });

    // 1. Reveal Sections
    gsap.utils.toArray('.reveal').forEach((section) => {
        gsap.to(section, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // 2. Staggered Service Cards
    gsap.to(".service-card", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15, 
        ease: "expo.out",
        scrollTrigger: {
            trigger: ".services-grid",
            start: "top 85%"
        }
    });

    // 3. Hero Entrance Timeline
    const heroTl = gsap.timeline();
    heroTl.from(".hero-title", { 
        y: 80, 
        opacity: 0, 
        duration: 1, 
        ease: "power3.out" 
    })
    .from(".hero-sub", { 
        y: 40, 
        opacity: 0, 
        duration: 1,
        ease: "power2.out" 
    }, "-=0.7") // Overlap for smoother feel, matches your 0.3s delay logic
    .from(".search-bar-wrapper", { 
        opacity: 0, 
        y: 20, 
        duration: 0.8, 
        ease: "power2.out" 
    }, "-=0.6")
    .from(".hero-btn", { 
        scale: 0.8, 
        opacity: 0, 
        duration: 0.6, 
        ease: "back.out(2)" 
    }, "-=0.4");
}

document.addEventListener('DOMContentLoaded', initGSAP);

// Ripple Effect for Buttons
document.addEventListener('click', function (e) {
    const target = e.target.closest('.primary-btn, .submit-btn, .chatbot-btn, .bg-nav-btn, .service-cta');
    if (target) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        target.appendChild(ripple);

        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }
});

// Scroll Progress & Subtle Parallax Logic
const scrollProgress = document.getElementById('scroll-progress');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    // 1. Progress Bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }

    // 2. Subtle Parallax for Hero
    if (heroContent && window.scrollY < window.innerHeight) {
        const offset = window.scrollY * 0.3; // Drift at 30% speed
        heroContent.style.transform = `translateY(${offset}px)`;
        // Fade out the hero content as user scrolls down for extra depth
        heroContent.style.opacity = 1 - (window.scrollY / (window.innerHeight * 0.8));
    }
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Preloader Logic
const preloader = document.getElementById('preloader');
const preloaderBar = document.getElementById('preloader-bar');

if (preloader) {
    let loadProgress = 0;
    const interval = setInterval(() => {
        loadProgress += Math.random() * 20;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Refresh ScrollTrigger after preloader hides
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }, 600);
        }
        if (preloaderBar) preloaderBar.style.width = `${loadProgress}%`;
    }, 150);

    window.addEventListener('load', () => {
        loadProgress = 100;
        if (preloaderBar) preloaderBar.style.width = '100%';
        setTimeout(() => {
            preloader.classList.add('hidden');
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 600);
    });
}

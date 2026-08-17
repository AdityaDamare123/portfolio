// Animated typing, modern scroll reveals, counters and micro-interactions
const words = [
  "Computer Engineering Student", "DSA Enthusiast", "Python Developer",
  "AI/ML Explorer", "Future Data Scientist"
];

const typingElement = document.getElementById("typing");
let wordIndex = 0, charIndex = 0, deleting = false;
function typeEffect() {
  if (!typingElement) return;
  const word = words[wordIndex];
  typingElement.textContent = word.slice(0, charIndex);
  if (!deleting && charIndex < word.length) charIndex++;
  else if (!deleting) { deleting = true; setTimeout(typeEffect, 1400); return; }
  else if (charIndex > 0) charIndex--;
  else { deleting = false; wordIndex = (wordIndex + 1) % words.length; }
  setTimeout(typeEffect, deleting ? 38 : 72);
}
typeEffect();

// Reveal content only once it enters the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) { target.classList.add("active"); revealObserver.unobserve(target); }
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Count statistics smoothly when visible.
const stats = document.querySelector(".stats");
if (stats) new IntersectionObserver(([entry], observer) => {
  if (!entry.isIntersecting) return;
  document.querySelectorAll(".counter").forEach(counter => {
    const target = Number(counter.dataset.target || 0), start = performance.now(), duration = 1150;
    const animate = now => {
      const p = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + (p === 1 ? "+" : "");
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  });
  observer.disconnect();
}, { threshold: .4 }).observe(stats);

// Convert each inline skill width into an animated CSS variable.
document.querySelectorAll(".skill-line span").forEach(bar => {
  bar.closest(".skill-card")?.style.setProperty("--level", bar.style.width);
});
const skillsObserver = new IntersectionObserver((entries) => entries.forEach(({isIntersecting,target}) => {
  if (isIntersecting) { target.classList.add("active"); skillsObserver.unobserve(target); }
}), { threshold: .25 });
document.querySelectorAll(".skill-card").forEach(card => skillsObserver.observe(card));

// Mobile navigation.
const menuButton = document.querySelector(".menu-btn"), navLinks = document.querySelector(".nav-links");
menuButton?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("mobile-active");
  menuButton.classList.toggle("open", open); menuButton.setAttribute("aria-expanded", open);
});
navLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("mobile-active"); menuButton?.classList.remove("open");
}));

// Gentle desktop parallax plus a cursor glow.
const heroVisual = document.querySelector(".hero-visual");
if (window.matchMedia("(min-width: 901px)").matches) {
  const glow = document.createElement("div"); glow.className = "cursor-glow"; document.body.append(glow);
  document.addEventListener("mousemove", event => {
    glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`;
    if (heroVisual) {
      const x = (innerWidth / 2 - event.clientX) / 45, y = (innerHeight / 2 - event.clientY) / 45;
      heroVisual.style.transform = `translate(${x}px, ${y}px)`;
    }
  });
}

// A calm raised-nav effect after scrolling.
const header = document.querySelector("header");
addEventListener("scroll", () => header?.classList.toggle("scrolled", scrollY > 20), { passive:true });


// ===============================
// SCROLL PROGRESS
// ===============================

const progress = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const percentage =
        (scrollTop / documentHeight) * 100;

    progress.style.width = percentage + "%";
});


// ===============================
// CUSTOM CURSOR
// ===============================

const cursor = document.querySelector(".cursor");
const cursorDot = document.querySelector(".cursor-dot");

document.addEventListener("mousemove", (e) => {

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";

});


document.querySelectorAll("a, button, .project-card, .skill-card")
.forEach(element => {

    element.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });

    element.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });

});


// ===============================
// 3D CARD TILT
// ===============================

document.querySelectorAll(".project-card, .skill-card")
.forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();

        const x =
            e.clientX - rect.left;

        const y =
            e.clientY - rect.top;

        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -6;

        const rotateY =
            ((x - centerX) / centerX) * 6;

        card.style.transform =
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-8px)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "perspective(1000px) rotateX(0) rotateY(0)";

    });

});


// ===============================
// PARTICLE NETWORK
// ===============================

const canvas =
    document.getElementById("particles");

const ctx =
    canvas.getContext("2d");

let particles = [];

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


class Particle {

    constructor() {

        this.x =
            Math.random() * canvas.width;

        this.y =
            Math.random() * canvas.height;

        this.size =
            Math.random() * 2 + 0.5;

        this.speedX =
            (Math.random() - .5) * .5;

        this.speedY =
            (Math.random() - .5) * .5;
    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width)
            this.speedX *= -1;

        if (this.y < 0 || this.y > canvas.height)
            this.speedY *= -1;
    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(0,229,255,.7)";

        ctx.fill();
    }
}


function createParticles() {

    particles = [];

    const amount =
        window.innerWidth < 700 ? 45 : 90;

    for (let i = 0; i < amount; i++) {
        particles.push(
            new Particle()
        );
    }
}

createParticles();


function connectParticles() {

    for (let a = 0; a < particles.length; a++) {

        for (
            let b = a + 1;
            b < particles.length;
            b++
        ) {

            const dx =
                particles[a].x -
                particles[b].x;

            const dy =
                particles[a].y -
                particles[b].y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 130) {

                ctx.beginPath();

                ctx.strokeStyle =
                    `rgba(
                        0,
                        229,
                        255,
                        ${1 - distance / 130}
                    )`;

                ctx.lineWidth = .4;

                ctx.moveTo(
                    particles[a].x,
                    particles[a].y
                );

                ctx.lineTo(
                    particles[b].x,
                    particles[b].y
                );

                ctx.stroke();
            }
        }
    }
}


function animateParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(particle => {

        particle.update();
        particle.draw();

    });

    connectParticles();

    requestAnimationFrame(
        animateParticles
    );
}

animateParticles();


// ===============================
// BACK TO TOP
// ===============================

const backTop =
    document.getElementById("backTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {
        backTop.classList.add("show");
    } else {
        backTop.classList.remove("show");
    }

});

backTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
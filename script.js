/* =========================================================
   ADITYA DAMARE | PORTFOLIO CORE ENGINE & MICRO-INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // 1. DYNAMIC THEME SYSTEM & LOCALSTORAGE
    // =========================================================
    const themeDots = document.querySelectorAll(".theme-dot");
    const savedTheme = localStorage.getItem("aditya_portfolio_theme") || "cyan";

    function applyTheme(themeName) {
        if (themeName === "cyan") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", themeName);
        }

        themeDots.forEach(dot => {
            dot.classList.toggle("active", dot.dataset.theme === themeName);
        });

        localStorage.setItem("aditya_portfolio_theme", themeName);
        updateParticleThemeColors();
    }

    themeDots.forEach(dot => {
        dot.addEventListener("click", () => {
            applyTheme(dot.dataset.theme);
            showToast(`Theme switched to ${dot.getAttribute("title") || dot.dataset.theme}! ✨`);
        });
    });

    // =========================================================
    // 2. TOAST NOTIFICATION ENGINE
    // =========================================================
    const toastContainer = document.getElementById("toastContainer");

    function showToast(message, icon = "✓") {
        if (!toastContainer) return;
        
        // Remove existing toast
        toastContainer.innerHTML = "";

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<span style="color: var(--accent); font-weight: bold;">${icon}</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("hiding");
            setTimeout(() => toast.remove(), 350);
        }, 2800);
    }

    // Copy to clipboard buttons
    document.querySelectorAll("[data-copy]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const textToCopy = btn.dataset.copy;
            if (navigator.clipboard && textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied "${textToCopy}" to clipboard! 📋`);
                }).catch(() => {
                    fallbackCopy(textToCopy);
                });
            } else if (textToCopy) {
                fallbackCopy(textToCopy);
            }
        });
    });

    function fallbackCopy(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            showToast(`Copied "${text}" to clipboard! 📋`);
        } catch (err) {
            showToast(`Please copy manually: ${text}`, "ℹ");
        }
        document.body.removeChild(textarea);
    }

    // =========================================================
    // 3. ADVANCED TYPING EFFECT WITH GLOW
    // =========================================================
    const typingElement = document.getElementById("typing");
    const roles = [
        "Computer Engineering Student",
        "DSA & C++ Problem Solver",
        "Python & AI/ML Developer",
        "Data Science Enthusiast",
        "Full-Stack Web Builder"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 80;

    function handleTyping() {
        if (!typingElement) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 40;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeDelay = 1800; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeDelay = 350;
        }

        setTimeout(handleTyping, typeDelay);
    }

    handleTyping();

    // =========================================================
    // 4. MOUSE-REACTIVE PARTICLE NETWORK WITH REPULSION
    // =========================================================
    const particleCanvas = document.getElementById("particles");
    let pCtx = particleCanvas ? particleCanvas.getContext("2d") : null;
    let particlesArray = [];
    let particleColor = "rgba(0, 229, 255, ";

    function updateParticleThemeColors() {
        const theme = document.documentElement.getAttribute("data-theme") || "cyan";
        if (theme === "violet") particleColor = "rgba(176, 84, 255, ";
        else if (theme === "emerald") particleColor = "rgba(0, 255, 157, ";
        else if (theme === "amber") particleColor = "rgba(255, 158, 0, ";
        else particleColor = "rgba(0, 229, 255, ";
    }
    updateParticleThemeColors();
    applyTheme(savedTheme);

    const mousePos = {
        x: null,
        y: null,
        radius: 130
    };

    window.addEventListener("mousemove", (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
        mousePos.x = null;
        mousePos.y = null;
    });

    function resizeParticleCanvas() {
        if (!particleCanvas) return;
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        initParticles();
    }

    class ReactiveParticle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 2 + 0.8;
            this.density = (Math.random() * 20) + 1;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.baseAlpha = Math.random() * 0.5 + 0.25;
        }

        draw() {
            if (!pCtx) return;
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fillStyle = particleColor + this.baseAlpha + ")";
            pCtx.fill();
        }

        update() {
            // Normal drift
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1;

            // Mouse Repulsion Physics
            if (mousePos.x !== null && mousePos.y !== null) {
                let dx = mousePos.x - this.x;
                let dy = mousePos.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mousePos.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (mousePos.radius - distance) / mousePos.radius;
                    let directionX = forceDirectionX * force * this.density * 0.6;
                    let directionY = forceDirectionY * force * this.density * 0.6;

                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }
    }

    function initParticles() {
        particlesArray = [];
        const count = window.innerWidth < 768 ? 40 : 85;
        for (let i = 0; i < count; i++) {
            particlesArray.push(new ReactiveParticle());
        }
    }

    function connectConstellations() {
        if (!pCtx) return;
        const maxDist = 115;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    let opacity = (1 - dist / maxDist) * 0.25;
                    pCtx.strokeStyle = particleColor + opacity + ")";
                    pCtx.lineWidth = 0.6;
                    pCtx.beginPath();
                    pCtx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    pCtx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    pCtx.stroke();
                }
            }
        }
    }

    function animateParticleSystem() {
        if (!pCtx || !particleCanvas) return;
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectConstellations();
        requestAnimationFrame(animateParticleSystem);
    }

    if (particleCanvas) {
        resizeParticleCanvas();
        window.addEventListener("resize", resizeParticleCanvas);
        animateParticleSystem();
    }

    // =========================================================
    // 5. MATRIX DIGITAL RAIN EASTER EGG (CLI Triggerable)
    // =========================================================
    const matrixCanvas = document.getElementById("matrixCanvas");
    let mCtx = matrixCanvas ? matrixCanvas.getContext("2d") : null;
    let matrixInterval = null;
    let matrixRunning = false;

    function toggleMatrixRain(forceState) {
        if (!matrixCanvas || !mCtx) return;
        matrixRunning = forceState !== undefined ? forceState : !matrixRunning;

        if (matrixRunning) {
            matrixCanvas.style.display = "block";
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
            
            const characters = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/*{}[]=+#~";
            const fontSize = 14;
            const columns = Math.floor(matrixCanvas.width / fontSize);
            const drops = [];

            for (let i = 0; i < columns; i++) {
                drops[i] = Math.floor(Math.random() * -50);
            }

            function drawMatrix() {
                mCtx.fillStyle = "rgba(4, 7, 13, 0.08)";
                mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

                mCtx.fillStyle = "#00ff9d";
                mCtx.font = fontSize + "px monospace";

                for (let i = 0; i < drops.length; i++) {
                    const char = characters.charAt(Math.floor(Math.random() * characters.length));
                    mCtx.fillText(char, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }

            clearInterval(matrixInterval);
            matrixInterval = setInterval(drawMatrix, 35);
            return true;
        } else {
            clearInterval(matrixInterval);
            mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            matrixCanvas.style.display = "none";
            return false;
        }
    }

    // =========================================================
    // 6. INTERACTIVE DEVELOPER TERMINAL (CLI) ENGINE
    // =========================================================
    const terminalInput = document.getElementById("terminalInput");
    const terminalOutput = document.getElementById("terminalOutput");
    const terminalBody = document.getElementById("terminalBody");
    const terminalChips = document.querySelectorAll(".chip-btn");

    const terminalCommands = {
        help: () => `
<span class="highlight">Available Commands:</span>
• <span class="cmd-echo">about</span>     : Learn more about Aditya's background & focus
• <span class="cmd-echo">skills</span>    : View technical skills, languages & toolsets
• <span class="cmd-echo">projects</span>  : Inspect featured engineering projects
• <span class="cmd-echo">coding</span>    : View LeetCode, CodeChef, & GitHub statistics
• <span class="cmd-echo">matrix</span>    : Toggle the cyber digital rain animation on/off
• <span class="cmd-echo">theme &lt;name&gt;</span>: Change palette (cyan, violet, emerald, amber)
• <span class="cmd-echo">contact</span>   : Get direct email, LinkedIn, and GitHub links
• <span class="cmd-echo">clear</span>     : Clear the terminal console
• <span class="cmd-echo">whoami</span>    : Display current session details
• <span class="cmd-echo">date</span>      : Print current date and time
        `,
        about: () => `
<span class="info">Aditya Damare</span> — Computer Engineering undergraduate in Pune, India.
Passionate about Data Structures, Algorithms, AI/ML, and turning ideas into tangible software products.
        `,
        skills: () => `
<span class="highlight">Core Technical Competencies:</span>
• <span class="success">Languages:</span> C++ (DSA Mastery), Python (AI/ML), JavaScript (ES6+), SQL
• <span class="success">Web & DB:</span> HTML5, CSS3, Modern UI/UX, SQLite, RESTful concepts
• <span class="success">AI / ML:</span> Natural Language Processing (NLP), Data Analysis, Pandas, NumPy
        `,
        projects: () => `
<span class="highlight">Featured Engineering Projects:</span>
1. <span class="info">AI Resume Scanner</span> — Python NLP tool comparing resume skills with job postings.
2. <span class="info">EduVerify Platform</span> — Tamper-proof academic credential verification via QR cryptography.
        `,
        coding: () => `
<span class="highlight">Competitive Programming Matrix:</span>
• <span class="info">LeetCode:</span> 120+ Solved problems (Arrays, Trees, Graphs, DP)
• <span class="info">CodeChef:</span> Active Division 3 Contestant
• <span class="info">GitHub:</span> Open Source codebases & repositories
        `,
        contact: () => `
<span class="highlight">Let's Connect:</span>
• Email: <a href="mailto:adityad8314@gmail.com" style="color:var(--accent);">adityad8314@gmail.com</a>
• LinkedIn: <a href="https://www.linkedin.com/in/aditya-damare-90195541b" target="_blank" style="color:var(--accent);">linkedin.com/in/aditya-damare-90195541b</a>
• GitHub: <a href="https://github.com/AdityaDamare123" target="_blank" style="color:var(--accent);">github.com/AdityaDamare123</a>
        `,
        whoami: () => `<span class="success">guest@aditya-portfolio (Role: Recruiter / Tech Explorer)</span>`,
        date: () => `<span class="info">${new Date().toString()}</span>`,
        sudo: () => `<span class="error">Permission denied: You are already in super-user exploration mode! 🚀</span>`
    };

    function executeCommand(rawCmd) {
        const cmdTrimmed = rawCmd.trim();
        if (!cmdTrimmed || !terminalOutput) return;

        // Echo typed command
        const userLine = document.createElement("div");
        userLine.className = "terminal-line";
        userLine.innerHTML = `<span class="terminal-user">guest</span><span class="terminal-host">@aditya</span>:<span class="terminal-path">~</span>$ <span class="cmd-echo">${cmdTrimmed}</span>`;
        terminalOutput.appendChild(userLine);

        const parts = cmdTrimmed.toLowerCase().split(" ");
        const baseCmd = parts[0];
        const arg = parts[1];

        if (baseCmd === "clear") {
            terminalOutput.innerHTML = "";
            return;
        }

        if (baseCmd === "matrix") {
            const isNowActive = toggleMatrixRain();
            const outputLine = document.createElement("div");
            outputLine.className = "terminal-line " + (isNowActive ? "success" : "info");
            outputLine.innerHTML = isNowActive 
                ? "Matrix digital stream: <span class='success'>ONLINE</span> 🟢 (Type 'matrix' again to turn off)"
                : "Matrix digital stream: <span class='highlight'>OFFLINE</span>";
            terminalOutput.appendChild(outputLine);
        } else if (baseCmd === "theme") {
            if (["cyan", "violet", "emerald", "amber"].includes(arg)) {
                applyTheme(arg);
                const outputLine = document.createElement("div");
                outputLine.className = "terminal-line success";
                outputLine.innerHTML = `Switched theme palette to <span class="highlight">${arg}</span>!`;
                terminalOutput.appendChild(outputLine);
            } else {
                const outputLine = document.createElement("div");
                outputLine.className = "terminal-line error";
                outputLine.innerHTML = `Unknown palette '${arg || ""}'. Options: cyan, violet, emerald, amber.`;
                terminalOutput.appendChild(outputLine);
            }
        } else if (terminalCommands[baseCmd]) {
            const outputLine = document.createElement("div");
            outputLine.className = "terminal-line";
            outputLine.innerHTML = terminalCommands[baseCmd]();
            terminalOutput.appendChild(outputLine);
        } else {
            const errorLine = document.createElement("div");
            errorLine.className = "terminal-line error";
            errorLine.innerHTML = `command not found: "${baseCmd}". Type <span class="highlight">help</span> for available commands.`;
            terminalOutput.appendChild(errorLine);
        }

        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    if (terminalInput) {
        terminalInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                executeCommand(terminalInput.value);
                terminalInput.value = "";
            }
        });
    }

    terminalChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const cmd = chip.dataset.cmd;
            if (cmd) {
                executeCommand(cmd);
            }
        });
    });

    // =========================================================
    // 7. SPOTLIGHT CARDS & 3D TILT PHYSICS
    // =========================================================
    const spotlightCards = document.querySelectorAll(".spotlight-card");

    spotlightCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            // Subtle 3D tilt
            if (window.innerWidth > 900) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            }
        });

        card.addEventListener("mouseleave", () => {
            if (window.innerWidth > 900) {
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
            }
        });
    });

    // =========================================================
    // 8. MAGNETIC BUTTONS & INTERACTIVE MICRO-CURSORS
    // =========================================================
    const cursor = document.querySelector(".cursor");
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorGlow = document.querySelector(".cursor-glow");
    const magneticElements = document.querySelectorAll(".btn-magnetic");

    if (window.matchMedia("(min-width: 901px)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (cursorDot) {
                cursorDot.style.left = `${mouseX}px`;
                cursorDot.style.top = `${mouseY}px`;
            }

            if (cursorGlow) {
                cursorGlow.style.left = `${mouseX}px`;
                cursorGlow.style.top = `${mouseY}px`;
            }
        });

        // Smooth Lerp loop for outer cursor
        function renderCursor() {
            cursorX += (mouseX - cursorX) * 0.22;
            cursorY += (mouseY - cursorY) * 0.22;

            if (cursor) {
                cursor.style.left = `${cursorX}px`;
                cursor.style.top = `${cursorY}px`;
            }
            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        // Magnetic Pull Logic
        magneticElements.forEach(elem => {
            elem.addEventListener("mousemove", (e) => {
                const rect = elem.getBoundingClientRect();
                const elemCenterX = rect.left + rect.width / 2;
                const elemCenterY = rect.top + rect.height / 2;

                const distanceX = (e.clientX - elemCenterX) * 0.25;
                const distanceY = (e.clientY - elemCenterY) * 0.25;

                elem.style.transform = `translate(${distanceX}px, ${distanceY}px)`;
                if (cursor) cursor.classList.add("active");
            });

            elem.addEventListener("mouseleave", () => {
                elem.style.transform = "translate(0, 0)";
                if (cursor) cursor.classList.remove("active");
            });
        });

        // Hover expansions
        document.querySelectorAll("a, button, input, .spotlight-card, .chip-btn, .theme-dot").forEach(el => {
            el.addEventListener("mouseenter", () => cursor && cursor.classList.add("active"));
            el.addEventListener("mouseleave", () => cursor && cursor.classList.remove("active"));
        });
    }

    // =========================================================
    // 9. CLICK SPARKLE / PARTICLE EXPLOSION
    // =========================================================
    const sparkleContainer = document.querySelector(".sparkle-container");

    document.addEventListener("click", (e) => {
        if (!sparkleContainer) return;
        const particleCount = 7;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.className = "sparkle-particle";

            const angle = (Math.PI * 2 / particleCount) * i;
            const velocity = Math.random() * 35 + 20;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;

            particle.style.left = `${e.clientX}px`;
            particle.style.top = `${e.clientY}px`;
            particle.style.setProperty("--dx", `${dx}px`);
            particle.style.setProperty("--dy", `${dy}px`);

            sparkleContainer.appendChild(particle);

            setTimeout(() => particle.remove(), 600);
        }
    });

    // =========================================================
    // 10. PROJECT DETAILS MODAL
    // =========================================================
    const projectDetails = {
        "resume-scanner": {
            icon: "📄",
            title: "AI Resume Scanner",
            description: "An intelligent Python-based resume analysis application that extracts skills, experience, and key career signals from PDF and DOCX files. It compares candidate profiles against job descriptions to identify fit score and missing requirements.",
            tags: ["Python", "NLP", "SQLite", "Text Mining"]
        },
        "eduverify": {
            icon: "🔐",
            title: "EduVerify System",
            description: "A tamper-proof academic verification platform built around encrypted QR credential generation and validation. It helps institutions and recruiters confirm certificate authenticity with a faster, more reliable verification flow.",
            tags: ["JavaScript", "QR Security", "HTML5/CSS3", "Verification"]
        },
        "summarizer-hf": {
            icon: "📝",
            title: "Summarizer-HF",
            description: "A natural language processing project that uses Hugging Face transformer models to generate concise summaries from long-form text.",
            tags: ["Python", "Hugging Face", "Transformers", "NLP"]
        }
    };

    const projectModal = document.getElementById("projectModal");
    const projectModalTitle = document.getElementById("projectModalTitle");
    const projectModalDescription = document.getElementById("projectModalDescription");
    const projectModalIcon = document.getElementById("projectModalIcon");
    const projectModalMeta = document.getElementById("projectModalMeta");
    const projectModalCloseBtn = document.querySelector(".project-modal-close");

    function openProjectModal(projectId) {
        if (!projectModal || !projectDetails[projectId]) return;

        const detail = projectDetails[projectId];
        projectModalTitle.textContent = detail.title;
        projectModalDescription.textContent = detail.description;
        projectModalIcon.textContent = detail.icon;
        projectModalMeta.innerHTML = detail.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join("");
        projectModal.classList.add("active");
        projectModal.setAttribute("aria-hidden", "false");
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove("active");
        projectModal.setAttribute("aria-hidden", "true");
    }

    document.querySelectorAll(".project-details-btn").forEach(button => {
        button.addEventListener("click", () => openProjectModal(button.dataset.project));
    });

    if (projectModalCloseBtn) {
        projectModalCloseBtn.addEventListener("click", closeProjectModal);
    }

    projectModal?.addEventListener("click", (event) => {
        if (event.target.matches("[data-close-modal='true']") || event.target === projectModal) {
            closeProjectModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && projectModal && projectModal.classList.contains("active")) {
            closeProjectModal();
        }
    });

    // =========================================================
    // 11. CONTACT FORM HANDLER
    // =========================================================
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const name = (formData.get("name") || "").toString().trim();
            const email = (formData.get("email") || "").toString().trim();
            const message = (formData.get("message") || "").toString().trim();

            if (!name || !email || !message) {
                showToast("Please complete all fields before sending.", "! ");
                return;
            }

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Something went wrong.');
                }

                showToast(result.message || 'Message sent successfully.', '✓');
                contactForm.reset();
            } catch (error) {
                showToast(error.message || 'Unable to send message right now.', '⚠');
            }
        });
    }

    // =========================================================
    // 12. CATEGORY FILTER SYSTEM (Projects & Skills)
    // =========================================================
    function setupFilter(containerId, itemsSelector) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const filterButtons = container.querySelectorAll(".filter-btn");
        const items = document.querySelectorAll(itemsSelector);

        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                button.classList.add("active");

                const filter = button.dataset.filter;

                items.forEach(item => {
                    const category = item.dataset.category || "";
                    if (filter === "all" || category.includes(filter)) {
                        item.style.display = "";
                        setTimeout(() => {
                            item.style.opacity = "1";
                            item.style.transform = "scale(1)";
                        }, 50);
                    } else {
                        item.style.opacity = "0";
                        item.style.transform = "scale(0.95)";
                        setTimeout(() => {
                            item.style.display = "none";
                        }, 250);
                    }
                });
            });
        });
    }

    setupFilter("projectsFilterPills", "#projectsGrid .project-card");
    setupFilter("skillsFilterPills", "#skillsGrid .skill-card");

    // =========================================================
    // 11. SCROLL REVEALS, SKILL PROGRESS & NUMBER COUNTERS
    // =========================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
            if (isIntersecting) {
                target.classList.add("active");

                // If this is a skill card, trigger width expansion
                if (target.classList.contains("skill-card")) {
                    const lineSpan = target.querySelector(".skill-line span");
                    if (lineSpan && lineSpan.style.width) {
                        target.style.setProperty("--level", lineSpan.style.width);
                    }
                }
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal, .skill-card").forEach(el => revealObserver.observe(el));

    // Stats Counter Animation
    const statsSection = document.querySelector(".stats");
    if (statsSection) {
        const statsObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                document.querySelectorAll(".counter").forEach(counter => {
                    const target = parseInt(counter.dataset.target, 10) || 0;
                    const duration = 1400;
                    const start = performance.now();

                    function countTick(now) {
                        const progress = Math.min((now - start) / duration, 1);
                        // EaseOutQuad
                        const easeProgress = 1 - (1 - progress) * (1 - progress);
                        const currentVal = Math.floor(easeProgress * target);
                        
                        counter.textContent = currentVal + (progress === 1 ? "+" : "");
                        if (progress < 1) requestAnimationFrame(countTick);
                    }

                    requestAnimationFrame(countTick);
                });
                statsObserver.disconnect();
            }
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // =========================================================
    // 12. SCROLL PROGRESS BAR & BACK TO TOP
    // =========================================================
    const progressBar = document.querySelector(".scroll-progress");
    const backTopBtn = document.getElementById("backTop");
    const header = document.querySelector("header");
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Progress bar
        if (progressBar && totalHeight > 0) {
            const percent = (scrollY / totalHeight) * 100;
            progressBar.style.width = `${percent}%`;
        }

        // Header backdrop blur enhancement
        if (header) {
            header.classList.toggle("scrolled", scrollY > 30);
        }

        // Back to Top button
        if (backTopBtn) {
            backTopBtn.classList.toggle("show", scrollY > 400);
        }

        // Active Navigation Scroll Spy
        let currentSectionId = "";
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.offsetHeight;
            if (scrollY >= secTop && scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }, { passive: true });

    if (backTopBtn) {
        backTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Mobile Navigation Drawer Toggle
    const menuBtn = document.querySelector(".menu-btn");
    const navMenu = document.querySelector(".nav-links");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("mobile-active");
            menuBtn.textContent = navMenu.classList.contains("mobile-active") ? "✕" : "☰";
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("mobile-active");
                if (menuBtn) menuBtn.textContent = "☰";
            });
        });
    }

    console.log("%c⚡ Aditya Damare Portfolio Engine initialized successfully! Ready for opportunities.", "color: #00e5ff; font-weight: bold; font-size: 14px;");
});

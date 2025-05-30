document.addEventListener("DOMContentLoaded", function () {
            // Прогресс-бар
            const steps = document.querySelectorAll(".journey-step");
            const svg = document.querySelector(".progress-line");

            const stepCount = steps.length;
            const spacing = 64;
            const startY = 36;
            const endY = startY + spacing * (stepCount - 1);
            const lineLength = endY - startY;

            svg.setAttribute("height", endY + 24);

            // Создаем градиент для линии прогресса
            const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            gradient.setAttribute("id", "progressGradient");
            gradient.setAttribute("x1", "0%");
            gradient.setAttribute("y1", "0%");
            gradient.setAttribute("x2", "0%");
            gradient.setAttribute("y2", "100%");
            const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stop1.setAttribute("offset", "0%");
            stop1.setAttribute("stop-color", "#0A66C2");
            const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stop2.setAttribute("offset", "100%");
            stop2.setAttribute("stop-color", "#00A3FF");
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            defs.appendChild(gradient);
            svg.appendChild(defs);

            const bgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            bgLine.setAttribute("x1", 20);
            bgLine.setAttribute("y1", startY);
            bgLine.setAttribute("x2", 20);
            bgLine.setAttribute("y2", endY);
            bgLine.setAttribute("stroke", "#e9ecef");
            bgLine.setAttribute("stroke-width", 5);
            svg.appendChild(bgLine);

            const progressLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            progressLine.setAttribute("x1", 20);
            progressLine.setAttribute("y1", startY);
            progressLine.setAttribute("x2", 20);
            progressLine.setAttribute("y2", endY);
            progressLine.setAttribute("stroke", "url(#progressGradient)");
            progressLine.setAttribute("stroke-width", 5);
            progressLine.setAttribute("stroke-dasharray", lineLength);
            progressLine.setAttribute("stroke-dashoffset", lineLength);
            progressLine.classList.add("progress-line-fill");
            svg.appendChild(progressLine);

            const dots = [];

            steps.forEach((step, index) => {
                const cy = startY + spacing * index;
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", 20);
                circle.setAttribute("cy", cy);
                circle.setAttribute("r", 8);
                circle.setAttribute("fill", "#e9ecef");
                circle.setAttribute("data-step", index + 1);
                circle.classList.add("progress-dot");
                svg.appendChild(circle);
                dots.push(circle);
            });

            // IntersectionObserver: отслеживает появление шагов
            let maxVisibleIndex = -1;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const step = entry.target;
                        const index = [...steps].indexOf(step);
                        if (entry.isIntersecting) {
                            step.classList.add("visible");
                            if (index > maxVisibleIndex) {
                                maxVisibleIndex = index;
                                for (let i = 0; i <= index; i++) {
                                    dots[i].setAttribute("fill", "#0a84ff");
                                    dots[i].classList.add("active");
                                }
                                progressLine.style.strokeDashoffset = lineLength - spacing * index;
                            }
                        } else {
                            step.classList.remove("visible");
                        }
                    });
                },
                {
                    threshold: 0.5,
                    rootMargin: "0px"
                }
            );

            steps.forEach((step) => observer.observe(step));
        });
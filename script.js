
  const dot = document.querySelector(".cursor-dot");
  const trail = document.querySelector(".cursor-trail");
  let x = 0, y = 0;

  document.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.style.top = `${y}px`;
    dot.style.left = `${x}px`;
  });

  function animateTrail() {
    const trailX = parseFloat(trail.style.left || 0);
    const trailY = parseFloat(trail.style.top || 0);

    trail.style.top = trailY + (y - trailY) * 0.15 + "px";
    trail.style.left = trailX + (x - trailX) * 0.15 + "px";

    requestAnimationFrame(animateTrail);
  }

  animateTrail();

  const nameText = document.querySelector('.name');
  const letters = nameText.textContent.split('');
  nameText.textContent = '';
  letters.forEach(letter => {
    const span = document.createElement('span');
    span.textContent = letter;
    nameText.appendChild(span);
  });

  gsap.from('.name span', {
    x: () => gsap.utils.random(-200, 200),
    y: () => gsap.utils.random(-100, 100),
    opacity: 0,
    rotation: () => gsap.utils.random(-30, 30),
    filter: 'blur(6px)',
    stagger: 0.05,
    duration: 1.8,
    ease: 'expo.out'
  });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".hero-content p span, .hero-content p", {
    opacity: 0,
    y: 30,
    duration: 1.1,
    stagger: 0.1,
  });

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-right");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("open");
  });

  document.querySelectorAll(".nav-right a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("open");
    });
  });


    const discoverBtn = document.getElementById("discover-btn");
    const popup = document.getElementById("mac-popup");
    const closeBtn = document.getElementById("close-popup");

    discoverBtn.onclick = () => popup.classList.add("show");
    closeBtn.onclick = () => popup.classList.remove("show");

    

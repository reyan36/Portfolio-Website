/* Custom cursor */
const dot = document.querySelector(".cursor-dot");
const trail = document.querySelector(".cursor-trail");
let x = 0, y = 0;
let trailRAF = null;

if (dot && trail) {
  document.addEventListener("mousemove", (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.top = `${y}px`; dot.style.left = `${x}px`;
    if (!trailRAF) animateTrail();
  });

  function animateTrail() {
    const trailX = parseFloat(trail.style.left || 0);
    const trailY = parseFloat(trail.style.top || 0);
    const dx = x - trailX;
    const dy = y - trailY;
    trail.style.top = trailY + dy * 0.15 + "px";
    trail.style.left = trailX + dx * 0.15 + "px";
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      trailRAF = requestAnimationFrame(animateTrail);
    } else {
      trailRAF = null;
    }
  }
}

/* Responsive hamburger menu */
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-right");

if (hamburger && navMenu) {
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
}

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


// SEARCH FUNCTIONALITY
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", function () {
  let filter = searchInput.value.toLowerCase();
  document.querySelectorAll("tbody tr").forEach(row => {
    let articleName = row.children[0].textContent.toLowerCase();
    row.style.display = articleName.includes(filter) ? "" : "none";
  });
});


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

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

/* ========== Skeleton Loading ========== */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.skeleton-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.96)';
    });
    setTimeout(() => {
      document.querySelectorAll('.skeleton-card').forEach(el => el.remove());
      document.querySelectorAll('.hack-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.06}s`;
        card.classList.add('card-visible');
      });
    }, 300);
  }, 400);
});

/* ========== Gallery Modal ========== */
let galleryImages = [];
let galleryIndex = 0;
let touchStartX = 0;

function openGallery(btn) {
  galleryImages = JSON.parse(btn.dataset.images);
  galleryIndex = 0;
  document.getElementById('galleryOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  renderThumbs();
  showGalleryImage(0);
}

function closeGallery() {
  document.getElementById('galleryOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function galleryNav(dir) {
  galleryIndex = (galleryIndex + dir + galleryImages.length) % galleryImages.length;
  showGalleryImage(galleryIndex);
}

function showGalleryImage(idx) {
  galleryIndex = idx;
  const img = document.getElementById('galleryImg');
  const spinner = document.getElementById('gallerySpinner');
  const counter = document.getElementById('galleryCounter');

  img.style.opacity = '0';
  spinner.style.display = 'block';

  const newImg = new Image();
  newImg.onload = () => {
    img.src = newImg.src;
    spinner.style.display = 'none';
    img.style.opacity = '1';
  };
  newImg.onerror = () => {
    img.src = newImg.src;
    spinner.style.display = 'none';
    img.style.opacity = '0.5';
  };
  newImg.src = galleryImages[idx];
  counter.textContent = (idx + 1) + ' / ' + galleryImages.length;

  document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}

function renderThumbs() {
  const container = document.getElementById('galleryThumbs');
  container.innerHTML = galleryImages.map((src, i) =>
    '<div class="gallery-thumb' + (i === 0 ? ' active' : '') + '" onclick="showGalleryImage(' + i + ')">' +
    '<div class="thumb-spinner"></div>' +
    '<img src="' + src + '" alt="Thumbnail ' + (i + 1) + '" onload="this.previousElementSibling.style.display=\'none\'; this.style.opacity=\'1\';">' +
    '</div>'
  ).join('');
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('galleryOverlay');
  if (!overlay || !overlay.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') galleryNav(-1);
  if (e.key === 'ArrowRight') galleryNav(1);
  if (e.key === 'Escape') closeGallery();
});

// Close on overlay background click
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'galleryOverlay') closeGallery();
});

// Touch/swipe support
document.addEventListener('touchstart', (e) => {
  const overlay = document.getElementById('galleryOverlay');
  if (!overlay || !overlay.classList.contains('active')) return;
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const overlay = document.getElementById('galleryOverlay');
  if (!overlay || !overlay.classList.contains('active')) return;
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 50) {
    galleryNav(diff > 0 ? -1 : 1);
  }
});

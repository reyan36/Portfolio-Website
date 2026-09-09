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
  if (!btn) return;
  const raw = btn.getAttribute('data-images') || btn.dataset.images;
  try {
    galleryImages = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (err) {
    console.error('Invalid gallery image data:', err);
    return;
  }
  if (!Array.isArray(galleryImages) || galleryImages.length === 0) return;

  galleryIndex = 0;
  const overlay = document.getElementById('galleryOverlay');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('gallery-open');

  // Toggle arrows & thumbnails based on image count
  const prevArrow = document.querySelector('.gallery-prev');
  const nextArrow = document.querySelector('.gallery-next');
  const thumbsContainer = document.getElementById('galleryThumbs');
  const hasMultiple = galleryImages.length > 1;

  if (prevArrow) prevArrow.style.display = hasMultiple ? 'flex' : 'none';
  if (nextArrow) nextArrow.style.display = hasMultiple ? 'flex' : 'none';
  if (thumbsContainer) {
    thumbsContainer.style.display = hasMultiple ? 'flex' : 'none';
    if (hasMultiple) renderThumbs();
  }

  showGalleryImage(0);
}

function closeGallery() {
  const overlay = document.getElementById('galleryOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  document.body.classList.remove('gallery-open');
}

function galleryNav(dir) {
  if (!galleryImages || galleryImages.length <= 1) return;
  galleryIndex = (galleryIndex + dir + galleryImages.length) % galleryImages.length;
  showGalleryImage(galleryIndex);
}

function showGalleryImage(idx) {
  galleryIndex = idx;
  const img = document.getElementById('galleryImg');
  const spinner = document.getElementById('gallerySpinner');
  const counter = document.getElementById('galleryCounter');

  if (!img) return;

  img.style.opacity = '0';
  if (spinner) spinner.style.display = 'block';

  const newImg = new Image();
  newImg.onload = () => {
    img.src = newImg.src;
    if (spinner) spinner.style.display = 'none';
    img.style.opacity = '1';
  };
  newImg.onerror = () => {
    img.src = newImg.src;
    if (spinner) spinner.style.display = 'none';
    img.style.opacity = '0.5';
  };
  newImg.src = galleryImages[idx];
  if (counter) {
    counter.textContent = galleryImages.length > 1 ? (idx + 1) + ' / ' + galleryImages.length : '';
  }

  document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}

function renderThumbs() {
  const container = document.getElementById('galleryThumbs');
  if (!container) return;
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

// Close on overlay background click (outside main image/thumbs/arrows)
document.addEventListener('click', (e) => {
  const overlay = document.getElementById('galleryOverlay');
  if (!overlay || !overlay.classList.contains('active')) return;
  if (e.target === overlay || e.target.classList.contains('gallery-body')) {
    closeGallery();
  }
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

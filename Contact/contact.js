/* ===== Custom cursor ===== */
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

/* ===== Responsive hamburger menu ===== */
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

/* ===== Contact page: captcha + AJAX submit (single handler) ===== */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const form     = $("contactForm");
  const statusEl = $("formStatus");
  const cq       = $("captchaQuestion");
  const ca       = $("captchaAnswer");

  if (!form || !cq || !ca) return; // not on contact page

  // captcha helpers
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pickOp  = () => (Math.random() < 0.5 ? "+" : "−");

  let current = null;
  function makeQuestion() {
    let a = randInt(2, 12), b = randInt(1, 12);
    const op = pickOp();
    if (op === "−" && b > a) [a, b] = [b, a];
    return { text: `${a} ${op} ${b} = ?`, ans: op === "+" ? a + b : a - b };
  }
  function refreshQuestion() {
    current = makeQuestion();
    cq.textContent = current.text;
    ca.value = "";
    ca.placeholder = "Answer";
  }
  refreshQuestion();

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // always AJAX

    // honeypot
    const trap = $("trap");
    if (trap && trap.value) return;

    // captcha check
    const ok = Number(ca.value) === current.ans;
    if (!ok) {
      statusEl.textContent = "Wrong answer — try again.";
      statusEl.style.color = "#b00020";
      refreshQuestion();
      ca.focus();
      return;
    }

    // send via fetch
    statusEl.textContent = "Sending…";
    statusEl.style.color = "#333";
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn && (submitBtn.disabled = true);

    try {
      const res = await fetch(form.action || "sendMail.php", {
        method: "POST",
        body: new FormData(form),
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        statusEl.textContent = "Message sent successfully!";
        statusEl.style.color = "#0a7b34";
        form.reset();
        refreshQuestion(); // ✅ regenerate captcha after success
      } else {
        throw new Error(data.msg || "Send failed");
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Couldn't send, please try again later.";
      statusEl.style.color = "#b00020";
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });

  /* Optional: email reveal block */
  const rq = $("revealQuestion");
  const ra = $("revealAnswer");
  const revealBtn = $("revealBtn");
  const revealBox = $("emailReveal");
  if (rq && ra && revealBtn && revealBox) {
    let revealQ;
    const makeReveal = () => {
      let q = makeQuestion();
      revealQ = q; rq.textContent = q.text;
    };
    makeReveal();
    revealBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (Number(ra.value) === revealQ.ans) {
        revealBox.hidden = false;
        ra.value = "";
      } else {
        ra.value = "";
        ra.placeholder = "Try again";
      }
      makeReveal();
    });

    const copyBtn = $("copyEmail");
    const myEmail = $("myEmail");
    if (copyBtn && myEmail) {
      copyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(myEmail.textContent).then(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
          setTimeout(() => (copyBtn.innerHTML = '<i class="fa-regular fa-clone"></i>'), 1200);
        });
      });
    }
  }
});
// Select the question mark element and popup
const questionMark = document.getElementById('questionMark');
const moviePopup = document.getElementById('movie-popup');
const closePopup = document.getElementById('close-popup');

// When the question mark is clicked, show the popup
questionMark.addEventListener('click', () => {
  moviePopup.classList.add('show');
});

// Close the popup when the close button is clicked
closePopup.addEventListener('click', () => {
  moviePopup.classList.remove('show');
});

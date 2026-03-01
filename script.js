
const dot = document.querySelector(".cursor-dot");
const trail = document.querySelector(".cursor-trail");
let x = 0, y = 0;
let trailRAF = null;

document.addEventListener("mousemove", (e) => {
  x = e.clientX;
  y = e.clientY;
  dot.style.top = `${y}px`;
  dot.style.left = `${x}px`;
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

const popupGifs = [
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExam45cmc0ZTB6OHkwMHZ4NWk4OWNkb2k0aXZqZmk0M2J1bGNzNXNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKQjYkqlg9u9VSg/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2dhZnh3dHQyM2o3Nmh5MDg3bW8wMDUxeTJrMThjZzJ5eDN4ZWFjNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Xd7QqFPv4IVAz8dnog/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmczOHpsZHh1MTBocXcxbnhoc2s0bnNleWloNW81NnFxYnFjMHgzayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cU7jXQjldnZ7y/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWZoYzRpcGR5cWRwaWgweHVkb3k1dDgwb2VnMHB1bjVicGxvcXZzMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F1ShQt35Nj2rPf6klm/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2s4eGJmZTVqMDB1NHVtcmZyY2N6dzhkMDVhajBkZ2dhcWg2cW1yayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cx5kVr1DRtfV8Q/giphy.gif"
];
const randomGifImg = document.querySelector(".animation-box img");
if (randomGifImg) {
  randomGifImg.src = popupGifs[Math.floor(Math.random() * popupGifs.length)];
}

/* --- SPOTIFY / LAST.FM WIDGET --- */
document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------
  // 1. ENTER YOUR DETAILS HERE
  // ------------------------------------------------------
  const API_KEY = "cc160dae462f4874dacde217a6123edc";
  const USERNAME = "reyan36";
  // ------------------------------------------------------

  const trackName = document.getElementById("track-name");
  const musicLabel = document.querySelector(".music-label");
  const equalizer = document.querySelector(".equalizer");
  const widget = document.getElementById("music-widget");

  async function fetchMusic() {
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`
      );
      const data = await response.json();
      const track = data.recenttracks.track[0];

      // Check if currently playing (Last.fm returns '@attr': { 'nowplaying': 'true' })
      const isPlaying = track["@attr"] && track["@attr"].nowplaying === "true";

      if (isPlaying) {
        // Update Text
        const artist = track.artist["#text"];
        const name = track.name;
        trackName.textContent = `${name} — ${artist}`;
        musicLabel.textContent = "LISTENING NOW";
        musicLabel.style.color = "#00c853"; // Green

        // Start Equalizer
        equalizer.classList.remove("paused");

        // Link to song
        widget.onclick = () => window.open(track.url, "_blank");
      } else {
        // Not playing, show last played
        const artist = track.artist["#text"];
        const name = track.name;
        trackName.textContent = `${name} — ${artist}`;
        musicLabel.textContent = "LAST PLAYED";
        musicLabel.style.color = "#666"; // Grey

        // Stop Equalizer
        equalizer.classList.add("paused");
      }
    } catch (error) {
      console.error("Music fetch error:", error);
      trackName.textContent = "Spotify Hidden";
      equalizer.classList.add("paused");
    }
  }

  // Fetch immediately, then every 10 seconds
  if (API_KEY !== "YOUR_LAST_FM_API_KEY_HERE") {
    fetchMusic();
    setInterval(fetchMusic, 30000);
  }
});
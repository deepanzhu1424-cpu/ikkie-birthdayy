
/* =====================================
   IKKIE'S BIRTHDAY WEBSITE
   Personalize the settings below first.
===================================== */

// Apni girlfriend ka next birthday yahan set karo.
// Format: "YYYY-MM-DD"
// Example only: "2027-05-15"
const BIRTHDAY_DATE = "2027-01-01";

// Birthday midnight countdown ke liye India timezone.
const TIME_ZONE = "Asia/Kolkata";

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const cake = document.getElementById("cake");
const cakeMessage = document.getElementById("cakeMessage");
const wishBtn = document.getElementById("wishBtn");
const confettiBox = document.getElementById("confetti");
const secretBtn = document.getElementById("secretBtn");
const secretMessage = document.getElementById("secretMessage");

let cakeBlown = false;
let confettiTimer;

// ---------- BACKGROUND MUSIC ----------
// Put your own MP3 file at audio/song.mp3.
// Browsers generally require a click before music can play.

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicBtn.textContent = "♫ Pause our song";
    } catch (error) {
      musicBtn.textContent = "Couldn't play song — check audio/song.mp3";
      console.error("Music playback failed:", error);
    }
  } else {
    music.pause();
    musicBtn.textContent = "♫ Play our song";
  }
});

music.addEventListener("error", () => {
  musicBtn.textContent = "♫ Check audio/song.mp3";
});

// ---------- BIRTHDAY CAKE ----------

function blowCandles() {
  if (cakeBlown) return;

  cakeBlown = true;
  cake.classList.add("blown");
  cakeMessage.textContent =
    "Your wish is on its way to the universe! ✨💗";
  wishBtn.textContent = "Wish sent with love 💌";
  launchConfetti();
}

cake.addEventListener("click", blowCandles);

cake.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    blowCandles();
  }
});

wishBtn.addEventListener("click", () => {
  if (!cakeBlown) {
    blowCandles();
  } else {
    launchConfetti();
    cakeMessage.textContent =
      "May your next year be filled with beautiful things, Ikkie! ❤️";
  }
});

// ---------- CONFETTI ----------

function launchConfetti() {
  clearTimeout(confettiTimer);
  confettiBox.replaceChildren();

  const colors = ["#ffb9df", "#c9b7ff", "#fff0a6", "#ffffff", "#a8e6cf"];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    fragment.appendChild(piece);
  }

  confettiBox.appendChild(fragment);

  confettiTimer = setTimeout(() => {
    confettiBox.replaceChildren();
  }, 6000);
}

// ---------- BIRTHDAY COUNTDOWN ----------

const timeFields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

function getIndiaDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter(part => part.type !== "literal")
      .map(part => [part.type, Number(part.value)])
  );
}

function getNextBirthdayTarget() {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(BIRTHDAY_DATE);

  if (!match) return null;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const check = new Date(Date.UTC(year, month - 1, day));

  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }

  const now = new Date();
  const india = getIndiaDateParts(now);
  let targetYear = india.year;

  // If this year's birthday has passed, use next year.
  const thisYearTarget = Date.UTC(
    targetYear, month - 1, day, -5, -30
  );

  // Use the actual next birthday midnight in India.
  // Convert India midnight to UTC (UTC minus 5h 30m).
  let target = Date.UTC(targetYear, month - 1, day) - 330 * 60 * 1000;

  if (target <= now.getTime()) {
    targetYear += 1;
    target = Date.UTC(targetYear, month - 1, day) - 330 * 60 * 1000;
  }

  return target;
}

function updateCountdown() {
  const target = getNextBirthdayTarget();

  if (target === null) {
    Object.values(timeFields).forEach(field => {
      field.textContent = "--";
    });
    return;
  }

  let remaining = Math.max(0, target - Date.now());

  const days = Math.floor(remaining / 86400000);
  remaining %= 86400000;

  const hours = Math.floor(remaining / 3600000);
  remaining %= 3600000;

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  timeFields.days.textContent = String(days);
  timeFields.hours.textContent = String(hours).padStart(2, "0");
  timeFields.minutes.textContent = String(minutes).padStart(2, "0");
  timeFields.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- SECRET SURPRISE ----------

secretBtn.addEventListener("click", () => {
  secretMessage.hidden = false;
  secretBtn.textContent = "Your secret is open ❤️";
  secretBtn.disabled = true;
  secretBtn.style.opacity = "0.7";

  secretMessage.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  launchConfetti();
});

// ---------- FULLSCREEN PHOTO VIEWER ----------

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");
let previouslyFocused = null;

function openPhoto(path, alt) {
  previouslyFocused = document.activeElement;
  lightboxImage.src = path;
  lightboxImage.alt = alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeLightbox.focus();
}

function closePhoto() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  document.body.style.overflow = "";
  if (previouslyFocused) previouslyFocused.focus();
}

document.querySelectorAll(".photo-card").forEach(card => {
  card.addEventListener("click", () => {
    const image = card.querySelector("img");
    openPhoto(card.dataset.photo, image.alt);
  });
});

closeLightbox.addEventListener("click", closePhoto);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closePhoto();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closePhoto();
  }
});

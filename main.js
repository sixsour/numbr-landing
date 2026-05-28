/* ══════════════════════════════════════════════
   NUMBR LANDING — scroll-driven animations
══════════════════════════════════════════════ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Utility ──────────────────────────────── */
function onIntersect(el, callback, options = {}) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry);
        if (options.once !== false) io.unobserve(el);
      }
    });
  }, { threshold: options.threshold ?? 0.35, ...options });
  io.observe(el);
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/* ══════════════════════════════════════════════
   VOICE SECTION SEQUENCE
══════════════════════════════════════════════ */
const voiceSection = document.getElementById('voice');
const voiceLabel   = voiceSection.querySelector('.voice-label');
const stageMic     = document.getElementById('stage-mic');
const micSvg       = stageMic.querySelector('.svg-mic');
const micOffSvg    = stageMic.querySelector('.svg-mic-off');
const ring1        = document.getElementById('ring1');
const ring2        = document.getElementById('ring2');
const ring3        = document.getElementById('ring3');
const recordingUI  = document.getElementById('recording-ui');
const waveform     = document.getElementById('waveform').querySelector('.waveform') || document.querySelector('.waveform');
const typewriterEl = document.getElementById('typewriter');
const processingUI = document.getElementById('processing-ui');

let voiceSequenceDone = false;

const TRANSCRIPT = 'Потратил пятьсот на продукты...';

async function typewriter(el, text, speed = 55) {
  el.textContent = '';
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await delay(speed);
  }
}

function fireRipples() {
  [ring1, ring2, ring3].forEach((ring, i) => {
    ring.style.animationDelay = `${i * 0.2}s`;
    ring.classList.remove('fire');
    void ring.offsetWidth; // reflow
    ring.classList.add('fire');
  });
}

async function runVoiceSequence() {
  if (voiceSequenceDone || reducedMotion) {
    if (reducedMotion) {
      voiceLabel.classList.add('visible');
    }
    return;
  }
  voiceSequenceDone = true;

  voiceLabel.classList.add('visible');

  await delay(400);

  // Step 1 — Mic grows
  stageMic.classList.add('big');

  await delay(600);

  // Step 2 — Activate: ripples + switch icon
  stageMic.classList.add('activated');
  fireRipples();
  micSvg.style.display = 'none';
  micOffSvg.style.display = 'block';

  await delay(700);

  // Step 3 — Recording UI appears
  recordingUI.classList.add('visible');
  document.querySelector('.waveform').classList.add('animating');

  await delay(400);

  // Step 4 — Typewriter
  await typewriter(typewriterEl, TRANSCRIPT);

  await delay(800);

  // Step 5 — Processing
  recordingUI.classList.remove('visible');
  document.querySelector('.waveform').classList.remove('animating');
  processingUI.classList.add('visible');

  await delay(1200);

  // Step 6 — Hide processing (result section takes over)
  processingUI.classList.remove('visible');
  stageMic.classList.remove('big', 'activated');
  micSvg.style.display = 'block';
  micOffSvg.style.display = 'none';
}

onIntersect(voiceSection, runVoiceSequence, { threshold: 0.3 });

/* ══════════════════════════════════════════════
   RESULT SECTION
══════════════════════════════════════════════ */
const resultSection = document.getElementById('result');
const expenseCard   = document.getElementById('expense-card');
const cardActions   = document.getElementById('card-actions');
const resultLabel   = resultSection.querySelector('.result-label');

onIntersect(resultSection, async () => {
  resultLabel.classList.add('visible');
  await delay(200);
  expenseCard.classList.add('visible');
  await delay(350);
  cardActions.classList.add('visible');
}, { threshold: 0.3 });

/* ══════════════════════════════════════════════
   CATEGORIES CAROUSEL
══════════════════════════════════════════════ */
const categoriesSection = document.getElementById('categories');
const categoriesTitle   = categoriesSection.querySelector('.categories-title');
const track             = document.getElementById('carousel-track');
const chips             = Array.from(track.querySelectorAll('.chip'));

let carouselDone = false;

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function animateScroll(el, targetX, duration) {
  const startX = el.scrollLeft;
  const diff = targetX - startX;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    el.scrollLeft = startX + diff * easeInOutQuad(progress);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

async function runCarouselSequence() {
  if (carouselDone || reducedMotion) return;
  carouselDone = true;

  categoriesTitle.classList.add('visible');

  // Reset to start
  track.scrollLeft = 0;

  await delay(400);

  // Scroll to show all chips passing by
  const totalWidth = track.scrollWidth - track.clientWidth;
  animateScroll(track, totalWidth * 0.55, 1800);

  await delay(900);

  // Animate active state cycling: food becomes active
  const targetIndex = 2; // 🍕 Еда
  chips.forEach((chip, i) => {
    chip.classList.remove('chip-active', 'dimmed');
    if (i === targetIndex) {
      chip.classList.add('chip-active');
    } else {
      chip.classList.add('dimmed');
    }
  });

  await delay(1400);

  // Restore to groceries active
  chips.forEach((chip, i) => {
    chip.classList.remove('chip-active', 'dimmed');
    if (i === 0) chip.classList.add('chip-active');
  });
}

onIntersect(categoriesSection, runCarouselSequence, { threshold: 0.25 });

/* ══════════════════════════════════════════════
   CTA SECTION
══════════════════════════════════════════════ */
const ctaContent = document.getElementById('cta-content');

onIntersect(ctaContent, () => {
  ctaContent.classList.add('visible');
}, { threshold: 0.2 });

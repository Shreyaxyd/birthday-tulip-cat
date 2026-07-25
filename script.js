/* ==========================================================================
   🌸 BIRTHDAY CAT & REALISTIC TULIP GARDEN — JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 🚀 LENIS SMOOTH SCROLL INITIALIZATION
  // ==========================================
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential inertia curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Helper smooth scroll function using Lenis
  function smoothScrollTo(target) {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6 });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ==========================================
  // 🔊 WEB AUDIO API SOUND SYNTH ENGINE
  // ==========================================
  let isSoundMuted = false;
  const audioToggleBtn = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');
  const audioLabel = document.getElementById('audioLabel');

  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  audioToggleBtn.addEventListener('click', () => {
    isSoundMuted = !isSoundMuted;
    if (isSoundMuted) {
      audioIcon.className = 'fa-solid fa-volume-xmark';
      audioLabel.textContent = 'Sound OFF';
      audioToggleBtn.style.opacity = '0.6';
    } else {
      audioIcon.className = 'fa-solid fa-volume-high';
      audioLabel.textContent = 'Sound ON';
      audioToggleBtn.style.opacity = '1';
      playMeowSound();
    }
  });

  // Sound Synth Functions
  function playMeowSound() {
    if (isSoundMuted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch(e) {}
  }

  function playPopSound() {
    if (isSoundMuted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch(e) {}
  }

  function playPaperSound() {
    if (isSoundMuted) return;
    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch(e) {}
  }

  function playFanfareSound() {
    if (isSoundMuted) return;
    try {
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.1;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch(e) {}
  }

  // ==========================================
  // 🌷 REALISTIC BOTANICAL TULIP GENERATOR
  // ==========================================
  const tulipsBack = document.getElementById('tulipsBack');
  const tulipsFront = document.getElementById('tulipsFront');
  const petalsContainer = document.getElementById('petalsContainer');

  const tulipPalettes = [
    { main: '#FF2A6D', dark: '#B0003A', light: '#FF75A0', name: 'pink' },
    { main: '#FFB300', dark: '#E65100', light: '#FFE082', name: 'yellow' },
    { main: '#9C27B0', dark: '#4A148C', light: '#E1BEE7', name: 'purple' },
    { main: '#E53935', dark: '#B71C1C', light: '#FF8A80', name: 'red' },
    { main: '#FF7043', dark: '#D84315', light: '#FFCCBC', name: 'coral' }
  ];

  function createRealisticTulipSVG(palette, instanceId) {
    const id = `tulip_${instanceId}_${Math.floor(Math.random()*10000)}`;
    return `
      <svg class="realistic-tulip-svg" viewBox="0 0 70 240" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="stem_${id}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#2E7D32"/>
            <stop offset="50%" stop-color="#4CAF50"/>
            <stop offset="100%" stop-color="#1B5E20"/>
          </linearGradient>

          <linearGradient id="leaf_${id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#66BB6A"/>
            <stop offset="60%" stop-color="#2E7D32"/>
            <stop offset="100%" stop-color="#1B5E20"/>
          </linearGradient>

          <radialGradient id="base_${id}" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stop-color="${palette.light}"/>
            <stop offset="60%" stop-color="${palette.main}"/>
            <stop offset="100%" stop-color="${palette.dark}"/>
          </radialGradient>

          <linearGradient id="petalL_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${palette.light}"/>
            <stop offset="100%" stop-color="${palette.dark}"/>
          </linearGradient>

          <linearGradient id="petalR_${id}" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${palette.light}"/>
            <stop offset="100%" stop-color="${palette.dark}"/>
          </linearGradient>

          <linearGradient id="petalC_${id}" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="${palette.light}"/>
            <stop offset="50%" stop-color="${palette.main}"/>
            <stop offset="100%" stop-color="${palette.dark}"/>
          </linearGradient>
        </defs>

        <path d="M 35 240 Q 30 140 35 55" stroke="url(#stem_${id})" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M 35 200 Q 5 160 2 105 Q 18 125 35 175 Z" fill="url(#leaf_${id})"/>
        <path d="M 35 185 Q 65 145 68 95 Q 52 115 35 160 Z" fill="url(#leaf_${id})"/>

        <g class="tulip-head-group">
          <path d="M 16 58 Q 35 72 54 58 Q 60 22 35 8 Q 10 22 16 58 Z" fill="url(#base_${id})"/>
          <path d="M 12 55 Q 5 25 28 10 Q 38 32 24 60 Z" fill="url(#petalL_${id})"/>
          <path d="M 58 55 Q 65 25 42 10 Q 32 32 46 60 Z" fill="url(#petalR_${id})"/>
          <path d="M 20 56 Q 35 68 50 56 Q 44 14 35 6 Q 26 14 20 56 Z" fill="url(#petalC_${id})"/>
          <path d="M 29 16 Q 35 8 38 16 Q 36 42 31 52 Q 27 34 29 16 Z" fill="rgba(255, 255, 255, 0.45)"/>
        </g>
      </svg>
    `;
  }

  function generateTulipRow(container, count) {
    for (let i = 0; i < count; i++) {
      const palette = tulipPalettes[i % tulipPalettes.length];
      const wrapper = document.createElement('div');
      wrapper.className = 'tulip-flower-wrapper';
      
      const animDelay = (Math.random() * 2.5).toFixed(2);
      wrapper.style.animationDelay = `${animDelay}s`;
      
      wrapper.innerHTML = createRealisticTulipSVG(palette, i);
      container.appendChild(wrapper);
    }
  }

  generateTulipRow(tulipsBack, 14);
  generateTulipRow(tulipsFront, 16);

  // Generate Floating Falling Petals
  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${4 + Math.random() * 6}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
    petal.style.width = `${10 + Math.random() * 12}px`;
    petal.style.height = `${10 + Math.random() * 12}px`;
    petalsContainer.appendChild(petal);
  }

  // ==========================================
  // 🐈 CAT ENTRANCE & LETTER INTERACTION
  // ==========================================
  const catLetter = document.getElementById('catLetter');
  const catSpeech = document.getElementById('catSpeech');
  const postcardsModal = document.getElementById('postcardsModal');
  const closePostcards = document.getElementById('closePostcards');
  const modalBackdrop = document.getElementById('modalBackdrop');

  // Trigger Meow after entrance (5.5s)
  setTimeout(() => {
    playMeowSound();
  }, 5500);

  catLetter.addEventListener('click', () => {
    playMeowSound();
    playPaperSound();
    postcardsModal.classList.add('active');
  });

  closePostcards.addEventListener('click', () => {
    playPopSound();
    postcardsModal.classList.remove('active');
  });

  modalBackdrop.addEventListener('click', () => {
    playPopSound();
    postcardsModal.classList.remove('active');
  });

  // ==========================================
  // 💌 POSTCARD DECK STACK SYSTEM
  // ==========================================
  const postcardItems = document.querySelectorAll('.postcard-item');
  const dots = document.querySelectorAll('.deck-dots .dot');
  const currentCardNum = document.getElementById('currentCardNum');
  const prevCardBtn = document.getElementById('prevCardBtn');
  const nextCardBtn = document.getElementById('nextCardBtn');
  const proceedToGalleryBtn = document.getElementById('proceedToGalleryBtn');

  let currentCardIndex = 0;
  const totalCards = postcardItems.length;

  function updatePostcardDeck() {
    postcardItems.forEach((card, idx) => {
      card.classList.remove('active', 'exit-left');
      if (idx === currentCardIndex) {
        card.classList.add('active');
      } else if (idx < currentCardIndex) {
        card.classList.add('exit-left');
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentCardIndex);
    });

    currentCardNum.textContent = currentCardIndex + 1;
  }

  // Click on active card -> Advance to next
  postcardItems.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.scroll-to-gallery-btn')) return;
      if (currentCardIndex < totalCards - 1) {
        playPaperSound();
        currentCardIndex++;
        updatePostcardDeck();
      }
    });
  });

  nextCardBtn.addEventListener('click', () => {
    if (currentCardIndex < totalCards - 1) {
      playPaperSound();
      currentCardIndex++;
      updatePostcardDeck();
    }
  });

  prevCardBtn.addEventListener('click', () => {
    if (currentCardIndex > 0) {
      playPaperSound();
      currentCardIndex--;
      updatePostcardDeck();
    }
  });

  proceedToGalleryBtn.addEventListener('click', () => {
    playPopSound();
    postcardsModal.classList.remove('active');
    smoothScrollTo('#gallerySection');
  });

  // ==========================================
  // 🎁 PLAYFUL DODGING GIFT BOX MINI-GAME
  // ==========================================
  const giftArena = document.getElementById('giftArena');
  const giftBox = document.getElementById('giftBox');
  const giftSpeech = document.getElementById('giftSpeech');
  const giftModal = document.getElementById('giftModal');
  const giftHintText = document.getElementById('giftHintText');

  let dodgeCount = 0;
  const maxDodges = 3; // Dodges 3 times, opens on 4th click

  const speechTaunts = [
    "Not so fast! 😹🐾",
    "Too slow! Try again! 😜",
    "Okay okay, one more try! 🎁✨",
    "Yay! You caught me! 🎉"
  ];

  function dodgeGiftBox() {
    if (dodgeCount >= maxDodges) return;

    dodgeCount++;
    playPopSound();

    const arenaRect = giftArena.getBoundingClientRect();
    const boxRect = giftBox.getBoundingClientRect();

    const maxLeft = arenaRect.width - boxRect.width - 40;
    const maxTop = arenaRect.height - boxRect.height - 40;

    const newLeft = Math.max(20, Math.floor(Math.random() * maxLeft));
    const newTop = Math.max(20, Math.floor(Math.random() * maxTop));

    giftBox.style.left = `${newLeft}px`;
    giftBox.style.top = `${newTop}px`;

    giftSpeech.querySelector('span').textContent = speechTaunts[dodgeCount - 1] || speechTaunts[0];
    giftSpeech.style.opacity = '1';
  }

  // Hover / Touch interaction triggers dodge
  giftBox.addEventListener('mouseenter', () => {
    if (dodgeCount < maxDodges) {
      dodgeGiftBox();
    }
  });

  giftBox.addEventListener('click', () => {
    if (dodgeCount < maxDodges) {
      dodgeGiftBox();
    } else {
      // 4th Click: Open Gift Box!
      playFanfareSound();
      launchConfetti();

      giftSpeech.querySelector('span').textContent = "Surprise Unlocked! 🎉";
      giftHintText.textContent = "✨ You did it! Your birthday options are ready below!";

      giftModal.classList.add('active');
      smoothScrollTo('#giftModal');
    }
  });

  // ==========================================
  // 💌 MULTI-CHOICE SELECTION TWIST & NOTE
  // ==========================================
  const giftOptionItems = document.querySelectorAll('.gift-option-item');
  const secretNote = document.getElementById('secretNote');
  const replayBtn = document.getElementById('replayBtn');

  let twistActivated = false;

  giftOptionItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      playPopSound();

      if (!twistActivated) {
        twistActivated = true;

        // Twist: Check ALL options simultaneously!
        giftOptionItems.forEach((opt, idx) => {
          setTimeout(() => {
            opt.classList.add('checked');
            const chk = opt.querySelector('.gift-checkbox');
            if (chk) chk.checked = true;
            playPopSound();
          }, idx * 120);
        });

        // Unfold Secret Note
        setTimeout(() => {
          playFanfareSound();
          secretNote.classList.add('active');
          smoothScrollTo('#secretNote');
        }, 600);
      }
    });
  });

  replayBtn.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setTimeout(() => {
      location.reload();
    }, 500);
  });

  // ==========================================
  // 🎉 CANVAS CONFETTI PARTICLE ENGINE
  // ==========================================
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let confettiParticles = [];
  const confettiColors = ['#FF80AB', '#FFD54F', '#80D8FF', '#B9F6CA', '#EA80FC', '#FF9E80'];

  function createConfettiParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: Math.random() * 4 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 6 - 3
    };
  }

  function launchConfetti() {
    confettiParticles = [];
    for (let i = 0; i < 120; i++) {
      confettiParticles.push(createConfettiParticle());
    }
    animateConfetti();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, width, height);

    confettiParticles.forEach((p, i) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      if (p.y > height) {
        confettiParticles[i] = createConfettiParticle();
      }
    });

    if (confettiParticles.length > 0) {
      requestAnimationFrame(animateConfetti);
    }
  }

});

/* High-Performance Birthday Celebration Logic
   - Neon Glassy Heart Mouse Wand & Sparkle Trails
   - Continuous Magical Confetti Rain
   - 100% Reliable Balloon Tap/Pop Architecture
   - Realistic Candle Fire Lights
   - Flawless Responsiveness Across Any Screen
*/

(function () {
  'use strict';

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hidden = false;
  var DPR = 1;

  var MX = -9999, MY = -9999;
  var balloonArr = [];
  var audioCtx = null, noiseBuf = null;

  function isMobile() {
    return matchMedia('(max-width:860px)').matches;
  }

  /* ==========================================================================
     1. AUDIO ENGINE: Pre-unlocked on first interaction
     ========================================================================== */
  function ensureAudio() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (e) { /* silent */ }
  }

  window.addEventListener('pointerdown', ensureAudio, { once: true, passive: true });
  window.addEventListener('touchstart', ensureAudio, { once: true, passive: true });

  function playPop() {
    if (!audioCtx) return;
    try {
      var t = audioCtx.currentTime;
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(560, t);
      o.frequency.exponentialRampToValueAtTime(140, t + 0.15);
      g.gain.setValueAtTime(0.001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(t);
      o.stop(t + 0.2);

      if (!noiseBuf) {
        var len = Math.floor(audioCtx.sampleRate * 0.06);
        noiseBuf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
        var d = noiseBuf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      }
      var n = audioCtx.createBufferSource();
      n.buffer = noiseBuf;
      var f = audioCtx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 1600;
      var g2 = audioCtx.createGain();
      g2.gain.value = 0.25;
      n.connect(f);
      f.connect(g2);
      g2.connect(audioCtx.destination);
      n.start(t);
    } catch (e) { /* silent */ }
  }

  /* ==========================================================================
     2. NEON HEART MOUSE WAND & SPARKLE TRAILS
     ========================================================================== */
  var trailLast = 0, trailCount = 0;
  var TRAIL_COLS = ['#FF1493', '#FF69B4', '#FF80AB', '#FFB6C1', '#FFD700', '#FFFFFF'];

  function initPointers() {
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      MX = e.clientX;
      MY = e.clientY;
      if (!reduced) spawnSparkle(MX, MY);
    }, { passive: true });

    window.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      MX = e.clientX;
      MY = e.clientY;
      if (!reduced) {
        spawnSparkle(MX, MY);
        spawnSparkle(MX + 10, MY + 8);
        spawnSparkle(MX - 8, MY + 10);
      }
    }, { passive: true });

    // Smooth cursor follower loop
    var wand = document.getElementById('wand');
    var wx = -100, wy = -100;
    function followCursor() {
      if (!hidden && wand && MX > -500) {
        wx += (MX - wx) * 0.28;
        wy += (MY - wy) * 0.28;
        wand.style.transform = 'translate3d(' + (wx - 13) + 'px,' + (wy - 13) + 'px,0)';
      }
      requestAnimationFrame(followCursor);
    }
    requestAnimationFrame(followCursor);
  }

  function spawnSparkle(x, y) {
    var now = performance.now();
    if (now - trailLast < 38 || trailCount >= 22 || hidden) return;
    trailLast = now;
    trailCount++;

    var s = document.createElement('span');
    var isStar = Math.random() < 0.35;
    s.className = 'wh-trail' + (isStar ? ' star' : '');
    var col = TRAIL_COLS[Math.floor(Math.random() * TRAIL_COLS.length)];
    s.innerHTML = '<i style="--tc:' + col + '"></i>';

    var offsetX = (Math.random() - 0.5) * 16;
    var offsetY = (Math.random() - 0.5) * 16;
    s.style.left = (x - 8 + offsetX) + 'px';
    s.style.top = (y - 8 + offsetY) + 'px';

    document.body.appendChild(s);
    setTimeout(function () {
      s.remove();
      trailCount--;
    }, 650);
  }

  initPointers();

  /* ==========================================================================
     3. LOCK SCREEN & PASSWORD VALIDATION (20/10/2009)
     ========================================================================== */
  var pw = document.getElementById('pw');
  var card = document.getElementById('lockCard');
  var openBtn = document.getElementById('openBtn');
  var err = document.getElementById('err');
  var lockWrap = document.getElementById('lockWrap');
  var built = false;

  if (pw && card) {
    var typingTimer = null;
    pw.addEventListener('input', function () {
      card.classList.remove('typing');
      void card.offsetWidth;
      card.classList.add('typing');
      clearTimeout(typingTimer);
      typingTimer = setTimeout(function () {
        card.classList.remove('typing');
      }, 550);
    });
    pw.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') unlock();
    });
  }

  var eyeBtn = document.getElementById('eyeBtn');
  if (eyeBtn && pw) {
    eyeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var isPw = pw.type === 'password';
      pw.type = isPw ? 'text' : 'password';
      var eyeOpen = eyeBtn.querySelector('.eye-open');
      var eyeClosed = eyeBtn.querySelector('.eye-closed');
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPw ? 'none' : 'block';
        eyeClosed.style.display = isPw ? 'block' : 'none';
      }
      pw.focus();
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', unlock);
  }

  function unlock() {
    if (built) return;
    var v = (pw ? pw.value : '').trim();
    if (v !== '20/10/2009' && v.replace(/[-.\s]/g, '/') !== '20/10/2009') {
      if (card) {
        card.classList.remove('shake');
        void card.offsetWidth;
        card.classList.add('shake');
      }
      if (err) err.style.display = 'block';
      return;
    }

    built = true;
    ensureAudio();

    if (lockWrap) lockWrap.classList.add('gone');
    setTimeout(showDarkGlassIntro, 400);
  }

  /* ==========================================================================
     4. MULTI-STAGE CINEMATIC INTRO
     Stage A (0s - 2.6s): "From Aser to Logine"
     Stage B (2.6s - 5.2s): "أحبش ❤️"
     Tap to skip anytime supported
     ========================================================================== */
  var introFinished = false;

  function showDarkGlassIntro() {
    if (lockWrap && lockWrap.parentNode) {
      lockWrap.parentNode.removeChild(lockWrap);
    }

    var darkIntro = document.getElementById('darkGlassIntro');
    var stageA = document.getElementById('introStageA');
    var stageB = document.getElementById('introStageB');
    if (!darkIntro) {
      buildScene();
      return;
    }

    darkIntro.style.display = 'flex';
    if (stageA) stageA.style.display = 'flex';
    if (stageB) stageB.style.display = 'none';

    darkIntro.addEventListener('pointerdown', function () {
      finishIntro();
    }, { once: true });

    var tA = setTimeout(function () {
      if (introFinished) return;
      if (stageA) stageA.classList.add('dissolve');
    }, 2000);

    var tB = setTimeout(function () {
      if (introFinished) return;
      if (stageA) stageA.style.display = 'none';
      if (stageB) stageB.style.display = 'flex';
    }, 2600);

    var tC = setTimeout(function () {
      finishIntro();
    }, 5200);

    function finishIntro() {
      if (introFinished) return;
      introFinished = true;
      clearTimeout(tA);
      clearTimeout(tB);
      clearTimeout(tC);

      darkIntro.classList.add('fade-out');
      buildScene();

      setTimeout(function () {
        if (darkIntro && darkIntro.parentNode) {
          darkIntro.parentNode.removeChild(darkIntro);
        }
      }, 750);
    }
  }

  /* ==========================================================================
     5. MAIN STAGE & OPTIMIZED DOM STRUCTURE
     ========================================================================== */
  function buildScene() {
    var st = document.getElementById('stage');
    if (!st) return;

    var wavesHtml =
      '<div class="waves-wrap" aria-hidden="true">' +
        '<div class="wave-layer w1"><svg viewBox="0 0 2880 180" preserveAspectRatio="none"><path d="M0,70 C360,140 720,15 1080,70 C1440,140 1800,15 2160,70 C2520,140 2880,15 2880,70 L2880,180 L0,180 Z"></path></svg></div>' +
        '<div class="wave-layer w2"><svg viewBox="0 0 2880 180" preserveAspectRatio="none"><path d="M0,95 C360,25 720,150 1080,85 C1440,25 1800,150 2160,85 C2520,25 2880,150 2880,85 L2880,180 L0,180 Z"></path></svg></div>' +
        '<div class="wave-layer w3"><svg viewBox="0 0 2880 180" preserveAspectRatio="none"><path d="M0,50 C400,120 800,20 1200,60 C1600,110 2000,20 2400,60 C2640,90 2880,40 2880,50 L2880,180 L0,180 Z"></path></svg></div>' +
      '</div>';

    st.innerHTML =
      '<div class="stage-wrapper" id="stageWrapper">' +
        wavesHtml +
        '<canvas id="fxCv"></canvas>' +
        '<div class="bfield" id="bfield"></div>' +
        '<div class="scene">' +
          '<div class="title-header">' +
            '<span class="bday-tag">✨ 20 • 10 • 2009 ✨</span>' +
            '<h1 class="title">Happy birthday logine</h1>' +
            '<span class="tap-hint">🎈 Tap the balloons! ✨</span>' +
          '</div>' +
          '<div class="cakes-bottom-anchor">' +
            '<div class="cake-pod left-cake"><div class="cake-box" id="cakeBoxLeft"></div></div>' +
            '<div class="cake-pod right-cake"><div class="cake-box" id="cakeBoxRight"></div></div>' +
          '</div>' +
        '</div>' +
        '<div class="footer"><p dir="rtl">مش هنشوف الفستان الأسود بقى 😉</p></div>' +
      '</div>';

    initCanvas();
    buildCakes();
    initBalloons();

    var stageWrapper = document.getElementById('stageWrapper');
    requestAnimationFrame(function () {
      if (stageWrapper) stageWrapper.classList.add('stage-in');
    });

    if (!reduced) startConfettiRain();

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        initCanvas();
        for (var i = 0; i < balloonArr.length; i++) {
          var s = balloonArr[i];
          if (s.x > window.innerWidth - s.w) {
            s.x = Math.max(window.innerWidth - s.w - 10, 10);
          }
        }
      }, 100);
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      hidden = document.hidden;
      if (!hidden && !reduced) {
        startBalloonLoop();
      }
    });
  }

  /* ==========================================================================
     6. UNIFIED FX CANVAS (Initial Blast + Continuous Magical Confetti Rain)
     ========================================================================== */
  var fxCv = null, fxCtx = null;
  var particles = [];
  var fxRunning = false;
  var confettiRainTimer = null;

  function initCanvas() {
    fxCv = document.getElementById('fxCv');
    if (!fxCv) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    fxCv.width = Math.floor(window.innerWidth * DPR);
    fxCv.height = Math.floor(window.innerHeight * DPR);
    fxCv.style.width = window.innerWidth + 'px';
    fxCv.style.height = window.innerHeight + 'px';
    fxCtx = fxCv.getContext('2d');
    fxCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function kickFx() {
    if (!fxRunning) {
      fxRunning = true;
      requestAnimationFrame(stepFx);
    }
  }

  function stepFx() {
    if (!fxCtx || hidden) {
      fxRunning = false;
      return;
    }
    fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    var alive = false;
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx + Math.sin(p.swayPhase += 0.04) * 0.45;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.rot += p.vRot;
      p.life -= p.decay;

      if (p.life > 0 && p.y < window.innerHeight + 25) {
        alive = true;
        fxCtx.save();
        fxCtx.globalAlpha = Math.max(p.life, 0);
        fxCtx.translate(p.x, p.y);
        fxCtx.rotate(p.rot);
        fxCtx.fillStyle = p.c;
        fxCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        fxCtx.restore();
      }
    }

    if (particles.length > 320) {
      particles = particles.filter(function (p) { return p.life > 0 && p.y < window.innerHeight + 25; });
    }

    if (alive || confettiRainTimer) {
      requestAnimationFrame(stepFx);
    } else {
      particles = [];
      fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      fxRunning = false;
    }
  }

  function burstAt(x, y, color) {
    var count = isMobile() ? 12 : 18;
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 2 + Math.random() * 6;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        gravity: 0.22,
        w: 5 + Math.random() * 5,
        h: 4 + Math.random() * 5,
        c: Math.random() < 0.25 ? '#FFFFFF' : color,
        rot: Math.random() * 3,
        vRot: (Math.random() - 0.5) * 0.3,
        life: 1,
        decay: 0.024 + Math.random() * 0.015,
        swayPhase: Math.random() * 6
      });
    }
    kickFx();
  }

  // Continuous Shimmering Confetti Rain
  function startConfettiRain() {
    var colors = ['#FF1493', '#FF2D78', '#FF69B4', '#FF80AB', '#FFB6C1', '#FFD1DC', '#FFE4E8', '#FFD700', '#FFFFFF'];

    // 1. Initial celebratory explosion
    var initialCount = isMobile() ? 100 : 160;
    var startY = window.innerHeight * 0.38;
    for (var i = 0; i < initialCount; i++) {
      particles.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * (window.innerWidth * 0.7),
        y: startY,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 15 - 3,
        gravity: 0.24,
        w: 5 + Math.random() * 6,
        h: 4 + Math.random() * 6,
        c: colors[i % colors.length],
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.25,
        life: 1,
        decay: 0.006 + Math.random() * 0.006,
        swayPhase: Math.random() * 6
      });
    }
    kickFx();

    // 2. Continuous gentle confetti rainfall
    if (confettiRainTimer) clearInterval(confettiRainTimer);
    var maxRain = isMobile() ? 65 : 120;

    confettiRainTimer = setInterval(function () {
      if (hidden) return;
      if (particles.length < maxRain) {
        var spawnCount = isMobile() ? 1 : 2;
        for (var k = 0; k < spawnCount; k++) {
          particles.push({
            x: Math.random() * window.innerWidth,
            y: -14,
            vx: (Math.random() - 0.5) * 1.5,
            vy: 1.2 + Math.random() * 1.8,
            gravity: 0.04,
            w: 5 + Math.random() * 5,
            h: 4 + Math.random() * 5,
            c: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * 3,
            vRot: (Math.random() - 0.5) * 0.15,
            life: 1,
            decay: 0.003 + Math.random() * 0.003,
            swayPhase: Math.random() * 6
          });
        }
        kickFx();
      }
    }, 150);
  }

  /* ==========================================================================
     7. REALISTIC CUTE BALLOONS (100% RELIABLE TAP/POP ENGINE)
     ========================================================================== */
  var BALLOON_COLS = [
    { c: '#FF69B4', d: '#FF1493' },
    { c: '#FF80AB', d: '#FF2D78' },
    { c: '#FFB6C1', d: '#FF4081' },
    { c: '#FF4081', d: '#D81B60' },
    { c: '#FFA4C2', d: '#FF1493' },
    { c: '#FF85A2', d: '#E91E63' }
  ];

  function curlStr() {
    return '<svg class="str" width="16" height="70" viewBox="0 0 16 70"><path d="M8 1 Q2 18 8 35 Q14 52 8 68" stroke="#FF69B4" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
  }

  var balloonLoopActive = false;

  function initBalloons() {
    var bfield = document.getElementById('bfield');
    if (!bfield) return;

    balloonArr = [];
    bfield.innerHTML = '';

    var count = isMobile() ? 8 : 14;

    for (var i = 0; i < count; i++) {
      var colObj = BALLOON_COLS[i % BALLOON_COLS.length];
      var el = document.createElement('div');
      el.className = 'b';
      el.setAttribute('data-idx', i);
      el.innerHTML = '<div class="bl" style="--c:' + colObj.c + ';--c-dark:' + colObj.d + '"></div>' + curlStr();

      bfield.appendChild(el);

      var state = {
        el: el,
        bl: el.querySelector('.bl'),
        color: colObj.c,
        alive: true,
        phase: Math.random() * Math.PI * 2,
        x: Math.random() * Math.max(window.innerWidth - 80, 20),
        y: Math.random() * (window.innerHeight + 160) - 80,
        vy: 0.5 + Math.random() * 0.7,
        swaySpeed: 0.0012 + Math.random() * 0.0008,
        swayRange: 20 + Math.random() * 15,
        w: 60,
        h: 76
      };

      el.style.transform = 'translate3d(' + state.x + 'px,' + state.y + 'px,0)';
      balloonArr.push(state);
    }

    function onPopTrigger(e) {
      var target = e.target.closest('.b');
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();

      var idx = parseInt(target.getAttribute('data-idx'), 10);
      if (!isNaN(idx) && balloonArr[idx] && balloonArr[idx].alive) {
        popBalloon(balloonArr[idx]);
      }
    }

    bfield.addEventListener('pointerdown', onPopTrigger, { passive: false });
    bfield.addEventListener('touchstart', onPopTrigger, { passive: false });

    startBalloonLoop();
  }

  function startBalloonLoop() {
    if (reduced || balloonLoopActive) return;
    balloonLoopActive = true;

    function step() {
      if (hidden) {
        balloonLoopActive = false;
        return;
      }
      requestAnimationFrame(step);

      var now = performance.now();
      var w = window.innerWidth;
      var h = window.innerHeight;

      for (var i = 0; i < balloonArr.length; i++) {
        var s = balloonArr[i];
        if (!s.alive) continue;

        s.y -= s.vy;
        var drift = Math.sin(now * s.swaySpeed + s.phase) * s.swayRange;
        var curX = s.x + drift;

        if (s.y < -150) {
          s.y = h + 60 + Math.random() * 80;
          s.x = Math.random() * Math.max(w - 75, 15);
        }

        s.el.style.transform = 'translate3d(' + curX + 'px,' + s.y + 'px,0)';
      }
    }
    requestAnimationFrame(step);
  }

  function popBalloon(s) {
    if (!s.alive) return;
    s.alive = false;

    ensureAudio();
    playPop();

    var rect = s.bl.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    burstAt(cx, cy, s.color);

    s.el.classList.add('popping');

    setTimeout(function () {
      s.y = window.innerHeight + 60 + Math.random() * 100;
      s.x = Math.random() * Math.max(window.innerWidth - 75, 15);
      s.el.classList.remove('popping');
      s.alive = true;
    }, 1200 + Math.random() * 1000);
  }

  /* ==========================================================================
     8. REALISTIC CUTE 3D CAKES BUILDER (AUTHENTIC CANDLE FIRE)
     ========================================================================== */
  function getCakeMarkup(isAlternate) {
    var c1 = isAlternate ? '#FF80AB' : '#FF69B4';
    var c2 = isAlternate ? '#FF4081' : '#FF80AB';
    var c3 = isAlternate ? '#FF69B4' : '#FF4081';

    function candleHtml(color, isTall) {
      return '' +
        '<div class="kc' + (isTall ? ' tall' : '') + '" style="--c:' + color + ';--c-dark:#FF1493">' +
          '<div class="kflame-aura"></div>' +
          '<div class="kwick"></div>' +
          '<div class="kflame"></div>' +
        '</div>';
    }

    return '' +
      '<div class="kcandles">' +
        candleHtml(c1, false) +
        candleHtml(c2, true) +
        candleHtml(c3, false) +
      '</div>' +
      '<div class="kt top">' +
        '<i class="kice"></i>' +
        '<div class="kpearls">' +
          '<span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span>' +
        '</div>' +
      '</div>' +
      '<div class="kt mid">' +
        '<i class="kice"></i>' +
        '<div class="kpearls">' +
          '<span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span>' +
        '</div>' +
      '</div>' +
      '<div class="kt bot">' +
        '<i class="kice"></i>' +
        '<div class="kpearls">' +
          '<span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span><span class="kpearl"></span>' +
        '</div>' +
      '</div>' +
      '<div class="cake-plate"></div>' +
      '<div class="cake-shadow"></div>';
  }

  function buildCakes() {
    var boxL = document.getElementById('cakeBoxLeft');
    var boxR = document.getElementById('cakeBoxRight');
    if (boxL) boxL.innerHTML = getCakeMarkup(false);
    if (boxR) boxR.innerHTML = getCakeMarkup(true);
  }

})();

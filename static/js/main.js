document.addEventListener('DOMContentLoaded', () => {

  (function buildHeroSoundbars() {
    const container = document.getElementById('heroSoundbars');
    if (!container) return;

    const count  = 36;
    const minH   = 5;
    const maxH   = 52;
    const colors = ['#c9b8f5', '#f9a8d4', '#6ee7b7', '#7dd3fc', '#fde68a', '#fdba74', '#a78bfa'];

    for (let i = 0; i < count; i++) {
      const bar     = document.createElement('div');
      const height  = minH + Math.random() * (maxH - minH);
      const dur     = (0.8 + Math.random() * 0.8).toFixed(2);
      const delay   = (Math.random() * 0.6).toFixed(2);
      const color   = colors[i % colors.length];

      bar.className = 'sbar';
      bar.style.setProperty('--h',     height + 'px');
      bar.style.setProperty('--d',     dur + 's');
      bar.style.setProperty('--delay', delay + 's');
      bar.style.background = `linear-gradient(to top, ${color}88, ${color})`;

      container.appendChild(bar);
    }
  })();


  (function buildBAWaves() {
    const beforeEl = document.getElementById('beforeWave');
    const afterEl  = document.getElementById('afterWave');
    if (!beforeEl || !afterEl) return;

    const noiseHeights = [8,28,14,50,10,42,20,55,9,38,25,16,52,35,8,45,18,30,12,48,28,15,40,22,53,9,36,19,44,11];
    const cleanHeights = [22,26,24,28,22,26,25,27,23,25,24,26,22,27,24,25,23,26,24,28,22,25,26,24,23,27,24,25,22,26];

    noiseHeights.forEach(h => {
      const b = document.createElement('div');
      b.className = 'babar babar--noise';
      b.style.height = h + 'px';
      beforeEl.appendChild(b);
    });

    cleanHeights.forEach(h => {
      const b = document.createElement('div');
      b.className = 'babar babar--clean';
      b.style.height = h + 'px';
      afterEl.appendChild(b);
    });
  })();

  const fileInput   = document.getElementById('fileInput');
  const dropZone    = document.getElementById('dropZone');
  const filePreview = document.getElementById('filePreview');
  const fpName      = document.getElementById('fpName');
  const fpSize      = document.getElementById('fpSize');
  const fpIcon      = document.getElementById('fpIcon');
  const fpRemove    = document.getElementById('fpRemove');
  const submitBtn   = document.getElementById('submitBtn');
  const dropIconWrap= document.getElementById('dropIconWrap');

  if (!fileInput) return; 

  const ALLOWED_EXTS  = new Set(['mp3','wav','ogg','flac','aac','m4a','wma','mp4','avi','mov','mkv','webm','flv']);
  const VIDEO_EXTS    = new Set(['mp4','avi','mov','mkv','webm','flv']);
  const MAX_MB        = 100;

  function formatBytes(bytes) {
    if (bytes < 1024)          return bytes + ' B';
    if (bytes < 1024 * 1024)   return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function getExt(name) {
    return name.includes('.') ? name.split('.').pop().toLowerCase() : '';
  }

  function getFileIcon(name) {
    return VIDEO_EXTS.has(getExt(name)) ? '▣' : '♪';
  }

  function showClientError(msg) {
   
    const prev = document.querySelector('.flash.client-flash');
    if (prev) prev.remove();

    const el = document.createElement('div');
    el.className = 'flash flash--error client-flash';
    el.setAttribute('role', 'alert');
    el.innerHTML = `<span class="flash-icon">❌</span><span>${msg}</span>
      <button class="flash-close" aria-label="Dismiss">✕</button>`;
    el.querySelector('.flash-close').addEventListener('click', () => el.remove());

    const uploadCard = document.getElementById('uploadCard');
    uploadCard.parentNode.insertBefore(el, uploadCard);
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function applyFile(file) {
    const ext  = getExt(file.name);
    const sizeMB = file.size / (1024 * 1024);

    if (!ALLOWED_EXTS.has(ext)) {
      showClientError(`"${ext.toUpperCase()}" is not supported. Please upload an audio or video file.`);
      clearFile();
      return;
    }
    if (sizeMB > MAX_MB) {
      showClientError(`File is ${sizeMB.toFixed(1)} MB — maximum is ${MAX_MB} MB.`);
      clearFile();
      return;
    }

    fpName.textContent = file.name;
    fpSize.textContent = formatBytes(file.size);
    fpIcon.textContent = getFileIcon(file.name);
    filePreview.classList.remove('hidden');
    submitBtn.disabled = false;

    dropZone.style.borderStyle = 'solid';
    if (dropIconWrap) {
      dropIconWrap.innerHTML = getFileIcon(file.name);
      dropIconWrap.style.fontSize = '1.8rem';
    }
  }

  function clearFile() {
    fileInput.value = '';
    filePreview.classList.add('hidden');
    submitBtn.disabled = true;
    dropZone.style.borderStyle = 'dashed';
    if (dropIconWrap) {
      dropIconWrap.innerHTML = '♪';
      dropIconWrap.style.fontSize = '2rem';
    }
  }

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) applyFile(fileInput.files[0]);
  });

  fpRemove.addEventListener('click', () => {
    clearFile();
    const prev = document.querySelector('.flash.client-flash');
    if (prev) prev.remove();
  });

  ['dragenter','dragover'].forEach(evt => {
    dropZone.addEventListener(evt, e => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
  });
  ['dragleave','dragend'].forEach(evt => {
    dropZone.addEventListener(evt, () => dropZone.classList.remove('dragover'));
  });
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer?.files?.[0];
    if (file) {
    
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
      } catch (_) { }
      applyFile(file);
    }
  });

  dropZone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  const uploadForm   = document.getElementById('uploadForm');
  const progressArea = document.getElementById('progressArea');
  const progFill     = document.getElementById('progFill');
  const progPct      = document.getElementById('progPct');
  const progStatus   = document.getElementById('progStatusText');
  const procSteps    = [
    document.getElementById('ps1'),
    document.getElementById('ps2'),
    document.getElementById('ps3'),
    document.getElementById('ps4'),
  ];

  const stepMessages = [
    'Uploading file…',
    'Analyzing audio…',
    'Reducing noise…',
    'Finalizing output…',
  ];

  function activateStep(idx) {
    procSteps.forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i < idx)      s.classList.add('done');
      else if (i === idx) s.classList.add('active');
    });
    progStatus.textContent = stepMessages[idx] || 'Processing…';
  }

  uploadForm.addEventListener('submit', () => {
    if (!fileInput.files[0]) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Processing…';

    progressArea.classList.remove('hidden');
    activateStep(0);

    let pct      = 0;
    let stepIdx  = 0;
    const thresholds = [0, 25, 55, 82]; 

    const timer = setInterval(() => {
      if (pct >= 93) { clearInterval(timer); return; }

      const increment = pct < 50 ? (3 + Math.random() * 4) : (1 + Math.random() * 2);
      pct = Math.min(pct + increment, 93);

      progFill.style.width = pct + '%';
      progFill.setAttribute('aria-valuenow', Math.round(pct));
      progPct.textContent  = Math.round(pct) + '%';

      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (pct >= thresholds[i] && stepIdx < i) {
          stepIdx = i;
          activateStep(i);
          break;
        }
      }
    }, 250);
  });

  document.querySelectorAll('.flash-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.flash')?.remove();
    });
  });


  (function initConfetti() {
    const area = document.getElementById('confettiArea');
    if (!area) return;

    const confettiColors = ['#c9b8f5','#f9a8d4','#6ee7b7','#7dd3fc','#fde68a','#fdba74','#a78bfa'];
    const count = 48;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      const color = confettiColors[i % confettiColors.length];
      const size  = 6 + Math.random() * 8;
      const left  = Math.random() * 100;
      const delay = Math.random() * 1.2;
      const dur   = 1.4 + Math.random() * 1.2;
      const shape = Math.random() > 0.5 ? '50%' : '2px';

      piece.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        background: ${color};
        border-radius: ${shape};
        left: ${left}%;
        top: -10px;
        opacity: 0;
        animation: confettiFall ${dur}s ${delay}s ease-in forwards;
      `;
      area.appendChild(piece);
    }

    if (!document.getElementById('confettiStyle')) {
      const style = document.createElement('style');
      style.id = 'confettiStyle';
      style.textContent = `
        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(260px) rotate(${360 + Math.random()*360}deg); }
        }
      `;
      document.head.appendChild(style);
    }
  })();

  (function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.step-card, .feat-card, .ba-card, .showcase-img, .stat-item'
    );

    if (!('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeUp 0.5s ease both';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.animationDelay = (i % 4 * 0.08) + 's';
      obs.observe(el);
    });
  })();

});

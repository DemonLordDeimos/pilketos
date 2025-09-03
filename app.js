// Load candidates and render cards
let selectedId = null;
const cardsEl = document.getElementById('cards');
const modalEl = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');
const toastEl = document.getElementById('toast');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

async function loadCandidates() {
  const res = await fetch('candidates.json');
  const data = await res.json();
  renderCards(data);
}
loadCandidates();

function makeTag(text){ const span=document.createElement('span'); span.className='tag'; span.textContent=text; return span; }

function renderCards(list) {
  cardsEl.innerHTML = '';
  list.forEach((c) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = c.id;

    const img = document.createElement('img');
    img.src = c.photo || '';
    img.alt = c.name;
    img.className = 'banner';
    card.appendChild(img);

    const body = document.createElement('div');
    body.className = 'body';

    const badge = document.createElement('div');
    badge.className = 'badge';
    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = c.id;
    const cls = document.createElement('span');
    cls.textContent = `Kelas ${c.class}`;
    badge.appendChild(num); badge.appendChild(cls);

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = c.name;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = c.vision;

    const tags = document.createElement('div');
    tags.className='tags';
    ['Aktif','Transparan','Kreatif'].forEach(t=>tags.appendChild(makeTag(t)));

    const actions = document.createElement('div');
    actions.className = 'actions';

    const detailBtn = document.createElement('button');
    detailBtn.textContent = 'Detail';
    detailBtn.addEventListener('click', () => showDetail(c));

    const pilihBtn = document.createElement('button');
    pilihBtn.textContent = 'Pilih';
    pilihBtn.className = 'primary';
    pilihBtn.addEventListener('click', () => selectCandidate(card, c));

    actions.appendChild(detailBtn);
    actions.appendChild(pilihBtn);

    body.appendChild(badge);
    body.appendChild(name);
    body.appendChild(meta);
    body.appendChild(tags);
    body.appendChild(actions);

    card.appendChild(body);
    cardsEl.appendChild(card);
  });
}

function showDetail(c){
  showToast(`${c.name} — Misi: ${c.mission.join(' · ')}`);
}

function selectCandidate(card, c){
  // Clear previous
  document.querySelectorAll('.card.selected').forEach(el=> el.classList.remove('selected'));
  card.classList.add('selected');
  selectedId = c.id;
  submitBtn.classList.add('enabled');
  submitBtn.disabled = false;
}

submitBtn.addEventListener('click', () => {
  if(!selectedId) return;
  modalText.textContent = `Kamu memilih Paslon Nomor ${selectedId}. Yakin ingin mengirim suara?`;
  modalEl.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => modalEl.classList.add('hidden'));

confirmBtn.addEventListener('click', () => {
  modalEl.classList.add('hidden');
  // Emulate saving vote (here we just localStorage)
  const votes = JSON.parse(localStorage.getItem('votes') || '{}');
  votes[selectedId] = (votes[selectedId] || 0) + 1;
  localStorage.setItem('votes', JSON.stringify(votes));
  runConfetti();
  showToast('Suara kamu berhasil dikirim! Terima kasih.');
  submitBtn.disabled = true;
  submitBtn.classList.remove('enabled');
});

function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden');
  setTimeout(()=> toastEl.classList.add('hidden'), 2500);
}

/** Lightweight confetti */
let particles = [];
function runConfetti(){
  spawn(180);
  animate();
  setTimeout(()=>{ particles = []; ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height); }, 1800);
}
function spawn(n){
  for(let i=0;i<n;i++){
    particles.push({
      x: Math.random()*confettiCanvas.width,
      y: -10,
      size: 6+Math.random()*6,
      speedY: 2+Math.random()*4,
      speedX: -2+Math.random()*4,
      rot: Math.random()*Math.PI,
      rotSpeed: -0.2+Math.random()*0.4,
    });
  }
}
function animate(){
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  particles.forEach(p=>{
    p.y += p.speedY;
    p.x += p.speedX;
    p.rot += p.rotSpeed;
    drawRect(p.x, p.y, p.size, p.size*0.6, p.rot);
  });
  particles = particles.filter(p=> p.y < confettiCanvas.height+20);
  if(particles.length) requestAnimationFrame(animate);
}
function drawRect(x, y, w, h, r){
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(r);
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = `hsl(${Math.random()*360}, 80%, 60%)`;
  ctx.fillRect(-w/2, -h/2, w, h);
  ctx.restore();
}

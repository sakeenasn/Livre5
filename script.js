
const bookContainer = document.getElementById('bookContainer');
const body = document.body;

let isOpen = false;
let particleInterval = null;
let fireInterval = null;
let lumiereTimeout = null;
let activeParticles = 0;
let effectsActive = false;

const colors = ['#ffd700','#ff9a9e','#a18cd1','#ffffff','#84fab0'];

// --- AUDIO ---
function playSound(audioId){
    const audio = document.getElementById(audioId);
    if(audio){ audio.currentTime=0; audio.play().catch(e=>console.log(e)); }
}

// --- THEME ---
function toggleTheme(){ body.classList.toggle('dark-mode'); }

// --- OUVRIR / FERMER ---
function toggleBook(){
    isOpen = !isOpen;
    if(isOpen){
        bookContainer.classList.add('open');
        const delay = 200;
        setTimeout(()=>playSound('soundPage'),300);
        setTimeout(()=>playSound('soundPage'),300+delay);
        setTimeout(()=>playSound('soundPage'),300+2*delay);
    } else {
        bookContainer.classList.remove('open');
        stopMagic();
        stopFire();
        clearTimeout(lumiereTimeout);
    }
}

// --- PARTICULES ---
function createParticle(){
    if(!isOpen || activeParticles>150) return;
    activeParticles++;
    const particle = document.createElement('div');
    particle.className='particle';
    const size = Math.random()*12+4;
    particle.style.width=size+'px'; particle.style.height=size+'px';
    const color = body.classList.contains('dark-mode') 
        ? ['#fff','#cfcfcf','#a0a0ff','#ffd700','#e0e0ff'][Math.floor(Math.random()*5)]
        : colors[Math.floor(Math.random()*colors.length)];
    particle.style.background=color;
    particle.style.boxShadow=`0 0 ${size*3}px ${color}`;
    const origin = document.getElementById('particleOrigin').getBoundingClientRect();
    particle.style.left = origin.left + origin.width/2 + 'px';
    particle.style.top = origin.top + origin.height/2 + 'px';
    const tx=(Math.random()-0.5)*120, txEnd=(Math.random()-0.5)*700;
    particle.style.setProperty('--tx', tx+'px'); particle.style.setProperty('--tx-end', txEnd+'px');
    const duration=Math.random()*2+2; particle.style.animation=`floatUp ${duration}s ease-out forwards`;
    document.body.appendChild(particle);
    setTimeout(()=>{ particle.remove(); activeParticles--; }, duration*1000);
}

function startMagic(){
    if(!isOpen || effectsActive) return;
    effectsActive=true;
    for(let i=0;i<100;i++) setTimeout(createParticle,i*15);
    particleInterval=setInterval(createParticle,30);
}
function stopMagic(){
    clearInterval(particleInterval); particleInterval=null;
    document.querySelectorAll('.particle').forEach(el=>el.remove());
    activeParticles=0; effectsActive=false;
}
function rainbowParticles(){ if(!isOpen) return; if(!effectsActive) startMagic(); else stopMagic(); }

// --- VENT ---
function flyPages(){
    if(!isOpen) toggleBook();
    const pages = document.querySelectorAll('.page:not(.front-cover):not(.back-cover)');
    pages.forEach((page,i)=>{
        setTimeout(()=>{
            const flyingPage=page.cloneNode(true);
            const rect=page.getBoundingClientRect();
            flyingPage.style.position='absolute';
            flyingPage.style.left=rect.left+'px';
            flyingPage.style.top=rect.top+'px';
            flyingPage.style.width=rect.width+'px';
            flyingPage.style.height=rect.height+'px';
            flyingPage.style.zIndex=1000; flyingPage.style.pointerEvents='none';
            flyingPage.style.transition='transform 4s ease-out, opacity 4s ease-out';
            document.body.appendChild(flyingPage);
            const endX=(Math.random()-0.5)*window.innerWidth*2;
            const endY=(Math.random()-0.5)*window.innerHeight*2;
            const rotateX=(Math.random()-0.5)*1080;
            const rotateY=(Math.random()-0.5)*1080;
            requestAnimationFrame(()=>{ flyingPage.style.transform=`translate(${endX}px,${endY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`; flyingPage.style.opacity=0; });
            setTimeout(()=>flyingPage.remove(),4000);
        }, i*100);
    });
}

// --- SECOUER ---
function shakeBook(){ if(!isOpen) toggleBook(); setTimeout(()=>{ bookContainer.classList.add('shake'); setTimeout(()=>bookContainer.classList.remove('shake'),500); },1200); }

// --- FEU ---
function spawnFire(){
    if(!isOpen) toggleBook();
    const flameBox=document.createElement('div'); flameBox.className='flame-box';
    flameBox.style.left='50%'; flameBox.style.top='50%';
    for(const c of ['yellow','orange','red']){
        const flame=document.createElement('div'); flame.className='flame '+c;
        flameBox.appendChild(flame);
    }
    document.body.appendChild(flameBox);
}
function startFire(){ if(fireInterval) return; fireInterval=setInterval(spawnFire,800); }
function stopFire(){ clearInterval(fireInterval); fireInterval=null; document.querySelectorAll('.flame-box').forEach(el=>el.remove()); }

// --- LUMIERE ---
function toggleLumiere(){
    if(!isOpen) return;
    const origin=document.getElementById('particleOrigin').getBoundingClientRect();
    const beam=document.createElement('div'); beam.className='magic-beam';
    beam.style.left=origin.left+origin.width/2+'px';
    beam.style.top=origin.top+origin.height/2+'px';
    document.body.appendChild(beam);
    lumiereTimeout=setTimeout(()=>beam.remove(),2600);
}

// --- RESET ---
function resetBook(){
    isOpen=false;
    bookContainer.classList.remove('open');
    body.classList.remove('dark-mode');
    stopMagic(); stopFire();
    clearTimeout(lumiereTimeout);
    document.querySelectorAll('.particle, .flame-box, .magic-beam').forEach(el=>el.remove());
}

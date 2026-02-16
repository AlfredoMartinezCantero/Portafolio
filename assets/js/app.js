  /* Tema oscuro por defecto */
  const html = document.documentElement;
  const toggle = document.getElementById('toggleTheme');

  function setTheme(mode) {
    if (mode === 'light') html.classList.add('light');
    else html.classList.remove('light');
    localStorage.setItem('theme', mode);
    if (toggle) toggle.textContent = mode === 'light' ? '☀️' : '🌙';
  }
  setTheme(localStorage.getItem('theme') || 'dark');
  toggle?.addEventListener('click', () => {
    const next = html.classList.contains('light') ? 'dark' : 'light';
    setTheme(next);
  });

  /* Año footer */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Proyectos destacados */
  const PROJECTS = [
  {
    id: 'reloj-canvas',
    titulo: 'Reloj Analógico Dinámico (Canvas API)',
    descripcion: 'Implementación de un reloj con Canvas y requestAnimationFrame.',
    stack: ['JavaScript', 'Canvas', 'requestAnimationFrame'],
    categoria: 'frontend',
    img: './assets/img/proyectos/reloj.jpg',
    demo: './reloj.html',
    code: '#',       
    lang: 'html',
    inlineCode:
  `<!doctype html>
  <html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reloj Analógico (Canvas) — AMC</title>
    <style>
      body { margin:0; height:100vh; display:flex; justify-content:center; align-items:center;
            background:linear-gradient(135deg,#d0d4db,#b8bec7); }
      canvas {
        background: radial-gradient(circle at center, #ffffff 70%, #e5e5e5 100%);
        border-radius: 50%; border: 10px solid #222;
        box-shadow: 0 0 25px rgba(0,0,0,0.3), inset 0 0 18px rgba(0,0,0,0.18);
      }
    </style>
  </head>
  <body>
    <canvas></canvas>
    <script>
      let temporizador = setTimeout("bucle()",1000);
      let lienzo = document.querySelector("canvas");
      lienzo.width = 512; lienzo.height = 512;
      let ctx = lienzo.getContext("2d");
      ctx.lineCap = "round";
      function dibujarNumeros(){
        ctx.fillStyle="#000"; ctx.font="bold 34px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle";
        for (let n=1;n<=12;n++){
          let ang=(n*Math.PI/6)-Math.PI/2;
          let x=256+Math.cos(ang)*145, y=256+Math.sin(ang)*145;
          ctx.fillText(n,x,y);
        }
      }
      function dibujarMarcas(){
        for (let i=0;i<60;i++){
          let ang=i*Math.PI/30;
          let x1=256+Math.cos(ang)*190, y1=256+Math.sin(ang)*190;
          let x2=256+Math.cos(ang)*(i%5===0?160:180), y2=256+Math.sin(ang)*(i%5===0?160:180);
          ctx.lineWidth=i%5===0?6:2; ctx.strokeStyle="#000";
          ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        }
      }
      function bucle(){
        let f=new Date(), h=f.getHours(), m=f.getMinutes(), s=f.getSeconds();
        ctx.clearRect(0,0,512,512);
        let grad=ctx.createRadialGradient(256,256,50,256,256,200);
        grad.addColorStop(0,"#fff"); grad.addColorStop(1,"#e3e3e3");
        ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(256,256,200,0,Math.PI*2); ctx.fill();
        dibujarMarcas(); dibujarNumeros();
        ctx.lineWidth=18; ctx.strokeStyle="#222"; ctx.shadowColor="rgba(0,0,0,0.4)"; ctx.shadowBlur=10;
        let angH=(h%12)*(Math.PI*2/12)+(m/60)*(Math.PI*2/12)-Math.PI/2;
        ctx.beginPath(); ctx.moveTo(256,256); ctx.lineTo(256+Math.cos(angH)*95,256+Math.sin(angH)*95); ctx.stroke();
        ctx.lineWidth=10; ctx.strokeStyle="#333";
        let angM=m*(Math.PI*2/60)-Math.PI/2;
        ctx.beginPath(); ctx.moveTo(256,256); ctx.lineTo(256+Math.cos(angM)*145,256+Math.sin(angM)*145); ctx.stroke();
        ctx.lineWidth=4; ctx.strokeStyle="#CC0000";
        let angS=s*(Math.PI*2/60)-Math.PI/2;
        ctx.beginPath(); ctx.moveTo(256,256); ctx.lineTo(256+Math.cos(angS)*165,256+Math.sin(angS)*165); ctx.stroke();
        let grad2=ctx.createRadialGradient(256,256,5,256,256,35);
        grad2.addColorStop(0,"#555"); grad2.addColorStop(1,"#000");
        ctx.fillStyle=grad2; ctx.beginPath(); ctx.arc(256,256,30,0,Math.PI*2); ctx.fill();
        clearTimeout(temporizador); temporizador=setTimeout("bucle()",1000);
      }
    </script>
  </body>
  </html>`
  },
    {
      id: 'simulacion-npcs',
      titulo: "Simulación de NPC's (Flask + Python)",
      descripcion: "Modelo de comportamiento con movimiento errático y rebote. Demo y código disponibles en mi publicación de LinkedIn.",
      stack: ['Python', 'Flask', 'Canvas (front)'],
      categoria: 'backend',
      img: './assets/img/proyectos/npcs.jpg',     
      demo: 'https://www.linkedin.com/posts/alfredomart%C3%ADnez_ya-hace-3-meses-que-empec%C3%A9-a-estudiar-desarrollo-activity-7400521730491842560-QLwG?utm_source=share&utm_medium=member_desktop&rcm=ACoAADwclm4B0Gm9BtORsl-Y1IhaHmIl_719QlY',
      code: 'https://www.linkedin.com/posts/alfredomart%C3%ADnez_ya-hace-3-meses-que-empec%C3%A9-a-estudiar-desarrollo-activity-7400521730491842560-QLwG?utm_source=share&utm_medium=member_desktop&rcm=ACoAADwclm4B0Gm9BtORsl-Y1IhaHmIl_719QlY'
    },
  {
    id: 'satori',
    titulo: 'Satori — Buscador',
    descripcion: 'Buscador rápido con deduplicación y filtrado por título (demo estática con JSON).',
    stack: ['JavaScript', 'HTML', 'UI'],
    categoria: 'bbdd',          
    img: './assets/img/proyectos/satori.jpg',
    demo: 'https://www.linkedin.com/feed/update/urn:li:activity:7414698829125550080/'
  },
    {
      id: 'proyecto-4',
      titulo: 'Proyecto 4',
      descripcion: 'Añadir ejercicio chatbot',
      stack: ['En preparación'],
      categoria: 'otros',
      img: './assets/img/proyectos/prox.jpg',
      demo: './otrapagina.html',
      code: '#'
    }
  ];

  /* Render de tarjetas */
  const grid = document.getElementById('gridProyectos');

  function cardTemplate(p) {
    const stacks = p.stack.map(s => `<span class="badge">${s}</span>`).join('');
    const safeAlt = p.titulo.replace(/"/g, '&quot;');
    const img = `<img src="${p.img}" alt="${safeAlt}" loading="lazy"
                    onerror="this.outerHTML='<div class=&quot;thumb&quot;>Sin imagen</div>'">`;
    const demoBtn = p.demo && p.demo !== '#'
      ? `<a class="btn" href="${p.demo}" target="_blank" rel="noreferrer">Ver proyecto</a>`
      : `<a class="btn ghost" href="#proyectos">Sin demo</a>`;
      const codeBtn = '';

    return `
    <article class="card" data-cat="${p.categoria}">
      ${img}
      <div class="body">
        <h3>${p.titulo}</h3>
        <p>${p.descripcion}</p>
        <div class="badges">${stacks}</div>
      </div>
      <div class="actions">
      ${demoBtn}
      </div>
    </article>`;
  }

  function renderProjects(list) {
    grid?.setAttribute('aria-busy', 'true');
    grid.innerHTML = list.map(cardTemplate).join('');
    grid?.setAttribute('aria-busy', 'false');
  }
  renderProjects(PROJECTS);

  /* Filtros */
  const filterBtns = document.querySelectorAll('.filter');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const f = btn.dataset.filter;
      if (f === 'all') return renderProjects(PROJECTS);
      renderProjects(PROJECTS.filter(p => p.categoria === f));
    });
  });


// Fuente única de los siete proyectos. Enlaces y descripciones originales conservados.
export const PROJECTS = [
  {
    "id": "gastos-simples",
    "titulo": "Gastos simples — Finanzas personales",
    "descripcion": "Aplicación de finanzas personales en PHP 8.2 con SQLite o MySQL/MariaDB. Permite gestionar gastos e ingresos, consultar el balance, filtrar movimientos y ver gráficos por categoría o día. Importación CSV con vista previa, validación y control de duplicados, exportación de movimientos y administración de usuarios con roles. Interfaz adaptable en verde oscuro y lima, con autenticación, PDO y protección CSRF.",
    "stack": [
      "PHP 8.2",
      "SQLite",
      "MySQL/MariaDB",
      "PDO",
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "categoria": "fullstack",
    "img": "./assets/img/proyectos/gastos-simples.jpg",
    "demo": "https://www.linkedin.com/feed/update/urn:li:activity:7516874488731303936/",
    "code": null,
    "resumen": "Gestiona gastos, ingresos y balances desde una aplicación con importación CSV y control de usuarios.",
    "destacado": true,
    "categorias": [
      "fullstack",
      "backend",
      "bbdd"
    ],
    "width": 956,
    "height": 965,
    "preview": "./assets/img/optimized/gastos-simples-640.webp",
    "previewLarge": "./assets/img/optimized/gastos-simples-1280.webp"
  },
  {
    "id": "copilot-ventas-ia",
    "titulo": "AI Sales Copilot",
    "descripcion": "Asistente inteligente de ventas integrado con Chatwoot. Analiza mensajes entrantes y genera notas privadas automáticas con análisis de sentimiento, clasificación de lead, resumen del mensaje, intención detectada, próximas acciones recomendadas y borrador de respuesta. LLM local con Ollama, sin datos fuera de la empresa.",
    "stack": [
      "Python",
      "FastAPI",
      "Ollama",
      "LLM",
      "Chatwoot API"
    ],
    "categoria": "ia",
    "img": "./assets/img/proyectos/ChatWoot.jpg",
    "demo": "https://www.linkedin.com/feed/update/urn:li:activity:7465399010728673280/",
    "code": null,
    "resumen": "IA local para analizar conversaciones de Chatwoot y ayudar a preparar la próxima respuesta.",
    "destacado": true,
    "categorias": [
      "ia",
      "backend"
    ],
    "width": 467,
    "height": 578,
    "preview": "./assets/img/optimized/copilot-ventas-ia-640.webp",
    "previewLarge": "./assets/img/optimized/copilot-ventas-ia-640.webp"
  },
  {
    "id": "discord-marketing-bot",
    "titulo": "Bot de Discord — Post de Marketing con IA",
    "descripcion": "Bot que convierte cualquier texto en un post de marketing completo (imagen con branding + copy) en menos de 60 segundos. Stack 100 % local y sin costes cloud: GPT vía Hermes genera el copy y el prompt visual, ComfyUI + SDXL renderiza la imagen en la GPU (AMD RX 7900 XTX / ROCm), Ollama + Qwen2.5 14B clasifica los mensajes y Python + FastAPI + PIL orquestan el flujo y estampan la identidad visual corporativa. Todo empaquetado en Docker.",
    "stack": [
      "Python",
      "FastAPI",
      "PIL",
      "Docker",
      "ComfyUI",
      "SDXL",
      "Ollama",
      "Qwen2.5 14B",
      "Discord API"
    ],
    "categoria": "ia",
    "img": "./assets/img/proyectos/discord-bot.jpg",
    "demo": "https://www.linkedin.com/feed/update/urn:li:activity:7467532490576998401/",
    "code": null,
    "resumen": "Del mensaje de Discord a una pieza de marketing: texto e imagen en un flujo automatizado.",
    "destacado": false,
    "categorias": [
      "ia",
      "backend"
    ],
    "width": 1024,
    "height": 1024,
    "preview": "./assets/img/optimized/discord-marketing-bot-640.webp",
    "previewLarge": "./assets/img/optimized/discord-marketing-bot-1280.webp"
  },
  {
    "id": "sistema-facturacion-erp",
    "titulo": "Sistema de Facturación / Mini‑ERP",
    "descripcion": "Aplicación web desarrollada en PHP nativo y MySQL para la gestión completa de facturación: usuarios con roles, clientes, productos/servicios, presupuestos con líneas, conversión a facturas, registro de pagos parciales, generación de PDF, envío por email y dashboard con métricas y gráficos (arquitectura MVC, PDO, CSRF).",
    "stack": [
      "PHP 8",
      "MySQL/MariaDB",
      "PDO",
      "HTML",
      "CSS",
      "JavaScript",
      "Chart.js",
      "Dompdf",
      "PHPMailer"
    ],
    "categoria": "fullstack",
    "img": "./assets/img/proyectos/foto factura.jpg",
    "demo": "https://www.linkedin.com/feed/update/urn:li:ugcPost:7454487669394477056/",
    "code": null,
    "resumen": "Clientes, presupuestos, facturas y pagos en una aplicación web con arquitectura MVC.",
    "destacado": false,
    "categorias": [
      "fullstack",
      "backend",
      "bbdd"
    ],
    "width": 1411,
    "height": 787,
    "preview": "./assets/img/optimized/sistema-facturacion-erp-640.webp",
    "previewLarge": "./assets/img/optimized/sistema-facturacion-erp-1280.webp"
  },
  {
    "id": "simulacion-npcs",
    "titulo": "Simulación de NPC's",
    "descripcion": "Modelo de comportamiento con movimiento errático y rebote de entidades. Backend en Flask + Python, front con Canvas.",
    "stack": [
      "Python",
      "Flask",
      "Canvas"
    ],
    "categoria": "backend",
    "img": "./assets/img/proyectos/npcs.jpg",
    "demo": "https://www.linkedin.com/posts/alfredomart%C3%ADnez_ya-hace-3-meses-que-empec%C3%A9-a-estudiar-desarrollo-activity-7400521730491842560-QLwG",
    "code": null,
    "resumen": "Exploración de comportamientos y movimiento de entidades con Python, Flask y Canvas.",
    "destacado": false,
    "categorias": [
      "backend",
      "frontend"
    ],
    "width": 1891,
    "height": 880,
    "preview": "./assets/img/optimized/simulacion-npcs-640.webp",
    "previewLarge": "./assets/img/optimized/simulacion-npcs-1280.webp"
  },
  {
    "id": "satori",
    "titulo": "Satori — Buscador",
    "descripcion": "Buscador rápido con deduplicación y filtrado por título. Demo estática con fuente JSON.",
    "stack": [
      "JavaScript",
      "HTML",
      "UI/UX"
    ],
    "categoria": "bbdd",
    "img": "./assets/img/proyectos/satori.jpg",
    "demo": "https://www.linkedin.com/feed/update/urn:li:activity:7414698829125550080/",
    "code": null,
    "resumen": "Búsqueda, deduplicación y filtrado por título sobre una fuente de datos JSON.",
    "destacado": false,
    "categorias": [
      "bbdd",
      "frontend"
    ],
    "width": 1024,
    "height": 1024,
    "preview": "./assets/img/optimized/satori-640.webp",
    "previewLarge": "./assets/img/optimized/satori-1280.webp"
  },
  {
    "id": "reloj-canvas",
    "titulo": "Reloj Analógico Dinámico",
    "descripcion": "Reloj en tiempo real con Canvas API y requestAnimationFrame. Gradientes, manecillas suavizadas y marcas horarias/minuteras.",
    "stack": [
      "JavaScript",
      "Canvas API",
      "requestAnimationFrame"
    ],
    "categoria": "frontend",
    "img": "./assets/img/proyectos/reloj.jpg",
    "demo": "./reloj.html",
    "code": null,
    "resumen": "Un reloj en tiempo real dibujado con Canvas y manecillas de movimiento continuo.",
    "destacado": false,
    "categorias": [
      "frontend"
    ],
    "width": 1027,
    "height": 608,
    "preview": "./assets/img/optimized/reloj-canvas-640.webp",
    "previewLarge": "./assets/img/optimized/reloj-canvas-1280.webp"
  }
];

import { PROJECTS } from './projects.js';

// Traducciones por ID; imágenes, tecnologías y enlaces comparten los datos originales.
const translations = {
  'gastos-simples': {
    titulo: 'Gastos simples — Personal finance',
    descripcion: 'Personal finance application built with PHP 8.2 and SQLite or MySQL/MariaDB. Manage expenses and income, check your balance, filter transactions and view charts by category or day. CSV import with preview, validation and duplicate detection, transaction export and role-based user management. Responsive interface in dark green and lime, with authentication, PDO and CSRF protection.',
    resumen: 'Manage expenses, income and balances in an application with CSV import and user management.',
  },
  'copilot-ventas-ia': {
    titulo: 'AI Sales Copilot',
    descripcion: 'Intelligent sales assistant integrated with Chatwoot. Analyses incoming messages and automatically generates private notes with sentiment analysis, lead classification, a message summary, detected intent, recommended next steps and a draft reply. Uses a local LLM with Ollama, keeping data within the company.',
    resumen: 'Local AI that analyses Chatwoot conversations and helps prepare the next reply.',
  },
  'discord-marketing-bot': {
    titulo: 'Discord Bot — AI Marketing Posts',
    descripcion: 'A bot that turns any text into a complete marketing post (branded image and copy) in under 60 seconds. A fully local stack with no cloud costs: GPT via Hermes generates the copy and visual prompt, ComfyUI + SDXL renders the image on the GPU (AMD RX 7900 XTX / ROCm), Ollama + Qwen2.5 14B classifies messages, and Python + FastAPI + PIL orchestrate the workflow and apply the corporate visual identity. Everything is packaged in Docker.',
    resumen: 'From a Discord message to a marketing post: text and images in an automated workflow.',
  },
  'sistema-facturacion-erp': {
    titulo: 'Invoicing System / Mini-ERP',
    descripcion: 'Web application built with native PHP and MySQL for complete invoicing management: role-based users, customers, products and services, itemised quotes, conversion to invoices, partial payment tracking, PDF generation, email delivery, and a dashboard with metrics and charts (MVC architecture, PDO, CSRF).',
    resumen: 'Customers, quotes, invoices and payments in a web application built with MVC architecture.',
  },
  'simulacion-npcs': {
    titulo: 'NPC Simulation',
    descripcion: 'A behaviour model with erratic movement and bouncing entities. Flask + Python backend and a Canvas frontend.',
    resumen: 'Exploring entity behaviour and movement with Python, Flask and Canvas.',
  },
  satori: {
    titulo: 'Satori — Search Engine',
    descripcion: 'A fast search engine with deduplication and title filtering. Static demo using a JSON data source.',
    resumen: 'Search, deduplication and title filtering using a JSON data source.',
  },
  'reloj-canvas': {
    titulo: 'Dynamic Analogue Clock',
    descripcion: 'A real-time clock built with the Canvas API and requestAnimationFrame. Gradients, smooth hands, and hour and minute markers.',
    resumen: 'A real-time clock drawn with Canvas, with continuously moving hands.',
    demo: './reloj-en.html',
  },
};

export const PROJECTS_EN = PROJECTS.map(project => ({ ...project, ...translations[project.id] }));

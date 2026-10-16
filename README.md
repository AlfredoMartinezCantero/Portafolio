# Portafolio · Alfredo Martínez Cantero

Portafolio estático en español e inglés de un estudiante de Desarrollo de Aplicaciones Multiplataforma en Valencia. HTML5, CSS3 y JavaScript con módulos nativos; sin frameworks, compilación ni dependencias de producción.

## Ejecutar en local

Requiere Node.js moderno (18 o posterior) para el servidor de desarrollo incluido:

```sh
node scripts/serve.mjs
```

Abre **http://127.0.0.1:4173**. Puedes elegir otro puerto con `node scripts/serve.mjs 8080`. Detén el servidor con `Ctrl+C`.

También funciona con cualquier servidor estático, incluido Live Server. Los módulos requieren HTTP: no abrir `index.html` mediante `file://`.

Para publicar, sube `index.html`, `index-en.html`, `reloj.html`, `reloj-en.html` y `assets/` a un hosting estático convencional (por ejemplo, GitHub Pages). No es necesario subir `scripts/`, los informes ni las herramientas de QA. Este trabajo modifica el repositorio local; no crea un despliegue externo.

## Estructura

```text
index.html                  Semántica, secciones, SVG y respaldo sin JavaScript
index-en.html               Versión inglesa completa del portafolio
reloj.html                  Demo del reloj y hora en formato textual
reloj-en.html               Demo del reloj en inglés
assets/css/style.css        Tokens, temas y componentes responsive
assets/js/theme.js          Preferencia de tema antes de pintar la página
assets/js/ui.js             Control de tema compartido
assets/js/projects.js       Datos de los siete proyectos
assets/js/projects-en.js    Textos ingleses, con los datos comunes compartidos
assets/js/i18n.js           Textos dinámicos según el idioma de la página
assets/js/app.js            Tarjetas, búsqueda, filtros, diálogo y navegación
assets/js/clock.js          Canvas, alta densidad y ciclo de actualización
assets/img/                 Fotografías y capturas originales conservadas
scripts/serve.mjs           Servidor local sin dependencias
scripts/check.mjs           Validación estática sin dependencias
scripts/browser-check.mjs   Validación opcional con Chrome, Playwright y axe
scripts/optimize-images.mjs Regeneración opcional de las variantes WebP
```

## Diseño y comportamiento

- Identidad editorial con Syne y DM Sans, grafito, azul suave, superficies sobrias y modo claro completo. Las fuentes variables WOFF2 se sirven localmente, usan `font-display: swap` y tienen alternativas del sistema. Las licencias OFL se incluyen en `assets/fonts/`.
- Hero con fotografía original, presentación, enlaces sociales y llamadas a proyectos y contacto.
- Fotografía con flotación continua, sin reposos entre ciclos, respetando la preferencia de movimiento reducido.
- Selector EN/ES visible en escritorio y móvil; funciona sin JavaScript y conserva la sección al cambiar de idioma con JavaScript. Ambas versiones incluyen metadatos y enlaces de idioma alternativo, y la demo del reloj mantiene el idioma del portafolio.
- Siete proyectos conservados con nombres, descripciones completas, stacks, imágenes y enlaces originales. Dos destacados y resúmenes para explorar la colección.
- Filtros combinados con búsqueda por nombre y tecnología, insensible a mayúsculas y acentos. Las categorías son múltiples cuando el stack lo justifica; «Otros» tiene un estado vacío explícito.
- Las tarjetas se construyen una vez con APIs DOM y `textContent`. Los filtros cambian `hidden` sin volver a crear las tarjetas. Las URL se validan para admitir solo HTTP(S).
- Detalles con `<dialog>` nativo: foco contenido en el diálogo, cierre con Escape, botón o fondo exterior, y devolución del foco al control que lo abrió. Los enlaces de LinkedIn se presentan como publicaciones, sin inventar demos alojadas ni repositorios de código.
- Competencias agrupadas por función, sin porcentajes ni niveles inventados.
- Menú móvil con Escape, cierre al salir, al navegar o al pasar a escritorio. Navegación con sección activa y enlace para volver al inicio.
- Tema oscuro por defecto y preferencia explícita persistida con la clave existente `pf-theme`. Un almacenamiento bloqueado no impide usar la página. La preferencia se sincroniza entre pestañas.
- Sin JavaScript sigue habiendo navegación, contenido personal, tecnologías, contacto y enlaces a los siete proyectos. Los controles que necesitan JavaScript solo aparecen tras inicializarse.
- Movimiento reducido respetado, foco visible, objetivos táctiles de al menos 44 px y anuncios del resultado de los filtros. Las animaciones de entrada no ocultan el contenido.
- Reloj con Canvas de alta densidad, ajuste al redimensionar, tema compartido, hora textual y pausa de dibujo en pestañas ocultas. En movimiento reducido actualiza una vez por segundo; el modo continuo limita el dibujo a 30 fps.

## Mantenimiento

Edita `assets/js/projects.js` para actualizar proyectos y `assets/js/projects-en.js` para sus traducciones. `descripcion` conserva el detalle completo y `resumen` alimenta las tarjetas; `categoria` identifica la categoría principal y `categorias` los filtros aplicables. `code: null` indica que no existe un enlace de código disponible: no se muestra un botón ficticio. Al añadir proyectos, actualiza también la lista alternativa de `#projectFallback` en `index.html` e `index-en.html`.

Los originales de imágenes permanecen en sus rutas. Se incluyen variantes WebP de hasta 640 y 1280 px, con `srcset`, `sizes` y retorno al original si fallan. Las dimensiones en los datos permiten reservar su espacio; las capturas de las tarjetas se cargan de forma diferida. La fotografía inicial tiene prioridad alta. Los iconos son SVG locales, sin bibliotecas externas.

## Auditoría y validación

Consulta [VALIDACION.md](./VALIDACION.md) para los problemas detectados, las comprobaciones ejecutadas y sus límites. Las pruebas automáticas de accesibilidad ayudan a detectar errores; no sustituyen una revisión completa con lectores de pantalla.

Comprobación rápida sin instalar nada: `node scripts/check.mjs`. Las herramientas opcionales de QA están separadas de los archivos públicos y excluidas de Git mediante `.gitignore`.

No se ha añadido una URL canónica ni `og:url`/imagen social absoluta porque el repositorio no proporciona una dirección de publicación verificada. Configúralas cuando se conozca el dominio final. No se han inventado datos profesionales, disponibilidad laboral ni proyectos.

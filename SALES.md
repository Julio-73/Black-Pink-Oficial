# 🎀 BLACKPINK Fan Hub — En Venta

**Precio: S/. 1,500** (o equivalente en USD ~$400)
**Estado: Listo para producción** · Transferencia completa con código fuente

---

## 🌟 ¿Qué es?

Sitio web completo, responsive y production-ready para una fan page premium de BLACKPINK. Incluye todas las secciones esperadas: hero, integrantes, música, videos, tour, formulario de registro, merch, test BLINK, mapa del tour, reproductor de audio con visualizer.

A diferencia de un sitio "estático" tradicional, este incluye **PWA instalable**, **modo offline**, **SEO avanzado**, **accesibilidad WCAG AA** y **assets optimizados a 3.7MB total**.

Ideal para fans, agencias pequeñas que ofrecen fan pages a artistas, estudiantes que quieran aprender de un proyecto real, o revendedores que lo personalicen para otros grupos (BTS, Stray Kids, etc.).

---

## ✨ Features incluidas (78 features)

### 🎨 Diseño y UX
- Hero con video de fondo autoplay + partículas animadas
- 4 perfiles de integrantes con modales y video de YouTube embebido
- Sección de música con discografía, top canciones, reproductor custom, lyrics
- Galería de videos con 3 tabs (MVs, Making Film, Lives)
- Mapa interactivo del tour (Leaflet + OpenStreetMap)
- Test BLINK de personalidad con confeti al final y descarga de VIP Pass
- Reproductor de audio con visualizer procedural, mini-player flotante
- Toast system accesible (reemplaza todos los `alert()`)
- Modal de video con YouTube embed
- Formulario de registro con validación live
- Sección de merch con grid
- Countdown dinámico para próximo comeback
- Mobile menu con animaciones
- Scroll progress bar
- Glassmorphism, animaciones de partículas, parallax, 3D tilt
- Scroll suave, smooth transitions
- 100% responsive (mobile-first)

### 🚀 Progressive Web App
- ✅ Instalable en iOS, Android, Desktop
- ✅ Manifest.json con iconos 192/512 + maskable
- ✅ Service Worker con cache-first para assets
- ✅ Funciona offline después de primera visita
- ✅ App shortcuts (Test BLINK, Tour)
- ✅ Theme color adaptativo light/dark
- ✅ Custom splash screen

### ♿ Accesibilidad (WCAG AA)
- ✅ Skip link al contenido
- ✅ Landmark `<main>` con `tabindex`
- ✅ Focus trap en modales + restauración de foco
- ✅ Esc cierra modales
- ✅ Form con 5 labels (sr-only) + `aria-required` + `aria-invalid` live
- ✅ Quiz: `aria-live="polite"` anuncia resultado
- ✅ `:focus-visible` outline 3px rosa (keyboard friendly)
- ✅ `@media (prefers-reduced-motion: reduce)` desactiva animaciones
- ✅ `@media (prefers-contrast: more)` modo alto contraste
- ✅ Roles ARIA: dialog, button, tab
- ✅ Headings jerárquicos: 1 h1, 13 h2, 11 h3, 17 h4
- ✅ 32/32 imágenes con `alt` descriptivo
- ✅ 0 errores en axe-core / WAVE

### 🔍 SEO (Google Rich Results)
- ✅ JSON-LD: WebSite + Organization + MusicGroup (4 members con birthDate, role, nationality)
- ✅ Open Graph: 15 propiedades
- ✅ Twitter Cards: summary_large_image
- ✅ Canonical URL + hreflang (es/en/ko)
- ✅ sitemap.xml + robots.txt
- ✅ Meta tags completos (description, keywords, author, robots)
- ✅ Theme color light/dark

### 🔒 Seguridad
- ✅ SRI (Subresource Integrity) en CDN scripts: boxicons, leaflet
- ✅ CSP estricta (config en _headers y vercel.json)
- ✅ HSTS preload
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ Referrer-Policy: strict-origin
- ✅ Permissions-Policy desactiva camera/mic
- ✅ 0 `target="_blank"` sin rel="noopener"
- ✅ 0 inline scripts (excepto JSON-LD data)
- ✅ 0 console.log/error residuales
- ✅ 0 `alert()` calls

### ⚡ Performance
- **175 MB → 3.66 MB** total shipped (97.9% reducción)
- **First-load gzipped: 44.7 KB** (HTML + CSS + JS + manifest + SW)
- 30 imágenes: AVIF + WebP + PNG fallback @ 2 sizes
- 6 videos: H.264 + VP9 dual-stream + poster, 15s loop
- 12 JS modules ES6 (sin bundler, HTTP/2 multiplexing)
- `preload="metadata"` en videos
- `loading="lazy"` en imágenes below-the-fold
- 4 preconnect + 2 dns-prefetch
- Service Worker precache 18 assets críticos

### 🛠️ Dev Experience
- `npm run build` — pipeline completo
- `npm run serve` — dev server en :3000
- `npm run optimize` — regenera icons + imágenes + videos
- `npm run validate` — SEO + a11y audit
- `npm run audit` — métricas completas del proyecto
- Dev server en Node nativo (sin `npx` dependency, arranca <1s)
- 11 scripts de build/audit en `scripts/`
- GitHub Actions CI: syntax check + SEO + a11y en cada PR

### 📦 Deployment
Listo para deployar en **3 plataformas** con configs pre-hechos:
- ✅ GitHub Pages (gratis, recomendado)
- ✅ Netlify (`_headers` con CSP + cache policies)
- ✅ Vercel (`vercel.json` con headers)

---

## 📊 Métricas técnicas (medidas con Chrome + Puppeteer)

| Métrica | Valor |
|---|---|
| Total shipped | 3.66 MB |
| First-load gzipped | 44.7 KB |
| Lighthouse Performance | ~95-100 (esperado) |
| Lighthouse A11y | ~100 (esperado) |
| Lighthouse SEO | 100 |
| Lighthouse PWA | Instalable |
| JS heap (post-load) | 3.19 MB |
| DOM nodes | 2,739 |
| JS modules | 12 (gzip 17.2 KB) |
| CSS lines | 3,172 |
| HTML lines | 862 |
| Imágenes optimizadas | 30 (3 formatos × 2 tamaños × 5 fuentes) |
| Videos optimizados | 6 (MP4 + WebM + poster × 2 clips) |
| Inline `onclick=` | 0 |
| Console errors | 0 |
| Failed requests (post-fix) | 0 |

---

## 📂 Qué se entrega

```
✓ Repositorio Git completo (commit ea5729a en main)
✓ Código fuente: HTML, CSS, JS (12 modules), sin minificar
✓ Assets optimizados: img/ y video/ listos para producción
✓ PWA completa: manifest.json, sw.js, iconos PWA
✓ SEO: JSON-LD, sitemap.xml, robots.txt
✓ Security: SRI hashes, _headers, vercel.json con CSP
✓ 11 scripts de build/audit (optimize, validate, generate, audit)
✓ Documentación: README.md con deployment guide
✓ GitHub Actions CI workflow
✓ .gitignore configurado
✓ package.json con scripts npm
✓ package-lock.json
```

**NO se entrega:**
- El repo original en GitHub (queda en tu cuenta; el comprador debe fork o clonar desde tu entrega)
- Acceso a la cuenta de GitHub del vendedor
- Soporte post-venta (a menos que se acuerde)

---

## 💰 Justificación del precio (S/. 1,500)

### Para el comprador, este sitio reemplazaría:

| Trabajo manual | Horas | Costo promedio (Perú) |
|---|---|---|
| Diseño UI/UX en Figma | 8-12h | S/. 600-1,000 |
| Maquetación HTML + CSS responsive | 15-20h | S/. 800-1,500 |
| JavaScript vanilla (modales, audio, quiz, etc.) | 25-35h | S/. 1,500-2,500 |
| Optimización de assets (videos + imágenes) | 3-5h | S/. 200-400 |
| SEO técnico (JSON-LD, OG, sitemap) | 4-6h | S/. 300-500 |
| A11y WCAG AA | 6-8h | S/. 400-700 |
| PWA + Service Worker | 4-6h | S/. 300-500 |
| CI/CD + deployment configs | 3-4h | S/. 200-350 |
| Documentación | 2-3h | S/. 150-250 |
| **Total trabajo manual** | **70-100h** | **S/. 4,450-7,700** |

**Precio de venta: S/. 1,500** = ~70% descuento vs. encargarlo nuevo
- Ahorro para el comprador: S/. 2,950-6,200
- ROI inmediato: ya viene optimizado, no hay que rehacer

### Comparable en el mercado
- ThemeForest: templates similares S/. 200-600 (sin PWA, sin SEO avanzado, sin A11y)
- Freelancer.com: sitios estáticos S/. 800-2,500 (sin optimizaciones técnicas)
- Agencia boutique: S/. 5,000-15,000 (con todo hecho a medida)

**S/. 1,500 es un precio justo-premium** para un sitio de este calibre.

---

## 🎯 Comprador ideal

1. **Fan de K-pop / BLINK** que quiera tener su propia fan page completa sin programarla
2. **Agencia pequeña** que ofrezca fan pages como servicio (pueden personalizar para cualquier artista)
3. **Estudiante de Web Dev** que quiera estudiar un proyecto production-ready con código limpio
4. **Revendedor** que lo personalice para BTS, Stray Kids, NewJeans, etc. (solo cambiar imágenes/textos)
5. **Empresa/Influencer** del nicho K-pop que necesite presencia web rápida

---

## ⚠️ Notas importantes

1. **Contenido de BLACKPINK**: El sitio usa imágenes y referencias a las integrantes. Si el comprador quiere otro artista, debe reemplazar assets. Es **fan-made no oficial**; el aviso está en el footer.

2. **Sin backend**: Es 100% estático. El formulario BLINK actualmente solo muestra un toast de éxito (no envía emails). Si el comprador quiere backend real (Mailchimp, Google Forms, etc.), es integración aparte.

3. **Deploy**: El comprador debe deployar por su cuenta. GitHub Pages es la opción más fácil (gratis). El README tiene instrucciones paso a paso.

4. **Soporte**: No incluye soporte post-venta. El código está documentado y es legible.

5. **Licencia**: Ver `LICENSE.md` para términos exactos de transferencia y uso comercial.

---

## 📞 Contacto

Para comprar, negociar o hacer preguntas:
- **WhatsApp**: [+51 XXX XXX XXX]
- **Email**: juliocesarquispegarrido@gmail.com
- **GitHub**: https://github.com/Julio-73/Black-Pink-Oficial

---

## 📸 Demo en vivo

Una vez deployado (instrucciones en README):
- URL: `https://julio-73.github.io/Black-Pink-Oficial/`
- Demo local: `npm install && npm run serve` → http://localhost:3000

---

**Última actualización**: Junio 2026
**Versión**: 1.0.0
**Licencia**: MIT (código) — contenido BLACKPINK © YG Entertainment

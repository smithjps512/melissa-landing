#!/usr/bin/env node
/**
 * Generates the static /garden section from content/3rd-period-garden/plants.json.
 * Output is committed to the repo — the site has no build step on Vercel.
 *
 * Usage: node scripts/build-garden.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'content/3rd-period-garden/plants.json'), 'utf8'));
const gardenDir = join(root, 'garden');

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Renders *text* as <em> so botanical names in prose stay italic.
const rich = (s) => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');

const HEAD = (title, description) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="noindex">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/garden/garden.css">
</head>
<body>
  <div class="topbar">
    <div class="wrap">
      <span>3rd Period Garden</span>
      <a href="/">Melissa for Educators &rarr;</a>
    </div>
  </div>
`;

const FOOT = `
  <footer class="foot">
    <div class="wrap">
      Grown and documented by the 3rd period sixth grade class using our FarmBot.<br>
      Every plant page is a student's own research, writing, and artwork.
    </div>
  </footer>
</body>
</html>
`;

// An <img> that reveals a styled placeholder if the file isn't in the repo yet.
const figure = (cls, src, placeholder, alt) => `<div class="${cls}" data-placeholder="${esc(placeholder)}">
        <img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"
             onerror="this.parentNode.classList.add('missing')">
      </div>`;

const factsList = (facts) => {
  if (!facts) return '';
  const rows = Object.entries(facts)
    .map(([k, v]) => `      <div><dt>${esc(k)}</dt><dd>${rich(v)}</dd></div>`)
    .join('\n');
  return `    <dl class="facts">\n${rows}\n    </dl>\n`;
};

const bullets = (items) => `    <ul>\n${items.map((i) => `      <li>${rich(i)}</li>`).join('\n')}\n    </ul>\n`;

const tabs = (slug, current) => `      <nav class="pagetabs">
        <a href="/garden/${slug}"${current === 'info' ? ' aria-current="page"' : ''}>Plant &amp; Info</a>
        <a href="/garden/${slug}/care"${current === 'care' ? ' aria-current="page"' : ''}>Care Instructions</a>
      </nav>`;

const plantHeader = (p, current) => `  <header class="plant-head">
    <div class="wrap">
      <a class="backlink" href="/garden">&larr; All plants</a>
      <h1>${esc(p.commonName)}</h1>
      <p class="botanical">${esc(p.botanicalName)}</p>
${tabs(p.id, current)}
    </div>
  </header>
`;

function infoPage(p) {
  const sections = [];
  if (p.fastFacts) sections.push(`    <h2>Fast facts</h2>\n${factsList(p.fastFacts)}`);
  if (p.info?.length) sections.push(`    <h2>About this plant</h2>\n${bullets(p.info)}`);
  if (p.history?.length) sections.push(`    <h2>History</h2>\n${bullets(p.history)}`);
  if (p.warning) {
    sections.push(`    <div class="callout"><strong>Careful!</strong>${esc(p.warning)}</div>\n`);
  }

  return HEAD(`${p.commonName} — 3rd Period Garden`, `Student research on ${p.commonName} (${p.botanicalName}), grown with our FarmBot.`)
    + plantHeader(p, 'info')
    + `  <main class="plant-body">
    <div class="wrap">
      <div class="spread">
        <div class="prose">
${sections.join('\n')}
          <a class="nextlink" href="/garden/${p.id}/care">How to care for it &rarr;</a>
        </div>
        <div>
          ${figure('figure', `/public/images/garden/${p.id}-plant.jpg`, 'Student drawing goes here', `Student drawing of ${p.commonName}`)}
          <p class="figure-caption">Drawn by a 3rd period botanist</p>
        </div>
      </div>
    </div>
  </main>
` + FOOT;
}

function carePage(p) {
  const body = p.care?.length
    ? `    <h2>How to care for it</h2>\n${bullets(p.care)}`
    : `    <h2>How to care for it</h2>\n    <div class="callout"><strong>Still being written</strong>This plant's care page is on its way.</div>\n`;

  return HEAD(`Caring for ${p.commonName} — 3rd Period Garden`, `Care instructions for ${p.commonName} (${p.botanicalName}), written by a sixth grade student.`)
    + plantHeader(p, 'care')
    + `  <main class="plant-body">
    <div class="wrap">
      <div class="spread">
        <div class="prose">
${body}
          <a class="nextlink" href="/garden/${p.id}">&larr; Back to the plant</a>
        </div>
        <div>
          ${figure('figure', `/public/images/garden/${p.id}-care.jpg`, 'Care sheet scan goes here', `Care instructions for ${p.commonName}`)}
          <p class="figure-caption">From the student's own care sheet</p>
        </div>
      </div>
    </div>
  </main>
` + FOOT;
}

function indexPage(plants) {
  const cards = plants.map((p) => `        <article class="card">
          ${figure('card-figure', `/public/images/garden/${p.id}-plant.jpg`, 'Drawing coming soon', `Student drawing of ${p.commonName}`)}
          <div class="card-body">
            <h3>${esc(p.commonName)}</h3>
            <p class="botanical">${esc(p.botanicalName)}</p>
            <p class="card-teaser">${rich(p.info?.[0] ?? '')}</p>
            <div class="card-links">
              <a class="primary" href="/garden/${p.id}">Plant &amp; info</a>
              <a href="/garden/${p.id}/care">Care</a>
            </div>
          </div>
        </article>`).join('\n');

  return HEAD('3rd Period Garden — FarmBot Plant Showcase', 'Nine native plants grown by a sixth grade class with a FarmBot, researched and illustrated by the students themselves.')
    + `  <section class="hero">
    <div class="wrap">
      <p class="eyebrow">Sixth Grade &middot; FarmBot Project</p>
      <h1>3rd Period Garden</h1>
      <p>Our class is growing native plants with a FarmBot. Every student picked a plant,
         researched it, drew it, and wrote the instructions for keeping it alive.
         Here is what they found out.</p>
      <div class="hero-meta">
        <span class="chip">${plants.length} plants</span>
        <span class="chip">Grown with FarmBot</span>
        <span class="chip">Researched &amp; illustrated by students</span>
      </div>
    </div>
  </section>

  <main class="section">
    <div class="wrap">
      <div class="section-head">
        <h2>Meet the plants</h2>
        <p>Each plant has two pages: what it is, and how to take care of it.</p>
      </div>
      <div class="grid">
${cards}
      </div>
    </div>
  </main>
` + FOOT;
}

// --- write ---------------------------------------------------------------

// Clear generated plant folders, keep garden.css.
if (existsSync(gardenDir)) {
  for (const entry of readdirSync(gardenDir, { withFileTypes: true })) {
    if (entry.isDirectory()) rmSync(join(gardenDir, entry.name), { recursive: true });
  }
}
mkdirSync(gardenDir, { recursive: true });

writeFileSync(join(gardenDir, 'index.html'), indexPage(data.plants));
for (const p of data.plants) {
  mkdirSync(join(gardenDir, p.id), { recursive: true });
  writeFileSync(join(gardenDir, p.id, 'index.html'), infoPage(p));
  writeFileSync(join(gardenDir, p.id, 'care.html'), carePage(p));
}

console.log(`Built /garden: 1 index + ${data.plants.length} plants (${data.plants.length * 2} pages)`);

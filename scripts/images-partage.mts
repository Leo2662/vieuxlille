// Images de partage (Open Graph, 1200 × 630) : public/og/*.png.
//
// Elles s'affichent quand un lien du site est partagé (WhatsApp, Messenger,
// iMessage, LinkedIn, e-mail…) et servent d'`image` au balisage schema.org.
// Elles sont versionnées : ce script ne tourne qu'à la main, sur le Mac, quand
// le visuel doit changer — jamais au build.
//
//   npx -y tsx scripts/images-partage.mts
//
// Prérequis (macOS) :
// - `sips`, livré avec macOS, pour passer le PDF de la carte en PNG ;
// - playwright-core et un Chromium : chemins à donner par PLAYWRIGHT_CORE et
//   CHROMIUM si ceux par défaut ne sont plus là.
//
// L'image carte cadeau montre la vraie carte, produite par api/_lib/pdf.ts :
// si la carte change, relancer le script.

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { genererCarte } from '../api/_lib/pdf.ts';

const racine = new URL('..', import.meta.url).pathname;
const require = createRequire(import.meta.url);

const PLAYWRIGHT_CORE =
  process.env.PLAYWRIGHT_CORE ?? '/Users/leo/.npm/_npx/705bc6b22212b352/node_modules/playwright-core';
const CHROMIUM =
  process.env.CHROMIUM ??
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

const tmp = mkdtempSync(join(tmpdir(), 'lum-og-'));
const sortie = join(racine, 'public/og');
mkdirSync(sortie, { recursive: true });

// --- La carte cadeau, telle que le client la reçoit --------------------
const pdf = await genererCarte({
  orderId: 'exemple',
  code: 'LUM-BRUNCH',
  payeeLe: new Date('2026-11-15T10:00:00Z'),
  valableJusquau: new Date('2027-11-15T10:00:00Z'),
  prenom: 'Sam',
  nom: 'Exemple',
  email: 'exemple@example.com',
  telephone: '0600000000',
  pour: 'Camille',
  mot: 'Un brunch rien que pour toi, au cœur du Vieux-Lille. Régale-toi !',
  quantite: 1,
});
writeFileSync(join(tmp, 'carte.pdf'), pdf);
execFileSync('sips', ['-s', 'format', 'png', '-Z', '1400', join(tmp, 'carte.pdf'), '--out', join(tmp, 'carte.png')], {
  stdio: 'ignore',
});
const cartePng = `data:image/png;base64,${readFileSync(join(tmp, 'carte.png')).toString('base64')}`;

// --- Polices du site, embarquées -----------------------------------------
const police = (chemin: string) =>
  `data:font/woff2;base64,${readFileSync(join(racine, 'node_modules', chemin)).toString('base64')}`;
const polices = `
  @font-face { font-family: Anton; src: url(${police('@fontsource/anton/files/anton-latin-400-normal.woff2')}); }
  @font-face { font-family: Nunito; font-weight: 200 1000; src: url(${police('@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2')}); }
  @font-face { font-family: Caveat; font-weight: 600; src: url(${police('@fontsource/caveat/files/caveat-latin-600-normal.woff2')}); }
`;

// L'œuf cocotte de la page brunch (src/components/Brunch.astro).
const OEUF = `<svg viewBox="0 0 120 84" width="300"><g fill="none" stroke="#f9f1e6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M48 16c-3-3.5 3-6.5 0-10 M60 14c-3-3.5 3-6.5 0-10 M72 16c-3-3.5 3-6.5 0-10" />
  <ellipse cx="60" cy="34" rx="46" ry="13" /><ellipse cx="60" cy="34" rx="37" ry="8.5" /><ellipse cx="62" cy="33.5" rx="9" ry="4.5" />
  <path d="M37 33l3-1.2 M80 36.5l2.8.8 M44 37.5l2.6.6 M78 29.5l2.4-.6" />
  <path d="M14 34v6c0 8 3 20 8 26 6 7 21 11 38 11s32-4 38-11c5-6 8-18 8-26v-6" />
  <path d="M30 50l1.5 16 M45 52l.8 19 M60 53v20 M75 52l-.8 19 M90 50l-1.5 16" /></g></svg>`;

const style = `
  ${polices}
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #944826; color: #f9f1e6;
         font-family: Nunito, sans-serif; }
  .cadre { position: absolute; inset: 22px; border: 3px solid rgba(249, 241, 230, 0.45); border-radius: 28px; }
  .logo { font-family: Anton; font-size: 64px; line-height: 1; letter-spacing: 0.06em; }
  .logo small { display: block; margin-top: 6px; font-family: Nunito; font-weight: 800; font-size: 17px; letter-spacing: 0.22em; }
  h1 { font-family: Anton; font-weight: 400; text-transform: uppercase; line-height: 0.98; letter-spacing: 0.01em; }
  .script { font-family: Caveat; font-weight: 600; }
  .infos { font-weight: 800; font-size: 25px; line-height: 1.45; letter-spacing: 0.02em; }
`;

const pages: Record<string, string> = {
  'carte-cadeau': `<style>${style}
      .texte { position: absolute; left: 76px; top: 64px; width: 470px; }
      h1 { margin-top: 40px; font-size: 100px; }
      .script { margin-top: 10px; font-size: 46px; line-height: 1.1; }
      .infos { margin-top: 22px; }
      .carte { position: absolute; right: 52px; top: 118px; width: 580px; border-radius: 22px;
               transform: rotate(4deg); box-shadow: 0 30px 60px -20px rgba(40, 14, 4, 0.75); }
    </style>
    <div class="cadre"></div>
    <div class="texte">
      <div class="logo">LÜM<small>VIEUX-LILLE</small></div>
      <h1>Offrir<br />le brunch</h1>
      <p class="script">Avec ton petit mot</p>
      <p class="infos">25 € le brunch · PDF par e-mail<br />Valable un an</p>
    </div>
    <img class="carte" src="${cartePng}" />`,

  lum: `<style>${style}
      .texte { position: absolute; left: 76px; top: 70px; width: 640px; }
      h1 { margin-top: 70px; font-size: 92px; }
      .script { margin-top: 16px; font-size: 46px; }
      .infos { margin-top: 30px; }
      .oeuf { position: absolute; right: 110px; top: 175px; }
    </style>
    <div class="cadre"></div>
    <div class="texte">
      <div class="logo">LÜM<small>VIEUX-LILLE</small></div>
      <h1>Coffee shop<br />&amp; brunch</h1>
      <p class="script">Healthy and local</p>
      <p class="infos">94 rue Saint-André, Vieux-Lille<br />Brunch le week-end, 11h – 15h30</p>
    </div>
    <div class="oeuf">${OEUF}</div>`,
};

const { chromium } = require(PLAYWRIGHT_CORE);
const navigateur = await chromium.launch({ executablePath: CHROMIUM, headless: true });
const page = await navigateur.newPage({ viewport: { width: 1200, height: 630 } });
for (const [nom, html] of Object.entries(pages)) {
  await page.setContent(`<!doctype html><html><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(sortie, `${nom}.png`) });
  console.log(`public/og/${nom}.png`);
}
await navigateur.close();

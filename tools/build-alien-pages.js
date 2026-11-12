/* Generates the ten static alien dossier shells.
   Run: node tools/build-alien-pages.js
*/
const fs = require('fs');
const path = require('path');

const aliens = [
  ['heatblast', 'Heatblast', '#ff6a2c', 'Pyronite'],
  ['four-arms', 'Four Arms', '#e2493f', 'Tetramand'],
  ['xlr8', 'XLR8', '#35d6ff', 'Kineceleran'],
  ['diamondhead', 'Diamondhead', '#4fe3cf', 'Petrosapien'],
  ['upgrade', 'Upgrade', '#5cff9d', 'Galvanic Mechamorph'],
  ['ghostfreak', 'Ghostfreak', '#b18cff', 'Ectonurite'],
  ['ripjaws', 'Ripjaws', '#3a86ff', 'Piscciss Volann'],
  ['stinkfly', 'Stinkfly', '#b6ff3d', 'Lepidopteran'],
  ['wildmutt', 'Wildmutt', '#ff9f1c', 'Vulpimancer'],
  ['cannonbolt', 'Cannonbolt', '#ffd23f', 'Arburian Pelarota']
];

const outDir = path.join(__dirname, '..', 'aliens');
fs.mkdirSync(outDir, { recursive: true });

const tpl = (slug, name, accent, species) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${name} // Ben 10 Omniverse Protocol</title>
  <meta name="description" content="${name} dossier — ${species} from the Ben 10 archive. Lore, powers, weaknesses, combat stats and Omnitrix entry.">
  <meta name="theme-color" content="${accent}">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/home.css">
  <link rel="stylesheet" href="../assets/css/pages.css">
  <link rel="stylesheet" href="../assets/css/extras.css">
  <link rel="stylesheet" href="../assets/css/responsive.css">
  <style>:root{--accent:${accent}}</style>
  <script>try{if(sessionStorage.getItem('b10-warp'))document.documentElement.classList.add('warping');}catch(e){}</script>
  <noscript><style>html.warping body{opacity:1!important}</style></noscript>
</head>
<body data-page="alien" data-alien="${slug}" data-root="../">

<main id="main">
  <div id="alien-content">
    <div class="shell" style="padding:180px 0;text-align:center">
      <span class="eyebrow">Omnitrix // loading sample</span>
      <h1 class="page-title" style="margin-top:16px">${name}</h1>
    </div>
  </div>
</main>

<script src="../assets/js/data.js"></script>
<script src="../assets/js/app.js"></script>
<script src="../assets/js/render.js"></script>
<script src="../assets/js/render-pages.js"></script>
</body>
</html>
`;

aliens.forEach(([slug, name, accent, species]) => {
  fs.writeFileSync(path.join(outDir, slug + '.html'), tpl(slug, name, accent, species), 'utf8');
  console.log('wrote aliens/' + slug + '.html');
});

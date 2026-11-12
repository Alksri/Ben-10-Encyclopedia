/* ============================================================
   BEN 10 — OMNIVERSE PROTOCOL
   Central data layer. Loaded as a classic script so the site
   works straight from the filesystem (no build step, no server).
   ============================================================ */
window.B10 = (function () {
  'use strict';

  /* ---------- SVG glyph library (64x64, stroke-based) ---------- */
  var GLYPHS = {
    flame:
      '<path d="M32 6c7 11 15 16 15 28a15 15 0 0 1-30 0c0-8 5-12 8-17 1 6 3 9 6 11-1-9 0-16 1-22Z"/><path d="M32 35c3 5 5 7 5 11a5 5 0 0 1-10 0c0-4 3-7 5-11Z"/>',
    fist:
      '<path d="M18 26V14a5 5 0 0 1 10 0v8"/><path d="M28 22V12a5 5 0 0 1 10 0v10"/><path d="M38 24V16a5 5 0 0 1 10 0v18c0 12-8 20-18 20S12 46 12 36V28a5 5 0 0 1 10 0"/>',
    bolt:
      '<path d="M36 4 14 36h12l-6 24 22-32H30l6-24Z"/>',
    crystal:
      '<path d="M32 4 50 20 44 50 20 50 14 20Z"/><path d="M32 4v46M14 20l18 8 18-8M20 50l12-22 12 22"/>',
    tech:
      '<path d="M32 8 52 20v24L32 56 12 44V20Z"/><circle cx="32" cy="32" r="7"/><path d="M32 8v17M52 20 39 27M52 44 39 37M32 56V39M12 44l13-7M12 20l13 7"/>',
    ghost:
      '<path d="M32 6c12 0 19 9 19 21v31l-6-6-6 6-6-6-6 6-6-6-6 6V27C13 15 20 6 32 6Z"/><circle cx="32" cy="28" r="6"/><path d="M22 40c6 4 14 4 20 0"/>',
    wave:
      '<path d="M4 42c8-10 16 10 24 0s16 10 24 0"/><path d="M4 54c8-10 16 10 24 0s16 10 24 0"/><path d="M32 8c8 8 12 14 12 20a12 12 0 0 1-24 0c0-6 4-12 12-20Z"/>',
    wing:
      '<path d="M32 24C24 14 12 12 6 18c4 10 12 18 22 20"/><path d="M32 24c8-10 20-12 26-6-4 10-12 18-22 20"/><path d="M32 22v34"/><circle cx="32" cy="17" r="4"/>',
    paw:
      '<ellipse cx="32" cy="40" rx="13" ry="11"/><circle cx="15" cy="26" r="6"/><circle cx="27" cy="16" r="6"/><circle cx="41" cy="16" r="6"/><circle cx="52" cy="26" r="6"/>',
    sphere:
      '<circle cx="32" cy="32" r="22"/><path d="M10 32h44M32 10c10 8 10 36 0 44M32 10c-10 8-10 36 0 44"/><path d="M14 44c10-6 26-6 36 0"/>',
    mind:
      '<path d="M32 10c-10 0-18 7-18 16 0 6 3 10 7 13v9h22v-9c4-3 7-7 7-13 0-9-8-16-18-16Z"/><path d="M25 24h14M25 32h14M25 40h8"/>',
    time:
      '<circle cx="32" cy="34" r="20"/><path d="M32 22v12l8 6M26 8h12M32 8v6"/>',
    gravity:
      '<circle cx="32" cy="32" r="6"/><ellipse cx="32" cy="32" rx="26" ry="10"/><ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(120 32 32)"/>',
    cosmic:
      '<path d="M32 6l6 18 18 8-18 8-6 18-6-18-18-8 18-8Z"/><circle cx="32" cy="32" r="4"/>',
    slime:
      '<path d="M32 8c10 14 18 20 18 30a18 18 0 0 1-36 0c0-10 8-16 18-30Z"/><circle cx="26" cy="36" r="2"/><circle cx="38" cy="42" r="2"/>',
    plant:
      '<path d="M32 56V22"/><path d="M32 34c-12 0-18-8-18-18 12 0 18 8 18 18Z"/><path d="M32 44c12 0 18-8 18-18-12 0-18 8-18 18Z"/>',
    sound:
      '<path d="M10 26h10l12-10v32L20 38H10Z"/><path d="M40 22c6 6 6 14 0 20M48 16c10 10 10 22 0 32"/>',
    ice:
      '<path d="M32 6v52M10 19l44 26M54 19 10 45"/><path d="M32 14l-6-6M32 14l6-6M32 50l-6 6M32 50l6 6"/>',
    hex:
      '<path d="M32 6 54 19v26L32 58 10 45V19Z"/><circle cx="32" cy="32" r="8"/>'
  };

  /* ---------- The ten featured dossiers ---------- */
  var featured = [
    {
      slug: 'heatblast', name: 'Heatblast', monogram: 'HB', entry: '001',
      species: 'Pyronite', planet: 'Pyros', series: 'Original Series', year: '2005',
      className: 'PYRO / ASSAULT', threat: 'OMEGA', accent: '#ff6a2c', accent2: '#ffd166',
      glyph: 'flame',
      tagline: 'The first spark. The last word in arson.',
      summary: 'A living furnace pulled from the surface of a star-scorched world. Heatblast was the very first alien Ben ever became — and he set the tone for everything that followed.',
      lore: [
        'Pyronites are born inside the magma oceans of Pyros, a planet so close to its sun that rock behaves like liquid. Their bodies are a self-sustaining combustion reaction wrapped around a silicon core. They do not wear armour; they are the armour.',
        'When the prototype Omnitrix sampled Pyronite DNA, it locked onto a juvenile template. That is why Heatblast runs hot in every sense: the power is enormous, the control is not. Ben has learned to aim it. Mostly.',
        'Pyronite culture measures status in heat. A young Pyronite proving itself will surf a lava flow from the caldera to the sea. Few return with their silhouette unchanged.'
      ],
      powers: [
        { name: 'Pyrokinesis', desc: 'Generate, shape and throw fire with pinpoint intent — from candle-flame precision to a building-sized inferno.' },
        { name: 'Flame Flight', desc: 'Vent plasma from the feet and shoulders to achieve sustained flight and mid-air course correction.' },
        { name: 'Heat Immunity', desc: 'Walk through molten metal, re-entry heat and plasma fire without a scratch.' },
        { name: 'Lava Surfing', desc: 'Ride magma currents like a wave, using the terrain itself as a weapon.' },
        { name: 'Fire Constructs', desc: 'Compress flame into solid-feeling walls, fists and shields that detonate on command.' }
      ],
      weaknesses: [
        'Water, foam and chemical suppressants smother the flame body.',
        'Extreme cold slows combustion and can force a forced de-transform.',
        'Emotional spikes translate directly into uncontrolled output.'
      ],
      moves: [
        { name: 'Nova Burst', desc: 'A radial detonation that clears a 30-metre ring.' },
        { name: 'Magma Surf', desc: 'Ride a liquefied street into a flying shoulder charge.' },
        { name: 'Firewall', desc: 'A wall of flame that splits a battlefield in half.' }
      ],
      stats: { strength: 6, speed: 5, durability: 5, energy: 10, intellect: 4, agility: 5 },
      code: 'B10-001', dna: 'PYR-001 / STABLE', debut: 'Ben 10 — 2005',
      aliases: ['heat blast', 'heatblast', 'pyronite', 'fire guy', 'flame'],
      related: ['xlr8', 'swampfire', 'nrg']
    },
    {
      slug: 'four-arms', name: 'Four Arms', monogram: '4A', entry: '002',
      species: 'Tetramand', planet: 'Khoros', series: 'Original Series', year: '2005',
      className: 'BRUTE / MELEE', threat: 'ALPHA', accent: '#e2493f', accent2: '#ff9d7a',
      glyph: 'fist',
      tagline: 'Four fists. Zero patience.',
      summary: 'The heavyweight of the original ten. Four Arms solves problems the way a wrecking ball solves a locked door — loudly, completely, and from an unexpected angle.',
      lore: [
        'Khoros is a desert world of red stone and endless fighting arenas. Tetramands are born with four arms and a social contract built entirely around challenge. A Tetramand who cannot lift their own weight is not considered disabled; they are considered early.',
        'Their muscle density is roughly nine times that of a human, and their skeleton is reinforced with a natural carbon lattice. A Tetramand child can bench-press a small vehicle. An adult can throw one.',
        'Ben\'s template is young, which makes Four Arms strong but reckless. The form has one setting: forward.'
      ],
      powers: [
        { name: 'Super Strength', desc: 'Lift buses, bend steel and trade blows with Vilgax-class opponents.' },
        { name: 'Shockwave Clap', desc: 'Four hands meeting at once produce a concussive blast strong enough to topple a building.' },
        { name: 'Seismic Slam', desc: 'Drive all four fists into the ground to shatter pavement and unbalance everything nearby.' },
        { name: 'Quad-Limb Combat', desc: 'Attack, block and grapple simultaneously with four independent limbs.' },
        { name: 'Enhanced Leap', desc: 'Thick legs launch the body across rooftops or over a charging enemy.' }
      ],
      weaknesses: [
        'A huge silhouette is a huge target.',
        'Cramped spaces neutralise the reach advantage.',
        'Confidence frequently becomes overextension.'
      ],
      moves: [
        { name: 'Four-Fist Barrage', desc: 'An alternating flurry that never gives the guard a moment to reset.' },
        { name: 'Shockwave Clap', desc: 'A short-range concussive burst that flattens a crowd.' },
        { name: 'Khoros Slam', desc: 'A two-storey body drop delivered with all four arms locked.' }
      ],
      stats: { strength: 10, speed: 4, durability: 8, energy: 3, intellect: 3, agility: 4 },
      code: 'B10-002', dna: 'TET-002 / STABLE', debut: 'Ben 10 — 2005',
      aliases: ['four arms', 'fourarms', 'forearms', '4 arms', '4arms', 'tetramand'],
      related: ['cannonbolt', 'humungousaur', 'rath']
    },
    {
      slug: 'xlr8', name: 'XLR8', monogram: 'X8', entry: '003',
      species: 'Kineceleran', planet: 'Kinet', series: 'Original Series', year: '2005',
      className: 'SPEED / RECON', threat: 'BETA', accent: '#35d6ff', accent2: '#b8f6ff',
      glyph: 'bolt',
      tagline: 'You will not see the punchline.',
      summary: 'A raptor-shaped blur with a visor full of targeting data. XLR8 turns distance into a formality and reaction time into a suggestion.',
      lore: [
        'Kinet is a world of permanent storms. Its natives evolved in the gaps between lightning strikes, building a civilisation that runs rather than builds. Kinecelerans do not walk; they arrive.',
        'Their legs are hydraulic pistons wrapped in friction-damping skin, and their brains process visual data at roughly forty times the human rate. To XLR8, a conversation is a slow-motion event.',
        'The visor is not eyewear. It is a hardened sensory plate that protects the eyes at velocity and overlays a tactical grid on the world.'
      ],
      powers: [
        { name: 'Supersonic Speed', desc: 'Accelerate to several hundred kilometres per hour in under a second.' },
        { name: 'Friction Control', desc: 'Adjust grip and drag to run up walls, across water and along ceilings.' },
        { name: 'Vortex Generation', desc: 'Circle a target fast enough to create a localised tornado.' },
        { name: 'Enhanced Reflexes', desc: 'Perceive and react to events before most opponents register them.' },
        { name: 'Rapid Strike', desc: 'Deliver dozens of blows in the time it takes to blink.' }
      ],
      weaknesses: [
        'Light frame and low durability — one clean hit lands hard.',
        'Ice, oil and loose gravel destroy traction.',
        'Stopping distance is a genuine tactical problem.'
      ],
      moves: [
        { name: 'Sonic Dash', desc: 'A straight-line sprint that hits like a freight train.' },
        { name: 'Tornado Spin', desc: 'A tight orbit that turns debris into a shrapnel storm.' },
        { name: 'Afterimage Feint', desc: 'Leave a speed ghost in place while repositioning behind the target.' }
      ],
      stats: { strength: 4, speed: 10, durability: 3, energy: 4, intellect: 5, agility: 9 },
      code: 'B10-003', dna: 'KIN-003 / STABLE', debut: 'Ben 10 — 2005',
      aliases: ['xlr8', 'xlr 8', 'accelerate', 'excelerate', 'kineceleran', 'speed guy'],
      related: ['fasttrack', 'jetray', 'heatblast']
    },
    {
      slug: 'diamondhead', name: 'Diamondhead', monogram: 'DH', entry: '004',
      species: 'Petrosapien', planet: 'Petropia', series: 'Original Series', year: '2005',
      className: 'CRYSTAL / DEFENSE', threat: 'ALPHA', accent: '#4fe3cf', accent2: '#c2fff8',
      glyph: 'crystal',
      tagline: 'Built to outlast you.',
      summary: 'A walking geological event. Diamondhead is the form that turns defence into offence — every shard of him is a blade, a wall, or a reload.',
      lore: [
        'Petropia was a crystalline world until it was shattered. Its survivors, the Petrosapiens, are living mineral matrices that can regrow from fragments. Diamondhead is one of the last stable templates in the Omnitrix.',
        'Their bodies are not "like" crystal; they are a self-repairing lattice that conducts light and absorbs impact. A Petrosapien can regrow a severed arm in minutes, provided the core is intact.',
        'The species has a long, bitter history with the Petropian destroyer Vilgax. For Ben, that history is personal by proxy.'
      ],
      powers: [
        { name: 'Crystalline Armor', desc: 'A body hard enough to shrug off plasma fire and bend metal on impact.' },
        { name: 'Shard Projection', desc: 'Fire razor-edged crystal shards from the hands, shoulders and back.' },
        { name: 'Regeneration', desc: 'Reform broken limbs and patch holes by drawing mass back into the lattice.' },
        { name: 'Crystal Constructs', desc: 'Grow walls, platforms and pillars from any mineral surface.' },
        { name: 'Light Refraction', desc: 'Bend light through the body to scatter energy attacks and blind opponents.' }
      ],
      weaknesses: [
        'Sonic attacks resonate through the lattice and crack it.',
        'Sustained extreme heat can soften the crystal matrix.',
        'Joint seams are the structural weak point.'
      ],
      moves: [
        { name: 'Shard Storm', desc: 'A 360-degree volley of crystal splinters.' },
        { name: 'Crystal Wall', desc: 'A instant barricade that grows from the ground.' },
        { name: 'Prism Beam', desc: 'Focus ambient light through the chest into a cutting lance.' }
      ],
      stats: { strength: 7, speed: 4, durability: 10, energy: 6, intellect: 5, agility: 3 },
      code: 'B10-004', dna: 'PET-004 / STABLE', debut: 'Ben 10 — 2005',
      aliases: ['diamondhead', 'diamond head', 'petrosapien', 'crystal guy'],
      related: ['chromastone', 'upgrade', 'four-arms']
    },
    {
      slug: 'upgrade', name: 'Upgrade', monogram: 'UP', entry: '005',
      species: 'Galvanic Mechamorph', planet: 'Galvan B', series: 'Original Series', year: '2005',
      className: 'TECH / INFILTRATION', threat: 'BETA', accent: '#5cff9d', accent2: '#d4ffe8',
      glyph: 'tech',
      tagline: 'Every machine is an open door.',
      summary: 'A puddle of living nanotechnology with a god complex. Upgrade does not hack systems — he becomes them, then improves them without asking.',
      lore: [
        'The Galvanic Mechamorphs were created by the Galvans as a self-repairing utility species. They escaped the lab, spread across the galaxy, and developed opinions. Galvan B is now a moon-sized machine ecosystem.',
        'A Mechamorph body is a colony of nanites suspended in a conductive gel. It can flow through vents, coat a vehicle, or rewrite the firmware of a defence grid by touch.',
        'Upgrade is cheerful, curious and alarmingly willing to interface with anything that has a power light — including things that should not be interfaced with.'
      ],
      powers: [
        { name: 'Technopathy', desc: 'Read, rewrite and command any digital system on contact.' },
        { name: 'Body Merging', desc: 'Coat and possess vehicles, weapons and machinery, upgrading them from within.' },
        { name: 'Plasma Beams', desc: 'Discharge green plasma from the eyes and palms.' },
        { name: 'Nanite Reshape', desc: 'Reform limbs into tools, blades, cables and interface ports.' },
        { name: 'System Override', desc: 'Turn an enemy\'s own hardware against them in seconds.' }
      ],
      weaknesses: [
        'Strong magnetic fields can scatter the nanite colony.',
        'An EMP can force the body to reboot.',
        'Corrupted or alien code can infect him right back.'
      ],
      moves: [
        { name: 'System Override', desc: 'A touch that flips a machine\'s allegiance.' },
        { name: 'Mechamorph Merge', desc: 'Absorb a vehicle and redeploy it as armour.' },
        { name: 'Plasma Lance', desc: 'A focused beam hot enough to cut bulkhead steel.' }
      ],
      stats: { strength: 5, speed: 5, durability: 6, energy: 8, intellect: 9, agility: 6 },
      code: 'B10-005', dna: 'MEC-005 / STABLE', debut: 'Ben 10 — 2005',
      aliases: ['upgrade', 'upgarde', 'up grade', 'mechamorph', 'tech guy'],
      related: ['diamondhead', 'nanomech', 'clockwork']
    },
    {
      slug: 'ghostfreak', name: 'Ghostfreak', monogram: 'GF', entry: '006',
      species: 'Ectonurite', planet: 'Anur Transyl', series: 'Original Series', year: '2005',
      className: 'PHASE / PSIONIC', threat: 'OMEGA', accent: '#b18cff', accent2: '#eee2ff',
      glyph: 'ghost',
      tagline: 'The form that remembers you.',
      summary: 'The one alien that was never really an alien. Ghostfreak is a possession, a horror story and a reminder that the Omnitrix stores more than DNA.',
      lore: [
        'Ectonurites are not ghosts. They are a silicon-based species from the permanently dark Anur Transyl, with a body that exists partly out of phase with normal matter. What looks like a sheet is a protective outer membrane.',
        'Their consciousness is distributed through every cell. That makes them nearly impossible to kill — and it means a strong enough will can survive inside the Omnitrix itself.',
        'Zs\'Skayr, the Ectonurite sample the watch sampled, did exactly that. Ghostfreak is the only form in the original playlist with a countdown that runs both ways.'
      ],
      powers: [
        { name: 'Intangibility', desc: 'Phase through walls, floors and energy barriers at will.' },
        { name: 'Invisibility', desc: 'Bend light around the body to vanish completely.' },
        { name: 'Possession', desc: 'Enter a host body and take control of its actions.' },
        { name: 'Flight', desc: 'Move in three dimensions with no regard for gravity.' },
        { name: 'Fear Aura', desc: 'Project a primal dread that slows even trained soldiers.' }
      ],
      weaknesses: [
        'Direct sunlight burns the ectoplasmic membrane.',
        'The Zs\'Skayr consciousness can seize control.',
        'Sealed energy barriers and wards block phasing.'
      ],
      moves: [
        { name: 'Phase Shift', desc: 'Drop out of phase and let an attack pass through.' },
        { name: 'Possession', desc: 'Slip inside a target and wear them like a suit.' },
        { name: 'Ecto-Screech', desc: 'A psychic wail that shatters concentration.' }
      ],
      stats: { strength: 4, speed: 7, durability: 4, energy: 8, intellect: 7, agility: 8 },
      code: 'B10-006', dna: 'ECT-006 / UNSTABLE', debut: 'Ben 10 — 2005',
      aliases: ['ghostfreak', 'ghost freak', 'ectonurite', 'ghost', 'zskayr'],
      related: ['big-chill', 'snare-oh', 'upgrade']
    },
    {
      slug: 'ripjaws', name: 'Ripjaws', monogram: 'RJ', entry: '007',
      species: 'Piscciss Volann', planet: 'Piscciss', series: 'Original Series', year: '2005',
      className: 'AQUATIC / BRUTE', threat: 'BETA', accent: '#3a86ff', accent2: '#a8d5ff',
      glyph: 'wave',
      tagline: 'Pressure is a love language.',
      summary: 'An ocean predator with a lantern on his head and a bear trap for a jaw. On land he is a problem. Underwater he is the food chain.',
      lore: [
        'Piscciss is a water world with no solid surface — only layers of ocean and pressure. Its Volann natives are the apex species, armoured in overlapping scales and built to survive crushing depths.',
        'The lure on a Volann\'s head is bioluminescent and hypnotic. Prey follows the light. The light is the last thing prey follows.',
        'On land, Ripjaws\' gills dry out fast. Ben has learned to keep fights short, wet, or preferably both.'
      ],
      powers: [
        { name: 'Aquatic Adaptation', desc: 'Breathe water, withstand abyssal pressure and swim at torpedo speed.' },
        { name: 'Crushing Jaws', desc: 'A bite force measured in tonnes, with rows of replaceable teeth.' },
        { name: 'Bioluminescent Lure', desc: 'Hypnotise and misdirect targets with a pulsing light.' },
        { name: 'Depth Resistance', desc: 'Function in trenches where the pressure would implode steel.' },
        { name: 'Scale Armor', desc: 'Overlapping plates deflect blades and glancing energy shots.' }
      ],
      weaknesses: [
        'Dehydrates rapidly in dry heat.',
        'Clumsy and slow on land.',
        'Fresh water vs. salt water can affect buoyancy control.'
      ],
      moves: [
        { name: 'Depth Charge', desc: 'Drag an opponent down and let the pressure do the work.' },
        { name: 'Crush Grip', desc: 'Lock a target in a jaw that does not negotiate.' },
        { name: 'Tidal Lunge', desc: 'Explode upward from the water in a full-body strike.' }
      ],
      stats: { strength: 8, speed: 6, durability: 7, energy: 4, intellect: 4, agility: 5 },
      code: 'B10-007', dna: 'PIS-007 / STABLE', debut: 'Ben 10 — 2005',
      aliases: ['ripjaws', 'rip jaws', 'piscciss', 'shark guy', 'fish'],
      related: ['water-hazard', 'jetray', 'stinkfly']
    },
    {
      slug: 'stinkfly', name: 'Stinkfly', monogram: 'SF', entry: '008',
      species: 'Lepidopterran', planet: 'Lepidopterra', series: 'Original Series', year: '2005',
      className: 'AERIAL / SUPPORT', threat: 'GAMMA', accent: '#b6ff3d', accent2: '#f2ffb0',
      glyph: 'wing',
      tagline: 'Aerial support with a smell.',
      summary: 'Four wings, four eyes, one deeply unpleasant chemical arsenal. Stinkfly is the original ten\'s air force and its least popular passenger.',
      lore: [
        'Lepidopterra is a gas-giant moon covered in fungal forests. Its natives fly through spore clouds thick enough to choke a human, filtering the air through a specialised tracheal system.',
        'The "stink" is a defence chemical stored in a dorsal sac. It is non-toxic to most species, but it clings to fabric, fur and dignity for days.',
        'Lepidopterrans see in a full 360-degree arc and process motion faster than any ground predator. Nothing sneaks up on Stinkfly. Nothing wants to.'
      ],
      powers: [
        { name: 'Flight', desc: 'Hover, strafe and dive with four independently controlled wings.' },
        { name: 'Slime Projection', desc: 'Fire a fast-setting adhesive that pins targets to walls.' },
        { name: 'Stink Gas', desc: 'Release a clinging chemical cloud that disorients and reveals invisible targets.' },
        { name: '360° Vision', desc: 'Four compound eyes eliminate blind spots.' },
        { name: 'Tail Stinger', desc: 'A sharp ovipositor used as a close-range piercing weapon.' }
      ],
      weaknesses: [
        'Waterlogged wings ground him instantly.',
        'Fragile frame — one solid hit can end the flight.',
        'Strong winds wreck his precision.'
      ],
      moves: [
        { name: 'Slime Shot', desc: 'A glob of adhesive delivered at wing speed.' },
        { name: 'Stink Cloud', desc: 'An area denial cloud that sticks to everything.' },
        { name: 'Dive Sting', desc: 'A steep aerial dive into a tail-first strike.' }
      ],
      stats: { strength: 3, speed: 8, durability: 3, energy: 5, intellect: 5, agility: 9 },
      code: 'B10-008', dna: 'LEP-008 / STABLE', debut: 'Ben 10 — 2005',
      aliases: ['stinkfly', 'stink fly', 'lepidopterran', 'bug guy', 'fly'],
      related: ['jetray', 'big-chill', 'ripjaws']
    },
    {
      slug: 'wildmutt', name: 'Wildmutt', monogram: 'WM', entry: '009',
      species: 'Vulpimancer', planet: 'Vulpin', series: 'Original Series', year: '2005',
      className: 'TRACKER / BEAST', threat: 'BETA', accent: '#ff9f1c', accent2: '#ffd9a0',
      glyph: 'paw',
      tagline: 'He does not need eyes to find you.',
      summary: 'A blind, orange apex predator that reads the world through scent, vibration and heat. Wildmutt is the reason Ben never really needs a map.',
      lore: [
        'Vulpin is a high-gravity world of tangled forest and zero light. Vulpimancers lost their eyes generations ago; the trade was a sensory cortex that processes smell, pressure and thermal data as a single three-dimensional map.',
        'Their vocal range sits mostly below human hearing. The growl you can hear is the polite part.',
        'Wildmutt cannot speak, but he understands everything. Ben has described the form as "the most honest one in the watch."'
      ],
      powers: [
        { name: 'Scent Tracking', desc: 'Follow a specific individual across a city through interference and time.' },
        { name: 'Thermal Sense', desc: 'Read body heat through walls and smoke.' },
        { name: 'Vibration Mapping', desc: 'Feel footsteps, heartbeats and structural stress through the ground.' },
        { name: 'Predator Agility', desc: 'Climb, pounce and twist with a body built for high gravity.' },
        { name: 'Bite & Claw', desc: 'Natural weapons backed by dense muscle.' }
      ],
      weaknesses: [
        'Completely blind — bright flashes and overloads disorient him.',
        'Cannot communicate verbally.',
        'Sensory overload from extreme noise or smell.'
      ],
      moves: [
        { name: 'Scent Lock', desc: 'Mark a target and never lose the trail.' },
        { name: 'Pounce', desc: 'A high-gravity leap that ends in a pin.' },
        { name: 'Echo Growl', desc: 'A low-frequency bark that rattles balance.' }
      ],
      stats: { strength: 7, speed: 7, durability: 6, energy: 2, intellect: 4, agility: 9 },
      code: 'B10-009', dna: 'VUL-009 / STABLE', debut: 'Ben 10 — 2005',
      aliases: ['wildmutt', 'wild mutt', 'vulpimancer', 'dog', 'beast'],
      related: ['blitzwolfer', 'rath', 'stinkfly']
    },
    {
      slug: 'cannonbolt', name: 'Cannonbolt', monogram: 'CB', entry: '010',
      species: 'Arburian Pelarota', planet: 'Arburia', series: 'Original Series', year: '2005',
      className: 'ARMOR / IMPACT', threat: 'ALPHA', accent: '#ffd23f', accent2: '#fff4bb',
      glyph: 'sphere',
      tagline: 'The fastest way down is through.',
      summary: 'A bowling ball with a grudge. Cannonbolt curls into an armoured sphere and turns momentum into a physics lesson for whatever is in the way.',
      lore: [
        'Arburia was a peaceful world of rolling plains and very few edges. Its natives evolved a segmented shell that locks into a perfect sphere — a defence that became a sport, then a weapon.',
        'A Pelarota can absorb and redirect kinetic energy across the shell plates. Drop one from orbit and it will bounce. Aim one at a wall and the wall loses.',
        'Cannonbolt was the first alien Ben unlocked after the original ten, and the first sign that the Omnitrix was not finished growing.'
      ],
      powers: [
        { name: 'Armored Shell', desc: 'A locked sphere of overlapping plates that shrugs off heavy fire.' },
        { name: 'Rollout', desc: 'Accelerate to highway speed and maintain it through obstacles.' },
        { name: 'Impact Absorption', desc: 'Soak up blunt force and return it on the rebound.' },
        { name: 'Ricochet', desc: 'Bounce between surfaces with controlled, unpredictable angles.' },
        { name: 'Momentum Charge', desc: 'The longer the roll, the harder the hit.' }
      ],
      weaknesses: [
        'Disoriented for a moment after uncurling.',
        'Slow to build initial speed.',
        'Tight corridors remove the bounce angle.'
      ],
      moves: [
        { name: 'Rollout', desc: 'A full-speed spherical charge.' },
        { name: 'Meteor Slam', desc: 'A falling body-slam delivered from above.' },
        { name: 'Pinball', desc: 'Chain ricochets through multiple targets without losing speed.' }
      ],
      stats: { strength: 8, speed: 6, durability: 9, energy: 2, intellect: 4, agility: 5 },
      code: 'B10-010', dna: 'ARB-010 / STABLE', debut: 'Ben 10 — 2005',
      aliases: ['cannonbolt', 'cannon bolt', 'arburian', 'ball guy', 'roll'],
      related: ['four-arms', 'terraspin', 'armodrillo']
    }
  ];

  /* ---------- Archive entries (searchable, modal dossiers) ---------- */
  var archive = [
    { slug: 'swampfire', name: 'Swampfire', species: 'Methanosian', planet: 'Methanos', series: 'Alien Force', accent: '#79e06a', glyph: 'plant',
      summary: 'A walking greenhouse that throws methane flames and regrows severed limbs. Calm, dry and very hard to put down.',
      powers: ['Fire generation', 'Regeneration', 'Plant control', 'Methane jet propulsion'],
      aliases: ['swamp fire', 'methanosian'] },
    { slug: 'echo-echo', name: 'Echo Echo', species: 'Sonorosian', planet: 'Sonorosia', series: 'Alien Force', accent: '#c9d6e8', glyph: 'sound',
      summary: 'A small silicon suit that duplicates itself and screams in frequencies that turn concrete into dust.',
      powers: ['Sonic screams', 'Self-duplication', 'Sound absorption', 'Wall crawling'],
      aliases: ['echoecho', 'sonorosian'] },
    { slug: 'humungousaur', name: 'Humungousaur', species: 'Vaxasaurian', planet: 'Terradino', series: 'Alien Force', accent: '#d98a3d', glyph: 'fist',
      summary: 'A dinosaur-shaped tank that can grow to sixty feet. The bigger he gets, the less the problem matters.',
      powers: ['Size amplification', 'Colossal strength', 'Armored hide', 'Tail strike'],
      aliases: ['humongousaur', 'humungasaur', 'vaxasaurian', 'dino'] },
    { slug: 'jetray', name: 'Jetray', species: 'Aerophibian', planet: 'Aeropela', series: 'Alien Force', accent: '#ff5d5d', glyph: 'wing',
      summary: 'A manta-ray jet that flies at hypersonic speed and fires neuroshock beams from its eyes and tail.',
      powers: ['Hypersonic flight', 'Neuroshock beams', 'Underwater travel', 'Space survival'],
      aliases: ['jet ray', 'aerophibian'] },
    { slug: 'big-chill', name: 'Big Chill', species: 'Necrofriggian', planet: 'Kylmyys', series: 'Alien Force', accent: '#7fd7ff', glyph: 'ice',
      summary: 'A ghostly moth that phases through matter and breathes ice cold enough to freeze a river solid.',
      powers: ['Intangibility', 'Invisibility', 'Ice breath', 'Flight'],
      aliases: ['bigchill', 'necrofriggian', 'moth'] },
    { slug: 'chromastone', name: 'Chromastone', species: 'Crystalsapien', planet: 'Petropia', series: 'Alien Force', accent: '#b06cff', glyph: 'crystal',
      summary: 'A living prism that absorbs energy and fires it back as ultraviolet destruction. Also, technically, a backup Petropian god.',
      powers: ['Energy absorption', 'Energy redirection', 'Flight', 'Near-invulnerability'],
      aliases: ['chroma stone', 'crystalsapien'] },
    { slug: 'brainstorm', name: 'Brainstorm', species: 'Cerebrocrustacean', planet: 'Encephalonus IV', series: 'Alien Force', accent: '#ffb02e', glyph: 'mind',
      summary: 'A crab with a doctorate. Electrokinetic, telepathic-adjacent, and insufferably correct about it.',
      powers: ['Electrokinesis', 'Genius intellect', 'Telekinesis', 'Cerebral projection'],
      aliases: ['brain storm', 'cerebrocrustacean'] },
    { slug: 'spidermonkey', name: 'Spidermonkey', species: 'Arachnichimp', planet: 'Aranhaschimmia', series: 'Alien Force', accent: '#5fa8ff', glyph: 'paw',
      summary: 'A four-armed blue monkey that swings through traffic and spits webs strong enough to stop a truck.',
      powers: ['Web projection', 'Wall crawling', 'Four arms', 'Agility'],
      aliases: ['spider monkey', 'arachnichimp'] },
    { slug: 'goop', name: 'Goop', species: 'Polymorph', planet: 'Viscosia', series: 'Alien Force', accent: '#9dff4f', glyph: 'slime',
      summary: 'A blob of acidic slime held together by a gravity disc. Almost impossible to hurt, almost impossible to aim.',
      powers: ['Shapeshifting', 'Acid secretion', 'Regeneration', 'Anti-gravity disc'],
      aliases: ['goop', 'polymorph', 'slime'] },
    { slug: 'alien-x', name: 'Alien X', species: 'Celestialsapien', planet: 'Forge of Creation', series: 'Alien Force', accent: '#e6e6ff', glyph: 'cosmic',
      summary: 'A universe-level reality warper with two arguing personalities and a very long decision tree. Omnipotence, with committee approval.',
      powers: ['Reality warping', 'Time manipulation', 'Invulnerability', 'Omnipresence'],
      aliases: ['alienx', 'celestialsapien', 'galaxy guy'] },
    { slug: 'rath', name: 'Rath', species: 'Appoplexian', planet: 'Appoplexia', series: 'Alien Force', accent: '#ff8a2e', glyph: 'fist',
      summary: 'A tiger with a wrestling problem. Rath is all caps, all the time, and surprisingly effective.',
      powers: ['Super strength', 'Durability', 'Rage amplification', 'Claws'],
      aliases: ['rath', 'appoplexian', 'tiger'] },
    { slug: 'nanomech', name: 'Nanomech', species: 'Nanochip hybrid', planet: 'Earth / Galvan', series: 'Alien Force', accent: '#8affd6', glyph: 'tech',
      summary: 'A microscopic fly-sized form created from a Nanochip sample. Shrinks, flies, and fires tiny energy blasts.',
      powers: ['Size reduction', 'Flight', 'Energy beams', 'Hive resistance'],
      aliases: ['nano mech', 'nanochip'] },
    { slug: 'water-hazard', name: 'Water Hazard', species: 'Orishan', planet: 'Kiusana', series: 'Ultimate Alien', accent: '#2f9dff', glyph: 'wave',
      summary: 'A pressure-suited aquatic bruiser that fires high-velocity water jets from its palms.',
      powers: ['Water blasts', 'Armored shell', 'Moisture absorption', 'Enhanced strength'],
      aliases: ['waterhazard', 'orishan'] },
    { slug: 'terraspin', name: 'Terraspin', species: 'Geochelone Aerio', planet: 'Aldabra', series: 'Ultimate Alien', accent: '#8fd96a', glyph: 'wind',
      summary: 'A turtle-like turbine that spins its shell to generate gale-force wind and fly.',
      powers: ['Wind generation', 'Flight', 'Tornado creation', 'Shell armor'],
      aliases: ['terra spin', 'geochelone'] },
    { slug: 'armodrillo', name: 'Armodrillo', species: 'Talpaedan', planet: 'Terraexcava', series: 'Ultimate Alien', accent: '#e0b64a', glyph: 'tech',
      summary: 'A drilling machine with arms. Causes local earthquakes and goes through walls like they are suggestions.',
      powers: ['Piston drills', 'Seismic shockwaves', 'Earth manipulation', 'Armor'],
      aliases: ['armo drillo', 'talpaedan', 'drill'] },
    { slug: 'nrg', name: 'NRG', species: 'Prypiatosian-B', planet: 'Prypiatos', series: 'Ultimate Alien', accent: '#ff5b2e', glyph: 'flame',
      summary: 'A radioactive core sealed inside a containment suit. Open the suit and the room becomes a meltdown.',
      powers: ['Radiation emission', 'Heat blasts', 'Containment armor', 'Energy absorption'],
      aliases: ['nrg', 'energy guy', 'prypiatosian'] },
    { slug: 'ampfibian', name: 'AmpFibian', species: 'Amperi', planet: 'Tesslos', series: 'Ultimate Alien', accent: '#4ad6ff', glyph: 'bolt',
      summary: 'A jellyfish of living current. Reads minds, travels through wiring and shocks anything with a pulse.',
      powers: ['Electrokinesis', 'Intangibility', 'Flight', 'Telepathy'],
      aliases: ['amp fibian', 'ampfibian', 'amperi'] },
    { slug: 'clockwork', name: 'Clockwork', species: 'Chronosapien', planet: 'Chronia', series: 'Omniverse', accent: '#d8b45a', glyph: 'time',
      summary: 'A brass automaton that fires time rays, rewinds objects and walks through history like a corridor.',
      powers: ['Time rays', 'Chronokinesis', 'Time travel', 'Durability'],
      aliases: ['clock work', 'chronosapien'] },
    { slug: 'fasttrack', name: 'Fasttrack', species: 'Citrakayah', planet: 'Chalybeas', series: 'Ultimate Alien', accent: '#7b8cff', glyph: 'bolt',
      summary: 'A feline speedster with actual muscle behind the sprint. Less blur, more impact.',
      powers: ['Super speed', 'Enhanced strength', 'Agility', 'Durability'],
      aliases: ['fast track', 'citrakayah'] },
    { slug: 'chamalien', name: 'ChamAlien', species: 'Merlinisapien', planet: 'Unknown', series: 'Omniverse', accent: '#9dff9d', glyph: 'ghost',
      summary: 'A chameleon infiltrator that bends light around itself and strikes from a blind spot.',
      powers: ['Camouflage', 'Wall crawling', 'Stinger tail', 'Agility'],
      aliases: ['cham alien', 'chameleon'] },
    { slug: 'shocksquatch', name: 'Shocksquatch', species: 'Gimlinopithecus', planet: 'Pattersonea', series: 'Omniverse', accent: '#ffe14a', glyph: 'bolt',
      summary: 'A yeti with a static problem. Brute strength plus a body that discharges electricity on contact.',
      powers: ['Electrokinesis', 'Super strength', 'Durability', 'Shock absorption'],
      aliases: ['shock squatch', 'yeti'] },
    { slug: 'bloxx', name: 'Bloxx', species: 'Segmentasapien', planet: 'Segmenta', series: 'Omniverse', accent: '#ff7a4a', glyph: 'hex',
      summary: 'A construction toy with a temper. Rebuilds its body into walls, bridges, cages and fists.',
      powers: ['Block construction', 'Shapeshifting', 'Super strength', 'Regeneration'],
      aliases: ['blox', 'segmentasapien', 'blocks'] },
    { slug: 'gravattack', name: 'Gravattack', species: 'Galilean', planet: 'Keplorr', series: 'Omniverse', accent: '#b58cff', glyph: 'gravity',
      summary: 'A living planetoid that controls gravity. Makes enemies heavy, light, or briefly orbital.',
      powers: ['Gravity control', 'Orbital field', 'Flight', 'Durability'],
      aliases: ['grav attack', 'galilean', 'gravity'] },
    { slug: 'feedback', name: 'Feedback', species: 'Conductoid', planet: 'Teslavorr', series: 'Omniverse', accent: '#5affd1', glyph: 'bolt',
      summary: 'A living antenna that absorbs any energy and fires it back through plug-like tendrils.',
      powers: ['Energy absorption', 'Energy redirection', 'Tendril combat', 'Flight'],
      aliases: ['feed back', 'conductoid'] },
    { slug: 'wildvine', name: 'Wildvine', species: 'Florauna', planet: 'Flors Verdance', series: 'Original Series', accent: '#6cd94f', glyph: 'plant',
      summary: 'A vine creature that stretches, regenerates and throws explosive seed pods.',
      powers: ['Vine stretching', 'Regeneration', 'Explosive pods', 'Burrowing'],
      aliases: ['wild vine', 'florauna', 'plant guy'] },
    { slug: 'snare-oh', name: 'Snare-oh', species: 'Thep Khufan', planet: 'Anur Khufos', series: 'Original Series', accent: '#e8cf8a', glyph: 'ghost',
      summary: 'A mummy made of living bandages. Stretches, regenerates and wraps enemies into submission.',
      powers: ['Bandage stretching', 'Regeneration', 'Intangibility', 'Flight'],
      aliases: ['snare oh', 'mummy', 'thep khufan'] },
    { slug: 'frankenstrike', name: 'Frankenstrike', species: 'Transylian', planet: 'Anur Transyl', series: 'Original Series', accent: '#9dff5a', glyph: 'bolt',
      summary: 'A stitched-together powerhouse that channels lightning through metal limbs.',
      powers: ['Electrokinesis', 'Super strength', 'Metal manipulation', 'Durability'],
      aliases: ['franken strike', 'transylian'] },
    { slug: 'blitzwolfer', name: 'Blitzwolfer', species: 'Loboan', planet: 'Luna Lobo', series: 'Original Series', accent: '#a8b6ff', glyph: 'paw',
      summary: 'A lunar werewolf with a sonic howl that flattens a street and claws that do the rest.',
      powers: ['Sonic howl', 'Claws', 'Enhanced senses', 'Agility'],
      aliases: ['blitz wolfer', 'werewolf', 'loboan'] },
    { slug: 'upchuck', name: 'Upchuck', species: 'Gourmand', planet: 'Peptos XI', series: 'Original Series', accent: '#9fe04a', glyph: 'slime',
      summary: 'Eats anything, digests it, and spits it back as a glowing projectile. Do not ask about the tongue.',
      powers: ['Matter consumption', 'Energy spit', 'Elastic tongue', 'Stomach storage'],
      aliases: ['up chuck', 'gourmand'] },
    { slug: 'ditto', name: 'Ditto', species: 'Splixson', planet: 'Hathor', series: 'Original Series', accent: '#5fd9d9', glyph: 'hex',
      summary: 'A small blue clone factory. Makes copies, coordinates perfectly, and feels every hit they take.',
      powers: ['Self-duplication', 'Hive coordination', 'Agility', 'Regeneration'],
      aliases: ['ditto', 'splixson', 'clones'] },
    { slug: 'eye-guy', name: 'Eye Guy', species: 'Opticoid', planet: 'Sightra', series: 'Original Series', accent: '#ffd94a', glyph: 'mind',
      summary: 'A bat-like form covered in eyes that fire freezing, burning and concussive beams.',
      powers: ['Eye beams', '360° vision', 'Wall climbing', 'Multiple energy types'],
      aliases: ['eye guy', 'eyeguy', 'opticoid'] },
    { slug: 'way-big', name: 'Way Big', species: "To'kustar", planet: 'Cosmic storm', series: 'Original Series', accent: '#ff4a6e', glyph: 'cosmic',
      summary: 'A kaiju-sized cosmic defender. Steps over buildings and fires a beam that cuts through orbital debris.',
      powers: ['Colossal size', 'Cosmic rays', 'Super strength', 'Space survival'],
      aliases: ['waybig', 'way big', 'tokustar', 'giant'] },
    { slug: 'grey-matter', name: 'Grey Matter', species: 'Galvan', planet: 'Galvan Prime', series: 'Original Series', accent: '#9dff7a', glyph: 'mind',
      summary: 'A three-inch genius with a hyper-fast brain. Solves in seconds what fists cannot solve at all.',
      powers: ['Genius intellect', 'Small size', 'Wall crawling', 'Technology expertise'],
      aliases: ['grey matter', 'graymatter', 'galvan', 'smart guy'] },
    { slug: 'ultimate-swampfire', name: 'Ultimate Swampfire', species: 'Evolved Methanosian', planet: 'Methanos', series: 'Ultimate Alien', accent: '#4aa8ff', glyph: 'flame',
      summary: 'Swampfire pushed through millions of simulated years. Blue fire, heavier armour, worse temper.',
      powers: ['Blue fire', 'Regeneration', 'Explosive seeds', 'Enhanced strength'],
      aliases: ['ultimate swamp fire', 'blue fire'] },
    { slug: 'ultimate-humungousaur', name: 'Ultimate Humungousaur', species: 'Evolved Vaxasaurian', planet: 'Terradino', series: 'Ultimate Alien', accent: '#c98a3d', glyph: 'fist',
      summary: 'Armoured, cannon-armed and permanently angry. The ultimate answer to "what if more dinosaur".',
      powers: ['Armor plating', 'Arm cannons', 'Colossal strength', 'Missile barrage'],
      aliases: ['ultimate humungousaur', 'ultimate humongousaur'] },
    { slug: 'ultimate-echo-echo', name: 'Ultimate Echo Echo', species: 'Evolved Sonorosian', planet: 'Sonorosia', series: 'Ultimate Alien', accent: '#b8c8e8', glyph: 'sound',
      summary: 'A floating sonic weapons platform. Drops discs that turn a city block into a resonance chamber.',
      powers: ['Sonic discs', 'Flight', 'Resonance control', 'Durability'],
      aliases: ['ultimate echo echo', 'ultimate echoecho'] },
    { slug: 'ultimate-big-chill', name: 'Ultimate Big Chill', species: 'Evolved Necrofriggian', planet: 'Kylmyys', series: 'Ultimate Alien', accent: '#6fc8ff', glyph: 'ice',
      summary: 'Ice that burns. A larger, meaner Big Chill whose flames freeze instead of scorch.',
      powers: ['Ice flames', 'Intangibility', 'Flight', 'Ice constructs'],
      aliases: ['ultimate big chill', 'ultimate bigchill'] },
    { slug: 'ultimate-spidermonkey', name: 'Ultimate Spidermonkey', species: 'Evolved Arachnichimp', planet: 'Aranhaschimmia', series: 'Ultimate Alien', accent: '#4a8aff', glyph: 'paw',
      summary: 'A four-armed ape-spider hybrid with web armour and a serious attitude upgrade.',
      powers: ['Four arms', 'Web armour', 'Strength', 'Web constructs'],
      aliases: ['ultimate spider monkey', 'ultimate spidermonkey'] },
    { slug: 'ultimate-cannonbolt', name: 'Ultimate Cannonbolt', species: 'Evolved Arburian Pelarota', planet: 'Arburia', series: 'Ultimate Alien', accent: '#e8c23f', glyph: 'sphere',
      summary: 'A spiked wrecking ball with a shell that shreds anything it touches. Momentum, weaponised.',
      powers: ['Spiked shell', 'Rolling attack', 'Impact absorption', 'Enhanced durability'],
      aliases: ['ultimate cannon bolt', 'ultimate cannonbolt'] },
    { slug: 'ultimate-way-big', name: 'Ultimate Way Big', species: "Evolved To'kustar", planet: 'Cosmic storm', series: 'Ultimate Alien', accent: '#ff3d5e', glyph: 'cosmic',
      summary: 'A planet-scale defender with cosmic blade fins and a beam that punches through fleets.',
      powers: ['Planetary size', 'Cosmic beams', 'Flight', 'Super strength'],
      aliases: ['ultimate way big', 'ultimate waybig'] },
    { slug: 'gax', name: 'Gax', species: 'Chimera Sui Generis', planet: 'Vilgaxia', series: 'Reboot', accent: '#8aff4a', glyph: 'cosmic',
      summary: 'A reboot-era Vilgax form: tentacled, armoured and built for interstellar conquest.',
      powers: ['Flight', 'Super strength', 'Laser vision', 'Tentacle combat'],
      aliases: ['gax', 'vilgax alien'] },
    { slug: 'overflow', name: 'Overflow', species: 'Cascan', planet: 'Casca', series: 'Reboot', accent: '#3ad6ff', glyph: 'wave',
      summary: 'A water construct with a body of pressurised liquid and a talent for tidal violence.',
      powers: ['Water manipulation', 'Hydro jets', 'Pressure control', 'Aquatic travel'],
      aliases: ['over flow', 'cascan', 'water alien'] },
    { slug: 'shock-rock', name: 'Shock Rock', species: 'Fulmini', planet: 'Fulmas', series: 'Reboot', accent: '#a8ff5a', glyph: 'crystal',
      summary: 'A crystal lifeform crackling with stored lightning. Every punch lands with a thunderclap.',
      powers: ['Electrokinesis', 'Crystal constructs', 'Super strength', 'Energy absorption'],
      aliases: ['shock rock', 'fulmini'] },
    { slug: 'slapback', name: 'Slapback', species: 'Ekoplektoid', planet: 'Ekoplekton', series: 'Reboot', accent: '#ffb04a', glyph: 'hex',
      summary: 'Gets hit, gets heavier, makes a copy. Slapback turns every attack into a multiplication problem.',
      powers: ['Kinetic absorption', 'Self-duplication', 'Density increase', 'Strength'],
      aliases: ['slap back', 'ekoplektoid'] }
  ];

  /* ---------- Series timeline ---------- */
  var series = [
    {
      year: '2005', title: 'Ben 10', label: 'ORIGINAL SERIES', device: 'Prototype Omnitrix',
      accent: '#a3ff12',
      blurb: 'A summer road trip, a falling pod, and ten alien templates. Ben Tennyson becomes the universe\'s least qualified hero and somehow keeps the watch.',
      key: 'Heatblast, Four Arms, XLR8, Diamondhead, Upgrade, Ghostfreak, Ripjaws, Stinkfly, Wildmutt, Cannonbolt',
      villain: 'Vilgax', episodes: '49 episodes'
    },
    {
      year: '2008', title: 'Alien Force', label: 'SEASON OF THE HIGHBREED', device: 'Recalibrated Omnitrix',
      accent: '#5cff9d',
      blurb: 'Five years later the watch rebuilds itself and hands Ben a new playlist. The threats are bigger, the team is older, and the Highbreed are at the door.',
      key: 'Swampfire, Echo Echo, Humungousaur, Jetray, Big Chill, Chromastone, Brainstorm, Spidermonkey, Goop, Alien X',
      villain: 'Highbreed / DNAliens', episodes: '46 episodes'
    },
    {
      year: '2010', title: 'Ultimate Alien', label: 'EVOLUTION PROTOCOL', device: 'Ultimatrix',
      accent: '#ff5b2e',
      blurb: 'The Ultimatrix adds an evolution simulator. Ben can push a form through a million years of combat in a heartbeat — at a cost.',
      key: 'Ultimate Swampfire, Ultimate Humungousaur, Ultimate Echo Echo, Water Hazard, Terraspin, Armodrillo, NRG, AmpFibian',
      villain: 'Aggregor / Dagon', episodes: '52 episodes'
    },
    {
      year: '2012', title: 'Omniverse', label: 'THE MULTIVERSE OPENS', device: 'New Omnitrix',
      accent: '#35d6ff',
      blurb: 'A sleeker watch, a new art direction and a wider universe. Alternate timelines, time war, and a Ben who has done this before.',
      key: 'Feedback, Bloxx, Gravattack, Clockwork, Shocksquatch, ChamAlien, Kickin Hawk, Astrodactyl',
      villain: 'Maltruant / Vilgax', episodes: '80 episodes'
    },
    {
      year: '2016', title: 'Reboot', label: 'NEW CONTINUITY', device: 'Reboot Omnitrix',
      accent: '#ffd23f',
      blurb: 'A fresh continuity with a younger Ben, a rebuilt watch and a playlist that mixes classics with new DNA.',
      key: 'Gax, Overflow, Shock Rock, Slapback, Humungousaur, Heatblast',
      villain: 'Vilgax / High Override', episodes: '185 episodes'
    }
  ];

  /* ---------- Omnitrix modes ---------- */
  var modes = [
    {
      id: 'prototype', name: 'Prototype', label: 'B10 / MARK I', accent: '#a3ff12', accent2: '#e4ffb0',
      desc: 'The original. Ten templates, a timed transformation and a dial that had to be slammed by hand. No map, no manual, no safety net.',
      specs: ['10 templates', 'Manual dial', 'Timed charge', 'No quick-select']
    },
    {
      id: 'recalibrated', name: 'Recalibrated', label: 'B10 / MARK II', accent: '#5cff9d', accent2: '#d4ffe8',
      desc: 'Rebuilt itself after five years in storage. A new playlist, a holographic interface and a far more cooperative DNA lock.',
      specs: ['New playlist', 'Holo-interface', 'Voice confirm', 'DNA repair']
    },
    {
      id: 'ultimatrix', name: 'Ultimatrix', label: 'EVOLUTION / MK III', accent: '#ff5b2e', accent2: '#ffd0b0',
      desc: 'Albedo\'s design, rebuilt. Runs a million-year combat simulation on any sample and deploys the evolved result. Powerful, unstable, never quiet.',
      specs: ['Ultimate forms', 'Evolution sim', 'Red core', 'Unstable AI']
    },
    {
      id: 'omniverse', name: 'New Omnitrix', label: 'OMNIVERSE / MK IV', accent: '#35d6ff', accent2: '#c2f6ff',
      desc: 'The finished article. Instant selection, a stable core, and a playlist that keeps growing. Still needs to be slammed. Some things are tradition.',
      specs: ['Instant select', 'Stable core', 'Hundreds of samples', 'Self-repair']
    }
  ];

  /* ---------- Factions ---------- */
  var factions = [
    { name: 'The Plumbers', tag: 'LAW / SUPPORT', accent: '#a3ff12', glyph: 'tech', desc: 'A cross-species peacekeeping force that started as a men-in-black joke and became the backbone of galactic order.' },
    { name: 'The Highbreed', tag: 'PURITY / EXTINCTION', accent: '#7fd7ff', glyph: 'crystal', desc: 'A dying species convinced of its own superiority. Their DNA repair arc is one of the franchise\'s best turns.' },
    { name: 'The Incurseans', tag: 'EMPIRE / COMEDY', accent: '#ff9f1c', glyph: 'cosmic', desc: 'Imperial toads with a fleet, a bureaucracy and a habit of losing to a teenager.' },
    { name: 'The Galvans', tag: 'SCIENCE / CHAOS', accent: '#5cff9d', glyph: 'mind', desc: 'Three-inch geniuses who built the Omnitrix, then kept building things that should not exist.' },
    { name: 'The Anur System', tag: 'HORROR / OUTCASTS', accent: '#b18cff', glyph: 'ghost', desc: 'A cluster of "monster" worlds — Transyl, Khufos, Lobo — whose people are always underestimated.' },
    { name: 'The Celestialsapiens', tag: 'COSMIC / ABSOLUTE', accent: '#e6e6ff', glyph: 'hex', desc: 'Reality warpers who argue for eternity before changing a lightbulb. Alien X is one of them. Sort of.' }
  ];

  /* ---------- helpers ---------- */
  function bySlug(slug) {
    var i;
    for (i = 0; i < featured.length; i++) if (featured[i].slug === slug) return featured[i];
    for (i = 0; i < archive.length; i++) if (archive[i].slug === slug) return archive[i];
    return null;
  }

  function all() {
    var list = featured.slice();
    for (var i = 0; i < archive.length; i++) {
      var a = archive[i];
      list.push({
        slug: a.slug, name: a.name, species: a.species, planet: a.planet,
        series: a.series, accent: a.accent, glyph: a.glyph, summary: a.summary,
        powers: a.powers, aliases: a.aliases || [], featured: false
      });
    }
    return list;
  }

  function glyph(name) {
    return GLYPHS[name] || GLYPHS.hex;
  }

  return {
    featured: featured,
    archive: archive,
    series: series,
    modes: modes,
    factions: factions,
    all: all,
    bySlug: bySlug,
    glyph: glyph,
    glyphNames: Object.keys(GLYPHS)
  };
})();

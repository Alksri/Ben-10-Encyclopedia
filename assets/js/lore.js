/* ============================================================
   BEN 10 — OMNIVERSE PROTOCOL
   Encyclopedia data layer: characters, worlds, factions,
   devices, series and glossary. Original prose summaries.
   ============================================================ */
window.LORE = (function () {
  'use strict';

  var characters = [
    { name: 'Ben Tennyson', type: 'Hero', species: 'Human', world: 'Earth', era: 'All eras', accent: '#a3ff12', glyph: 'hex',
      desc: 'A ordinary kid who found a watch in a meteor crater and became the most important DNA archive in the galaxy. Ben grows from a show-off ten-year-old into a commander who would rather talk a villain down than throw a punch.', tags: ['Omnitrix wielder', 'Plumber', 'Team Tennyson'] },
    { name: 'Gwen Tennyson', type: 'Hero', species: 'Human / Anodite', world: 'Earth', era: 'All eras', accent: '#ff5fd2', glyph: 'mind',
      desc: 'Ben’s cousin, the team’s strategist and a latent Anodite. Gwen’s mana constructs and spellwork turn a rescue mission into a controlled operation — and she is usually the one who remembers the plan.', tags: ['Mana', 'Anodite', 'Magic'] },
    { name: 'Kevin Levin', type: 'Antihero', species: 'Osmosian', world: 'Earth', era: 'Alien Force →', accent: '#8f8f9c', glyph: 'tech',
      desc: 'A mutant who can absorb matter and energy into his body. Kevin starts as Ben’s rival, becomes a partner, and spends the rest of the timeline learning that power without a conscience is just damage.', tags: ['Matter absorption', 'Osmosian', 'Team'] },
    { name: 'Max Tennyson', type: 'Mentor', species: 'Human', world: 'Earth', era: 'All eras', accent: '#ffb347', glyph: 'paw',
      desc: 'Ben’s grandfather and a retired Plumber Magister. Max knows which alien empire owes him a favour, which moon is a trap, and exactly how much chilli a road trip requires.', tags: ['Plumber Magister', 'Mentor', 'Road trip'] },
    { name: 'Rook Blonko', type: 'Partner', species: 'Revonnahgander', world: 'Revonnah', era: 'Omniverse', accent: '#35d6ff', glyph: 'crystal',
      desc: 'A disciplined Plumber recruit assigned to Ben in Omniverse. Rook is polite, literal and terrifyingly competent with a Proto-Tool, which makes him the perfect foil for Ben’s improvisation.', tags: ['Plumber', 'Proto-Tool', 'Omniverse'] },
    { name: 'Vilgax', type: 'Villain', species: 'Chimera Sui Generis', world: 'Vilgaxia', era: 'All eras', accent: '#e2493f', glyph: 'wave',
      desc: 'The conqueror who wants the Omnitrix and will rebuild his body as many times as it takes to get it. Vilgax is the franchise’s measuring stick: every new playlist is tested against him.', tags: ['Conqueror', 'Omnitrix hunter', 'Vilgaxia'] },
    { name: 'Azmuth', type: 'Creator', species: 'Galvan', world: 'Galvan Prime', era: 'All eras', accent: '#5cff9d', glyph: 'tech',
      desc: 'The First Thinker of the Galvans and the creator of the Omnitrix. Azmuth built a device for understanding between species; he spends most of his time annoyed that Ben uses it to punch things.', tags: ['Omnitrix creator', 'Galvan', 'First Thinker'] },
    { name: 'Zs’Skayr', type: 'Villain', species: 'Ectonurite', world: 'Anur Transyl', era: 'Original →', accent: '#b18cff', glyph: 'ghost',
      desc: 'The Ectonurite High Ecto-Lord whose DNA was trapped inside Ghostfreak. Zs’Skayr is patient, theatrical and very difficult to kill, because “dead” is a state he treats as a suggestion.', tags: ['Ectonurite', 'Ghostfreak', 'Anur'] },
    { name: 'Aggregor', type: 'Villain', species: 'Osmosian', world: 'Osmos V', era: 'Ultimate Alien', accent: '#ff6a2c', glyph: 'gravity',
      desc: 'An Osmosian who absorbs the powers of five aliens at once and nearly becomes a god. Aggregor is the Ultimate Alien era’s cold, methodical answer to Kevin’s worst possible future.', tags: ['Osmosian', 'Power absorption', 'Ultimate Alien'] },
    { name: 'Professor Paradox', type: 'Ally', species: 'Human (temporal)', world: 'Unknown', era: 'Alien Force →', accent: '#ffd23f', glyph: 'time',
      desc: 'A time traveller who speaks in paradoxes and arrives exactly when the plot needs him. Paradox understands the multiverse as a garden; he is careful about which flowers he steps on.', tags: ['Time travel', 'Multiverse', 'Mentor'] },
    { name: 'Charmcaster', type: 'Villain', species: 'Human', world: 'Ledgerdomain', era: 'Original →', accent: '#ff5fd2', glyph: 'cosmic',
      desc: 'A powerful sorceress from Ledgerdomain, constantly chasing bigger magic and worse bargains. Her rivalry with Gwen is one of the franchise’s best mirrors: same ambition, different teachers.', tags: ['Magic', 'Ledgerdomain', 'Gwen rival'] },
    { name: 'Albedo', type: 'Villain', species: 'Galvan', world: 'Galvan Prime', era: 'Alien Force →', accent: '#e2493f', glyph: 'hex',
      desc: 'Azmuth’s former assistant, trapped in a human body and obsessed with proving he is the rightful Omnitrix wielder. Albedo is Ben’s skill set without Ben’s restraint.', tags: ['Galvan', 'Evil Omnitrix', 'Rival'] },
    { name: 'Julie Yamamoto', type: 'Ally', species: 'Human', world: 'Earth', era: 'Alien Force →', accent: '#35d6ff', glyph: 'sphere',
      desc: 'A champion tennis player, Ben’s partner for a long stretch of the timeline, and the human anchor to Ship. Julie is the reminder that the universe is worth saving because ordinary life is in it.', tags: ['Tennis', 'Ship', 'Earth'] },
    { name: 'Cooper Daniels', type: 'Ally', species: 'Human mutant', world: 'Earth', era: 'Alien Force →', accent: '#5cff9d', glyph: 'tech',
      desc: 'A technopath who can talk to machines with his mind. Cooper turns scrap into infrastructure and gives the team a hacker’s answer to problems that punch-shaped solutions cannot solve.', tags: ['Technopath', 'Plumber support'] },
    { name: 'Kai Green', type: 'Ally', species: 'Human', world: 'Earth', era: 'Omniverse', accent: '#b6ff3d', glyph: 'paw',
      desc: 'A wildlife expert, dinosaur enthusiast and Ben’s future partner in more than one timeline. Kai is unimpressed by the Omnitrix and completely at home in a jungle full of things that want to eat it.', tags: ['Wildlife', 'Omniverse', 'Future'] },
    { name: 'Verdona', type: 'Ally', species: 'Anodite', world: 'Anodyne', era: 'Alien Force', accent: '#ff5fd2', glyph: 'cosmic',
      desc: 'Gwen’s grandmother and a full Anodite — a being of pure mana wearing a human shape for convenience. Verdona is warm, chaotic and powerful enough that “helping” can look like a natural disaster.', tags: ['Anodite', 'Mana', 'Gwen’s grandmother'] }
  ];

  var planets = [
    { name: 'Pyros', type: 'Home world', species: 'Pyronites', era: 'Original', accent: '#ff6a2c', glyph: 'flame',
      desc: 'A star-scorched world of magma oceans and obsidian continents. Pyronites treat heat as culture and lava as transport; a calm day on Pyros is a geological event.', tags: ['Heatblast', 'Magma', 'Outer rim'] },
    { name: 'Khoros', type: 'Home world', species: 'Tetramands', era: 'Original', accent: '#e2493f', glyph: 'fist',
      desc: 'A high-gravity desert planet that produces warriors with four arms and a deep respect for strength. On Khoros, a handshake is a negotiation and a duel is a greeting.', tags: ['Four Arms', 'High gravity', 'Warrior culture'] },
    { name: 'Kinet', type: 'Home world', species: 'Kinecelerans', era: 'Original', accent: '#35d6ff', glyph: 'bolt',
      desc: 'A world of violent storms and frictionless plains where survival depends on being faster than the weather. Kinecelerans evolved wheels, reflexes and a sense of humour about both.', tags: ['XLR8', 'Storms', 'Speed'] },
    { name: 'Petropia', type: 'Home world', species: 'Petrosapiens', era: 'Original', accent: '#4fe3cf', glyph: 'crystal',
      desc: 'A crystalline planet shattered and later restored, home to silicon-based life that grows in facets. Petrosapien culture is written in mineral memory; damage is a kind of biography.', tags: ['Diamondhead', 'Crystal', 'Restored'] },
    { name: 'Galvan Prime', type: 'Home world', species: 'Galvans', era: 'Original', accent: '#5cff9d', glyph: 'tech',
      desc: 'A tiny world of enormous laboratories and very small, very confident scientists. Galvan technology runs on curiosity, and its greatest export is a watch that changed everything.', tags: ['Azmuth', 'Galvans', 'Omnitrix'] },
    { name: 'Anur Transyl', type: 'Home world', species: 'Ectonurites', era: 'Original', accent: '#b18cff', glyph: 'ghost',
      desc: 'A dark, decayed world in the Anur system where the line between biology and haunting is optional. Its Ectonurite rulers consider sunlight a personal insult.', tags: ['Ghostfreak', 'Anur system', 'Ectonurites'] },
    { name: 'Piscciss', type: 'Home world', species: 'Piscciss Volanns', era: 'Original', accent: '#3a86ff', glyph: 'wave',
      desc: 'A deep-ocean planet of pressure, darkness and bioluminescent lures. Piscciss Volanns are built for the abyss and are visibly uncomfortable in a dry room.', tags: ['Ripjaws', 'Ocean', 'Bioluminescence'] },
    { name: 'Lepidopterra', type: 'Home world', species: 'Lepidopterans', era: 'Original', accent: '#b6ff3d', glyph: 'wing',
      desc: 'A humid world of giant flora and aerial predators where flight is the default form of travel. Lepidopterans navigate by scent, sound and an unreasonable number of eyes.', tags: ['Stinkfly', 'Flight', 'Jungle'] },
    { name: 'Vulpin', type: 'Home world', species: 'Vulpimancers', era: 'Original', accent: '#ff9f1c', glyph: 'paw',
      desc: 'A rugged world of canyons and burrows where sight is a liability and smell is a map. Vulpimancers hunt by vibration, which makes hiding from one an academic exercise.', tags: ['Wildmutt', 'Blind', 'Scent'] },
    { name: 'Arburia', type: 'Home world', species: 'Arburian Pelarotas', era: 'Original', accent: '#ffd23f', glyph: 'sphere',
      desc: 'A world of open plains and rolling terrain, home to a species that solved defence by becoming a sphere. Arburian Pelarotas are living momentum with a very thick shell.', tags: ['Cannonbolt', 'Armour', 'Rolling'] },
    { name: 'Revonnah', type: 'Home world', species: 'Revonnahganders', era: 'Omniverse', accent: '#35d6ff', glyph: 'plant',
      desc: 'An agricultural world of terraced farms and strict traditions, where a Plumber posting is a rare honour. Rook’s home is the quiet counterpoint to Ben’s very loud galaxy.', tags: ['Rook', 'Farming', 'Tradition'] },
    { name: 'Terradino', type: 'Home world', species: 'Vaxasaurians', era: 'Alien Force', accent: '#c98a4b', glyph: 'fist',
      desc: 'A primordial world of giant reptiles and seismic weather. Its Vaxasaurian natives grow into walking siege engines, which makes diplomacy a matter of standing very still.', tags: ['Humungousaur', 'Dinosaurs', 'Giants'] },
    { name: 'Methanos', type: 'Home world', species: 'Methanosians', era: 'Alien Force', accent: '#5cff9d', glyph: 'plant',
      desc: 'A swamp planet of methane clouds, acid rain and aggressive botany. Methanosian biology turns decay into fuel — a walking reminder that “waste” is a human concept.', tags: ['Swampfire', 'Swamp', 'Methane'] },
    { name: 'Peptos XI', type: 'Home world', species: 'Gourmands', era: 'Alien Force', accent: '#ffb347', glyph: 'slime',
      desc: 'A world with a complicated relationship to appetite. Its Gourmand natives can eat almost anything and store it for later, which is either a survival trait or a diplomatic incident.', tags: ['Upchuck', 'Gourmands', 'Appetite'] },
    { name: 'Ledgerdomain', type: 'Dimension', species: 'Magic users', era: 'Ultimate Alien', accent: '#ff5fd2', glyph: 'cosmic',
      desc: 'A realm of raw mana, floating citadels and laws written by whoever holds the Alpha Rune. Time and geography are negotiable; debts are not.', tags: ['Magic', 'Mana', 'Charmcaster'] },
    { name: 'The Null Void', type: 'Pocket dimension', species: 'Exiles', era: 'Original', accent: '#8f8f9c', glyph: 'hex',
      desc: 'A grey, unstable prison dimension used by the Plumbers for the criminals they cannot hold anywhere else. Escape is possible, which is precisely why the Plumbers keep upgrading the door.', tags: ['Prison', 'Plumbers', 'Dimension'] }
  ];

  var factions = [
    { name: 'The Plumbers', type: 'Law enforcement', species: 'Multi-species', era: 'All eras', accent: '#a3ff12', glyph: 'hex',
      desc: 'A galactic peacekeeping organisation founded after the Highbreed wars, now operating from Earth to the outer rim. Plumbers investigate, contain and occasionally babysit a teenager with a doomsday device.', tags: ['Peacekeepers', 'Magisters', 'Rook'] },
    { name: 'The Highbreed', type: 'Supremacist empire', species: 'Highbreed', era: 'Alien Force', accent: '#dfe8e3', glyph: 'ice',
      desc: 'A dying empire convinced of its own genetic superiority. Their attempt to purge the galaxy is stopped not by a bigger army but by a act of mercy that rewrites their entire worldview.', tags: ['Alien Force', 'DNAliens', 'Empire'] },
    { name: 'The Incurseans', type: 'Militaristic empire', species: 'Incurseans', era: 'Omniverse', accent: '#b6ff3d', glyph: 'wave',
      desc: 'A frog-like imperial power led by Emperor Milleous and his daughter Attea. They invade planets with enthusiasm, paperwork and a surprising amount of internal politics.', tags: ['Omniverse', 'Invasion', 'Attea'] },
    { name: 'The Galvans', type: 'Scientific collective', species: 'Galvans', era: 'All eras', accent: '#5cff9d', glyph: 'tech',
      desc: 'The galaxy’s smallest and most consequential scientists. Galvan inventions include the Omnitrix, the Ultimatrix and several things Azmuth would prefer nobody mentions again.', tags: ['Azmuth', 'Invention', 'Galvan Prime'] },
    { name: 'The Anur System', type: 'Loose alliance', species: 'Ectonurites & others', era: 'Original →', accent: '#b18cff', glyph: 'ghost',
      desc: 'A cluster of dark worlds whose inhabitants treat the rest of the galaxy as prey. The Anur system is less a government than a shared aesthetic of menace.', tags: ['Zs’Skayr', 'Ectonurites', 'Dark worlds'] },
    { name: 'The Celestialsapiens', type: 'Cosmic observers', species: 'Celestialsapiens', era: 'Ultimate Alien →', accent: '#8fd8ff', glyph: 'cosmic',
      desc: 'Near-omnipotent beings who debate the fate of reality in a chamber outside time. They gave Ben a new universe and then argued about whether that was allowed.', tags: ['Alien X', 'Omnipotence', 'Forge of Creation'] },
    { name: 'The Forever Knights', type: 'Secret order', species: 'Human', era: 'Original →', accent: '#c9a24a', glyph: 'crystal',
      desc: 'A human supremacist order that hoards alien technology and believes the Earth belongs to humanity. Their armour is impressive; their historical record is not.', tags: ['Earth', 'Alien tech', 'Order'] },
    { name: 'The Rooters', type: 'Covert unit', species: 'Multi-species', era: 'Omniverse', accent: '#e2493f', glyph: 'tech',
      desc: 'A black-ops Plumber splinter group that decided the best way to fight aliens was to make super-soldiers. Their experiments left a trail of broken identities across the galaxy.', tags: ['Black ops', 'Omniverse', 'Experiments'] }
  ];

  var devices = [
    { name: 'Prototype Omnitrix', type: 'DNA device', species: 'Galvan tech', era: '2005', accent: '#a3ff12', glyph: 'hex',
      desc: 'The original wristwatch: a bulky, self-repairing DNA archive with a ten-form playlist and a habit of timing out at the worst possible moment. It chose Ben because it was looking for someone willing to try.', tags: ['Original series', '10 forms', 'Self-repair'] },
    { name: 'Recalibrated Omnitrix', type: 'DNA device', species: 'Galvan tech', era: 'Alien Force', accent: '#5cff9d', glyph: 'tech',
      desc: 'A rebuilt watch with a new playlist, a holographic dial and a slimmer profile. It turned transformation from a novelty into a tactical system — and gave Ben a whole new set of problems.', tags: ['Alien Force', 'New playlist', 'Holo dial'] },
    { name: 'Ultimatrix', type: 'Evolution device', species: 'Galvan tech', era: 'Ultimate Alien', accent: '#ff6a2c', glyph: 'bolt',
      desc: 'Albedo’s knock-off Omnitrix, later rebuilt by Azmuth. Its “ultimate” mode simulates millions of years of combat evolution, producing forms that are stronger, angrier and harder to control.', tags: ['Ultimate Alien', 'Evolution', 'Ultimate forms'] },
    { name: 'Omniverse Omnitrix', type: 'DNA device', species: 'Galvan tech', era: 'Omniverse', accent: '#35d6ff', glyph: 'hex',
      desc: 'The final watch: sleeker, faster, voice-responsive and equipped with a failsafe. It can scan new DNA, reconnect to Ben after separation and still finds time to be dramatically inconvenient.', tags: ['Omniverse', 'Voice control', 'Failsafe'] },
    { name: 'Nemetrix', type: 'Predator device', species: 'Galvan tech', era: 'Omniverse', accent: '#e2493f', glyph: 'paw',
      desc: 'A counterpart to the Omnitrix built for predators rather than heroes. Its samples are the natural enemies of Ben’s aliens, which makes every fight a food-chain problem.', tags: ['Predators', 'Khyber', 'Counter-device'] },
    { name: 'Plumber Badge', type: 'Identification', species: 'Plumber tech', era: 'All eras', accent: '#a3ff12', glyph: 'hex',
      desc: 'A badge, a communicator, a scanner and a licence to intervene. The badge is the reason a Plumber can walk into a crime scene and a reason villains keep stealing them.', tags: ['Plumbers', 'Scanner', 'Comms'] },
    { name: 'Null Void Projector', type: 'Containment', species: 'Plumber tech', era: 'Original →', accent: '#8f8f9c', glyph: 'gravity',
      desc: 'A handheld gateway to the Null Void, used to exile threats that cannot be imprisoned on-world. It is a humane solution right up until the projector breaks.', tags: ['Null Void', 'Prison', 'Portal'] },
    { name: 'Alpha Rune', type: 'Magic artefact', species: 'Ledgerdomain', era: 'Ultimate Alien', accent: '#ff5fd2', glyph: 'cosmic',
      desc: 'The keystone of Ledgerdomain’s magic, capable of rewriting the rules of the realm. Whoever holds it controls the mana supply — and becomes the target of everyone who wants it.', tags: ['Ledgerdomain', 'Mana', 'Charmcaster'] },
    { name: 'Chronosapien Time Bomb', type: 'Temporal weapon', species: 'Chronosapien', era: 'Omniverse', accent: '#ffd23f', glyph: 'time',
      desc: 'A device that erases entire timelines rather than merely destroying places. Its existence is the reason the Omniverse has a multiverse-sized headache.', tags: ['Time war', 'Multiverse', 'Maltruant'] }
  ];

  var series = [
    { name: 'Ben 10', type: 'Series', species: '2005 – 2008', era: 'Original', accent: '#a3ff12', glyph: 'hex',
      desc: 'A summer road trip, a crashed meteor and a watch full of aliens. The original series establishes the tone: monster-of-the-week adventure with a family at the centre and a very loud secret.', tags: ['2005', 'Prototype Omnitrix', 'Road trip'] },
    { name: 'Ben 10: Alien Force', type: 'Series', species: '2008 – 2010', era: 'Alien Force', accent: '#5cff9d', glyph: 'tech',
      desc: 'Five years later, Ben is a teenager, the watch is recalibrated and the galaxy is at war. Alien Force grows the cast, the stakes and the playlist, and gives Kevin a redemption arc.', tags: ['2008', 'Highbreed', 'Recalibrated'] },
    { name: 'Ben 10: Ultimate Alien', type: 'Series', species: '2010 – 2012', era: 'Ultimate Alien', accent: '#ff6a2c', glyph: 'bolt',
      desc: 'Ben’s identity is public, the Ultimatrix is online and Aggregor is collecting power. The era leans into evolution, consequence and the question of what Ben owes the world.', tags: ['2010', 'Ultimatrix', 'Aggregor'] },
    { name: 'Ben 10: Omniverse', type: 'Series', species: '2012 – 2014', era: 'Omniverse', accent: '#35d6ff', glyph: 'cosmic',
      desc: 'A new partner, a new watch and a much bigger multiverse. Omniverse is the most playful era, filling in galactic history while throwing Ben into alternate timelines and comedy bits.', tags: ['2012', 'Rook', 'Multiverse'] },
    { name: 'Ben 10 (Reboot)', type: 'Series', species: '2016 – 2021', era: 'Reboot', accent: '#ffd23f', glyph: 'sphere',
      desc: 'A fresh continuity with a younger Ben, a redesigned watch and a more episodic tone. The reboot remixes classic aliens and introduces new mechanics like Omni-Kix and Omni-Naut.', tags: ['2016', 'Reboot', 'Omni-Kix'] }
  ];

  var glossary = [
    { term: 'Omnitrix', def: 'A wrist-mounted DNA archive that transforms the wearer into any sampled species. Created by Azmuth as a tool for empathy; used by Ben as a very loud problem solver.' },
    { term: 'Ultimatrix', def: 'An evolution simulator disguised as an Omnitrix. It pushes a sample through millions of simulated battles to produce an “ultimate” form.' },
    { term: 'DNA sample', def: 'The genetic record the Omnitrix uses to build a transformation. A sample is not a copy of a person; it is a template the watch interprets.' },
    { term: 'Transformation', def: 'The process of rewriting the wearer’s body into a sampled species. In this build it is represented by the warp overlay and the dial animation.' },
    { term: 'Omni-Kix', def: 'A reboot-era armour mode that layers mechanical plating over an alien form, boosting defence and adding weaponised accessories.' },
    { term: 'Omni-Naut', def: 'A reboot-era space mode that seals an alien form inside a pressurised suit for vacuum and zero-gravity operations.' },
    { term: 'Ultimate form', def: 'A species pushed through simulated combat evolution. Ultimate forms hit harder and look angrier, but they are not always the right answer.' },
    { term: 'Anodite', def: 'A being of pure mana from Anodyne. Anodites can shape energy into constructs and typically wear a physical form out of habit rather than need.' },
    { term: 'Osmosian', def: 'A species able to absorb matter and energy into their bodies. Kevin Levin is the best-known Osmosian; Aggregor is the worst-case version.' },
    { term: 'Plumber', def: 'A member of the galaxy’s peacekeeping organisation. Plumbers investigate alien incidents, contain threats and keep the existence of the galaxy mostly quiet.' },
    { term: 'Null Void', def: 'A pocket dimension used as a prison. It is grey, unstable and full of things that have had a very long time to get angry.' },
    { term: 'Ledgerdomain', def: 'A realm of raw mana and floating citadels, ruled by whoever controls the Alpha Rune. Magic there is geography.' },
    { term: 'Mana', def: 'The energy that powers magic in the Ben 10 universe. Gwen channels it; Charmcaster weaponises it; Ledgerdomain is made of it.' },
    { term: 'Chronosapien', def: 'A time-manipulating species. Chronosapiens can freeze, slow or rewind time, which makes them excellent villains and terrible house guests.' },
    { term: 'Celestialsapien', def: 'A near-omnipotent cosmic being with multiple personalities that must agree before it can act. Alien X is the most famous, and the most frustrating.' },
    { term: 'Galvan', def: 'A tiny, highly intelligent species from Galvan Prime. Galvans built the Omnitrix, the Ultimatrix and most of the technology the plot depends on.' },
    { term: 'Chimera Sui Generis', def: 'Vilgax’s species: large, amphibious and extremely difficult to permanently defeat. Their home world is Vilgaxia.' },
    { term: 'Ectonurite', def: 'A ghost-like species from Anur Transyl. Ectonurites can phase, possess and survive as disembodied consciousness.' },
    { term: 'Tetramand', def: 'A four-armed warrior species from Khoros. Tetramands measure strength in reputation and reputation in duels.' },
    { term: 'Pyronite', def: 'A living combustion organism from Pyros. Pyronites generate and control fire, and treat heat as a form of language.' },
    { term: 'Petrosapien', def: 'A silicon-based crystalline species from Petropia. Petrosapiens can grow and reshape their crystal bodies into weapons and armour.' },
    { term: 'Kineceleran', def: 'A speed-adapted species from Kinet. Kinecelerans can run at supersonic speeds and perceive the world in slowed time.' },
    { term: 'Vulpimancer', def: 'A blind, scent-and-vibration-hunting species from Vulpin. Vulpimancers see the world as a three-dimensional smell map.' },
    { term: 'Lepidopteran', def: 'An insectoid flight species from Lepidopterra. Lepidopterans have compound eyes, four wings and a stinger.' },
    { term: 'Piscciss Volann', def: 'A deep-sea predator species from Piscciss. Piscciss Volanns use lures, teeth and pressure tolerance to dominate the abyss.' },
    { term: 'Arburian Pelarota', def: 'A species from Arburia that can curl into an armoured sphere. Arburian Pelarotas are essentially biological momentum weapons.' },
    { term: 'Galvanic Mechamorph', def: 'A techno-organic species made of liquid metal and circuitry. Galvanic Mechamorphs can merge with and upgrade technology.' },
    { term: 'Highbreed', def: 'A dying imperial species convinced of its genetic superiority. Their war on the galaxy is ended by an act of trust rather than a weapon.' },
    { term: 'Incursean', def: 'A frog-like imperial species from the Incursean empire. Incurseans are loud, expansionist and surprisingly fond of bureaucracy.' },
    { term: 'Revonnahgander', def: 'An agricultural species from Revonnah. Revonnahganders value discipline, tradition and a well-maintained Proto-Tool.' },
    { term: 'Master Control', def: 'An Omnitrix override that removes the time limit and lets the wearer switch forms instantly. It is the dream of every wielder and the nightmare of every villain.' },
    { term: 'Self-destruct mode', def: 'The Omnitrix’s final failsafe: a countdown that can destroy the device, the wearer or a significant amount of local geography.' }
  ];

  var sections = [
    { id: 'characters', label: 'Characters', singular: 'Character', items: characters },
    { id: 'planets', label: 'Worlds', singular: 'World', items: planets },
    { id: 'factions', label: 'Factions', singular: 'Faction', items: factions },
    { id: 'devices', label: 'Devices', singular: 'Device', items: devices },
    { id: 'series', label: 'Series', singular: 'Series', items: series },
    { id: 'glossary', label: 'Glossary', singular: 'Term', items: glossary }
  ];

  function all() {
    var out = [];
    sections.forEach(function (s) {
      s.items.forEach(function (item) {
        out.push({ section: s.id, label: s.singular, item: item });
      });
    });
    return out;
  }

  return {
    characters: characters,
    planets: planets,
    factions: factions,
    devices: devices,
    series: series,
    glossary: glossary,
    sections: sections,
    all: all,
    count: all().length
  };
})();

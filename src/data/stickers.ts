import { StickerItem } from '../types/notebook';

export const STICKER_COLLECTION: StickerItem[] = [
  // --- SPACE ---
  {
    id: 'space_crescent_moon',
    name: 'Dreamy Moon',
    category: 'space',
    emojiFallback: '🌙',
    tags: ['moon', 'night', 'cosmic', 'dream'],
    accentColor: '#fef08a',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="70%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#fde047"/>
        </radialGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="42" fill="url(#moonGlow)" opacity="0.3" filter="url(#softGlow)"/>
      <path d="M68 18C44 24 30 48 36 72C38 80 43 87 49 92C28 88 12 70 12 48C12 24 30 5 54 5C59 5 64 6 68 8C65 11 63 14 62 18Z" fill="url(#moonGlow)"/>
      <circle cx="36" cy="40" r="2.5" fill="#ca8a04" opacity="0.4"/>
      <circle cx="44" cy="58" r="3.5" fill="#ca8a04" opacity="0.4"/>
      <polygon points="76,28 78,33 83,34 79,38 80,43 75,40 70,43 71,38 67,34 72,33" fill="#fef9c3"/>
      <polygon points="62,64 63,67 66,68 64,70 64,73 61,71 58,73 59,70 57,68 60,67" fill="#fef9c3"/>
    </svg>`
  },
  {
    id: 'space_saturn_ring',
    name: 'Cosmic Saturn',
    category: 'space',
    emojiFallback: '🪐',
    tags: ['planet', 'saturn', 'ring', 'galaxy'],
    accentColor: '#c084fc',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="planetGrad" x1="20%" y1="20%" x2="80%" y2="80%">
          <stop offset="0%" stop-color="#f472b6"/>
          <stop offset="50%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fbcfe8"/>
          <stop offset="50%" stop-color="#e9d5ff"/>
          <stop offset="100%" stop-color="#c4b5fd"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="28" fill="url(#planetGrad)"/>
      <path d="M10 52 C 10 36, 90 36, 90 52 C 90 68, 10 68, 10 52 Z" stroke="url(#ringGrad)" stroke-width="7" fill="none" transform="rotate(-25 50 50)"/>
      <path d="M28 50 C 35 44, 65 44, 72 50" stroke="#ffffff" stroke-width="2" opacity="0.5" stroke-linecap="round"/>
      <circle cx="65" cy="40" r="2.5" fill="#ffffff" opacity="0.8"/>
      <circle cx="60" cy="36" r="1.5" fill="#ffffff" opacity="0.8"/>
    </svg>`
  },
  {
    id: 'space_whalien_cosmic',
    name: 'Cosmic Whalien',
    category: 'space',
    emojiFallback: '🐋',
    tags: ['whale', 'whalien', 'galaxy', 'ocean'],
    accentColor: '#818cf8',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="whaleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#60a5fa"/>
          <stop offset="50%" stop-color="#818cf8"/>
          <stop offset="100%" stop-color="#c084fc"/>
        </linearGradient>
      </defs>
      <path d="M12 56 C 18 36, 52 30, 80 44 C 88 48, 92 42, 94 38 C 94 48, 88 56, 78 60 C 58 68, 26 70, 12 56 Z" fill="url(#whaleGrad)"/>
      <path d="M82 46 C 88 40, 94 34, 98 32 C 96 42, 94 48, 82 54" fill="url(#whaleGrad)"/>
      <path d="M42 58 C 44 68, 38 74, 32 76 C 34 70, 38 64, 42 58 Z" fill="#4338ca"/>
      <circle cx="28" cy="50" r="3" fill="#1e1b4b"/>
      <circle cx="27" cy="49" r="1" fill="#ffffff"/>
      <!-- Tiny water/stardust spray -->
      <circle cx="36" cy="32" r="2" fill="#e0e7ff"/>
      <circle cx="42" cy="26" r="2.5" fill="#fbcfe8"/>
      <circle cx="32" cy="24" r="1.5" fill="#c7d2fe"/>
    </svg>`
  },
  {
    id: 'space_seven_stars',
    name: 'Seven Stars Constellation',
    category: 'space',
    emojiFallback: '✨',
    tags: ['constellation', 'stars', 'seven', 'bts'],
    accentColor: '#f43f5e',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20,70 32,50 48,58 60,35 78,42 85,25 68,18" stroke="#d8b4fe" stroke-width="2" stroke-dasharray="3 3"/>
      <circle cx="20" cy="70" r="4.5" fill="#f43f5e"/>
      <circle cx="32" cy="50" r="5" fill="#fb923c"/>
      <circle cx="48" cy="58" r="4.5" fill="#facc15"/>
      <circle cx="60" cy="35" r="5.5" fill="#4ade80"/>
      <circle cx="78" cy="42" r="4.5" fill="#38bdf8"/>
      <circle cx="85" cy="25" r="5" fill="#818cf8"/>
      <circle cx="68" cy="18" r="5.5" fill="#c084fc"/>
      <polygon points="68,18 70,22 74,23 71,26 72,30 68,27 64,30 65,26 62,23 66,22" fill="#ffffff" transform="scale(0.5) translate(68,18)"/>
    </svg>`
  },

  // --- BTS INSPIRED ---
  {
    id: 'bts_borahae_heart',
    name: 'Borahae Purple Heart',
    category: 'bts',
    emojiFallback: '💜',
    tags: ['heart', 'purple', 'borahae', 'love'],
    accentColor: '#9333ea',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="heartGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#e9d5ff"/>
          <stop offset="35%" stop-color="#c084fc"/>
          <stop offset="70%" stop-color="#9333ea"/>
          <stop offset="100%" stop-color="#581c87"/>
        </radialGradient>
        <filter id="purpleGlow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#a855f7" flood-opacity="0.5"/>
        </filter>
      </defs>
      <path d="M50 88 C 20 65, 8 48, 8 28 C 8 14, 19 6, 33 6 C 41 6, 48 10, 50 16 C 52 10, 59 6, 67 6 C 81 6, 92 14, 92 28 C 92 48, 80 65, 50 88 Z" fill="url(#heartGrad)" filter="url(#purpleGlow)"/>
      <path d="M26 20 C 26 14, 32 12, 38 12" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.75"/>
      <circle cx="24" cy="28" r="2" fill="#ffffff" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'bts_golden_mic',
    name: 'Golden Stage Mic',
    category: 'bts',
    emojiFallback: '🎤',
    tags: ['microphone', 'mic', 'music', 'stage', 'concert'],
    accentColor: '#eab308',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#854d0e"/>
        </linearGradient>
      </defs>
      <!-- Mic handle -->
      <path d="M42 46 L30 78 C 29 82, 32 86, 36 86 L42 86 C 46 86, 49 82, 48 78 L42 46" fill="#475569"/>
      <!-- Grip bands -->
      <line x1="33" y1="72" x2="45" y2="72" stroke="#94a3b8" stroke-width="2"/>
      <line x1="35" y1="64" x2="43" y2="64" stroke="#94a3b8" stroke-width="2"/>
      <!-- Mic Head -->
      <rect x="36" y="16" width="28" height="34" rx="14" fill="url(#goldGrad)" transform="rotate(20 50 33)"/>
      <!-- Mesh details -->
      <circle cx="58" cy="28" r="2" fill="#713f12" opacity="0.4"/>
      <circle cx="64" cy="34" r="2" fill="#713f12" opacity="0.4"/>
      <!-- Sparkles -->
      <polygon points="76,16 78,20 82,21 78,23 79,27 75,25 71,27 73,23 69,21 74,20" fill="#facc15"/>
    </svg>`
  },
  {
    id: 'bts_army_bomb',
    name: 'Galaxy Lightstick',
    category: 'bts',
    emojiFallback: '🪄',
    tags: ['lightstick', 'concert', 'army', 'glow'],
    accentColor: '#c084fc',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Handle -->
      <rect x="44" y="52" width="12" height="42" rx="4" fill="#1e1b4b"/>
      <rect x="46" y="64" width="8" height="6" rx="2" fill="#a855f7"/>
      <!-- Sphere Globe -->
      <circle cx="50" cy="34" r="26" fill="rgba(243, 232, 255, 0.45)" stroke="#c084fc" stroke-width="3"/>
      <!-- Red fuse dot -->
      <circle cx="50" cy="8" r="4.5" fill="#ef4444"/>
      <line x1="50" y1="8" x2="50" y2="12" stroke="#1e1b4b" stroke-width="2"/>
      <!-- Inside sparkling core -->
      <circle cx="50" cy="34" r="10" fill="#f3e8ff"/>
      <polygon points="50,26 52,32 58,34 52,36 50,42 48,36 42,34 48,32" fill="#9333ea"/>
      <circle cx="42" cy="26" r="3" fill="#ffffff" opacity="0.8"/>
    </svg>`
  },
  {
    id: 'bts_magic_shop_key',
    name: 'Magic Shop Key',
    category: 'bts',
    emojiFallback: '🗝️',
    tags: ['key', 'magic', 'shop', 'door'],
    accentColor: '#fbbf24',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="magicKey" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde68a"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <!-- Key Bow shaped as Heart -->
      <path d="M50 38 C 42 22, 28 22, 28 34 C 28 42, 38 48, 50 56 C 62 48, 72 42, 72 34 C 72 22, 58 22, 50 38 Z" fill="url(#magicKey)" stroke="#78350f" stroke-width="1.5"/>
      <circle cx="50" cy="35" r="5" fill="#1e1b4b"/>
      <!-- Key Stem -->
      <rect x="47" y="52" width="6" height="38" rx="2" fill="url(#magicKey)"/>
      <!-- Key Bit/Teeth (7 shaped) -->
      <rect x="53" y="74" width="10" height="4" rx="1.5" fill="url(#magicKey)"/>
      <rect x="53" y="82" width="14" height="4" rx="1.5" fill="url(#magicKey)"/>
    </svg>`
  },

  // --- CUTE CHARACTERS (BT21-STYLE ORIGINAL AESTHETIC COSMIC BUDDIES) ---
  {
    id: 'char_sleepy_koala',
    name: 'Cosmic Koala',
    category: 'characters',
    emojiFallback: '🐨',
    tags: ['koya', 'koala', 'blue', 'sleepy', 'cute', 'character'],
    accentColor: '#60a5fa',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Ears -->
      <circle cx="24" cy="32" r="15" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2.5"/>
      <circle cx="24" cy="32" r="8" fill="#dbeafe"/>
      <circle cx="76" cy="32" r="15" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2.5"/>
      <circle cx="76" cy="32" r="8" fill="#dbeafe"/>
      <!-- Head -->
      <ellipse cx="50" cy="56" rx="34" ry="28" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2.5"/>
      <!-- Nose (Deep violet oval) -->
      <ellipse cx="50" cy="56" rx="9" ry="12" fill="#4338ca"/>
      <!-- Sleeping Eyes (curved lines) -->
      <path d="M34 52 Q 38 56 42 52" stroke="#1e3a8a" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M58 52 Q 62 56 66 52" stroke="#1e3a8a" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <!-- Rosy cheeks -->
      <ellipse cx="26" cy="62" rx="5" ry="3" fill="#f472b6" opacity="0.6"/>
      <ellipse cx="74" cy="62" rx="5" ry="3" fill="#f472b6" opacity="0.6"/>
      <!-- Small sleep bubble 'Z' -->
      <text x="74" y="24" fill="#a855f7" font-weight="bold" font-size="14" font-family="sans-serif">z</text>
    </svg>`
  },
  {
    id: 'char_golden_puppy',
    name: 'Joyful Cosmic Puppy',
    category: 'characters',
    emojiFallback: '🐶',
    tags: ['chimmy', 'puppy', 'yellow', 'hoodie', 'cute', 'character'],
    accentColor: '#facc15',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Yellow Hoodie -->
      <circle cx="50" cy="50" r="38" fill="#facc15" stroke="#854d0e" stroke-width="2.5"/>
      <!-- Black floppy ears -->
      <path d="M14 36 C 8 46, 8 68, 18 70 C 24 72, 28 62, 24 48 Z" fill="#1e1b4b"/>
      <path d="M86 36 C 92 46, 92 68, 82 70 C 76 72, 72 62, 76 48 Z" fill="#1e1b4b"/>
      <!-- White Face inside hoodie -->
      <ellipse cx="50" cy="54" rx="24" ry="22" fill="#ffffff" stroke="#854d0e" stroke-width="2"/>
      <!-- Cheerful eyes -->
      <ellipse cx="40" cy="50" rx="3" ry="4" fill="#1e1b4b"/>
      <ellipse cx="60" cy="50" rx="3" ry="4" fill="#1e1b4b"/>
      <!-- Nose -->
      <ellipse cx="50" cy="56" rx="3" ry="2.5" fill="#1e1b4b"/>
      <!-- Tongue sticking out -->
      <path d="M48 62 C 48 68, 54 68, 54 62" fill="#f43f5e" stroke="#9f1239" stroke-width="1.5"/>
    </svg>`
  },
  {
    id: 'char_tough_bunny',
    name: 'Cosmic Pink Bunny',
    category: 'characters',
    emojiFallback: '🐰',
    tags: ['cooky', 'bunny', 'pink', 'rabbit', 'cute', 'character'],
    accentColor: '#f472b6',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Bunny ears (one tilted) -->
      <ellipse cx="36" cy="24" rx="8" ry="18" fill="#f472b6" stroke="#9d174d" stroke-width="2"/>
      <ellipse cx="36" cy="24" rx="4" ry="12" fill="#fbcfe8"/>
      <!-- Tilted right ear -->
      <g transform="rotate(30 68 28)">
        <ellipse cx="68" cy="24" rx="8" ry="18" fill="#f472b6" stroke="#9d174d" stroke-width="2"/>
        <ellipse cx="68" cy="24" rx="4" ry="12" fill="#fbcfe8"/>
      </g>
      <!-- Head -->
      <circle cx="50" cy="60" r="30" fill="#f472b6" stroke="#9d174d" stroke-width="2.5"/>
      <!-- Signature raised eyebrow on left -->
      <path d="M34 50 L44 54" stroke="#9d174d" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M56 54 L66 52" stroke="#9d174d" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Eyes -->
      <circle cx="39" cy="58" r="3.5" fill="#1e1b4b"/>
      <circle cx="61" cy="58" r="3.5" fill="#1e1b4b"/>
      <!-- Nose & Mouth -->
      <circle cx="50" cy="65" r="2.5" fill="#be185d"/>
      <path d="M46 69 Q 50 72 54 69" stroke="#9d174d" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>`
  },
  {
    id: 'char_heart_alien',
    name: 'Heart Crown Wanderer',
    category: 'characters',
    emojiFallback: '❤️',
    tags: ['tata', 'alien', 'heart', 'red', 'cute', 'character'],
    accentColor: '#ef4444',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Large Heart Head -->
      <path d="M50 72 C 24 50, 12 36, 12 20 C 12 8, 22 2, 34 2 C 42 2, 48 6, 50 12 C 52 6, 58 2, 66 2 C 78 2, 88 8, 88 20 C 88 36, 76 50, 50 72 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>
      <!-- Big Round Eyes -->
      <circle cx="36" cy="28" r="4.5" fill="#1e1b4b"/>
      <circle cx="35" cy="26" r="1.5" fill="#ffffff"/>
      <circle cx="64" cy="28" r="4.5" fill="#1e1b4b"/>
      <circle cx="63" cy="26" r="1.5" fill="#ffffff"/>
      <!-- Thick yellow lips -->
      <ellipse cx="50" cy="44" rx="10" ry="5.5" fill="#facc15" stroke="#a16207" stroke-width="1.5"/>
      <!-- Tiny space body -->
      <ellipse cx="50" cy="84" rx="14" ry="12" fill="#1e40af"/>
      <circle cx="44" cy="82" r="3" fill="#facc15"/>
      <circle cx="56" cy="85" r="3" fill="#facc15"/>
    </svg>`
  },
  {
    id: 'char_star_alpaca',
    name: 'Fluffy Star Alpaca',
    category: 'characters',
    emojiFallback: '🦙',
    tags: ['rj', 'alpaca', 'white', 'fluffy', 'cute', 'character'],
    accentColor: '#f1f5f9',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Fluffy cloud ears -->
      <circle cx="26" cy="26" r="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="74" cy="26" r="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <!-- Cloud Head Body -->
      <path d="M30 40 C 22 40, 18 50, 22 62 C 18 72, 28 84, 40 84 C 44 88, 56 88, 60 84 C 72 84, 82 72, 78 62 C 82 50, 78 40, 70 40 C 68 32, 54 28, 50 32 C 46 28, 32 32, 30 40 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <!-- Red Bandana Scarf -->
      <path d="M36 78 C 42 86, 58 86, 64 78 C 66 84, 60 92, 50 94 C 40 92, 34 84, 36 78 Z" fill="#ef4444"/>
      <!-- Cute Eyes & Face -->
      <circle cx="42" cy="54" r="3" fill="#1e1b4b"/>
      <circle cx="58" cy="54" r="3" fill="#1e1b4b"/>
      <ellipse cx="36" cy="62" rx="4" ry="2.5" fill="#fca5a5" opacity="0.6"/>
      <ellipse cx="64" cy="62" rx="4" ry="2.5" fill="#fca5a5" opacity="0.6"/>
      <path d="M47 62 Q 50 64 53 62" stroke="#1e1b4b" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    </svg>`
  },

  // --- STUDY & RESEARCH ---
  {
    id: 'study_open_book',
    name: 'Galaxy Grimoire',
    category: 'study',
    emojiFallback: '📖',
    tags: ['book', 'read', 'study', 'research'],
    accentColor: '#818cf8',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4c1d95"/>
          <stop offset="100%" stop-color="#7c3aed"/>
        </linearGradient>
      </defs>
      <!-- Base Cover -->
      <path d="M12 68 C 24 64, 46 64, 50 72 C 54 64, 76 64, 88 68 L 88 32 C 76 28, 54 28, 50 36 C 46 28, 24 28, 12 32 Z" fill="url(#bookCover)" stroke="#c4b5fd" stroke-width="2"/>
      <!-- Pages -->
      <path d="M16 64 C 26 60, 46 60, 49 68 L 49 34 C 46 26, 26 26, 16 30 Z" fill="#faf5ff"/>
      <path d="M84 64 C 74 60, 54 60, 51 68 L 51 34 C 54 26, 74 26, 84 30 Z" fill="#faf5ff"/>
      <!-- Bookmark ribbon -->
      <path d="M48 34 L 52 34 L 52 74 L 50 71 L 48 74 Z" fill="#f43f5e"/>
      <!-- Stardust rising -->
      <circle cx="32" cy="20" r="2" fill="#facc15"/>
      <circle cx="68" cy="18" r="2.5" fill="#e879f9"/>
    </svg>`
  },
  {
    id: 'study_glowing_bulb',
    name: 'Cosmic Eureka Idea',
    category: 'study',
    emojiFallback: '💡',
    tags: ['idea', 'lightbulb', 'eureka', 'inspire'],
    accentColor: '#facc15',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Glow rays -->
      <line x1="50" y1="6" x2="50" y2="14" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
      <line x1="22" y1="20" x2="28" y2="26" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
      <line x1="78" y1="20" x2="72" y2="26" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
      <!-- Bulb body -->
      <path d="M34 44 C 34 32, 42 22, 50 22 C 58 22, 66 32, 66 44 C 66 52, 60 58, 58 64 L 42 64 C 40 58, 34 52, 34 44 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5"/>
      <!-- Filament -->
      <path d="M46 44 Q 50 40 54 44" stroke="#eab308" stroke-width="2" fill="none"/>
      <!-- Screw base -->
      <rect x="42" y="66" width="16" height="5" rx="2" fill="#94a3b8"/>
      <rect x="44" y="73" width="12" height="4" rx="2" fill="#64748b"/>
    </svg>`
  },
  {
    id: 'study_magnifier',
    name: 'Research Lens',
    category: 'study',
    emojiFallback: '🔍',
    tags: ['search', 'lens', 'research', 'inspect'],
    accentColor: '#38bdf8',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="44" cy="44" r="26" fill="rgba(224, 242, 254, 0.45)" stroke="#38bdf8" stroke-width="5"/>
      <line x1="63" y1="63" x2="86" y2="86" stroke="#475569" stroke-width="8" stroke-linecap="round"/>
      <line x1="63" y1="63" x2="74" y2="74" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>
      <path d="M32 30 A 16 16 0 0 1 48 24" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  },

  // --- MOTIVATIONAL PHRASES ---
  {
    id: 'quote_borahae',
    name: 'Borahae Banner',
    category: 'motivational',
    emojiFallback: '💜',
    tags: ['borahae', 'quote', 'purple', 'love'],
    accentColor: '#9333ea',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="28" width="88" height="44" rx="14" fill="#6b21a8" stroke="#d8b4fe" stroke-width="3"/>
      <text x="50" y="48" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="13" text-anchor="middle" letter-spacing="1">BORAHAE</text>
      <text x="50" y="63" fill="#fbcfe8" font-family="'Caveat', cursive" font-weight="700" font-size="12" text-anchor="middle">I purple you 💜</text>
    </svg>`
  },
  {
    id: 'quote_shine_dream',
    name: 'Shine Dream Smile',
    category: 'motivational',
    emojiFallback: '⭐',
    tags: ['quote', 'mikrokosmos', 'shine', 'dream'],
    accentColor: '#ec4899',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 32 C 30 24, 70 24, 92 32 L 86 68 C 64 60, 24 60, 14 68 Z" fill="#db2777" stroke="#fbcfe8" stroke-width="2"/>
      <text x="50" y="47" fill="#ffffff" font-family="'Fredoka', sans-serif" font-weight="700" font-size="10.5" text-anchor="middle">SHINE • DREAM</text>
      <text x="50" y="60" fill="#fef08a" font-family="'Fredoka', sans-serif" font-weight="700" font-size="11" text-anchor="middle">SMILE ✨</text>
    </svg>`
  },
  {
    id: 'quote_magic_shop',
    name: 'Welcome to Magic Shop',
    category: 'motivational',
    emojiFallback: '🚪',
    tags: ['magic shop', 'quote', 'comfort', 'tea'],
    accentColor: '#3b82f6',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="24" width="80" height="52" rx="10" fill="#1e1b4b" stroke="#818cf8" stroke-width="2.5"/>
      <text x="50" y="45" fill="#a5b4fc" font-family="'Caveat', cursive" font-weight="700" font-size="15" text-anchor="middle">In the Magic Shop...</text>
      <text x="50" y="62" fill="#fef08a" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="9" text-anchor="middle">DRINK WARM TEA & BREATHE</text>
    </svg>`
  }
];

export const DAILY_QUOTES = [
  {
    quote: "You gave me the best of me, so you'll give you the best of you.",
    song: "Magic Shop",
    theme: "Self-Belief"
  },
  {
    quote: "One history in one person, one star in one person, 7 billion worlds shining with 7 billion lights.",
    song: "Mikrokosmos",
    theme: "Individuality"
  },
  {
    quote: "The dawn right before the sun rises is the darkest. Never forget the stars you wished for.",
    song: "Tomorrow",
    theme: "Persistence"
  },
  {
    quote: "Maybe I made a mistake yesterday, but yesterday's me is still me. Today I am who I am with all my faults.",
    song: "Love Myself",
    theme: "Acceptance"
  },
  {
    quote: "No darkness, no season can last forever. The morning will come again.",
    song: "Spring Day",
    theme: "Hope"
  },
  {
    quote: "Even if you live for a day, do something. Put away your weakness and speak yourself.",
    song: "No More Dream",
    theme: "Purpose"
  }
];

export const AVATAR_OPTIONS = [
  { id: 'koya', name: 'Sleepy Koala', color: '#60a5fa', emoji: '🐨' },
  { id: 'chimmy', name: 'Joyful Puppy', color: '#facc15', emoji: '🐶' },
  { id: 'cooky', name: 'Cosmic Bunny', color: '#f472b6', emoji: '🐰' },
  { id: 'tata', name: 'Heart Alien', color: '#ef4444', emoji: '❤️' },
  { id: 'rj', name: 'Fluffy Alpaca', color: '#e2e8f0', emoji: '🦙' },
  { id: 'mang', name: 'Masked Dancer', color: '#a855f7', emoji: '🦄' },
  { id: 'shooky', name: 'Star Cookie', color: '#b45309', emoji: '🍪' },
];

// ============================================================
// GL1TCH: OVERRIDE — Game Engine
// ============================================================

// --- Types ---
export type GameMode = "story" | "speedrun" | "endless" | "chaos" | "hardcore" | "zen"

export const OWNER_NAMES = [
  "patrick otto",
  "patrick",
  "pat",
  "patrick o",
  "sgs12",
  "supergodspeed12",
]

export interface Vec2 {
  x: number
  y: number
}

export interface Platform {
  x: number
  y: number
  w: number
  h: number
  type: "solid" | "phase" | "falling" | "moving" | "corrupt"
  visible: boolean
  moveDir?: number
  moveRange?: number
  moveSpeed?: number
  originX?: number
  originY?: number
  fallTimer?: number
  color?: string
}

export interface Enemy {
  x: number
  y: number
  w: number
  h: number
  type: "watchdog" | "logic_bomb" | "memory_leak" | "fragment" | "mirror_bug" | "null_anchor" | "lag_beast"
  vx: number
  vy: number
  hp: number
  maxHp: number
  alive: boolean
  patrolRange?: number
  originX?: number
  originY?: number
  growthRate?: number
  radius?: number
  pulseTimer?: number
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export interface DataPacket {
  x: number
  y: number
  w: number
  h: number
  collected: boolean
  type: "data" | "health" | "overclock"
}

export interface LevelData {
  name: string
  width: number
  height: number
  spawnX: number
  spawnY: number
  exitX: number
  exitY: number
  platforms: Platform[]
  enemies: Enemy[]
  packets: DataPacket[]
  bgColor?: string
  corruptionModifier?: number
}

export interface PlayerState {
  x: number
  y: number
  w: number
  h: number
  vx: number
  vy: number
  onGround: boolean
  facing: number
  jumpsLeft: number
  maxJumps: number
  dashCooldown: number
  dashTimer: number
  isDashing: boolean
  dashDir: number
  health: number
  maxHealth: number
  corruption: number
  glitchMeter: number
  maxGlitch: number
  overclocked: boolean
  overclockHeat: number
  invincible: number
  dead: boolean
  score: number
  afterimages: { x: number; y: number; alpha: number; facing: number }[]
  isDoubleJumping: boolean
  hasMovedThisRun: boolean
}

export interface GameState {
  player: PlayerState
  camera: Vec2
  particles: Particle[]
  screenShake: number
  glitchIntensity: number
  levelTime: number
  paused: boolean
  gameOver: boolean
  levelComplete: boolean
  currentLevel: number
  gameMode: GameMode
  speedrunTimer: number
  speedrunStarted: boolean
  secretComboActive: boolean
  secretComboSequence: string[]
  allLevelsComplete: boolean
  hud: {
    showCorruptionWarning: boolean
    fakeNotification: string | null
    notificationTimer: number
    hudMelt: number
    modeTransitionText: string | null
    modeTransitionTimer: number
    doubleJumpFlash: number
  }
}

export interface InputState {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
  jump: boolean
  dash: boolean
  overclock: boolean
  attack: boolean
  jumpPressed: boolean
  dashPressed: boolean
  overclockPressed: boolean
  attackPressed: boolean
}

// --- Constants ---
const GRAVITY = 0.45
const JUMP_FORCE = -11
const DOUBLE_JUMP_FORCE = -10
const MOVE_SPEED = 1.5
const DASH_SPEED = 15
const DASH_DURATION = 10
const DASH_COOLDOWN = 28
const MAX_FALL_SPEED = 10
const PLAYER_W = 20
const PLAYER_H = 28
const FRICTION = 0.85
const AIR_FRICTION = 0.92
const WALL_SLIDE_SPEED = 2
const OVERCLOCK_HEAT_RATE = 0.30
const OVERCLOCK_COOL_RATE = 0.25
const CORRUPTION_DECAY = 0.005

// --- Level Definitions ---
export const LEVELS: LevelData[] = [
  // Level 1: RAM Corridor (Tutorial)
  {
    name: "RAM Corridor",
    width: 2400,
    height: 600,
    spawnX: 60,
    spawnY: 460,
    exitX: 2300,
    exitY: 200,
    platforms: [
      // Ground
      { x: 0, y: 520, w: 400, h: 80, type: "solid", visible: true },
      { x: 450, y: 520, w: 200, h: 80, type: "solid", visible: true },
      { x: 700, y: 480, w: 150, h: 120, type: "solid", visible: true },
      { x: 900, y: 440, w: 120, h: 160, type: "solid", visible: true },
      // Platforms ascending
      { x: 1070, y: 380, w: 100, h: 20, type: "solid", visible: true },
      { x: 1220, y: 340, w: 120, h: 20, type: "phase", visible: true },
      { x: 1400, y: 300, w: 100, h: 20, type: "solid", visible: true },
      { x: 1550, y: 350, w: 80, h: 20, type: "moving", visible: true, moveDir: 1, moveRange: 100, moveSpeed: 1.5, originX: 1550, originY: 350 },
      { x: 1700, y: 280, w: 120, h: 20, type: "solid", visible: true },
      // Upper section
      { x: 1870, y: 250, w: 100, h: 20, type: "phase", visible: true },
      { x: 2020, y: 220, w: 150, h: 20, type: "solid", visible: true },
      { x: 2220, y: 220, w: 200, h: 20, type: "solid", visible: true },
      // Walls
      { x: 850, y: 200, w: 20, h: 320, type: "solid", visible: true },
      { x: 1680, y: 100, w: 20, h: 180, type: "solid", visible: true },
    ],
    enemies: [
      { x: 500, y: 490, w: 24, h: 24, type: "fragment", vx: 2, vy: 0, hp: 1, maxHp: 1, alive: true, patrolRange: 150, originX: 500, originY: 490 },
      { x: 1400, y: 270, w: 24, h: 24, type: "watchdog", vx: 1.5, vy: 0, hp: 2, maxHp: 2, alive: true, patrolRange: 80, originX: 1400, originY: 270 },
    ],
    packets: [
      { x: 480, y: 480, w: 16, h: 16, collected: false, type: "data" },
      { x: 1100, y: 340, w: 16, h: 16, collected: false, type: "data" },
      { x: 1750, y: 240, w: 16, h: 16, collected: false, type: "health" },
      { x: 2050, y: 180, w: 16, h: 16, collected: false, type: "data" },
    ],
  },
  // Level 2: CPU Core
  {
    name: "CPU Core",
    width: 2800,
    height: 700,
    spawnX: 60,
    spawnY: 560,
    exitX: 2700,
    exitY: 150,
    platforms: [
      // Ground
      { x: 0, y: 600, w: 300, h: 100, type: "solid", visible: true },
      { x: 350, y: 580, w: 100, h: 120, type: "falling", visible: true, fallTimer: 0 },
      { x: 500, y: 560, w: 120, h: 140, type: "solid", visible: true },
      // Moving section
      { x: 680, y: 500, w: 80, h: 20, type: "moving", visible: true, moveDir: 1, moveRange: 120, moveSpeed: 2, originX: 680, originY: 500 },
      { x: 880, y: 450, w: 80, h: 20, type: "moving", visible: true, moveDir: -1, moveRange: 80, moveSpeed: 1.5, originX: 880, originY: 450 },
      { x: 1040, y: 400, w: 150, h: 20, type: "solid", visible: true },
      // Corrupt section
      { x: 1250, y: 370, w: 100, h: 20, type: "corrupt", visible: true, color: "hsl(340,100%,55%)" },
      { x: 1400, y: 340, w: 80, h: 20, type: "phase", visible: true },
      { x: 1550, y: 450, w: 200, h: 20, type: "solid", visible: true },
      // Vertical climb
      { x: 1600, y: 200, w: 20, h: 250, type: "solid", visible: true },
      { x: 1700, y: 300, w: 100, h: 20, type: "solid", visible: true },
      { x: 1850, y: 250, w: 80, h: 20, type: "falling", visible: true, fallTimer: 0 },
      { x: 2000, y: 200, w: 120, h: 20, type: "solid", visible: true },
      // Final stretch
      { x: 2180, y: 250, w: 80, h: 20, type: "moving", visible: true, moveDir: 1, moveRange: 60, moveSpeed: 2, originX: 2180, originY: 250 },
      { x: 2350, y: 200, w: 100, h: 20, type: "phase", visible: true },
      { x: 2550, y: 170, w: 250, h: 20, type: "solid", visible: true },
    ],
    enemies: [
      { x: 550, y: 530, w: 24, h: 24, type: "watchdog", vx: 2, vy: 0, hp: 2, maxHp: 2, alive: true, patrolRange: 100, originX: 550, originY: 530 },
      { x: 1080, y: 370, w: 24, h: 24, type: "logic_bomb", vx: 0, vy: 0, hp: 1, maxHp: 1, alive: true, originX: 1080, originY: 370 },
      { x: 1300, y: 340, w: 30, h: 30, type: "memory_leak", vx: 0, vy: 0, hp: 3, maxHp: 3, alive: true, originX: 1300, originY: 340, growthRate: 0.02, radius: 15 },
      { x: 2100, y: 170, w: 24, h: 24, type: "fragment", vx: 3, vy: 0, hp: 1, maxHp: 1, alive: true, patrolRange: 120, originX: 2100, originY: 170 },
      { x: 2400, y: 170, w: 24, h: 24, type: "mirror_bug", vx: 0, vy: 0, hp: 2, maxHp: 2, alive: true, originX: 2400, originY: 170 },
    ],
    packets: [
      { x: 730, y: 460, w: 16, h: 16, collected: false, type: "data" },
      { x: 1100, y: 360, w: 16, h: 16, collected: false, type: "overclock" },
      { x: 1750, y: 260, w: 16, h: 16, collected: false, type: "health" },
      { x: 2050, y: 160, w: 16, h: 16, collected: false, type: "data" },
      { x: 2600, y: 130, w: 16, h: 16, collected: false, type: "data" },
    ],
    corruptionModifier: 1.2,
  },
  // Level 3: GPU Wasteland
  {
    name: "GPU Wasteland",
    width: 3200,
    height: 800,
    spawnX: 60,
    spawnY: 660,
    exitX: 3100,
    exitY: 100,
    platforms: [
      { x: 0, y: 700, w: 250, h: 100, type: "solid", visible: true },
      { x: 300, y: 680, w: 80, h: 20, type: "falling", visible: true, fallTimer: 0 },
      { x: 430, y: 650, w: 80, h: 20, type: "falling", visible: true, fallTimer: 0 },
      { x: 560, y: 600, w: 150, h: 200, type: "solid", visible: true },
      { x: 770, y: 550, w: 80, h: 20, type: "moving", visible: true, moveDir: 1, moveRange: 100, moveSpeed: 2.5, originX: 770, originY: 550 },
      { x: 950, y: 500, w: 100, h: 20, type: "corrupt", visible: true },
      { x: 1120, y: 460, w: 120, h: 20, type: "solid", visible: true },
      { x: 1300, y: 500, w: 20, h: 200, type: "solid", visible: true },
      { x: 1300, y: 400, w: 100, h: 20, type: "solid", visible: true },
      { x: 1470, y: 350, w: 80, h: 20, type: "phase", visible: true },
      { x: 1600, y: 300, w: 80, h: 20, type: "moving", visible: true, moveDir: -1, moveRange: 80, moveSpeed: 1.8, originX: 1600, originY: 300 },
      { x: 1780, y: 350, w: 200, h: 20, type: "solid", visible: true },
      { x: 2050, y: 300, w: 80, h: 20, type: "falling", visible: true, fallTimer: 0 },
      { x: 2200, y: 250, w: 120, h: 20, type: "corrupt", visible: true },
      { x: 2380, y: 200, w: 100, h: 20, type: "phase", visible: true },
      { x: 2550, y: 250, w: 20, h: 200, type: "solid", visible: true },
      { x: 2550, y: 150, w: 150, h: 20, type: "solid", visible: true },
      { x: 2770, y: 130, w: 80, h: 20, type: "moving", visible: true, moveDir: 1, moveRange: 60, moveSpeed: 3, originX: 2770, originY: 130 },
      { x: 2950, y: 120, w: 250, h: 20, type: "solid", visible: true },
    ],
    enemies: [
      { x: 600, y: 570, w: 24, h: 24, type: "watchdog", vx: 2.5, vy: 0, hp: 2, maxHp: 2, alive: true, patrolRange: 120, originX: 600, originY: 570 },
      { x: 1000, y: 470, w: 24, h: 24, type: "logic_bomb", vx: 0, vy: 0, hp: 1, maxHp: 1, alive: true, originX: 1000, originY: 470 },
      { x: 1350, y: 370, w: 24, h: 24, type: "fragment", vx: 2, vy: 0, hp: 1, maxHp: 1, alive: true, patrolRange: 80, originX: 1350, originY: 370 },
      { x: 1830, y: 320, w: 30, h: 30, type: "null_anchor", vx: 0, vy: 0, hp: 3, maxHp: 3, alive: true, originX: 1830, originY: 320, radius: 100 },
      { x: 2250, y: 220, w: 30, h: 30, type: "lag_beast", vx: 1, vy: 0, hp: 3, maxHp: 3, alive: true, patrolRange: 80, originX: 2250, originY: 220 },
      { x: 3000, y: 90, w: 24, h: 24, type: "mirror_bug", vx: 0, vy: 0, hp: 2, maxHp: 2, alive: true, originX: 3000, originY: 90 },
    ],
    packets: [
      { x: 620, y: 560, w: 16, h: 16, collected: false, type: "data" },
      { x: 1170, y: 420, w: 16, h: 16, collected: false, type: "overclock" },
      { x: 1650, y: 260, w: 16, h: 16, collected: false, type: "data" },
      { x: 2100, y: 260, w: 16, h: 16, collected: false, type: "health" },
      { x: 2600, y: 110, w: 16, h: 16, collected: false, type: "data" },
      { x: 3050, y: 80, w: 16, h: 16, collected: false, type: "data" },
    ],
    corruptionModifier: 1.5,
  },
]

// --- Helper Functions ---
function rectIntersect(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

// --- Create Initial States ---
export function createPlayer(level: LevelData, mode: GameMode = "story"): PlayerState {
  return {
    x: level.spawnX,
    y: level.spawnY,
    w: PLAYER_W,
    h: PLAYER_H,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    jumpsLeft: 2,
    maxJumps: 2,
    dashCooldown: 0,
    dashTimer: 0,
    isDashing: false,
    dashDir: 1,
    health: mode === "hardcore" ? 50 : 100,
    maxHealth: mode === "hardcore" ? 50 : 100,
    corruption: mode === "chaos" ? 30 : 0,
    glitchMeter: 50,
    maxGlitch: 100,
    overclocked: false,
    overclockHeat: 0,
    invincible: 0,
    dead: false,
    score: 0,
    afterimages: [],
    isDoubleJumping: false,
    hasMovedThisRun: false,
  }
}

export function createGameState(levelIndex: number, mode: GameMode = "story"): GameState {
  const level = LEVELS[levelIndex] || LEVELS[0]
  return {
    player: createPlayer(level, mode),
    camera: { x: 0, y: 0 },
    particles: [],
    screenShake: 0,
    glitchIntensity: 0,
    levelTime: 0,
    paused: false,
    gameOver: false,
    levelComplete: false,
    currentLevel: levelIndex,
    gameMode: mode,
    speedrunTimer: 0,
    speedrunStarted: false,
    secretComboActive: false,
    secretComboSequence: [],
    allLevelsComplete: false,
    hud: {
      showCorruptionWarning: false,
      fakeNotification: null,
      notificationTimer: 0,
      hudMelt: 0,
      modeTransitionText: null,
      modeTransitionTimer: 0,
      doubleJumpFlash: 0,
    },
  }
}

export function createInputState(): InputState {
  return {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    dash: false,
    overclock: false,
    attack: false,
    jumpPressed: false,
    dashPressed: false,
    overclockPressed: false,
    attackPressed: false,
  }
}

// --- Particle Spawners ---
function spawnParticles(
  particles: Particle[],
  x: number,
  y: number,
  count: number,
  color: string,
  speed: number = 3,
  size: number = 3
) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const spd = Math.random() * speed + 1
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color,
      size: Math.random() * size + 1,
    })
  }
}

function spawnDashTrail(particles: Particle[], player: PlayerState) {
  for (let i = 0; i < 3; i++) {
    particles.push({
      x: player.x + player.w / 2 + (Math.random() - 0.5) * 10,
      y: player.y + player.h / 2 + (Math.random() - 0.5) * 10,
      vx: -player.facing * 2 + (Math.random() - 0.5),
      vy: (Math.random() - 0.5) * 2,
      life: 15,
      maxLife: 15,
      color: player.overclocked ? "#ff0066" : "#00ffff",
      size: Math.random() * 4 + 2,
    })
  }
}

// --- Core Update Function ---
export function updateGame(
  state: GameState,
  input: InputState,
  levelData: LevelData,
  dt: number
): GameState {
  if (state.paused || state.gameOver || state.levelComplete) return state

  const s = { ...state }
  const p = { ...s.player }
  s.player = p
  s.levelTime += dt
  s.particles = [...s.particles]

  // Track if player has moved (for speedrun timer)
  if (!p.hasMovedThisRun && (input.left || input.right || input.jump || input.dash)) {
    p.hasMovedThisRun = true
    if (s.gameMode === "speedrun") {
      s.speedrunStarted = true
    }
  }

  // Speedrun timer
  if (s.gameMode === "speedrun" && s.speedrunStarted) {
    s.speedrunTimer += dt
  }

  // Mode transition timer decay
  s.hud = { ...s.hud }
  if (s.hud.modeTransitionTimer > 0) {
    s.hud.modeTransitionTimer--
    if (s.hud.modeTransitionTimer <= 0) {
      s.hud.modeTransitionText = null
    }
  }

  // Double jump flash decay
  if (s.hud.doubleJumpFlash > 0) {
    s.hud.doubleJumpFlash--
  }

  // Zen mode: no enemies
  if (s.gameMode === "zen") {
    for (const enemy of levelData.enemies) {
      enemy.alive = false
    }
  }

  // Chaos mode: corruption always builds
  if (s.gameMode === "chaos") {
    p.corruption = Math.min(100, p.corruption + 0.05)
  }

  // --- Corruption effects ---
  const corruptMod = levelData.corruptionModifier || 1
  if (p.corruption > 0) {
    p.corruption = Math.max(0, p.corruption - CORRUPTION_DECAY)
  }
  s.glitchIntensity = p.corruption / 100
  s.hud = { ...s.hud }
  s.hud.showCorruptionWarning = p.corruption > 70
  s.hud.hudMelt = p.corruption > 90 ? (p.corruption - 90) / 10 : 0

  // Fake notification at high corruption
  if (p.corruption > 80 && Math.random() < 0.001) {
    const notes = [
      "SYSTEM: Memory corruption detected",
      "WARNING: Unauthorized process running",
      "ERROR: Stack overflow imminent",
      "ALERT: Firewall breach in sector 7",
      "CRITICAL: Data integrity compromised",
    ]
    s.hud.fakeNotification = notes[Math.floor(Math.random() * notes.length)]
    s.hud.notificationTimer = 180
  }
  if (s.hud.notificationTimer > 0) {
    s.hud.notificationTimer--
    if (s.hud.notificationTimer <= 0) s.hud.fakeNotification = null
  }

  // --- Input handling (with corruption lag simulation) ---
  const inputLag = p.corruption > 75 ? Math.random() < 0.1 : false

  if (!inputLag) {
    // Horizontal movement
    if (input.left) {
      p.vx -= MOVE_SPEED * 0.3
      p.facing = -1
    }
    if (input.right) {
      p.vx += MOVE_SPEED * 0.3
      p.facing = 1
    }

    // Jump (with double jump)
    if (input.jumpPressed && p.jumpsLeft > 0) {
      const isDoubleJump = !p.onGround && p.jumpsLeft < p.maxJumps
      p.isDoubleJumping = isDoubleJump
      p.vy = isDoubleJump ? DOUBLE_JUMP_FORCE : JUMP_FORCE
      p.jumpsLeft--
      p.onGround = false

      if (isDoubleJump) {
        // Double jump: burst of particles in a ring pattern
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2
          s.particles.push({
            x: p.x + p.w / 2,
            y: p.y + p.h / 2,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            life: 20,
            maxLife: 20,
            color: p.overclocked ? "#ff66aa" : "#66ffff",
            size: 3,
          })
        }
        s.hud.doubleJumpFlash = 15
        s.screenShake = 2
      } else {
        spawnParticles(s.particles, p.x + p.w / 2, p.y + p.h, 6, "#00ffff", 2)
      }
      input.jumpPressed = false
    }

    // Dash
    if (input.dashPressed && p.dashCooldown <= 0 && !p.isDashing) {
      p.isDashing = true
      p.dashTimer = DASH_DURATION
      p.dashCooldown = DASH_COOLDOWN
      p.dashDir = p.facing
      p.vy = 0
      p.invincible = DASH_DURATION
      spawnParticles(s.particles, p.x + p.w / 2, p.y + p.h / 2, 10, "#00ffff", 4)
      s.screenShake = 4
      input.dashPressed = false
    }

    // Overclock toggle
    if (input.overclockPressed) {
      p.overclocked = !p.overclocked
      if (p.overclocked) {
        spawnParticles(s.particles, p.x + p.w / 2, p.y + p.h / 2, 15, "#ff0066", 5)
        s.screenShake = 6
      }
      input.overclockPressed = false
    }

    // Attack (kill -9)
    if (input.attackPressed && p.glitchMeter >= 25) {
      p.glitchMeter -= 25
      spawnParticles(s.particles, p.x + p.w / 2, p.y + p.h / 2, 20, "#ff0066", 8, 4)
      s.screenShake = 8
      // AOE damage
      const aoeRange = 120
      for (const enemy of levelData.enemies) {
        if (!enemy.alive) continue
        const ex = enemy.x + enemy.w / 2
        const ey = enemy.y + enemy.h / 2
        const px = p.x + p.w / 2
        const py = p.y + p.h / 2
        const dist = Math.sqrt((ex - px) ** 2 + (ey - py) ** 2)
        if (dist < aoeRange) {
          enemy.hp--
          if (enemy.hp <= 0) {
            enemy.alive = false
            p.score += 100
            p.glitchMeter = Math.min(p.maxGlitch, p.glitchMeter + 15)
            spawnParticles(s.particles, enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 12, "#ff0066", 5)
          }
        }
      }
      input.attackPressed = false
    }
  }

  // --- Physics ---
  // Dashing
  if (p.isDashing) {
    p.vx = DASH_SPEED * p.dashDir
    p.vy = 0
    p.dashTimer--
    spawnDashTrail(s.particles, p)
    if (p.dashTimer <= 0) {
      p.isDashing = false
      p.vx *= 0.3
    }
  } else {
    // Apply gravity
    p.vy += GRAVITY
    if (p.vy > MAX_FALL_SPEED) p.vy = MAX_FALL_SPEED

    // Friction
    if (p.onGround) {
      p.vx *= FRICTION
    } else {
      p.vx *= AIR_FRICTION
    }
  }

  // Clamp horizontal speed
  p.vx = clamp(p.vx, -MOVE_SPEED * 1.5, MOVE_SPEED * 1.5)
  if (p.isDashing) p.vx = clamp(p.vx, -DASH_SPEED, DASH_SPEED)

  // Dash cooldown
  if (p.dashCooldown > 0) p.dashCooldown--

  // Invincibility
  if (p.invincible > 0) p.invincible--

  // Overclock heat
  if (p.overclocked) {
    p.overclockHeat += OVERCLOCK_HEAT_RATE
    if (p.overclockHeat >= 100) {
      p.overclocked = false
      p.overclockHeat = 100
      p.corruption = Math.min(100, p.corruption + 15 * corruptMod)
      p.health -= 10
      s.screenShake = 10
      spawnParticles(s.particles, p.x + p.w / 2, p.y + p.h / 2, 20, "#ff3333", 6)
    }
    // Afterimages in overclock
    p.afterimages = [...p.afterimages, { x: p.x, y: p.y, alpha: 0.6, facing: p.facing }]
    if (p.afterimages.length > 8) p.afterimages = p.afterimages.slice(-8)
  } else {
    p.overclockHeat = Math.max(0, p.overclockHeat - OVERCLOCK_COOL_RATE * 2)
    p.afterimages = p.afterimages
      .map((a) => ({ ...a, alpha: a.alpha - 0.08 }))
      .filter((a) => a.alpha > 0)
  }

  // --- Platform updates ---
  const platforms = levelData.platforms
  for (const plat of platforms) {
    if (plat.type === "moving" && plat.originX !== undefined) {
      plat.x = plat.originX + Math.sin(s.levelTime * 0.02 * (plat.moveSpeed || 1)) * (plat.moveRange || 50) * (plat.moveDir || 1)
    }
    if (plat.type === "phase") {
      plat.visible = Math.sin(s.levelTime * 0.03) > -0.3
      if (p.overclocked) plat.visible = true
    }
    if (plat.type === "falling" && plat.fallTimer !== undefined && plat.fallTimer > 0) {
      plat.fallTimer--
      if (plat.fallTimer <= 0) {
        plat.visible = false
      }
    }
  }

  // --- Collision detection ---
  // Horizontal
  p.x += p.vx
  p.onGround = false

  for (const plat of platforms) {
    if (!plat.visible) continue
    if (plat.type === "phase" && p.overclocked) continue // Liquid state: pass through in overclock
    if (rectIntersect(p.x, p.y, p.w, p.h, plat.x, plat.y, plat.w, plat.h)) {
      if (p.vx > 0) {
        p.x = plat.x - p.w
      } else if (p.vx < 0) {
        p.x = plat.x + plat.w
      }
      // Wall slide
      if (!p.onGround && p.vy > 0) {
        p.vy = Math.min(p.vy, WALL_SLIDE_SPEED)
        p.jumpsLeft = Math.max(p.jumpsLeft, 1)
      }
      p.vx = 0
    }
  }

  // Vertical
  p.y += p.vy

  for (const plat of platforms) {
    if (!plat.visible) continue
    if (plat.type === "phase" && p.overclocked) continue
    if (rectIntersect(p.x, p.y, p.w, p.h, plat.x, plat.y, plat.w, plat.h)) {
      if (p.vy > 0) {
        p.y = plat.y - p.h
        p.vy = 0
        p.onGround = true
        p.jumpsLeft = p.maxJumps
        p.isDoubleJumping = false

        // Falling platforms
        if (plat.type === "falling" && plat.fallTimer === 0) {
          plat.fallTimer = 40
        }
        // Corrupt platforms damage
        if (plat.type === "corrupt" && p.invincible <= 0) {
          p.corruption = Math.min(100, p.corruption + 0.3 * corruptMod)
        }
      } else if (p.vy < 0) {
        p.y = plat.y + plat.h
        p.vy = 0
      }
    }
  }

  // --- Enemy updates ---
  for (const enemy of levelData.enemies) {
    if (!enemy.alive) continue

    switch (enemy.type) {
      case "watchdog":
      case "fragment": {
        // Patrol movement
        enemy.x += enemy.vx
        if (enemy.originX !== undefined && enemy.patrolRange) {
          if (enemy.x > enemy.originX + enemy.patrolRange || enemy.x < enemy.originX - enemy.patrolRange) {
            enemy.vx *= -1
          }
        }
        break
      }
      case "logic_bomb": {
        // Stationary, pulses
        enemy.pulseTimer = (enemy.pulseTimer || 0) + 1
        break
      }
      case "memory_leak": {
        // Grows over time
        if (enemy.radius !== undefined && enemy.growthRate) {
          enemy.radius += enemy.growthRate * 0.1
          enemy.w = enemy.radius * 2
          enemy.h = enemy.radius * 2
        }
        break
      }
      case "mirror_bug": {
        // Copies player movement with delay
        const dx = p.x - enemy.x
        const dy = p.y - enemy.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 300) {
          enemy.vx = dx * 0.01
          enemy.vy = dy * 0.01
          enemy.x += enemy.vx
          enemy.y += enemy.vy
        }
        break
      }
      case "null_anchor": {
        // Pulls player toward it
        const pullRange = enemy.radius || 100
        const dxN = enemy.x - p.x
        const dyN = enemy.y - p.y
        const distN = Math.sqrt(dxN * dxN + dyN * dyN)
        if (distN < pullRange && distN > 0) {
          const force = (pullRange - distN) / pullRange * 0.5
          p.vx += (dxN / distN) * force
          p.vy += (dyN / distN) * force
        }
        enemy.pulseTimer = (enemy.pulseTimer || 0) + 1
        break
      }
      case "lag_beast": {
        // Patrol and slow time effect
        enemy.x += enemy.vx
        if (enemy.originX !== undefined && enemy.patrolRange) {
          if (enemy.x > enemy.originX + enemy.patrolRange || enemy.x < enemy.originX - enemy.patrolRange) {
            enemy.vx *= -1
          }
        }
        break
      }
    }

    // Collision with player
    if (p.invincible <= 0 && rectIntersect(p.x, p.y, p.w, p.h, enemy.x, enemy.y, enemy.w, enemy.h)) {
      // Watchdog invisible to overclock
      if (enemy.type === "watchdog" && p.overclocked) continue

      // Stomp from above
      if (p.vy > 0 && p.y + p.h - enemy.y < 15) {
        enemy.hp--
        if (enemy.hp <= 0) {
          enemy.alive = false
          p.score += (enemy.type === "fragment" ? 50 : 100)
          p.glitchMeter = Math.min(p.maxGlitch, p.glitchMeter + 10)
          spawnParticles(s.particles, enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 10, "#00ff88", 4)
        }
        p.vy = JUMP_FORCE * 0.7
        s.screenShake = 3
      } else {
        // Take damage
        p.health -= 15
        p.corruption = Math.min(100, p.corruption + 10 * corruptMod)
        p.invincible = 45
        s.screenShake = 6
        spawnParticles(s.particles, p.x + p.w / 2, p.y + p.h / 2, 8, "#ff3333", 4)
        // Knockback
        p.vx = (p.x < enemy.x ? -1 : 1) * 8
        p.vy = -6
      }
    }

    // Dash through enemies (defragment)
    if (p.isDashing && enemy.alive && rectIntersect(p.x, p.y, p.w, p.h, enemy.x, enemy.y, enemy.w, enemy.h)) {
      enemy.hp -= 2
      if (enemy.hp <= 0) {
        enemy.alive = false
        p.score += 150
      }
      p.glitchMeter = Math.min(p.maxGlitch, p.glitchMeter + 20)
      spawnParticles(s.particles, enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 15, "#00ffff", 5)
      s.screenShake = 4
    }
  }

  // --- Collect data packets ---
  for (const pkt of levelData.packets) {
    if (pkt.collected) continue
    if (rectIntersect(p.x, p.y, p.w, p.h, pkt.x, pkt.y, pkt.w, pkt.h)) {
      pkt.collected = true
      spawnParticles(s.particles, pkt.x + pkt.w / 2, pkt.y + pkt.h / 2, 8, pkt.type === "health" ? "#00ff88" : pkt.type === "overclock" ? "#ff0066" : "#ffff00", 3)
      switch (pkt.type) {
        case "data":
          p.score += 200
          break
        case "health":
          p.health = Math.min(p.maxHealth, p.health + 25)
          break
        case "overclock":
          p.glitchMeter = Math.min(p.maxGlitch, p.glitchMeter + 30)
          break
      }
    }
  }

  // --- Level exit ---
  if (rectIntersect(p.x, p.y, p.w, p.h, levelData.exitX - 15, levelData.exitY - 15, 30, 30)) {
    s.levelComplete = true
    s.screenShake = 10
    spawnParticles(s.particles, levelData.exitX, levelData.exitY, 30, "#00ffff", 8, 5)
  }

  // --- Death ---
  if (p.health <= 0 || p.y > levelData.height + 100 || p.corruption >= 100) {
    p.dead = true
    s.gameOver = true
    s.screenShake = 15
    spawnParticles(s.particles, p.x + p.w / 2, p.y + p.h / 2, 30, "#ff3333", 8, 5)
  }

  // --- Particles ---
  s.particles = s.particles
    .map((part) => ({
      ...part,
      x: part.x + part.vx,
      y: part.y + part.vy,
      vy: part.vy + 0.05,
      life: part.life - 1,
    }))
    .filter((part) => part.life > 0)

  // --- Camera ---
  const targetCX = p.x - 400
  const targetCY = p.y - 250
  s.camera = {
    x: s.camera.x + (targetCX - s.camera.x) * 0.1,
    y: s.camera.y + (targetCY - s.camera.y) * 0.1,
  }
  s.camera.x = clamp(s.camera.x, 0, Math.max(0, levelData.width - 800))
  s.camera.y = clamp(s.camera.y, 0, Math.max(0, levelData.height - 500))

  // Screen shake decay
  if (s.screenShake > 0) s.screenShake *= 0.85

  // Bounds
  p.x = clamp(p.x, 0, levelData.width - p.w)

  return s
}

// --- Render ---
export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  levelData: LevelData,
  canvasW: number,
  canvasH: number
) {
  const { player: p, camera, particles, screenShake, glitchIntensity } = state

  ctx.save()

  // Screen shake
  if (screenShake > 0.5) {
    ctx.translate(
      (Math.random() - 0.5) * screenShake * 2,
      (Math.random() - 0.5) * screenShake * 2
    )
  }

  // Clear
  ctx.fillStyle = "#050810"
  ctx.fillRect(0, 0, canvasW, canvasH)

  // Background grid
  ctx.strokeStyle = `rgba(0, 255, 255, ${0.03 + glitchIntensity * 0.05})`
  ctx.lineWidth = 1
  const gridSize = 40
  const offX = -camera.x % gridSize
  const offY = -camera.y % gridSize
  for (let x = offX; x < canvasW; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvasH)
    ctx.stroke()
  }
  for (let y = offY; y < canvasH; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvasW, y)
    ctx.stroke()
  }

  // Glitch distortion at high corruption
  if (glitchIntensity > 0.5 && Math.random() < glitchIntensity * 0.3) {
    const sliceY = Math.random() * canvasH
    const sliceH = Math.random() * 20 + 5
    const shiftX = (Math.random() - 0.5) * 30 * glitchIntensity
    try {
      const imgData = ctx.getImageData(0, sliceY, canvasW, sliceH)
      ctx.putImageData(imgData, shiftX, sliceY)
    } catch {
      // ignore
    }
  }

  ctx.save()
  ctx.translate(-camera.x, -camera.y)

  // --- Platforms ---
  for (const plat of levelData.platforms) {
    if (!plat.visible) continue
    const px = plat.x
    const py = plat.y

    switch (plat.type) {
      case "solid":
        ctx.fillStyle = "#0a1628"
        ctx.fillRect(px, py, plat.w, plat.h)
        ctx.strokeStyle = "rgba(0, 255, 255, 0.4)"
        ctx.lineWidth = 1
        ctx.strokeRect(px, py, plat.w, plat.h)
        // Top highlight
        ctx.fillStyle = "rgba(0, 255, 255, 0.2)"
        ctx.fillRect(px, py, plat.w, 2)
        break
      case "phase":
        ctx.globalAlpha = 0.4 + Math.sin(state.levelTime * 0.05) * 0.2
        ctx.fillStyle = "#0a1628"
        ctx.fillRect(px, py, plat.w, plat.h)
        ctx.strokeStyle = "rgba(0, 255, 255, 0.3)"
        ctx.setLineDash([4, 4])
        ctx.strokeRect(px, py, plat.w, plat.h)
        ctx.setLineDash([])
        ctx.globalAlpha = 1
        break
      case "falling":
        ctx.fillStyle = "#1a0a0a"
        ctx.fillRect(px, py, plat.w, plat.h)
        ctx.strokeStyle = "rgba(255, 100, 50, 0.5)"
        ctx.lineWidth = 1
        ctx.strokeRect(px, py, plat.w, plat.h)
        if (plat.fallTimer && plat.fallTimer > 0) {
          ctx.globalAlpha = plat.fallTimer / 40
          ctx.fillStyle = "rgba(255, 100, 50, 0.3)"
          ctx.fillRect(px, py, plat.w, plat.h)
          ctx.globalAlpha = 1
        }
        break
      case "moving":
        ctx.fillStyle = "#0a1628"
        ctx.fillRect(px, py, plat.w, plat.h)
        ctx.strokeStyle = "rgba(100, 200, 255, 0.5)"
        ctx.lineWidth = 1
        ctx.strokeRect(px, py, plat.w, plat.h)
        ctx.fillStyle = "rgba(100, 200, 255, 0.2)"
        ctx.fillRect(px, py, plat.w, 2)
        break
      case "corrupt":
        ctx.fillStyle = "rgba(60, 0, 30, 0.8)"
        ctx.fillRect(px, py, plat.w, plat.h)
        ctx.strokeStyle = "rgba(255, 0, 102, 0.6)"
        ctx.lineWidth = 1
        ctx.strokeRect(px, py, plat.w, plat.h)
        // Corruption pulse
        ctx.globalAlpha = 0.2 + Math.sin(state.levelTime * 0.08) * 0.1
        ctx.fillStyle = "#ff0066"
        ctx.fillRect(px, py, plat.w, 2)
        ctx.globalAlpha = 1
        break
    }
  }

  // --- Data Packets ---
  for (const pkt of levelData.packets) {
    if (pkt.collected) continue
    const px = pkt.x + pkt.w / 2
    const py = pkt.y + pkt.h / 2 + Math.sin(state.levelTime * 0.06) * 4
    const colors = { data: "#ffff00", health: "#00ff88", overclock: "#ff0066" }
    const col = colors[pkt.type]

    ctx.beginPath()
    ctx.arc(px, py, 8, 0, Math.PI * 2)
    ctx.fillStyle = col
    ctx.globalAlpha = 0.3
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.strokeStyle = col
    ctx.lineWidth = 2
    ctx.stroke()

    // Inner diamond
    ctx.beginPath()
    ctx.moveTo(px, py - 4)
    ctx.lineTo(px + 4, py)
    ctx.lineTo(px, py + 4)
    ctx.lineTo(px - 4, py)
    ctx.closePath()
    ctx.fillStyle = col
    ctx.fill()
  }

  // --- Level Exit ---
  const exitPulse = Math.sin(state.levelTime * 0.05) * 0.3 + 0.7
  ctx.beginPath()
  ctx.arc(levelData.exitX, levelData.exitY, 18, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(0, 255, 255, ${exitPulse * 0.2})`
  ctx.fill()
  ctx.strokeStyle = `rgba(0, 255, 255, ${exitPulse})`
  ctx.lineWidth = 2
  ctx.stroke()
  // Inner triangle
  ctx.beginPath()
  ctx.moveTo(levelData.exitX, levelData.exitY - 8)
  ctx.lineTo(levelData.exitX + 7, levelData.exitY + 5)
  ctx.lineTo(levelData.exitX - 7, levelData.exitY + 5)
  ctx.closePath()
  ctx.fillStyle = `rgba(0, 255, 255, ${exitPulse})`
  ctx.fill()

  // --- Enemies ---
  for (const enemy of levelData.enemies) {
    if (!enemy.alive) continue
    const ex = enemy.x
    const ey = enemy.y

    switch (enemy.type) {
      case "watchdog":
        ctx.fillStyle = "#00ccff"
        ctx.fillRect(ex, ey, enemy.w, enemy.h)
        ctx.strokeStyle = "#00ffff"
        ctx.lineWidth = 1
        ctx.strokeRect(ex, ey, enemy.w, enemy.h)
        // Searchlight
        ctx.beginPath()
        ctx.moveTo(ex + enemy.w / 2, ey + enemy.h / 2)
        const lightDir = enemy.vx > 0 ? 1 : -1
        ctx.lineTo(ex + enemy.w / 2 + lightDir * 60, ey + 40)
        ctx.lineTo(ex + enemy.w / 2 + lightDir * 30, ey + 40)
        ctx.closePath()
        ctx.fillStyle = "rgba(0, 200, 255, 0.1)"
        ctx.fill()
        break
      case "logic_bomb":
        const pulse = Math.sin((enemy.pulseTimer || 0) * 0.1) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(ex + enemy.w / 2, ey + enemy.h / 2, enemy.w / 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 100, 50, ${pulse})`
        ctx.fill()
        ctx.strokeStyle = "#ff6633"
        ctx.lineWidth = 2
        ctx.stroke()
        break
      case "memory_leak":
        const r = enemy.radius || 15
        ctx.beginPath()
        ctx.arc(ex + enemy.w / 2, ey + enemy.h / 2, r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(150, 0, 200, 0.4)"
        ctx.fill()
        ctx.strokeStyle = "rgba(200, 100, 255, 0.7)"
        ctx.lineWidth = 2
        ctx.stroke()
        break
      case "fragment":
        ctx.save()
        ctx.translate(ex + enemy.w / 2, ey + enemy.h / 2)
        ctx.rotate(state.levelTime * 0.05)
        ctx.fillStyle = "#ff6600"
        ctx.fillRect(-enemy.w / 2, -enemy.h / 2, enemy.w, enemy.h)
        ctx.restore()
        break
      case "mirror_bug":
        ctx.fillStyle = "rgba(0, 255, 255, 0.5)"
        ctx.fillRect(ex, ey, enemy.w, enemy.h)
        ctx.strokeStyle = "#00ffff"
        ctx.setLineDash([3, 3])
        ctx.strokeRect(ex, ey, enemy.w, enemy.h)
        ctx.setLineDash([])
        break
      case "null_anchor":
        const pullR = enemy.radius || 100
        ctx.beginPath()
        ctx.arc(ex + enemy.w / 2, ey + enemy.h / 2, pullR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 0, 255, ${0.1 + Math.sin((enemy.pulseTimer || 0) * 0.03) * 0.05})`
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(ex + enemy.w / 2, ey + enemy.h / 2, enemy.w / 2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 0, 255, 0.6)"
        ctx.fill()
        break
      case "lag_beast":
        ctx.fillStyle = "rgba(100, 200, 255, 0.6)"
        ctx.fillRect(ex, ey, enemy.w, enemy.h)
        // Time distortion ring
        ctx.beginPath()
        ctx.arc(ex + enemy.w / 2, ey + enemy.h / 2, 40, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(100, 200, 255, 0.15)"
        ctx.lineWidth = 2
        ctx.stroke()
        break
    }

    // HP bar
    if (enemy.maxHp > 1) {
      const barW = enemy.w
      const barH = 3
      const barX = ex
      const barY = ey - 6
      ctx.fillStyle = "rgba(255,0,0,0.5)"
      ctx.fillRect(barX, barY, barW, barH)
      ctx.fillStyle = "#00ff88"
      ctx.fillRect(barX, barY, barW * (enemy.hp / enemy.maxHp), barH)
    }
  }

  // --- Player afterimages ---
  for (const ai of p.afterimages) {
    ctx.globalAlpha = ai.alpha * 0.5
    ctx.fillStyle = p.overclocked ? "#ff0066" : "#00ffff"
    ctx.fillRect(ai.x, ai.y, p.w, p.h)
    ctx.globalAlpha = 1
  }

  // --- Player ---
  if (!p.dead) {
    // Flash during invincibility
    if (p.invincible > 0 && Math.floor(p.invincible / 3) % 2 === 0) {
      ctx.globalAlpha = 0.4
    }

    // Body
    const bodyColor = p.overclocked
      ? "#ff0066"
      : p.isDashing
        ? "#00ffff"
        : p.isDoubleJumping
          ? "#66ffff"
          : "#00ddcc"
    ctx.fillStyle = bodyColor
    ctx.fillRect(p.x, p.y, p.w, p.h)

    // Double jump spin effect
    if (p.isDoubleJumping && !p.onGround) {
      ctx.save()
      ctx.globalAlpha = 0.3
      ctx.fillStyle = "#66ffff"
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2)
      ctx.rotate(state.levelTime * 0.15)
      ctx.fillRect(-p.w / 2 - 2, -p.h / 2 - 2, p.w + 4, p.h + 4)
      ctx.restore()
    }

    // Border
    ctx.strokeStyle = p.overclocked ? "#ff3399" : p.isDoubleJumping ? "#aaffff" : "#00ffff"
    ctx.lineWidth = p.isDoubleJumping ? 2 : 1.5
    ctx.strokeRect(p.x, p.y, p.w, p.h)

    // Eye
    const eyeX = p.facing > 0 ? p.x + p.w - 6 : p.x + 3
    const eyeY = p.y + 7
    ctx.fillStyle = p.overclocked ? "#ffffff" : "#00ffff"
    ctx.fillRect(eyeX, eyeY, 4, 4)

    // Glow
    ctx.shadowColor = p.overclocked ? "#ff0066" : p.isDoubleJumping ? "#66ffff" : "#00ffff"
    ctx.shadowBlur = p.isDoubleJumping ? 15 : 10
    ctx.fillStyle = "transparent"
    ctx.fillRect(p.x, p.y, p.w, p.h)
    ctx.shadowBlur = 0

    ctx.globalAlpha = 1
  }

  // --- Particles ---
  for (const part of particles) {
    ctx.globalAlpha = part.life / part.maxLife
    ctx.fillStyle = part.color
    ctx.fillRect(part.x - part.size / 2, part.y - part.size / 2, part.size, part.size)
  }
  ctx.globalAlpha = 1

  ctx.restore()

  // --- HUD ---
  renderHUD(ctx, state, canvasW, canvasH)

  ctx.restore()
}

function renderHUD(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  canvasW: number,
  canvasH: number
) {
  const { player: p, hud, levelTime } = state
  const level = LEVELS[state.currentLevel]

  // HUD melt effect
  ctx.save()
  if (hud.hudMelt > 0) {
    ctx.transform(1, 0, Math.sin(levelTime * 0.1) * hud.hudMelt * 0.02, 1, 0, hud.hudMelt * 5)
  }

  const hudY = 16

  // Health bar
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
  ctx.fillRect(16, hudY, 150, 14)
  const healthPct = p.health / p.maxHealth
  ctx.fillStyle = healthPct > 0.5 ? "#00ff88" : healthPct > 0.25 ? "#ffaa00" : "#ff3333"
  ctx.fillRect(16, hudY, 150 * healthPct, 14)
  ctx.strokeStyle = "rgba(0, 255, 255, 0.3)"
  ctx.lineWidth = 1
  ctx.strokeRect(16, hudY, 150, 14)
  ctx.fillStyle = "#ffffff"
  ctx.font = "10px monospace"
  ctx.fillText(`HP ${Math.ceil(p.health)}`, 20, hudY + 11)

  // Corruption bar
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
  ctx.fillRect(16, hudY + 20, 150, 10)
  ctx.fillStyle = p.corruption > 70 ? "#ff0066" : p.corruption > 40 ? "#ff6600" : "#8800cc"
  ctx.fillRect(16, hudY + 20, 150 * (p.corruption / 100), 10)
  ctx.strokeStyle = "rgba(255, 0, 102, 0.3)"
  ctx.strokeRect(16, hudY + 20, 150, 10)
  ctx.fillStyle = "#ffffff"
  ctx.font = "8px monospace"
  ctx.fillText(`CORRUPTION ${Math.ceil(p.corruption)}%`, 20, hudY + 28)

  // Glitch Meter
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
  ctx.fillRect(16, hudY + 36, 150, 10)
  ctx.fillStyle = "#00ffff"
  ctx.fillRect(16, hudY + 36, 150 * (p.glitchMeter / p.maxGlitch), 10)
  ctx.strokeStyle = "rgba(0, 255, 255, 0.3)"
  ctx.strokeRect(16, hudY + 36, 150, 10)
  ctx.fillStyle = "#ffffff"
  ctx.fillText(`GLITCH ${Math.ceil(p.glitchMeter)}%`, 20, hudY + 44)

  // Overclock heat
  if (p.overclocked || p.overclockHeat > 0) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
    ctx.fillRect(16, hudY + 52, 150, 10)
    ctx.fillStyle = p.overclockHeat > 70 ? "#ff3333" : "#ff6600"
    ctx.fillRect(16, hudY + 52, 150 * (p.overclockHeat / 100), 10)
    ctx.strokeStyle = "rgba(255, 100, 0, 0.3)"
    ctx.strokeRect(16, hudY + 52, 150, 10)
    ctx.fillStyle = "#ffffff"
    ctx.fillText(`HEAT ${Math.ceil(p.overclockHeat)}%`, 20, hudY + 60)
  }

  // Score
  ctx.fillStyle = "#00ffff"
  ctx.font = "bold 14px monospace"
  ctx.textAlign = "right"
  ctx.fillText(`SCORE: ${p.score}`, canvasW - 16, hudY + 14)

  // Level name
  ctx.fillStyle = "rgba(0, 255, 255, 0.5)"
  ctx.font = "10px monospace"
  ctx.fillText(level?.name || "UNKNOWN", canvasW - 16, hudY + 28)

  // Time
  const mins = Math.floor(levelTime / 60 / 60)
  const secs = Math.floor((levelTime / 60) % 60)
  ctx.fillText(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`, canvasW - 16, hudY + 42)
  ctx.textAlign = "left"

  // Overclock indicator
  if (p.overclocked) {
    ctx.fillStyle = "#ff0066"
    ctx.font = "bold 12px monospace"
    const flash = Math.sin(levelTime * 0.1) > 0
    if (flash) {
      ctx.fillText("[ OVERCLOCKED ]", canvasW / 2 - 60, hudY + 14)
    }
  }

  // Jump status (double jump indicator)
  const jumpY = hudY + 78
  ctx.font = "10px monospace"
  if (p.jumpsLeft === 2) {
    ctx.fillStyle = "#00ffff"
    ctx.fillText("JUMP: ** READY", 16, jumpY)
  } else if (p.jumpsLeft === 1) {
    ctx.fillStyle = "#66ffff"
    ctx.fillText("JUMP: *- DBL READY", 16, jumpY)
  } else {
    ctx.fillStyle = "rgba(0, 255, 255, 0.3)"
    ctx.fillText("JUMP: -- AIRBORNE", 16, jumpY)
  }

  // Dash cooldown
  if (p.dashCooldown > 0) {
    ctx.fillStyle = "rgba(0, 255, 255, 0.3)"
    ctx.font = "10px monospace"
    ctx.fillText(`DASH: ${Math.ceil(p.dashCooldown / 60 * 100) / 100}s`, 16, jumpY + 14)
  } else {
    ctx.fillStyle = "#00ffff"
    ctx.font = "10px monospace"
    ctx.fillText("DASH: READY", 16, jumpY + 14)
  }

  // Game Mode indicator
  const modeLabels: Record<string, string> = {
    story: "STORY",
    speedrun: "SPEEDRUN",
    endless: "ENDLESS",
    chaos: "CHAOS",
    hardcore: "HARDCORE",
    zen: "ZEN",
  }
  ctx.fillStyle = state.gameMode === "speedrun" ? "#ffaa00" : state.gameMode === "chaos" ? "#ff0066" : "rgba(0, 255, 255, 0.4)"
  ctx.font = "8px monospace"
  ctx.textAlign = "right"
  ctx.fillText(`MODE: ${modeLabels[state.gameMode] || "UNKNOWN"}`, canvasW - 16, hudY + 56)
  ctx.textAlign = "left"

  // Speedrun timer (prominent display)
  if (state.gameMode === "speedrun") {
    const totalFrames = state.speedrunTimer
    const totalSecs = totalFrames / 60
    const spdMins = Math.floor(totalSecs / 60)
    const spdSecs = Math.floor(totalSecs % 60)
    const spdMs = Math.floor((totalSecs * 1000) % 1000)
    const timerStr = `${String(spdMins).padStart(2, "0")}:${String(spdSecs).padStart(2, "0")}.${String(spdMs).padStart(3, "0")}`

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(canvasW / 2 - 80, 4, 160, 26)
    ctx.strokeStyle = "rgba(255, 170, 0, 0.6)"
    ctx.lineWidth = 1
    ctx.strokeRect(canvasW / 2 - 80, 4, 160, 26)
    ctx.fillStyle = state.speedrunStarted ? "#ffaa00" : "rgba(255, 170, 0, 0.5)"
    ctx.font = "bold 16px monospace"
    ctx.textAlign = "center"
    ctx.fillText(timerStr, canvasW / 2, 23)
    if (!state.speedrunStarted) {
      ctx.fillStyle = "rgba(255, 170, 0, 0.4)"
      ctx.font = "8px monospace"
      ctx.fillText("MOVE TO START", canvasW / 2, 38)
    }
    ctx.textAlign = "left"
  }

  // Double jump flash effect
  if (hud.doubleJumpFlash > 0) {
    const flashAlpha = hud.doubleJumpFlash / 15
    ctx.fillStyle = `rgba(100, 255, 255, ${flashAlpha * 0.15})`
    ctx.fillRect(0, 0, canvasW, canvasH)
    ctx.fillStyle = `rgba(100, 255, 255, ${flashAlpha})`
    ctx.font = "bold 10px monospace"
    ctx.textAlign = "center"
    ctx.fillText("DOUBLE JUMP!", canvasW / 2, canvasH / 2 - 60)
    ctx.textAlign = "left"
  }

  // Corruption warning
  if (hud.showCorruptionWarning) {
    const flash = Math.sin(levelTime * 0.15) > 0
    if (flash) {
      ctx.fillStyle = "#ff0066"
      ctx.font = "bold 14px monospace"
      ctx.textAlign = "center"
      ctx.fillText("! CRITICAL CORRUPTION !", canvasW / 2, canvasH - 40)
      ctx.textAlign = "left"
    }
  }

  // Fake notification
  if (hud.fakeNotification) {
    const nAlpha = Math.min(1, hud.notificationTimer / 30)
    ctx.globalAlpha = nAlpha
    ctx.fillStyle = "rgba(10, 10, 20, 0.9)"
    const nw = 300
    ctx.fillRect(canvasW - nw - 16, canvasH - 60, nw, 40)
    ctx.strokeStyle = "rgba(255, 0, 102, 0.5)"
    ctx.strokeRect(canvasW - nw - 16, canvasH - 60, nw, 40)
    ctx.fillStyle = "#ff0066"
    ctx.font = "10px monospace"
    ctx.fillText(hud.fakeNotification, canvasW - nw - 8, canvasH - 36)
    ctx.globalAlpha = 1
  }

  // Mode transition overlay
  if (hud.modeTransitionText && hud.modeTransitionTimer > 0) {
    const tAlpha = Math.min(1, hud.modeTransitionTimer / 60)
    ctx.fillStyle = `rgba(0, 0, 0, ${tAlpha * 0.8})`
    ctx.fillRect(0, 0, canvasW, canvasH)
    // Glitch lines during transition
    for (let i = 0; i < 5; i++) {
      const ly = Math.random() * canvasH
      ctx.fillStyle = `rgba(0, 255, 255, ${tAlpha * 0.2})`
      ctx.fillRect(0, ly, canvasW, 2)
    }
    ctx.fillStyle = `rgba(0, 255, 255, ${tAlpha})`
    ctx.font = "bold 28px monospace"
    ctx.textAlign = "center"
    ctx.fillText(hud.modeTransitionText, canvasW / 2, canvasH / 2 - 10)
    ctx.fillStyle = `rgba(255, 0, 102, ${tAlpha * 0.7})`
    ctx.font = "12px monospace"
    ctx.fillText("INITIALIZING...", canvasW / 2, canvasH / 2 + 20)
    ctx.textAlign = "left"
  }

  // Game over overlay
  if (state.gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(0, 0, canvasW, canvasH)
    ctx.fillStyle = "#ff0066"
    ctx.font = "bold 36px monospace"
    ctx.textAlign = "center"
    ctx.fillText("SYSTEM CRASH", canvasW / 2, canvasH / 2 - 30)
    ctx.fillStyle = "#ffffff"
    ctx.font = "14px monospace"
    ctx.fillText(`Score: ${p.score}`, canvasW / 2, canvasH / 2 + 10)
    if (state.gameMode === "speedrun") {
      const totalSecs = state.speedrunTimer / 60
      const spdMins = Math.floor(totalSecs / 60)
      const spdSecs = Math.floor(totalSecs % 60)
      const spdMs = Math.floor((totalSecs * 1000) % 1000)
      ctx.fillStyle = "#ffaa00"
      ctx.font = "12px monospace"
      ctx.fillText(`Time: ${String(spdMins).padStart(2, "0")}:${String(spdSecs).padStart(2, "0")}.${String(spdMs).padStart(3, "0")}`, canvasW / 2, canvasH / 2 + 30)
    }
    ctx.fillStyle = "rgba(0, 255, 255, 0.7)"
    ctx.font = "12px monospace"
    ctx.fillText("Press [R] to reboot", canvasW / 2, canvasH / 2 + 55)
    ctx.textAlign = "left"
  }

  // Level complete overlay
  if (state.levelComplete) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(0, 0, canvasW, canvasH)
    ctx.fillStyle = "#00ffff"
    ctx.font = "bold 30px monospace"
    ctx.textAlign = "center"
    ctx.fillText("SECTOR CLEARED", canvasW / 2, canvasH / 2 - 30)
    ctx.fillStyle = "#ffffff"
    ctx.font = "14px monospace"
    ctx.fillText(`Score: ${p.score}`, canvasW / 2, canvasH / 2 + 10)
    if (state.gameMode === "speedrun") {
      const totalSecs = state.speedrunTimer / 60
      const spdMins = Math.floor(totalSecs / 60)
      const spdSecs = Math.floor(totalSecs % 60)
      const spdMs = Math.floor((totalSecs * 1000) % 1000)
      ctx.fillStyle = "#ffaa00"
      ctx.font = "12px monospace"
      ctx.fillText(`Time: ${String(spdMins).padStart(2, "0")}:${String(spdSecs).padStart(2, "0")}.${String(spdMs).padStart(3, "0")}`, canvasW / 2, canvasH / 2 + 30)
    }
    ctx.fillStyle = "rgba(0, 255, 255, 0.7)"
    ctx.font = "12px monospace"
    const hasNext = state.currentLevel < LEVELS.length - 1
    ctx.fillText(
      hasNext ? "Press [ENTER] for next sector" : "ALL SECTORS CLEARED! Press [ENTER] to finish",
      canvasW / 2,
      canvasH / 2 + 55
    )
    ctx.textAlign = "left"
  }

  ctx.restore()
}

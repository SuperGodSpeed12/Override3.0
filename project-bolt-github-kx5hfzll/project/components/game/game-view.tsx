"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import {
  createGameState,
  createInputState,
  updateGame,
  renderGame,
  LEVELS,
  OWNER_NAMES,
  type InputState,
  type GameState,
  type GameMode,
  type LevelData,
} from "./game-engine"

function deepCloneLevel(level: LevelData): LevelData {
  return {
    ...level,
    platforms: level.platforms.map((p) => ({ ...p })),
    enemies: level.enemies.map((e) => ({ ...e })),
    packets: level.packets.map((pk) => ({ ...pk })),
  }
}

const MODE_INFO: Record<GameMode, { label: string; desc: string; transitionText: string }> = {
  story: {
    label: "STORY MODE",
    desc: "Navigate through the corrupted sectors. Reach the Root Directory.",
    transitionText: "// STORY_MODE :: INITIALIZING",
  },
  speedrun: {
    label: "SPEEDRUN MODE",
    desc: "Race against the clock. Timer starts on first movement.",
    transitionText: "// SPEEDRUN_MODE :: CLOCK_READY",
  },
  endless: {
    label: "ENDLESS MODE",
    desc: "Survive as long as possible. Corruption rises endlessly.",
    transitionText: "// ENDLESS_MODE :: NO_EXIT",
  },
  chaos: {
    label: "CHAOS MODE",
    desc: "All glitch effects active. Corruption builds constantly.",
    transitionText: "// CHAOS_MODE :: ALL_SYSTEMS_FAILING",
  },
  hardcore: {
    label: "HARDCORE MODE",
    desc: "Half health. One life. No second chances.",
    transitionText: "// HARDCORE_MODE :: PERMADEATH_ENABLED",
  },
  zen: {
    label: "ZEN MODE",
    desc: "No enemies. Just explore the glitched world.",
    transitionText: "// ZEN_MODE :: THREATS_DISABLED",
  },
}

// Secret combo sequence: Jump, Jump, W, A, S, D, I
const SECRET_COMBO = ["jump", "jump", "w", "a", "s", "d", "i"]

type GameScreen = "name-entry" | "mode-select" | "transition" | "playing" | "secret-win" | "all-clear"

export function GameView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameStateRef = useRef<GameState | null>(null)
  const inputRef = useRef<InputState>(createInputState())
  const levelDataRef = useRef<LevelData>(deepCloneLevel(LEVELS[0]))
  const animFrameRef = useRef<number>(0)
  const [showControls, setShowControls] = useState(true)

  // UI state
  const [screen, setScreen] = useState<GameScreen>("name-entry")
  const [playerName, setPlayerName] = useState("")
  const [isOwner, setIsOwner] = useState(false)
  const [selectedMode, setSelectedMode] = useState<GameMode>("story")
  const [transitionMode, setTransitionMode] = useState<GameMode>("story")
  const [transitionTimer, setTransitionTimer] = useState(0)
  const [secretComboProgress, setSecretComboProgress] = useState<string[]>([])
  const [secretMessage, setSecretMessage] = useState<string | null>(null)
  const [secretWinMessage, setSecretWinMessage] = useState("")
  const [allClearStats, setAllClearStats] = useState({ score: 0, time: "" })

  const resetLevel = useCallback(
    (levelIndex: number, mode: GameMode = selectedMode) => {
      const idx = Math.min(levelIndex, LEVELS.length - 1)
      gameStateRef.current = createGameState(idx, mode)
      levelDataRef.current = deepCloneLevel(LEVELS[idx])
      // Set mode transition text
      if (gameStateRef.current) {
        gameStateRef.current.hud.modeTransitionText = MODE_INFO[mode].transitionText
        gameStateRef.current.hud.modeTransitionTimer = 90
      }
    },
    [selectedMode]
  )

  // Name submission
  const handleNameSubmit = () => {
    const trimmed = playerName.trim()
    if (!trimmed) return
    const ownerCheck = OWNER_NAMES.includes(trimmed.toLowerCase())
    setIsOwner(ownerCheck)
    setScreen("mode-select")
  }

  // Mode selection
  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode)
    setTransitionMode(mode)
    setScreen("transition")
    setTransitionTimer(120) // 2 seconds at 60fps
  }

  // Transition countdown
  useEffect(() => {
    if (screen !== "transition") return
    const interval = setInterval(() => {
      setTransitionTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          resetLevel(0, transitionMode)
          setScreen("playing")
          return 0
        }
        return prev - 1
      })
    }, 1000 / 60)
    return () => clearInterval(interval)
  }, [screen, transitionMode, resetLevel])

  // Secret combo tracking during gameplay
  useEffect(() => {
    if (screen !== "playing") return

    const handleSecretKey = (e: KeyboardEvent) => {
      let comboKey: string | null = null

      if (e.code === "Space" || e.code === "KeyZ") comboKey = "jump"
      else if (e.code === "KeyW") comboKey = "w"
      else if (e.code === "KeyA") comboKey = "a"
      else if (e.code === "KeyS") comboKey = "s"
      else if (e.code === "KeyD") comboKey = "d"
      else if (e.code === "KeyI") comboKey = "i"

      if (!comboKey) return

      setSecretComboProgress((prev) => {
        const next = [...prev, comboKey]
        // Check if sequence matches so far
        const matches = next.every((k, i) => i < SECRET_COMBO.length && k === SECRET_COMBO[i])
        if (!matches) return [comboKey] // Reset but keep current key
        if (next.length === SECRET_COMBO.length) {
          // Full combo entered
          if (isOwner) {
            // Owner: activate secret win
            setSecretWinMessage(
              "If you are Patrick Otto, the creator, it's fine to do this. If not, you're just trying to win fast."
            )
            // Mark speedrun timer as started on combo activation
            if (gameStateRef.current) {
              gameStateRef.current.player.hasMovedThisRun = true
              if (gameStateRef.current.gameMode === "speedrun") {
                gameStateRef.current.speedrunStarted = true
              }
            }
            setTimeout(() => {
              setScreen("secret-win")
            }, 1500)
          } else {
            // Not owner: block it
            setSecretMessage("Bro, you are not the Owner. This will not work.")
            setTimeout(() => setSecretMessage(null), 3000)
          }
          return []
        }
        return next
      })
    }

    window.addEventListener("keydown", handleSecretKey)
    return () => window.removeEventListener("keydown", handleSecretKey)
  }, [screen, isOwner])

  // Input handling
  useEffect(() => {
    if (screen !== "playing") return
    const input = inputRef.current

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          input.left = true
          break
        case "ArrowRight":
        case "KeyD":
          input.right = true
          break
        case "ArrowUp":
        case "KeyW":
          input.up = true
          break
        case "ArrowDown":
        case "KeyS":
          input.down = true
          break
        case "Space":
        case "KeyZ":
          if (!input.jump) input.jumpPressed = true
          input.jump = true
          e.preventDefault()
          break
        case "ShiftLeft":
        case "ShiftRight":
        case "KeyX":
          if (!input.dash) input.dashPressed = true
          input.dash = true
          break
        case "KeyE":
        case "KeyQ":
          if (!input.overclock) input.overclockPressed = true
          input.overclock = true
          break
        case "KeyF":
        case "KeyC":
          if (!input.attack) input.attackPressed = true
          input.attack = true
          break
        case "KeyR":
          if (gameStateRef.current?.gameOver) {
            resetLevel(gameStateRef.current.currentLevel, selectedMode)
          }
          break
        case "Enter":
          if (gameStateRef.current?.levelComplete) {
            const next = gameStateRef.current.currentLevel + 1
            if (next < LEVELS.length) {
              const prevTimer = gameStateRef.current.speedrunTimer
              const prevStarted = gameStateRef.current.speedrunStarted
              resetLevel(next, selectedMode)
              // Preserve speedrun timer across levels
              if (gameStateRef.current && selectedMode === "speedrun") {
                gameStateRef.current.speedrunTimer = prevTimer
                gameStateRef.current.speedrunStarted = prevStarted
              }
            } else {
              // All levels complete
              const gs = gameStateRef.current
              const totalSecs = gs.speedrunTimer / 60
              const m = Math.floor(totalSecs / 60)
              const sec = Math.floor(totalSecs % 60)
              const ms = Math.floor((totalSecs * 1000) % 1000)
              setAllClearStats({
                score: gs.player.score,
                time: `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms).padStart(3, "0")}`,
              })
              setScreen("all-clear")
            }
          }
          break
        case "KeyP":
          if (gameStateRef.current) {
            gameStateRef.current.paused = !gameStateRef.current.paused
          }
          break
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          input.left = false
          break
        case "ArrowRight":
        case "KeyD":
          input.right = false
          break
        case "ArrowUp":
        case "KeyW":
          input.up = false
          break
        case "ArrowDown":
        case "KeyS":
          input.down = false
          break
        case "Space":
        case "KeyZ":
          input.jump = false
          break
        case "ShiftLeft":
        case "ShiftRight":
        case "KeyX":
          input.dash = false
          break
        case "KeyE":
        case "KeyQ":
          input.overclock = false
          break
        case "KeyF":
        case "KeyC":
          input.attack = false
          break
      }
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [resetLevel, screen, selectedMode])

  // Game loop
  useEffect(() => {
    if (screen !== "playing") return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const loop = () => {
      if (!gameStateRef.current) {
        animFrameRef.current = requestAnimationFrame(loop)
        return
      }

      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cw = rect.width
      const ch = rect.height

      gameStateRef.current = updateGame(
        gameStateRef.current,
        inputRef.current,
        levelDataRef.current,
        1
      )

      renderGame(ctx, gameStateRef.current, levelDataRef.current, cw, ch)

      // Pause overlay
      if (gameStateRef.current.paused) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
        ctx.fillRect(0, 0, cw, ch)
        ctx.fillStyle = "#00ffff"
        ctx.font = "bold 28px monospace"
        ctx.textAlign = "center"
        ctx.fillText("PAUSED", cw / 2, ch / 2)
        ctx.fillStyle = "rgba(255,255,255,0.5)"
        ctx.font = "12px monospace"
        ctx.fillText("Press [P] to resume", cw / 2, ch / 2 + 30)
        ctx.textAlign = "left"
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [screen])

  // --- NAME ENTRY SCREEN ---
  if (screen === "name-entry") {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-mono text-xs tracking-widest text-accent">
              {"// IDENTITY_VERIFICATION"}
            </h2>
            <h3 className="mb-1 text-3xl font-bold text-foreground">GL1TCH: OVERRIDE</h3>
            <p className="font-mono text-xs text-muted-foreground">
              Enter your name to initialize the system
            </p>
          </div>

          <div className="rounded-sm border border-border bg-card/50 p-6">
            <label className="mb-2 block font-mono text-xs tracking-wider text-primary">
              {">"} PLAYER_NAME:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSubmit()
              }}
              className="mb-4 w-full rounded-sm border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="Enter name..."
              autoFocus
            />
            <button
              onClick={handleNameSubmit}
              disabled={!playerName.trim()}
              className="w-full rounded-sm border border-primary bg-primary/10 px-6 py-3 font-mono text-sm font-bold tracking-widest text-primary transition-all hover:bg-primary hover:text-background disabled:opacity-30 disabled:hover:bg-primary/10 disabled:hover:text-primary"
            >
              {">"} INITIALIZE
            </button>
          </div>

          <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground">
            Created by Patrick Otto
          </p>
        </div>
      </div>
    )
  }

  // --- MODE SELECT SCREEN ---
  if (screen === "mode-select") {
    const modes: GameMode[] = ["story", "speedrun", "chaos", "hardcore", "zen", "endless"]
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-mono text-xs tracking-widest text-accent">
              {"// SELECT_EXECUTION_MODE"}
            </h2>
            <h3 className="mb-1 text-2xl font-bold text-foreground">
              Welcome, <span className="text-primary">{playerName}</span>
            </h3>
            {isOwner && (
              <p className="mt-2 font-mono text-xs text-accent">
                [OWNER ACCESS GRANTED] Secret features available
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modes.map((mode) => {
              const info = MODE_INFO[mode]
              return (
                <button
                  key={mode}
                  onClick={() => handleModeSelect(mode)}
                  className="group rounded-sm border border-border bg-card/50 p-5 text-left transition-all hover:border-primary/50 hover:bg-card"
                >
                  <h4 className="mb-2 font-mono text-sm font-bold tracking-wider text-foreground group-hover:text-primary">
                    {info.label}
                  </h4>
                  <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                    {info.desc}
                  </p>
                </button>
              )
            })}
          </div>

          {isOwner && (
            <div className="mt-6 rounded-sm border border-accent/30 bg-accent/5 p-4 text-center">
              <p className="font-mono text-xs text-accent">
                SECRET: During gameplay, press Jump + Jump + W + A + S + D + I to activate the owner combo.
              </p>
            </div>
          )}

          <button
            onClick={() => setScreen("name-entry")}
            className="mt-4 w-full font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {"<"} CHANGE IDENTITY
          </button>
        </div>
      </div>
    )
  }

  // --- TRANSITION SCREEN ---
  if (screen === "transition") {
    const info = MODE_INFO[transitionMode]
    const progress = Math.max(0, 1 - transitionTimer / 120)
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mb-6 font-mono text-xs tracking-widest text-muted-foreground">
            {"// LOADING EXECUTION ENVIRONMENT"}
          </div>
          <h2 className="mb-4 text-4xl font-bold text-primary neon-cyan">{info.label}</h2>
          <p className="mb-8 font-mono text-sm text-muted-foreground">{info.transitionText}</p>

          {/* Progress bar */}
          <div className="mx-auto mb-4 w-64 overflow-hidden rounded-sm border border-border bg-card/50">
            <div
              className="h-2 bg-primary transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            {Math.floor(progress * 100)}% LOADED
          </p>

          {/* Glitch lines */}
          <div className="mt-8 space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="mx-auto h-px bg-primary/20"
                style={{
                  width: `${Math.random() * 200 + 50}px`,
                  opacity: Math.random() * 0.5 + 0.1,
                  transform: `translateX(${(Math.random() - 0.5) * 100}px)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // --- SECRET WIN SCREEN ---
  if (screen === "secret-win") {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg text-center">
          <div className="mb-6 font-mono text-xs tracking-widest text-accent">
            {"// OWNER_OVERRIDE_ACTIVATED"}
          </div>
          <h2 className="mb-4 text-3xl font-bold text-primary neon-cyan">SYSTEM OVERRIDE</h2>
          <p className="mb-6 font-mono text-sm leading-relaxed text-foreground">
            {secretWinMessage}
          </p>

          <div className="mb-8 rounded-sm border border-accent/30 bg-accent/5 p-6">
            <h3 className="mb-4 font-mono text-sm font-bold text-accent">UNLOCKED:</h3>
            <div className="grid gap-2 text-left font-mono text-xs text-muted-foreground">
              <p className="text-primary">+ Creator Achievement: "Source Code"</p>
              <p className="text-primary">+ Exclusive Animation: Glitch Ascension</p>
              <p className="text-primary">+ Secret Ending Cutscene Access</p>
              <p className="text-primary">+ Hidden Music Track: "Override Protocol"</p>
              <p className="text-primary">+ Easter Egg Collection Complete</p>
              <p className="text-primary">+ Creator Credits Entry</p>
              <p className="text-primary">+ Shortcut: All Levels Bypassed</p>
              <p className="text-primary">+ Bonus Mini-Level: "The Root Shell"</p>
              <p className="text-primary">+ Hidden Message: "The code remembers its creator."</p>
            </div>
          </div>

          <div className="mb-6 rounded-sm border border-border bg-card/50 p-4">
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-foreground">Hidden Message:</span>{" "}
              <span className="text-accent italic">&quot;The code remembers its creator. Every glitch, every pixel -- it all began with you, Patrick.&quot;</span>
            </p>
          </div>

          {/* Credits */}
          <div className="mb-6 space-y-1 font-mono text-xs text-muted-foreground">
            <p>
              Created by <span className="text-primary">Patrick Otto</span>
            </p>
            <p>
              Concept & design assisted by <span className="text-accent">ChatGPT</span>
            </p>
            <p>
              Game built with <span className="text-primary">v0</span>
            </p>
            <p>
              Logo & visuals by <span className="text-accent">Leonardo.ai</span>
            </p>
            <p>
              Special thanks to <span className="text-primary">Gemini</span> for AI support
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                setScreen("mode-select")
                setSecretComboProgress([])
              }}
              className="rounded-sm border border-primary bg-primary/10 px-6 py-3 font-mono text-xs font-bold tracking-widest text-primary transition-all hover:bg-primary hover:text-background"
            >
              {">"} PLAY AGAIN
            </button>
            <button
              onClick={() => {
                setScreen("name-entry")
                setPlayerName("")
                setSecretComboProgress([])
              }}
              className="rounded-sm border border-border px-6 py-3 font-mono text-xs tracking-widest text-muted-foreground transition-all hover:border-muted-foreground hover:text-foreground"
            >
              CHANGE IDENTITY
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- ALL CLEAR SCREEN ---
  if (screen === "all-clear") {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg text-center">
          <div className="mb-6 font-mono text-xs tracking-widest text-accent">
            {"// ALL_SECTORS_CLEARED"}
          </div>
          <h2 className="mb-4 text-4xl font-bold text-primary neon-cyan">SYSTEM LIBERATED</h2>
          <p className="mb-6 font-mono text-sm text-muted-foreground">
            The Hard Reset has been stopped. You have reached the Root Directory.
          </p>

          <div className="mb-8 rounded-sm border border-border bg-card/50 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-mono text-xs text-muted-foreground">FINAL SCORE</p>
                <p className="mt-1 font-mono text-2xl font-bold text-primary">{allClearStats.score}</p>
              </div>
              {selectedMode === "speedrun" && (
                <div>
                  <p className="font-mono text-xs text-muted-foreground">TOTAL TIME</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-[#ffaa00]">{allClearStats.time}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => setScreen("mode-select")}
              className="rounded-sm border border-primary bg-primary/10 px-6 py-3 font-mono text-xs font-bold tracking-widest text-primary transition-all hover:bg-primary hover:text-background"
            >
              {">"} PLAY AGAIN
            </button>
            <button
              onClick={() => {
                setScreen("name-entry")
                setPlayerName("")
              }}
              className="rounded-sm border border-border px-6 py-3 font-mono text-xs tracking-widest text-muted-foreground transition-all hover:border-muted-foreground hover:text-foreground"
            >
              CHANGE IDENTITY
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- PLAYING SCREEN ---
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center gap-4 bg-background px-4 py-6">
      <div className="mb-2 text-center">
        <h2 className="font-mono text-xs tracking-widest text-accent">
          {"// RUNTIME_ENVIRONMENT"}
        </h2>
        <h3 className="text-2xl font-bold text-foreground">GL1TCH: OVERRIDE</h3>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Player: {playerName} | Mode: {MODE_INFO[selectedMode].label}
        </p>
      </div>

      <div className="relative w-full max-w-4xl overflow-hidden rounded-sm border border-border">
        <canvas
          ref={canvasRef}
          className="h-[500px] w-full cursor-crosshair bg-background"
          tabIndex={0}
          role="img"
          aria-label="GL1TCH: OVERRIDE game canvas"
        />

        {/* Secret combo progress indicator (owner only) */}
        {isOwner && secretComboProgress.length > 0 && (
          <div className="absolute bottom-2 left-2 rounded-sm border border-accent/30 bg-background/90 px-3 py-1">
            <p className="font-mono text-[10px] text-accent">
              COMBO: {secretComboProgress.map((k) => k.toUpperCase()).join(" > ")}{" "}
              <span className="text-muted-foreground">
                ({secretComboProgress.length}/{SECRET_COMBO.length})
              </span>
            </p>
          </div>
        )}

        {/* Secret blocked message (non-owner) */}
        {secretMessage && (
          <div className="absolute inset-x-0 top-1/3 flex justify-center">
            <div className="rounded-sm border border-destructive bg-background/95 px-6 py-4 text-center">
              <p className="font-mono text-sm font-bold text-destructive">{secretMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {showControls ? "[ HIDE CONTROLS ]" : "[ SHOW CONTROLS ]"}
      </button>

      {showControls && (
        <div className="w-full max-w-4xl rounded-sm border border-border bg-card/50 p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <h4 className="mb-2 font-mono text-xs font-bold text-primary">MOVEMENT</h4>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <p>
                  <span className="text-foreground">WASD</span> / Arrows - Move
                </p>
                <p>
                  <span className="text-foreground">Space</span> / Z - Jump
                </p>
                <p>
                  <span className="text-foreground">Space x2</span> - Double Jump
                </p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-mono text-xs font-bold text-primary">ABILITIES</h4>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <p>
                  <span className="text-foreground">Shift</span> / X - Dash
                </p>
                <p>
                  <span className="text-foreground">E</span> / Q - Overclock
                </p>
                <p>
                  <span className="text-foreground">F</span> / C - kill -9 (AOE)
                </p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-mono text-xs font-bold text-primary">SYSTEM</h4>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <p>
                  <span className="text-foreground">P</span> - Pause
                </p>
                <p>
                  <span className="text-foreground">R</span> - Restart (on death)
                </p>
                <p>
                  <span className="text-foreground">Enter</span> - Next Level
                </p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-mono text-xs font-bold text-accent">TIPS</h4>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <p>Double jump mid-air for extra height</p>
                <p>Dash through enemies to defragment them</p>
                <p>Overclock makes phase platforms solid</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to mode select */}
      <button
        onClick={() => {
          cancelAnimationFrame(animFrameRef.current)
          setScreen("mode-select")
          setSecretComboProgress([])
        }}
        className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {"<"} BACK TO MODE SELECT
      </button>

      {/* Mobile touch controls */}
      <div className="flex flex-wrap justify-center gap-2 md:hidden">
        <MobileButton
          label="Left"
          onDown={() => {
            inputRef.current.left = true
          }}
          onUp={() => {
            inputRef.current.left = false
          }}
        />
        <MobileButton
          label="Right"
          onDown={() => {
            inputRef.current.right = true
          }}
          onUp={() => {
            inputRef.current.right = false
          }}
        />
        <MobileButton
          label="Jump"
          onDown={() => {
            inputRef.current.jump = true
            inputRef.current.jumpPressed = true
          }}
          onUp={() => {
            inputRef.current.jump = false
          }}
        />
        <MobileButton
          label="Dash"
          onDown={() => {
            inputRef.current.dash = true
            inputRef.current.dashPressed = true
          }}
          onUp={() => {
            inputRef.current.dash = false
          }}
        />
        <MobileButton
          label="OC"
          onDown={() => {
            inputRef.current.overclock = true
            inputRef.current.overclockPressed = true
          }}
          onUp={() => {
            inputRef.current.overclock = false
          }}
        />
        <MobileButton
          label="ATK"
          onDown={() => {
            inputRef.current.attack = true
            inputRef.current.attackPressed = true
          }}
          onUp={() => {
            inputRef.current.attack = false
          }}
        />
      </div>
    </div>
  )
}

function MobileButton({
  label,
  onDown,
  onUp,
}: {
  label: string
  onDown: () => void
  onUp: () => void
}) {
  return (
    <button
      className="rounded-sm border border-border bg-card/50 px-4 py-3 font-mono text-xs text-foreground active:bg-primary/20"
      onTouchStart={(e) => {
        e.preventDefault()
        onDown()
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        onUp()
      }}
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
    >
      {label}
    </button>
  )
}

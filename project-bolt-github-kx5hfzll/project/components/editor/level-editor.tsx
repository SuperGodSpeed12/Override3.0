"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import type { Platform, Enemy, DataPacket, LevelData } from "@/components/game/game-engine"
import {
  MousePointer,
  Square,
  Trash2,
  Play,
  Download,
  Upload,
  RotateCcw,
  Grid3X3,
  Minus,
  Plus,
  Move,
  Circle,
  Diamond,
  Flag,
  MapPin,
} from "lucide-react"

type EditorTool = "select" | "platform" | "enemy" | "packet" | "spawn" | "exit" | "erase"
type PlatformType = Platform["type"]
type EnemyType = Enemy["type"]
type PacketType = DataPacket["type"]

interface EditorState {
  tool: EditorTool
  platformType: PlatformType
  enemyType: EnemyType
  packetType: PacketType
  level: LevelData
  selectedIndex: number | null
  selectedCategory: "platform" | "enemy" | "packet" | null
  zoom: number
  panX: number
  panY: number
  showGrid: boolean
  gridSize: number
  isPanning: boolean
  lastMouseX: number
  lastMouseY: number
}

function createEmptyLevel(): LevelData {
  return {
    name: "Custom Level",
    width: 2400,
    height: 600,
    spawnX: 60,
    spawnY: 460,
    exitX: 2300,
    exitY: 200,
    platforms: [
      { x: 0, y: 520, w: 400, h: 80, type: "solid", visible: true },
    ],
    enemies: [],
    packets: [],
  }
}

const TOOL_CONFIG: {
  id: EditorTool
  label: string
  icon: React.ElementType
  shortcut: string
}[] = [
  { id: "select", label: "Select", icon: MousePointer, shortcut: "V" },
  { id: "platform", label: "Platform", icon: Square, shortcut: "P" },
  { id: "enemy", label: "Enemy", icon: Circle, shortcut: "E" },
  { id: "packet", label: "Packet", icon: Diamond, shortcut: "D" },
  { id: "spawn", label: "Spawn", icon: MapPin, shortcut: "S" },
  { id: "exit", label: "Exit", icon: Flag, shortcut: "X" },
  { id: "erase", label: "Erase", icon: Trash2, shortcut: "Del" },
]

const PLATFORM_TYPES: { type: PlatformType; label: string; color: string }[] = [
  { type: "solid", label: "Solid", color: "#00ffff" },
  { type: "phase", label: "Phase", color: "#00ffff80" },
  { type: "falling", label: "Falling", color: "#ff6432" },
  { type: "moving", label: "Moving", color: "#66ccff" },
  { type: "corrupt", label: "Corrupt", color: "#ff0066" },
]

const ENEMY_TYPES: { type: EnemyType; label: string; color: string }[] = [
  { type: "watchdog", label: "Watchdog", color: "#00ccff" },
  { type: "logic_bomb", label: "Logic Bomb", color: "#ff6633" },
  { type: "memory_leak", label: "Memory Leak", color: "#cc66ff" },
  { type: "fragment", label: "Fragment", color: "#ff6600" },
  { type: "mirror_bug", label: "Mirror Bug", color: "#00ffff" },
  { type: "null_anchor", label: "Null Anchor", color: "#ff00ff" },
  { type: "lag_beast", label: "Lag Beast", color: "#66ccff" },
]

const PACKET_TYPES: { type: PacketType; label: string; color: string }[] = [
  { type: "data", label: "Data", color: "#ffff00" },
  { type: "health", label: "Health", color: "#00ff88" },
  { type: "overclock", label: "Overclock", color: "#ff0066" },
]

export function LevelEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<EditorState>({
    tool: "select",
    platformType: "solid",
    enemyType: "watchdog",
    packetType: "data",
    level: createEmptyLevel(),
    selectedIndex: null,
    selectedCategory: null,
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    gridSize: 20,
    isPanning: false,
    lastMouseX: 0,
    lastMouseY: 0,
  })

  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null)
  const [testMode, setTestMode] = useState(false)
  const [levelName, setLevelName] = useState("Custom Level")

  // Convert screen coords to world coords
  const screenToWorld = useCallback(
    (sx: number, sy: number) => {
      return {
        x: (sx - state.panX) / state.zoom,
        y: (sy - state.panY) / state.zoom,
      }
    },
    [state.panX, state.panY, state.zoom]
  )

  // Snap to grid
  const snapToGrid = useCallback(
    (val: number) => {
      return Math.round(val / state.gridSize) * state.gridSize
    },
    [state.gridSize]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      switch (e.key.toLowerCase()) {
        case "v":
          setState((s) => ({ ...s, tool: "select" }))
          break
        case "p":
          setState((s) => ({ ...s, tool: "platform" }))
          break
        case "e":
          setState((s) => ({ ...s, tool: "enemy" }))
          break
        case "d":
          setState((s) => ({ ...s, tool: "packet" }))
          break
        case "s":
          if (!e.ctrlKey && !e.metaKey) setState((s) => ({ ...s, tool: "spawn" }))
          break
        case "x":
          setState((s) => ({ ...s, tool: "exit" }))
          break
        case "delete":
        case "backspace":
          if (state.selectedIndex !== null && state.selectedCategory) {
            setState((s) => {
              const newLevel = { ...s.level }
              if (s.selectedCategory === "platform") {
                newLevel.platforms = newLevel.platforms.filter(
                  (_, i) => i !== s.selectedIndex
                )
              } else if (s.selectedCategory === "enemy") {
                newLevel.enemies = newLevel.enemies.filter(
                  (_, i) => i !== s.selectedIndex
                )
              } else if (s.selectedCategory === "packet") {
                newLevel.packets = newLevel.packets.filter(
                  (_, i) => i !== s.selectedIndex
                )
              }
              return { ...s, level: newLevel, selectedIndex: null, selectedCategory: null }
            })
          }
          break
        case "g":
          setState((s) => ({ ...s, showGrid: !s.showGrid }))
          break
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [state.selectedIndex, state.selectedCategory])

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const sx = e.clientX - rect.left
      const sy = e.clientY - rect.top
      const world = screenToWorld(sx, sy)
      const wx = snapToGrid(world.x)
      const wy = snapToGrid(world.y)

      // Middle mouse or space+click for panning
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        setState((s) => ({ ...s, isPanning: true, lastMouseX: e.clientX, lastMouseY: e.clientY }))
        return
      }

      switch (state.tool) {
        case "select": {
          // Find what was clicked
          let found = false
          for (let i = state.level.platforms.length - 1; i >= 0; i--) {
            const p = state.level.platforms[i]
            if (world.x >= p.x && world.x <= p.x + p.w && world.y >= p.y && world.y <= p.y + p.h) {
              setState((s) => ({ ...s, selectedIndex: i, selectedCategory: "platform" }))
              found = true
              break
            }
          }
          if (!found) {
            for (let i = state.level.enemies.length - 1; i >= 0; i--) {
              const en = state.level.enemies[i]
              if (world.x >= en.x && world.x <= en.x + en.w && world.y >= en.y && world.y <= en.y + en.h) {
                setState((s) => ({ ...s, selectedIndex: i, selectedCategory: "enemy" }))
                found = true
                break
              }
            }
          }
          if (!found) {
            for (let i = state.level.packets.length - 1; i >= 0; i--) {
              const pk = state.level.packets[i]
              if (world.x >= pk.x - 8 && world.x <= pk.x + pk.w + 8 && world.y >= pk.y - 8 && world.y <= pk.y + pk.h + 8) {
                setState((s) => ({ ...s, selectedIndex: i, selectedCategory: "packet" }))
                found = true
                break
              }
            }
          }
          if (!found) {
            setState((s) => ({ ...s, selectedIndex: null, selectedCategory: null }))
          }
          break
        }
        case "platform":
          setDragStart({ x: wx, y: wy })
          setDragCurrent({ x: wx, y: wy })
          break
        case "enemy": {
          setState((s) => {
            const newEnemy: Enemy = {
              x: wx,
              y: wy,
              w: 24,
              h: 24,
              type: s.enemyType,
              vx: s.enemyType === "logic_bomb" || s.enemyType === "null_anchor" ? 0 : 2,
              vy: 0,
              hp: s.enemyType === "memory_leak" || s.enemyType === "null_anchor" || s.enemyType === "lag_beast" ? 3 : s.enemyType === "fragment" ? 1 : 2,
              maxHp: s.enemyType === "memory_leak" || s.enemyType === "null_anchor" || s.enemyType === "lag_beast" ? 3 : s.enemyType === "fragment" ? 1 : 2,
              alive: true,
              patrolRange: 100,
              originX: wx,
              originY: wy,
              ...(s.enemyType === "memory_leak" ? { growthRate: 0.02, radius: 15 } : {}),
              ...(s.enemyType === "null_anchor" ? { radius: 100 } : {}),
            }
            return {
              ...s,
              level: { ...s.level, enemies: [...s.level.enemies, newEnemy] },
            }
          })
          break
        }
        case "packet": {
          setState((s) => {
            const newPkt: DataPacket = {
              x: wx,
              y: wy,
              w: 16,
              h: 16,
              collected: false,
              type: s.packetType,
            }
            return {
              ...s,
              level: { ...s.level, packets: [...s.level.packets, newPkt] },
            }
          })
          break
        }
        case "spawn":
          setState((s) => ({
            ...s,
            level: { ...s.level, spawnX: wx, spawnY: wy },
          }))
          break
        case "exit":
          setState((s) => ({
            ...s,
            level: { ...s.level, exitX: wx, exitY: wy },
          }))
          break
        case "erase": {
          setState((s) => {
            const newLevel = { ...s.level }
            // Check platforms
            for (let i = newLevel.platforms.length - 1; i >= 0; i--) {
              const p = newLevel.platforms[i]
              if (world.x >= p.x && world.x <= p.x + p.w && world.y >= p.y && world.y <= p.y + p.h) {
                newLevel.platforms = newLevel.platforms.filter((_, j) => j !== i)
                return { ...s, level: newLevel }
              }
            }
            // Check enemies
            for (let i = newLevel.enemies.length - 1; i >= 0; i--) {
              const en = newLevel.enemies[i]
              if (world.x >= en.x && world.x <= en.x + en.w && world.y >= en.y && world.y <= en.y + en.h) {
                newLevel.enemies = newLevel.enemies.filter((_, j) => j !== i)
                return { ...s, level: newLevel }
              }
            }
            // Check packets
            for (let i = newLevel.packets.length - 1; i >= 0; i--) {
              const pk = newLevel.packets[i]
              if (world.x >= pk.x - 8 && world.x <= pk.x + pk.w + 8 && world.y >= pk.y - 8 && world.y <= pk.y + pk.h + 8) {
                newLevel.packets = newLevel.packets.filter((_, j) => j !== i)
                return { ...s, level: newLevel }
              }
            }
            return s
          })
          break
        }
      }
    },
    [state.tool, state.level, screenToWorld, snapToGrid]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (state.isPanning) {
        const dx = e.clientX - state.lastMouseX
        const dy = e.clientY - state.lastMouseY
        setState((s) => ({
          ...s,
          panX: s.panX + dx,
          panY: s.panY + dy,
          lastMouseX: e.clientX,
          lastMouseY: e.clientY,
        }))
        return
      }

      if (dragStart && state.tool === "platform") {
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const sx = e.clientX - rect.left
        const sy = e.clientY - rect.top
        const world = screenToWorld(sx, sy)
        setDragCurrent({ x: snapToGrid(world.x), y: snapToGrid(world.y) })
      }
    },
    [state.isPanning, state.lastMouseX, state.lastMouseY, state.tool, dragStart, screenToWorld, snapToGrid]
  )

  const handleMouseUp = useCallback(() => {
    if (state.isPanning) {
      setState((s) => ({ ...s, isPanning: false }))
      return
    }

    if (dragStart && dragCurrent && state.tool === "platform") {
      const x = Math.min(dragStart.x, dragCurrent.x)
      const y = Math.min(dragStart.y, dragCurrent.y)
      const w = Math.abs(dragCurrent.x - dragStart.x)
      const h = Math.abs(dragCurrent.y - dragStart.y)

      if (w >= 10 && h >= 10) {
        const newPlat: Platform = {
          x,
          y,
          w,
          h,
          type: state.platformType,
          visible: true,
          ...(state.platformType === "moving" ? {
            moveDir: 1,
            moveRange: 100,
            moveSpeed: 1.5,
            originX: x,
            originY: y,
          } : {}),
          ...(state.platformType === "falling" ? { fallTimer: 0 } : {}),
        }
        setState((s) => ({
          ...s,
          level: { ...s.level, platforms: [...s.level.platforms, newPlat] },
        }))
      }
      setDragStart(null)
      setDragCurrent(null)
    }
  }, [state.isPanning, state.tool, state.platformType, dragStart, dragCurrent])

  // Scroll to zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setState((s) => ({
      ...s,
      zoom: Math.max(0.2, Math.min(3, s.zoom + delta)),
    }))
  }, [])

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const cw = rect.width
    const ch = rect.height

    // Clear
    ctx.fillStyle = "#030608"
    ctx.fillRect(0, 0, cw, ch)

    ctx.save()
    ctx.translate(state.panX, state.panY)
    ctx.scale(state.zoom, state.zoom)

    // Grid
    if (state.showGrid) {
      ctx.strokeStyle = "rgba(0, 255, 255, 0.05)"
      ctx.lineWidth = 0.5 / state.zoom
      for (let x = 0; x < state.level.width; x += state.gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, state.level.height)
        ctx.stroke()
      }
      for (let y = 0; y < state.level.height; y += state.gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(state.level.width, y)
        ctx.stroke()
      }
    }

    // Level boundary
    ctx.strokeStyle = "rgba(255, 0, 102, 0.3)"
    ctx.lineWidth = 2 / state.zoom
    ctx.setLineDash([8 / state.zoom, 8 / state.zoom])
    ctx.strokeRect(0, 0, state.level.width, state.level.height)
    ctx.setLineDash([])

    // Platforms
    state.level.platforms.forEach((plat, i) => {
      const isSelected = state.selectedCategory === "platform" && state.selectedIndex === i
      const colors: Record<PlatformType, string> = {
        solid: "#0a1628",
        phase: "rgba(10, 22, 40, 0.6)",
        falling: "#1a0a0a",
        moving: "#0a1628",
        corrupt: "rgba(60, 0, 30, 0.8)",
      }
      const borders: Record<PlatformType, string> = {
        solid: "#00ffff",
        phase: "rgba(0, 255, 255, 0.4)",
        falling: "#ff6432",
        moving: "#66ccff",
        corrupt: "#ff0066",
      }

      ctx.fillStyle = colors[plat.type]
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h)
      ctx.strokeStyle = isSelected ? "#ffffff" : borders[plat.type]
      ctx.lineWidth = isSelected ? 2 / state.zoom : 1 / state.zoom
      if (plat.type === "phase") {
        ctx.setLineDash([4 / state.zoom, 4 / state.zoom])
      }
      ctx.strokeRect(plat.x, plat.y, plat.w, plat.h)
      ctx.setLineDash([])

      // Type label
      ctx.fillStyle = "rgba(255,255,255,0.4)"
      ctx.font = `${10 / state.zoom}px monospace`
      ctx.fillText(plat.type.toUpperCase(), plat.x + 3 / state.zoom, plat.y + 12 / state.zoom)
    })

    // Enemies
    state.level.enemies.forEach((enemy, i) => {
      const isSelected = state.selectedCategory === "enemy" && state.selectedIndex === i
      const enemyColors: Record<EnemyType, string> = {
        watchdog: "#00ccff",
        logic_bomb: "#ff6633",
        memory_leak: "#cc66ff",
        fragment: "#ff6600",
        mirror_bug: "#00ffff",
        null_anchor: "#ff00ff",
        lag_beast: "#66ccff",
      }
      const col = enemyColors[enemy.type]

      ctx.fillStyle = col
      ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h)
      if (isSelected) {
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2 / state.zoom
        ctx.strokeRect(enemy.x - 2, enemy.y - 2, enemy.w + 4, enemy.h + 4)
      }

      ctx.fillStyle = "rgba(255,255,255,0.5)"
      ctx.font = `${8 / state.zoom}px monospace`
      ctx.fillText(enemy.type.slice(0, 4).toUpperCase(), enemy.x, enemy.y - 3 / state.zoom)
    })

    // Packets
    state.level.packets.forEach((pkt, i) => {
      const isSelected = state.selectedCategory === "packet" && state.selectedIndex === i
      const pktColors: Record<PacketType, string> = {
        data: "#ffff00",
        health: "#00ff88",
        overclock: "#ff0066",
      }
      const col = pktColors[pkt.type]

      ctx.beginPath()
      ctx.arc(pkt.x + pkt.w / 2, pkt.y + pkt.h / 2, 8 / state.zoom * state.zoom, 0, Math.PI * 2)
      ctx.fillStyle = col
      ctx.globalAlpha = 0.4
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.strokeStyle = isSelected ? "#ffffff" : col
      ctx.lineWidth = (isSelected ? 2 : 1) / state.zoom
      ctx.stroke()
    })

    // Spawn point
    ctx.beginPath()
    ctx.arc(state.level.spawnX, state.level.spawnY, 10, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(0, 255, 136, 0.3)"
    ctx.fill()
    ctx.strokeStyle = "#00ff88"
    ctx.lineWidth = 2 / state.zoom
    ctx.stroke()
    ctx.fillStyle = "#00ff88"
    ctx.font = `${10 / state.zoom}px monospace`
    ctx.fillText("SPAWN", state.level.spawnX - 15, state.level.spawnY - 14)

    // Exit point
    ctx.beginPath()
    ctx.arc(state.level.exitX, state.level.exitY, 12, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(0, 255, 255, 0.3)"
    ctx.fill()
    ctx.strokeStyle = "#00ffff"
    ctx.lineWidth = 2 / state.zoom
    ctx.stroke()
    ctx.fillStyle = "#00ffff"
    ctx.fillText("EXIT", state.level.exitX - 10, state.level.exitY - 16)

    // Drag preview
    if (dragStart && dragCurrent && state.tool === "platform") {
      const x = Math.min(dragStart.x, dragCurrent.x)
      const y = Math.min(dragStart.y, dragCurrent.y)
      const w = Math.abs(dragCurrent.x - dragStart.x)
      const h = Math.abs(dragCurrent.y - dragStart.y)
      ctx.fillStyle = "rgba(0, 255, 255, 0.15)"
      ctx.fillRect(x, y, w, h)
      ctx.strokeStyle = "#00ffff"
      ctx.lineWidth = 1 / state.zoom
      ctx.setLineDash([4 / state.zoom, 4 / state.zoom])
      ctx.strokeRect(x, y, w, h)
      ctx.setLineDash([])
      ctx.fillStyle = "#00ffff"
      ctx.font = `${10 / state.zoom}px monospace`
      ctx.fillText(`${Math.round(w)}x${Math.round(h)}`, x + 2, y - 4 / state.zoom)
    }

    ctx.restore()
  }, [state, dragStart, dragCurrent])

  // Export level as JSON
  const exportLevel = useCallback(() => {
    const data = { ...state.level, name: levelName }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${levelName.replace(/\s+/g, "_").toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [state.level, levelName])

  // Import level from JSON
  const importLevel = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as LevelData
          setState((s) => ({ ...s, level: data }))
          setLevelName(data.name || "Imported Level")
        } catch {
          // ignore parse errors
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-background lg:flex-row">
      {/* Left sidebar - Tools */}
      <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto border-b border-border bg-card/30 p-3 lg:w-56 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="hidden font-mono text-xs tracking-widest text-accent lg:block">
          {"// LEVEL_EDITOR"}
        </div>

        {/* Level Name */}
        <div className="hidden lg:block">
          <label className="mb-1 block font-mono text-xs text-muted-foreground">
            Level Name
          </label>
          <input
            type="text"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            className="w-full rounded-sm border border-border bg-background px-2 py-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Tools */}
        <div className="flex gap-1 lg:flex-col">
          {TOOL_CONFIG.map((t) => (
            <button
              key={t.id}
              onClick={() => setState((s) => ({ ...s, tool: t.id }))}
              className={cn(
                "flex items-center gap-2 rounded-sm px-2.5 py-2 font-mono text-xs transition-all",
                state.tool === t.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              title={`${t.label} (${t.shortcut})`}
            >
              <t.icon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">{t.label}</span>
              <span className="ml-auto hidden font-mono text-xs text-muted-foreground lg:inline">
                {t.shortcut}
              </span>
            </button>
          ))}
        </div>

        {/* Platform types */}
        {state.tool === "platform" && (
          <div className="flex gap-1 lg:flex-col">
            <div className="hidden text-xs text-muted-foreground lg:block">Type:</div>
            {PLATFORM_TYPES.map((pt) => (
              <button
                key={pt.type}
                onClick={() => setState((s) => ({ ...s, platformType: pt.type }))}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-2 py-1.5 font-mono text-xs",
                  state.platformType === pt.type
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: pt.color }} />
                <span className="hidden lg:inline">{pt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Enemy types */}
        {state.tool === "enemy" && (
          <div className="flex gap-1 lg:flex-col">
            <div className="hidden text-xs text-muted-foreground lg:block">Type:</div>
            {ENEMY_TYPES.map((et) => (
              <button
                key={et.type}
                onClick={() => setState((s) => ({ ...s, enemyType: et.type }))}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-2 py-1.5 font-mono text-xs",
                  state.enemyType === et.type
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: et.color }} />
                <span className="hidden lg:inline">{et.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Packet types */}
        {state.tool === "packet" && (
          <div className="flex gap-1 lg:flex-col">
            <div className="hidden text-xs text-muted-foreground lg:block">Type:</div>
            {PACKET_TYPES.map((pk) => (
              <button
                key={pk.type}
                onClick={() => setState((s) => ({ ...s, packetType: pk.type }))}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-2 py-1.5 font-mono text-xs",
                  state.packetType === pk.type
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pk.color }} />
                <span className="hidden lg:inline">{pk.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="ml-auto flex gap-1 lg:ml-0 lg:mt-auto lg:flex-col">
          <button
            onClick={() => {
              setState((s) => ({ ...s, level: createEmptyLevel() }))
              setLevelName("Custom Level")
            }}
            className="flex items-center gap-2 rounded-sm px-2.5 py-2 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>
          <button
            onClick={exportLevel}
            className="flex items-center gap-2 rounded-sm px-2.5 py-2 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Export</span>
          </button>
          <button
            onClick={importLevel}
            className="flex items-center gap-2 rounded-sm px-2.5 py-2 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Import</span>
          </button>
        </div>
      </aside>

      {/* Canvas area */}
      <div className="relative flex-1">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-card/30 px-4 py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setState((s) => ({ ...s, showGrid: !s.showGrid }))}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-xs",
                state.showGrid ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Grid3X3 className="h-3.5 w-3.5" />
              Grid
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setState((s) => ({ ...s, zoom: Math.max(0.2, s.zoom - 0.2) }))}
                className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-12 text-center font-mono text-xs text-muted-foreground">
                {Math.round(state.zoom * 100)}%
              </span>
              <button
                onClick={() => setState((s) => ({ ...s, zoom: Math.min(3, s.zoom + 0.2) }))}
                className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => setState((s) => ({ ...s, panX: 0, panY: 0, zoom: 1 }))}
              className="rounded-sm px-2 py-1 font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              <Move className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {state.level.platforms.length} platforms | {state.level.enemies.length} enemies | {state.level.packets.length} packets
            </span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="h-[calc(100vh-8rem)] w-full cursor-crosshair lg:h-[calc(100vh-7rem)]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          tabIndex={0}
          role="img"
          aria-label="Level editor canvas"
        />

        {/* Properties panel */}
        {state.selectedIndex !== null && state.selectedCategory && (
          <div className="absolute bottom-4 right-4 w-64 rounded-sm border border-border bg-card/95 p-4 backdrop-blur-sm">
            <h4 className="mb-3 font-mono text-xs font-bold tracking-wider text-primary">
              PROPERTIES
            </h4>
            {state.selectedCategory === "platform" && state.level.platforms[state.selectedIndex] && (
              <PlatformProperties
                platform={state.level.platforms[state.selectedIndex]}
                onChange={(updated) => {
                  setState((s) => {
                    const newPlatforms = [...s.level.platforms]
                    newPlatforms[s.selectedIndex!] = updated
                    return { ...s, level: { ...s.level, platforms: newPlatforms } }
                  })
                }}
              />
            )}
            {state.selectedCategory === "enemy" && state.level.enemies[state.selectedIndex] && (
              <EnemyProperties
                enemy={state.level.enemies[state.selectedIndex]}
                onChange={(updated) => {
                  setState((s) => {
                    const newEnemies = [...s.level.enemies]
                    newEnemies[s.selectedIndex!] = updated
                    return { ...s, level: { ...s.level, enemies: newEnemies } }
                  })
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function PlatformProperties({
  platform,
  onChange,
}: {
  platform: Platform
  onChange: (p: Platform) => void
}) {
  return (
    <div className="space-y-2">
      <PropRow label="X">
        <PropInput
          value={platform.x}
          onChange={(v) => onChange({ ...platform, x: v })}
        />
      </PropRow>
      <PropRow label="Y">
        <PropInput
          value={platform.y}
          onChange={(v) => onChange({ ...platform, y: v })}
        />
      </PropRow>
      <PropRow label="Width">
        <PropInput
          value={platform.w}
          onChange={(v) => onChange({ ...platform, w: v })}
        />
      </PropRow>
      <PropRow label="Height">
        <PropInput
          value={platform.h}
          onChange={(v) => onChange({ ...platform, h: v })}
        />
      </PropRow>
      <PropRow label="Type">
        <select
          value={platform.type}
          onChange={(e) => onChange({ ...platform, type: e.target.value as PlatformType })}
          className="w-full rounded-sm border border-border bg-background px-1.5 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
        >
          {PLATFORM_TYPES.map((pt) => (
            <option key={pt.type} value={pt.type}>
              {pt.label}
            </option>
          ))}
        </select>
      </PropRow>
      {platform.type === "moving" && (
        <>
          <PropRow label="Range">
            <PropInput
              value={platform.moveRange || 100}
              onChange={(v) => onChange({ ...platform, moveRange: v })}
            />
          </PropRow>
          <PropRow label="Speed">
            <PropInput
              value={platform.moveSpeed || 1.5}
              onChange={(v) => onChange({ ...platform, moveSpeed: v })}
              step={0.1}
            />
          </PropRow>
        </>
      )}
    </div>
  )
}

function EnemyProperties({
  enemy,
  onChange,
}: {
  enemy: Enemy
  onChange: (e: Enemy) => void
}) {
  return (
    <div className="space-y-2">
      <PropRow label="X">
        <PropInput value={enemy.x} onChange={(v) => onChange({ ...enemy, x: v, originX: v })} />
      </PropRow>
      <PropRow label="Y">
        <PropInput value={enemy.y} onChange={(v) => onChange({ ...enemy, y: v, originY: v })} />
      </PropRow>
      <PropRow label="HP">
        <PropInput value={enemy.maxHp} onChange={(v) => onChange({ ...enemy, hp: v, maxHp: v })} />
      </PropRow>
      <PropRow label="Speed">
        <PropInput value={Math.abs(enemy.vx)} onChange={(v) => onChange({ ...enemy, vx: v })} step={0.5} />
      </PropRow>
      <PropRow label="Patrol">
        <PropInput value={enemy.patrolRange || 100} onChange={(v) => onChange({ ...enemy, patrolRange: v })} />
      </PropRow>
    </div>
  )
}

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 font-mono text-xs text-muted-foreground">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function PropInput({
  value,
  onChange,
  step = 1,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-full rounded-sm border border-border bg-background px-1.5 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
    />
  )
}

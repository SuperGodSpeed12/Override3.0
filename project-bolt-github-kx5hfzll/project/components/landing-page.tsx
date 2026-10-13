"use client"

import { useEffect, useRef, useState } from "react"
import { Terminal, Zap, Shield, Skull, ArrowDown } from "lucide-react"

function GlitchCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animFrame: number
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const chars = "01アイウエオカキクケコ>_{}[];/\\|"
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = new Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = "rgba(5, 8, 15, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "rgba(0, 255, 255, 0.15)"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      animFrame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-40"
      aria-hidden="true"
    />
  )
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [started, text])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="animate-pulse text-primary">_</span>
      )}
    </span>
  )
}

const features = [
  {
    icon: Zap,
    title: "Overclock Toggle",
    desc: "Switch between Solid and Liquid states. Dash through walls, bend gravity, but watch the Heat.",
  },
  {
    icon: Shield,
    title: "Adaptive Corruption",
    desc: "Damage doesn't just hurt -- it warps reality. Fake platforms, input lag, UI meltdown.",
  },
  {
    icon: Terminal,
    title: "Execution Commands",
    desc: "Unlock sudo_leap, grep_hook, chmod_777, and kill -9. Code is your weapon.",
  },
  {
    icon: Skull,
    title: "Malware Enemies",
    desc: "Watchdogs, Logic Bombs, Memory Leaks, Trojans. Each exploits the Glitch system differently.",
  },
]

export function LandingPage({ onPlay }: { onPlay: () => void }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <GlitchCanvas />

      {/* Hero */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 font-mono text-xs tracking-widest text-accent">
          <TypewriterText text="// ERROR 404: ILLEGAL INSTRUCTION DETECTED" delay={500} />
        </div>

        <h1
          className="glitch-text mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl"
          data-text="GL1TCH"
        >
          GL1TCH
        </h1>

        <p className="mb-2 font-mono text-lg tracking-wider text-primary neon-cyan md:text-xl">
          <TypewriterText text=": OVERRIDE" delay={2000} />
        </p>

        <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          You are an Illegal Instruction. The system is purging itself via a Hard Reset.
          Reach the Root Directory before everything is wiped.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={onPlay}
            className="group relative overflow-hidden rounded-sm border border-primary bg-primary/10 px-8 py-3 font-mono text-sm font-bold tracking-widest text-primary transition-all hover:bg-primary hover:text-background pulse-glow"
          >
            <span className="relative z-10">{">"} PLAY NOW</span>
          </button>
          <a
            href="#features"
            className="flex items-center gap-2 rounded-sm border border-border px-8 py-3 font-mono text-sm tracking-widest text-muted-foreground transition-all hover:border-muted-foreground hover:text-foreground"
          >
            LEARN MORE
          </a>
        </div>

        <div className="mt-20 animate-bounce text-muted-foreground">
          <ArrowDown className="h-5 w-5" />
        </div>
      </div>

      {/* Features */}
      <div id="features" className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-12">
        <h2 className="mb-2 text-center font-mono text-xs tracking-widest text-accent">
          {"// CORE_SYSTEMS"}
        </h2>
        <h3 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Precision Chaos
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-sm border border-border bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card glitch-border"
            >
              <f.icon className="mb-4 h-8 w-8 text-primary" />
              <h4 className="mb-2 font-mono text-sm font-bold tracking-wider text-foreground">
                {f.title}
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enemies Preview */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24">
        <h2 className="mb-2 text-center font-mono text-xs tracking-widest text-accent">
          {"// THREAT_DATABASE"}
        </h2>
        <h3 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          The Malware
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "The Watchdog", color: "text-primary", desc: "Fast patrol drones with searchlights. Overclocking makes you invisible to them." },
            { name: "Logic Bombs", color: "text-accent", desc: "Stationary mines that explode into binary shrapnel. Glitch Shift defuses them." },
            { name: "Memory Leak", color: "text-chart-3", desc: "Growing blobs that slow you down. They feed on your Glitch Meter energy." },
            { name: "The Trojan", color: "text-chart-4", desc: "Disguised as a power-up. Get close and it morphs into a multi-phase boss." },
            { name: "Firewall Bots", color: "text-destructive", desc: "Laser-shooting sentries blocking critical pathways." },
            { name: "Fragment Swarms", color: "text-chart-5", desc: "Fast-moving glitch cubes that overwhelm in numbers." },
          ].map((enemy) => (
            <div
              key={enemy.name}
              className="flex items-start gap-4 rounded-sm border border-border bg-card/30 p-4 transition-all hover:border-primary/30"
            >
              <div className={`mt-0.5 h-3 w-3 shrink-0 rounded-full bg-current ${enemy.color}`} />
              <div>
                <h4 className={`font-mono text-sm font-bold ${enemy.color}`}>{enemy.name}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{enemy.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Modes */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-24">
        <h2 className="mb-2 text-center font-mono text-xs tracking-widest text-accent">
          {"// EXECUTION_MODES"}
        </h2>
        <h3 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Choose Your Protocol
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { mode: "Story Mode", desc: "Navigate through the RAM Corridor, CPU Core, GPU Wasteland, and reach the Kernel." },
            { mode: "Speedrun Mode", desc: "Race against the clock. Timer starts on movement. Every millisecond counts." },
            { mode: "Endless Mode", desc: "Survive infinite glitches. How long can you last before Kernel Panic?" },
            { mode: "Level Editor", desc: "Build your own corrupted worlds. Share with the community." },
          ].map((m) => (
            <div
              key={m.mode}
              className="rounded-sm border border-border bg-card/30 p-6 transition-all hover:border-primary/30"
            >
              <h4 className="mb-2 font-mono text-sm font-bold text-primary">{m.mode}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credits */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 pb-32">
        <div className="rounded-sm border border-border bg-card/30 p-8 text-center">
          <h2 className="mb-1 text-center font-mono text-xs tracking-widest text-accent">
            {"// CREDITS"}
          </h2>
          <h3 className="mb-6 text-center text-xl font-bold text-foreground">
            GL1TCH: OVERRIDE
          </h3>
          <div className="space-y-2 font-mono text-xs leading-relaxed text-muted-foreground">
            <p>
              <span className="text-foreground">Created by</span>{" "}
              <span className="text-primary">Patrick Otto</span>
            </p>
            <p>
              <span className="text-foreground">Concept & design assisted by</span>{" "}
              <span className="text-accent">ChatGPT</span>
            </p>
            <p>
              <span className="text-foreground">Game built with</span>{" "}
              <span className="text-primary">v0</span>
            </p>
            <p>
              <span className="text-foreground">Logo & visuals by</span>{" "}
              <span className="text-accent">Leonardo.ai</span>
            </p>
            <p>
              <span className="text-foreground">Special thanks to</span>{" "}
              <span className="text-primary">Gemini</span>{" "}
              <span className="text-foreground">for AI support</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

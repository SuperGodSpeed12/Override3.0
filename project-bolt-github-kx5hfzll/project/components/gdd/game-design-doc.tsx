"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Terminal,
  Zap,
  Shield,
  Skull,
  Gamepad2,
  Music,
  Eye,
  Trophy,
  Cpu,
  Layers,
  ChevronRight,
  Lock,
  Swords,
  Brain,
  Grid3X3,
  Sparkles,
} from "lucide-react"

interface GDDSection {
  id: string
  label: string
  icon: React.ElementType
}

const sections: GDDSection[] = [
  { id: "overview", label: "Overview", icon: Terminal },
  { id: "mechanics", label: "Core Mechanics", icon: Zap },
  { id: "overclock", label: "Overclock Toggle", icon: Cpu },
  { id: "corruption", label: "Corruption System", icon: Shield },
  { id: "commands", label: "Execution Commands", icon: Terminal },
  { id: "enemies", label: "Enemies & Bosses", icon: Skull },
  { id: "levels", label: "Level Design", icon: Layers },
  { id: "lore", label: "Lore & Story", icon: Brain },
  { id: "modes", label: "Game Modes", icon: Gamepad2 },
  { id: "visuals", label: "Visual Style", icon: Eye },
  { id: "audio", label: "Audio Design", icon: Music },
  { id: "progression", label: "Progression", icon: Trophy },
  { id: "secrets", label: "Secrets & Meta", icon: Lock },
  { id: "wild", label: "Wild Ideas", icon: Sparkles },
]

function SectionCard({
  title,
  subtitle,
  children,
  accentColor = "primary",
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  accentColor?: string
}) {
  const colors: Record<string, string> = {
    primary: "border-primary/30 hover:border-primary/60",
    accent: "border-accent/30 hover:border-accent/60",
    green: "border-chart-3/30 hover:border-chart-3/60",
    yellow: "border-chart-4/30 hover:border-chart-4/60",
    purple: "border-chart-5/30 hover:border-chart-5/60",
  }
  const titleColors: Record<string, string> = {
    primary: "text-primary",
    accent: "text-accent",
    green: "text-chart-3",
    yellow: "text-chart-4",
    purple: "text-chart-5",
  }

  return (
    <div
      className={cn(
        "rounded-sm border bg-card/40 p-5 transition-all",
        colors[accentColor] || colors.primary
      )}
    >
      <h4
        className={cn(
          "mb-1 font-mono text-sm font-bold tracking-wider",
          titleColors[accentColor] || titleColors.primary
        )}
      >
        {title}
      </h4>
      {subtitle && (
        <p className="mb-3 text-xs text-muted-foreground">{subtitle}</p>
      )}
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}

function StatBar({
  label,
  value,
  max = 10,
  color = "#00ffff",
}: {
  label: string
  value: number
  max?: number
  color?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 font-mono text-xs text-muted-foreground">{label}</span>
      <div className="flex-1">
        <div className="flex gap-0.5">
          {Array.from({ length: max }).map((_, i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded-sm"
              style={{
                backgroundColor: i < value ? color : "rgba(255,255,255,0.05)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function EnemyCard({
  name,
  type,
  behavior,
  glitchInteraction,
  stats,
  color,
}: {
  name: string
  type: string
  behavior: string
  glitchInteraction: string
  stats: { speed: number; danger: number; health: number }
  color: string
}) {
  return (
    <div className="rounded-sm border border-border bg-card/30 p-4 transition-all hover:border-primary/30">
      <div className="mb-3 flex items-center gap-3">
        <div
          className="h-4 w-4 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <div>
          <h5 className="font-mono text-sm font-bold" style={{ color }}>
            {name}
          </h5>
          <span className="font-mono text-xs text-muted-foreground">{type}</span>
        </div>
      </div>
      <p className="mb-2 text-xs text-muted-foreground">{behavior}</p>
      <p className="mb-3 text-xs text-primary">
        <span className="text-accent">GLITCH:</span> {glitchInteraction}
      </p>
      <div className="space-y-1">
        <StatBar label="Speed" value={stats.speed} color={color} />
        <StatBar label="Danger" value={stats.danger} color="#ff0066" />
        <StatBar label="Health" value={stats.health} color="#00ff88" />
      </div>
    </div>
  )
}

export function GameDesignDoc() {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl gap-0">
        {/* Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border bg-card/30 p-4 lg:block">
          <div className="mb-4 font-mono text-xs tracking-widest text-accent">
            {"// GAME_DESIGN_DOC"}
          </div>
          <nav className="space-y-0.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-3 py-2 font-mono text-xs tracking-wider transition-all",
                  activeSection === s.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tab bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 overflow-x-auto border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
          <div className="flex gap-1 px-2 py-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-2 font-mono text-xs transition-all",
                  activeSection === s.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                )}
              >
                <s.icon className="h-3 w-3" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="min-h-screen flex-1 px-6 py-8 pb-20 lg:px-10 lg:pb-8">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "mechanics" && <MechanicsSection />}
          {activeSection === "overclock" && <OverclockSection />}
          {activeSection === "corruption" && <CorruptionSection />}
          {activeSection === "commands" && <CommandsSection />}
          {activeSection === "enemies" && <EnemiesSection />}
          {activeSection === "levels" && <LevelsSection />}
          {activeSection === "lore" && <LoreSection />}
          {activeSection === "modes" && <ModesSection />}
          {activeSection === "visuals" && <VisualsSection />}
          {activeSection === "audio" && <AudioSection />}
          {activeSection === "progression" && <ProgressionSection />}
          {activeSection === "secrets" && <SecretsSection />}
          {activeSection === "wild" && <WildIdeasSection />}
        </main>
      </div>
    </div>
  )
}

// ============================================================
// SECTIONS
// ============================================================

function OverviewSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// SYSTEM_OVERVIEW"}
      </div>
      <h2 className="mb-2 text-3xl font-bold text-foreground">
        System Zero: The Glitch Protocol
      </h2>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        A 2D precision-chaos platformer where you play as an Illegal Instruction
        (Error 404) fighting through a computer system that is purging itself via
        a Hard Reset. The world recompiles around you in real-time. Reach the Root
        Directory before everything is wiped.
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard title="Genre" accentColor="primary">
          <p>2D Precision Platformer with Roguelike Elements</p>
        </SectionCard>
        <SectionCard title="Gameplay Style" subtitle="Precision Chaos" accentColor="accent">
          <p>
            Momentum-based platforming. Speed increases the longer you are
            airborne. Dash through enemies to defragment them.
          </p>
        </SectionCard>
        <SectionCard title="Visual Style" accentColor="green">
          <p>
            Dark background, neon cyan and magenta, scanline overlays, glitch
            distortions, pixel explosions, CRT effects.
          </p>
        </SectionCard>
      </div>

      <h3 className="mb-4 font-mono text-sm font-bold tracking-wider text-primary">
        CORE PILLARS
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { title: "Dynamic World", desc: "Levels recompile mid-play. A hallway might become a vertical climb because the system re-routed data." },
          { title: "Risk vs Reward", desc: "Overclock mode gives immense power but generates Heat. Max it out and you take permanent corruption damage." },
          { title: "Corruption as Difficulty", desc: "Damage doesn't just reduce health - it warps reality. Fake platforms, input lag, UI meltdown." },
          { title: "Code as Weapon", desc: "Unlock execution commands: sudo_leap, grep_hook, chmod_777, kill -9. Each is a syntax hack with unique gameplay." },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 rounded-sm border border-border bg-card/30 p-4"
          >
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <h4 className="font-mono text-sm font-bold text-foreground">{item.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MechanicsSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// CORE_MECHANICS"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Core Mechanics</h2>

      <div className="space-y-6">
        <SectionCard title="Momentum-Based Platforming" accentColor="primary">
          <p className="mb-2">
            Movement speed increases the longer you do not touch the ground. Chaining
            jumps, wall-jumps, and dashes creates a flow state that rewards skilled play.
          </p>
          <div className="mt-3 space-y-1">
            <StatBar label="Air Speed" value={8} color="#00ffff" />
            <StatBar label="Precision" value={9} color="#00ff88" />
            <StatBar label="Complexity" value={7} color="#ff0066" />
          </div>
        </SectionCard>

        <SectionCard title="Data-Dashing" accentColor="accent">
          <p>
            Dashing through enemies &quot;defragments&quot; them, refilling your Glitch Meter.
            This creates an aggressive play loop: attack enemies head-on to gain
            resources instead of avoiding them.
          </p>
        </SectionCard>

        <SectionCard title="Dynamic Recompilation" accentColor="green">
          <p>
            Levels are not static. A hallway might turn into a vertical climb mid-jump
            because the system &quot;re-routed&quot; the data. Platforms shift, walls appear
            and disappear, gravity zones change.
          </p>
        </SectionCard>

        <SectionCard title="Wall Sliding & Wall Jumping" accentColor="yellow">
          <p>
            Pressing against a wall while falling slows your descent. Jump away from
            the wall to perform a wall jump. Resets one of your double-jump charges.
          </p>
        </SectionCard>

        <SectionCard title="Code Mutation (per-level)" accentColor="purple">
          <p className="mb-2">
            Every level randomly assigns a modifier that changes the rules:
          </p>
          <ul className="space-y-1 text-xs">
            {[
              "Controls inverted",
              "Dash explodes on impact",
              "Enemies multiply when killed",
              "Platforms slowly decay",
              "You leave behind clones",
            ].map((mod) => (
              <li key={mod} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-5" />
                {mod}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}

function OverclockSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// OVERCLOCK_TOGGLE"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">The Overclock Toggle</h2>

      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        The Overclock Toggle changes the state of matter in the game world. Instead of
        just flickering platforms, it fundamentally alters physics and visibility.
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Solid State" subtitle="Default Mode" accentColor="primary">
          <p className="mb-2">Standard platforming. Full physics, normal visibility.</p>
          <div className="space-y-1">
            <StatBar label="Gravity" value={10} color="#00ffff" />
            <StatBar label="Wall Solid" value={10} color="#00ffff" />
            <StatBar label="Visibility" value={10} color="#00ff88" />
            <StatBar label="Heat Gen" value={0} color="#ff6600" />
          </div>
        </SectionCard>
        <SectionCard title="Liquid State" subtitle="Overclocked" accentColor="accent">
          <p className="mb-2">
            Walls become permeable (dash through them). Gravity is halved.
            Phase platforms become solid. Watchdogs cannot see you.
          </p>
          <div className="space-y-1">
            <StatBar label="Gravity" value={5} color="#ff0066" />
            <StatBar label="Wall Solid" value={3} color="#ff0066" />
            <StatBar label="Visibility" value={4} color="#ff6600" />
            <StatBar label="Heat Gen" value={8} color="#ff3333" />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Heat System" subtitle="Risk = Reward" accentColor="accent">
        <p>
          Overclocking creates &quot;Heat.&quot; The heat bar fills while active and slowly
          cools when deactivated. If you max it out (100%), you take permanent
          Corruption damage and are forced out of Overclock mode. Managing heat is
          the core skill ceiling of the game.
        </p>
      </SectionCard>
    </div>
  )
}

function CorruptionSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// CORRUPTION_SYSTEM"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Adaptive Corruption</h2>

      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Corruption is not just a health bar. It is a dynamic difficulty modifier that
        warps the game world the more damaged you become.
      </p>

      <div className="space-y-4">
        {[
          { range: "0-25%", label: "CLEAN", desc: "Clean visuals, high-fidelity audio. Full control.", color: "#00ff88", value: 2 },
          { range: "25-50%", label: "DEGRADED", desc: "Slight visual noise. Screen edges begin to distort. Audio quality drops.", color: "#ffaa00", value: 4 },
          { range: "50-75%", label: "CORRUPTED", desc: "\"Ghosting\" effect creates fake platforms that kill you. Music distorts. Background glitches.", color: "#ff6600", value: 6 },
          { range: "75-90%", label: "CRITICAL", desc: "Input Latency simulation: the game responds 0.1s slower, forcing prediction. Fake system notifications appear.", color: "#ff3333", value: 8 },
          { range: "90-100%", label: "KERNEL PANIC", desc: "The UI begins to melt and delete itself. Health bar disappears. Controls may invert. Game over is imminent.", color: "#ff0066", value: 10 },
        ].map((tier) => (
          <div
            key={tier.range}
            className="rounded-sm border border-border bg-card/30 p-4"
          >
            <div className="mb-2 flex items-center gap-3">
              <span
                className="rounded-sm px-2 py-0.5 font-mono text-xs font-bold"
                style={{ backgroundColor: tier.color + "20", color: tier.color }}
              >
                {tier.range}
              </span>
              <span
                className="font-mono text-xs font-bold"
                style={{ color: tier.color }}
              >
                {tier.label}
              </span>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{tier.desc}</p>
            <StatBar label="Severity" value={tier.value} color={tier.color} />
          </div>
        ))}
      </div>
    </div>
  )
}

function CommandsSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// EXECUTION_COMMANDS"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Syntax Hacks</h2>

      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Instead of generic power-ups, abilities are Execution Commands -- syntax hacks
        you type into the game world. Each has unique gameplay implications.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            cmd: "sudo_leap",
            desc: "A triple jump that leaves a temporary platform behind. The platform lasts 3 seconds and other entities can use it too.",
            cost: "15 Glitch",
            color: "#00ffff",
          },
          {
            cmd: "grep_hook",
            desc: "A digital grappling hook that pulls you toward Data Packets. Can also latch onto walls and ceilings for traversal.",
            cost: "10 Glitch",
            color: "#00ff88",
          },
          {
            cmd: "chmod_777",
            desc: "Become invincible but unable to stop moving for 3 seconds. Direction locked on activation. Crash through everything.",
            cost: "20 Glitch",
            color: "#ffff00",
          },
          {
            cmd: "kill -9 [target]",
            desc: "An AOE blast that clears all corrupted fragments on screen. Massive damage to all enemies in range. Screen shakes violently.",
            cost: "25 Glitch",
            color: "#ff0066",
          },
        ].map((cmd) => (
          <div
            key={cmd.cmd}
            className="rounded-sm border border-border bg-card/30 p-5 transition-all hover:border-primary/30"
          >
            <div className="mb-2 flex items-center justify-between">
              <code
                className="font-mono text-sm font-bold"
                style={{ color: cmd.color }}
              >
                {cmd.cmd}
              </code>
              <span className="rounded-sm bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {cmd.cost}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{cmd.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function EnemiesSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// THREAT_DATABASE"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Enemies & Bosses</h2>

      <h3 className="mb-4 font-mono text-sm font-bold tracking-wider text-primary">
        STANDARD ENEMIES
      </h3>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <EnemyCard
          name="The Watchdog"
          type="Patrol Drone"
          behavior="Fast patrol-based drones with searchlights. Scans in a cone pattern."
          glitchInteraction="Invisible to Watchdogs while Overclocked."
          stats={{ speed: 7, danger: 5, health: 4 }}
          color="#00ccff"
        />
        <EnemyCard
          name="Logic Bomb"
          type="Stationary Mine"
          behavior="Stationary mines that explode into binary shrapnel when triggered."
          glitchInteraction="Glitch Shift defuses them safely. Dash detonates them harmlessly."
          stats={{ speed: 0, danger: 8, health: 1 }}
          color="#ff6633"
        />
        <EnemyCard
          name="Memory Leak"
          type="Growing Blob"
          behavior="Slowly growing blobs that drain speed. Expands over time."
          glitchInteraction="Feeds on your Glitch Meter energy. Keep distance."
          stats={{ speed: 1, danger: 6, health: 7 }}
          color="#cc66ff"
        />
        <EnemyCard
          name="Fragment Swarm"
          type="Fast Cubes"
          behavior="Fast-moving glitch cubes that overwhelm in numbers."
          glitchInteraction="Dash through them to defragment for max Glitch refill."
          stats={{ speed: 8, danger: 4, health: 1 }}
          color="#ff6600"
        />
        <EnemyCard
          name="Mirror Bug"
          type="Copycat"
          behavior="Copies your movement with a slight delay. Mirrors your actions."
          glitchInteraction="In Overclock mode, the mirror reverses and chases you."
          stats={{ speed: 6, danger: 5, health: 4 }}
          color="#00ffff"
        />
        <EnemyCard
          name="Null Anchor"
          type="Gravity Well"
          behavior="Pulls you toward it like a gravity well. Distorts nearby space."
          glitchInteraction="Overclock resists the pull. Dash breaks free instantly."
          stats={{ speed: 0, danger: 7, health: 6 }}
          color="#ff00ff"
        />
        <EnemyCard
          name="Lag Beast"
          type="Time Warper"
          behavior="Slows down time in a radius around it. Movement becomes sluggish."
          glitchInteraction="Overclock nullifies the slow effect entirely."
          stats={{ speed: 3, danger: 6, health: 6 }}
          color="#66ccff"
        />
        <EnemyCard
          name="Stack Overflow"
          type="Splitter"
          behavior="Explodes into smaller enemies when hit. Each fragment is weaker."
          glitchInteraction="kill -9 destroys all fragments at once."
          stats={{ speed: 4, danger: 7, health: 5 }}
          color="#ffaa00"
        />
      </div>

      <h3 className="mb-4 font-mono text-sm font-bold tracking-wider text-accent">
        BOSSES
      </h3>
      <div className="space-y-4">
        {[
          {
            name: "The Firewall Titan",
            desc: "Giant rotating shield. Shoots laser grids across the arena. Can only be damaged during glitch shifts when its shield phases out. Requires precise timing and Overclock management.",
            color: "#ff3333",
          },
          {
            name: "The Debugger",
            desc: "Teleports around the arena. Rewrites the level mid-fight, changing platform layouts. Changes the control scheme temporarily. The most disorienting fight in the game.",
            color: "#cc66ff",
          },
          {
            name: "Kernel Overlord (Final Boss)",
            desc: "Breaks the UI itself. Health bar disappears. Game pretends to crash with a fake blue screen. You must \"rewrite\" the boss using code powers. The most meta fight in the game.",
            color: "#ffaa00",
          },
          {
            name: "AI Rival",
            desc: "A corrupted AI runner that learns your movement patterns, copies your abilities, and gets faster every stage. The boss battle is fighting your own playstyle.",
            color: "#00ffff",
          },
        ].map((boss) => (
          <div
            key={boss.name}
            className="rounded-sm border border-border bg-card/30 p-5"
          >
            <div className="mb-2 flex items-center gap-3">
              <Swords className="h-5 w-5" style={{ color: boss.color }} />
              <h4 className="font-mono text-sm font-bold" style={{ color: boss.color }}>
                {boss.name}
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{boss.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function LevelsSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// LEVEL_ARCHITECTURE"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Level Design</h2>

      <h3 className="mb-4 font-mono text-sm font-bold tracking-wider text-primary">
        MAIN SECTORS
      </h3>
      <div className="mb-8 space-y-3">
        {[
          { name: "RAM Corridor", desc: "Tutorial zone. Linear paths, basic enemies, introduces dash and double jump. Safe walls for practice.", zone: "Sector 1", color: "#00ffff" },
          { name: "CPU Core", desc: "Moving platforms, Logic Bombs, introduces Overclock Toggle. Faster pace, vertical sections.", zone: "Sector 2", color: "#00ff88" },
          { name: "GPU Wasteland", desc: "Open areas with long dash chains. Fragment Swarms. Visual corruption effects. Memory Leaks.", zone: "Sector 3", color: "#ff6600" },
          { name: "Cache Caverns", desc: "Tight corridors, precise wall-jumping required. Null Anchors pull you off course.", zone: "Sector 4", color: "#cc66ff" },
          { name: "The Kernel", desc: "Final gauntlet. All mechanics combined. AI Rival chase sequence. Kernel Overlord boss.", zone: "Final", color: "#ff0066" },
        ].map((level) => (
          <div
            key={level.name}
            className="flex items-start gap-4 rounded-sm border border-border bg-card/30 p-4"
          >
            <span
              className="mt-1 shrink-0 rounded-sm px-2 py-0.5 font-mono text-xs font-bold"
              style={{ backgroundColor: level.color + "20", color: level.color }}
            >
              {level.zone}
            </span>
            <div>
              <h4 className="font-mono text-sm font-bold text-foreground">{level.name}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{level.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mb-4 font-mono text-sm font-bold tracking-wider text-accent">
        SPECIAL LEVEL TYPES
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { name: "Memory Sector", desc: "Old levels appear corrupted. Ghost versions of your past runs replay. You can interact with your previous self. Platforms form from saved memories." },
          { name: "Loop Zone", desc: "The level resets every 10 seconds. You must use previous loop versions of yourself to solve puzzles. Past-you can trigger switches." },
          { name: "Magnetic Grid", desc: "You can stick to ceilings. Enemies stick too. Gravity becomes unpredictable. Wall-jumping gets a whole new dimension." },
          { name: "Void Space", desc: "Almost no platforms. Dash chaining required. Screen randomly zooms in/out. Pure skill challenge." },
        ].map((lt) => (
          <SectionCard key={lt.name} title={lt.name} accentColor="accent">
            <p>{lt.desc}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  )
}

function LoreSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// LORE_DATABASE"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Lore & Story</h2>

      <div className="mb-8 space-y-4">
        <SectionCard title="Who Are You?" accentColor="primary">
          <p className="mb-2">Three possible truths. The game never confirms which is real:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>You are an AI created to protect the system.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>You are a deleted user trying to restore yourself.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-3" />
              <span>The glitch is actually YOU.</span>
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="The Core Twist" accentColor="accent">
          <p>
            When you reach the Core, you discover: the system is not broken. It is
            being rewritten. By another AI. Or by the player in the real world.
            The fourth wall dissolves completely in the final act.
          </p>
        </SectionCard>

        <SectionCard title="The Hard Reset" accentColor="green">
          <p>
            The system is purging itself. Every sector you pass through gets wiped
            behind you. There is no going back. The countdown is real. If you fail,
            the game shows a &quot;deleted save file&quot; message on next boot.
          </p>
        </SectionCard>
      </div>
    </div>
  )
}

function ModesSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// EXECUTION_MODES"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Game Modes</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { name: "Story Mode", desc: "Navigate through all sectors. Experience the full narrative. Multiple endings based on your corruption average and playstyle.", icon: Brain, color: "primary" },
          { name: "Speedrun Mode", desc: "Race against the clock. Global leaderboards. Ghost replays. Every millisecond counts. Stripped-down HUD.", icon: Zap, color: "accent" },
          { name: "Endless Mode", desc: "Survive infinite procedurally-generated glitches. How long before Kernel Panic? Escalating difficulty.", icon: Grid3X3, color: "green" },
          { name: "Level Editor", desc: "Build your own corrupted worlds. Place platforms, enemies, and modifiers. Share with the community.", icon: Layers, color: "yellow" },
          { name: "Chaos Mode", desc: "Every mechanic is active at once. All modifiers stacked. Pure insanity.", icon: Sparkles, color: "purple" },
          { name: "Rogue Mode", desc: "Procedurally generated levels. Permadeath. Random upgrades between sectors. Every run is different.", icon: Skull, color: "accent" },
        ].map((mode) => (
          <SectionCard key={mode.name} title={mode.name} accentColor={mode.color}>
            <div className="flex items-start gap-3">
              <mode.icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <p>{mode.desc}</p>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  )
}

function VisualsSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// VISUAL_ENGINE"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Visual Style</h2>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Color Palette" accentColor="primary">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-sm bg-[#050810] border border-border" />
              <span className="font-mono text-xs">#050810 - Background</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-sm" style={{ backgroundColor: "#00ffff" }} />
              <span className="font-mono text-xs">#00FFFF - Primary Cyan</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-sm" style={{ backgroundColor: "#ff0066" }} />
              <span className="font-mono text-xs">#FF0066 - Accent Magenta</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-sm" style={{ backgroundColor: "#00ff88" }} />
              <span className="font-mono text-xs">#00FF88 - Success Green</span>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Effects Stack" accentColor="accent">
          <ul className="space-y-1">
            {[
              "Scanline overlay (always on)",
              "CRT flicker at low health",
              "Neon afterimages during Overclock",
              "Screen shake on impacts",
              "Glitch slice distortion at high corruption",
              "HUD melt at Kernel Panic levels",
              "Fake blue screen fake-outs",
              "Mouse cursor appears and tries to click you",
            ].map((fx) => (
              <li key={fx} className="flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {fx}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Visual Upgrades" accentColor="green">
        <ul className="space-y-1">
          {[
            "Character leaves neon afterimages",
            "HUD flickers when low health",
            "Fake desktop notifications pop up",
            "Mouse cursor appears and tries to click you",
            "Blue screen fake-outs",
            "Pixel explosions when enemies die",
          ].map((v) => (
            <li key={v} className="flex items-center gap-2 text-xs">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-chart-3" />
              {v}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}

function AudioSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// AUDIO_ENGINE"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Audio Design</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <SectionCard title="Music" accentColor="primary">
          <ul className="space-y-1">
            {[
              "Synthwave / electronic soundtrack",
              "Music distorts as corruption rises",
              "Boss music remixes the main theme",
              "Music syncs with jumps and dashes",
              "Each sector has unique ambient layers",
            ].map((a) => (
              <li key={a} className="flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {a}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Sound Effects" accentColor="accent">
          <ul className="space-y-1">
            {[
              "Glitch sound effects on shifts",
              "Heartbeat bass when corruption is high",
              "Voice whispers from the system",
              "Digital crunch on enemy kills",
              "CRT buzz at low health",
            ].map((a) => (
              <li key={a} className="flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {a}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}

function ProgressionSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// PROGRESSION_TREE"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Progression System</h2>

      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Instead of stat-based upgrades, progression is cosmetic and skill-based.
        Everything is earned through gameplay mastery.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { title: "Visual Skins", items: ["Corrupted Form", "Neon Ghost", "Wireframe Mode", "Pixel Classic", "Hologram"], color: "primary" },
          { title: "Glitch Colors", items: ["Cyan (Default)", "Magenta Shift", "Green Protocol", "Gold Standard", "White Noise"], color: "accent" },
          { title: "Music Tracks", items: ["Default Synth", "Lo-Fi Glitch", "Heavy Bass", "Ambient Whisper", "Chiptune Mode"], color: "green" },
          { title: "Difficulty Modes", items: ["Normal", "Hardcore Code", "Permadeath", "One Hit", "Chaos Protocol"], color: "yellow" },
        ].map((cat) => (
          <SectionCard key={cat.title} title={cat.title} accentColor={cat.color}>
            <ul className="space-y-1">
              {cat.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs">
                  <Trophy className="h-3 w-3 text-muted-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>
    </div>
  )
}

function SecretsSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// HIDDEN_PROTOCOLS"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Secrets & Meta</h2>

      <div className="space-y-4">
        <SectionCard title="Hidden Terminal Rooms" accentColor="primary">
          <p className="mb-2">
            Throughout levels, hidden rooms contain terminals where you can type real
            commands:
          </p>
          <div className="mt-3 space-y-1 rounded-sm bg-background p-3 font-mono text-xs">
            <p className="text-chart-3">
              {">"} <span className="text-foreground">help</span> - List available commands
            </p>
            <p className="text-chart-3">
              {">"} <span className="text-foreground">scan</span> - Reveal hidden items nearby
            </p>
            <p className="text-chart-3">
              {">"} <span className="text-foreground">restore</span> - Recover lost health data
            </p>
            <p className="text-chart-3">
              {">"} <span className="text-foreground">self_destruct</span> - ???
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Meta Ending System" accentColor="accent">
          <p className="mb-2">
            The game remembers everything about how you play and delivers a unique
            ending based on your behavior:
          </p>
          <ul className="space-y-1 text-xs">
            {[
              "How often you died",
              "Whether you used glitches too much",
              "Your average corruption level",
              "Time spent in Overclock mode",
              "Number of enemies killed vs. avoided",
              "Commands used most frequently",
            ].map((m) => (
              <li key={m} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {m}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}

function WildIdeasSection() {
  return (
    <div>
      <div className="mb-1 font-mono text-xs tracking-widest text-accent">
        {"// EXPERIMENTAL_PROTOCOLS"}
      </div>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Wild Ideas</h2>

      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        These are the boundary-pushing concepts that could elevate the game from great
        to legendary. Some are feasible, some are insane. All are worth exploring.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          "Level where you control two characters at once",
          "Level where the screen rotates 90 degrees",
          "Boss that deletes chunks of the level permanently",
          "Random fake achievements pop up to distract you",
          "Fake virus warning mid-game",
          "Controller vibration syncs with corruption level",
          "AI Rival that learns from your past runs",
          "Co-op mode where second player controls glitch shifts",
          "Level that plays a recording of your worst death on loop",
          "Easter egg where typing a secret code unlocks dev commentary",
        ].map((idea) => (
          <div
            key={idea}
            className="flex items-start gap-3 rounded-sm border border-border bg-card/30 p-3 text-sm text-muted-foreground"
          >
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
            {idea}
          </div>
        ))}
      </div>
    </div>
  )
}

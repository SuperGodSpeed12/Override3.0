"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Terminal, Gamepad2, FileText, Wrench, Menu, X } from "lucide-react"

const navItems = [
  { id: "landing", label: "HOME", icon: Terminal, href: "#landing" },
  { id: "game", label: "PLAY", icon: Gamepad2, href: "#game" },
  { id: "gdd", label: "GDD", icon: FileText, href: "#gdd" },
  { id: "editor", label: "EDITOR", icon: Wrench, href: "#editor" },
]

export function SiteNav({
  activeSection,
  onNavigate,
}: {
  activeSection: string
  onNavigate: (section: string) => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-primary neon-cyan"
        >
          <span className="text-accent">{">"}</span>
          <span>GL1TCH:OVERRIDE</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-xs tracking-wider transition-all",
                activeSection === item.id
                  ? "bg-primary/10 text-primary neon-cyan"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="text-muted-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id)
                setMobileOpen(false)
              }}
              className={cn(
                "flex w-full items-center gap-3 px-6 py-3 font-mono text-xs tracking-wider transition-all",
                activeSection === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

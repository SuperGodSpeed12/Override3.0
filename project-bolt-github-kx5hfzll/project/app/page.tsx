"use client"

import { useState } from "react"
import { SiteNav } from "@/components/site-nav"
import { LandingPage } from "@/components/landing-page"
import { GameView } from "@/components/game/game-view"
import { GameDesignDoc } from "@/components/gdd/game-design-doc"
import { LevelEditor } from "@/components/editor/level-editor"

export default function Page() {
  const [activeSection, setActiveSection] = useState("landing")

  return (
    <div className="min-h-screen bg-background">
      <SiteNav activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="pt-14">
        {activeSection === "landing" && (
          <LandingPage onPlay={() => setActiveSection("game")} />
        )}
        {activeSection === "game" && <GameView />}
        {activeSection === "gdd" && <GameDesignDoc />}
        {activeSection === "editor" && <LevelEditor />}
      </main>
    </div>
  )
}

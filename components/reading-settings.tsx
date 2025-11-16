"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, Type, Palette } from "lucide-react"

export default function ReadingSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(18)
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light")

  const applySettings = () => {
    // Apply settings to the article element
    const article = document.querySelector("article")
    if (article) {
      article.style.fontSize = `${fontSize}px`
      
      if (theme === "sepia") {
        article.style.backgroundColor = "#f4ecd8"
        article.style.color = "#5b4636"
      } else if (theme === "dark") {
        article.style.backgroundColor = "#1a1a1a"
        article.style.color = "#e0e0e0"
      } else {
        article.style.backgroundColor = "#ffffff"
        article.style.color = "#2B2B2B"
      }
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-surface rounded-xl shadow-xl border border-gray-200 p-6 mb-4 w-72">
          <h3 className="font-semibold text-textPrimary mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Reading Settings
          </h3>
          
          {/* Font Size */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-textSecondary mb-2">
              <Type className="h-4 w-4" />
              Font Size
            </label>
            <input
              type="range"
              min="14"
              max="24"
              value={fontSize}
              onChange={(e) => {
                setFontSize(Number(e.target.value))
                applySettings()
              }}
              className="w-full"
            />
            <div className="text-xs text-textSecondary mt-1">{fontSize}px</div>
          </div>

          {/* Theme */}
          <div>
            <label className="flex items-center gap-2 text-sm text-textSecondary mb-2">
              <Palette className="h-4 w-4" />
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["light", "sepia", "dark"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTheme(t)
                    applySettings()
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    theme === t
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-textPrimary hover:bg-gray-200"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full h-14 w-14 shadow-lg"
      >
        <Settings className="h-6 w-6" />
      </Button>
    </div>
  )
}
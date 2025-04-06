"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"


export default function SwitchTheme() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        {`${theme[0].toUpperCase()}${theme.slice(1)} Mode`}
      </div>
      <Switch onClick={() => toggleTheme()} />
    </div>
  )
}

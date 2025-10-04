"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="top-center"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#9333ea",         // purple background
          "--normal-text": "white",         // white text
          "--normal-border": "#7e22ce",     // darker purple border
          
          "--success-bg": "#9333ea",        // success toast bg purple
          "--success-text": "white",
          
          "--error-bg": "#9333ea",          // error toast bg purple
          "--error-text": "white",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

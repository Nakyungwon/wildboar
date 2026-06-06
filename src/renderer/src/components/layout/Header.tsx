import React from 'react'
import { Button } from '@renderer/components/ui/button'
import { cn } from '@renderer/lib/utils'

export interface HeaderProps {
  className?: string
  onThemeToggle?: () => void
}

export const Header: React.FC<HeaderProps> = ({ className, onThemeToggle }) => {
  return (
    <header
      className={cn(
        'border-b border-border bg-background px-6 py-4',
        'flex items-center justify-between',
        'dark:bg-slate-950 dark:border-slate-800',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground">WildBoar</h1>
        <p className="text-sm text-muted-foreground">와일드보어</p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onThemeToggle}
        className="dark:hover:bg-slate-800"
        aria-label="토글 테마"
        title="테마 토글"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </Button>
    </header>
  )
}

export default Header

import React, { ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'
import { Header, HeaderProps } from './Header'

export interface MainLayoutProps {
  children?: ReactNode
  className?: string
  contentClassName?: string
  sidebarClassName?: string
  showSidebar?: boolean
  showHeader?: boolean
  headerProps?: HeaderProps
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  contentClassName,
  sidebarClassName,
  showSidebar = true,
  showHeader = true,
  headerProps
}) => {
  return (
    <div
      className={cn(
        'flex h-screen w-full flex-col',
        'bg-background text-foreground',
        'dark:bg-slate-950 dark:text-slate-50',
        className
      )}
    >
      {/* Header */}
      {showHeader && <Header {...headerProps} />}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Optional */}
        {showSidebar && (
          <aside
            className={cn(
              'w-64 border-r border-border bg-muted/50',
              'overflow-y-auto',
              'dark:bg-slate-900 dark:border-slate-800',
              sidebarClassName
            )}
          >
            <nav className="space-y-2 p-4">{/* Sidebar content placeholder */}</nav>
          </aside>
        )}

        {/* Content Area */}
        <main
          className={cn(
            'flex-1 overflow-y-auto',
            'bg-background',
            'dark:bg-slate-950',
            contentClassName
          )}
        >
          {children || (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">내용이 여기에 표시됩니다</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default MainLayout

import React from 'react'
import { LayoutDashboard, History, Package, Users, Settings, Bell, Search, Plus } from 'lucide-react'
import { cn } from '../lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white text-notion-text font-sans">
      {/* Sidebar */}
      <aside className="w-64 notion-sidebar flex flex-col h-screen sticky top-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-notion-primary rounded flex items-center justify-center text-white text-[10px] font-bold">
              Q
            </div>
            <span className="font-semibold text-sm tracking-tight">Quartermaster</span>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto mt-2">
          <SidebarItem icon={<Search size={16} />} label="Search" />
          <SidebarItem icon={<History size={16} />} label="Updates" />
          <SidebarItem icon={<Settings size={16} />} label="Settings" />
          
          <div className="pt-4 pb-2 px-2">
            <p className="text-[11px] font-bold text-notion-muted uppercase tracking-wider">Workspace</p>
          </div>
          
          <SidebarItem icon={<LayoutDashboard size={16} />} label="Resolutions" active />
          <SidebarItem icon={<Package size={16} />} label="Inventory" />
          <SidebarItem icon={<Users size={16} />} label="Team" />
        </nav>

        <div className="p-4 border-t border-notion-border bg-notion-sidebar/50">
          <div className="flex items-center space-x-3 px-2 py-1.5 rounded hover:bg-notion-hover cursor-pointer transition-colors">
            <div className="w-5 h-5 rounded-full bg-orange-200 flex items-center justify-center text-[10px] font-bold text-orange-800">
              AN
            </div>
            <span className="text-xs font-medium">Armaan Nahata</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-11 border-b border-notion-border flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center space-x-2 text-xs text-notion-muted">
            <span>Resolutions</span>
            <span>/</span>
            <span className="text-notion-text">New Technician Update</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-ghost">Share</button>
            <button className="btn-ghost"><Bell size={16} /></button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-12 py-16">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <a
    href="#"
    className={cn(
      "flex items-center space-x-2 px-2 py-1.5 rounded transition-colors text-sm",
      active ? "bg-notion-hover text-notion-text font-medium" : "text-notion-text opacity-70 hover:opacity-100 hover:bg-notion-hover"
    )}
  >
    <span className="opacity-70">{icon}</span>
    <span>{label}</span>
  </a>
)

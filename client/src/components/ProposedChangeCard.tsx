import React from 'react'
import { MapPin, Wrench, CheckCircle2, Box, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import type { ProposedChange } from '../types'

interface ProposedChangeCardProps {
  change: ProposedChange
  onConfirm: () => void
  isConfirming?: boolean
}

export const ProposedChangeCard: React.FC<ProposedChangeCardProps> = ({ change, onConfirm, isConfirming }) => {
  const hasConflicts = change.validation.conflicts.length > 0

  // Format ISO time to a readable string
  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
      })
    } catch {
      return iso || '---'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white border notion-card p-0 overflow-hidden",
        hasConflicts ? "border-red-200 ring-1 ring-red-50" : ""
      )}
    >
      <div className="px-6 py-4 border-b border-notion-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {hasConflicts ? (
            <AlertCircle size={16} className="text-red-500" />
          ) : (
            <CheckCircle2 size={16} className="text-green-500" />
          )}
          <h3 className="text-sm font-semibold text-notion-text">Proposed Change</h3>
        </div>
        {hasConflicts && (
          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase tracking-tight">
            {change.validation.conflicts.length} Conflict{change.validation.conflicts.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <ChangeItem icon={<MapPin size={14} />} label="Location" value={change.location} />
          <ChangeItem icon={<Wrench size={14} />} label="Equipment" value={change.equipment} />
          <ChangeItem icon={<Box size={14} />} label="Action" value={change.action} />
          <ChangeItem icon={<Clock size={14} />} label="Time" value={formatTime(change.time)} />
        </div>
        
        <div className="pt-4 border-t border-notion-border/50">
          <p className="text-[11px] font-bold text-notion-muted uppercase tracking-wider mb-3">Required Parts</p>
          <div className="flex flex-wrap gap-2">
            {change.parts.map((part, idx) => (
              <span key={idx} className="px-2 py-1 bg-notion-sidebar border border-notion-border rounded text-xs text-notion-text">
                {part.name} <span className="text-notion-muted">×{part.quantity}</span>
              </span>
            ))}
          </div>
        </div>

        {hasConflicts && (
          <div className="pt-4 border-t border-notion-border/50">
            <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-2">Conflict Details</p>
            <ul className="space-y-1.5">
              {change.validation.conflicts.map((c, idx) => (
                <li key={idx} className="text-xs text-red-600 bg-red-50/50 px-3 py-2 rounded">
                  <span className="font-medium uppercase text-[10px] mr-1.5">[{c.type}]</span>
                  {c.detail}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="px-6 py-4 bg-notion-sidebar/50 border-t border-notion-border flex justify-between items-center">
        <button 
          onClick={() => alert('Manual editing would open a specialized search/entry modal here.')}
          className="text-[10px] font-bold text-notion-muted hover:text-notion-text uppercase tracking-widest transition-colors"
        >
          Request Manual Override
        </button>
        
        {!hasConflicts && (
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="btn-notion disabled:opacity-50 flex items-center space-x-2"
          >
            {isConfirming && <Loader2 size={14} className="animate-spin" />}
            <span>{isConfirming ? 'Saving...' : 'Confirm Changes'}</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}

const ChangeItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="space-y-1">
    <div className="flex items-center space-x-1.5 text-notion-muted">
      {icon}
      <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm font-medium text-notion-text pl-5">{value || "---"}</p>
  </div>
)

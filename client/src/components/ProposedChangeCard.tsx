import React from 'react'
import { MapPin, Wrench, CheckCircle2, Box, Clock, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export interface ProposedChange {
  location: string
  equipment: string
  action: string
  parts: string[]
  time: string
  hasConflict?: boolean
}

interface ProposedChangeCardProps {
  change: ProposedChange
  onConfirm: () => void
}

export const ProposedChangeCard: React.FC<ProposedChangeCardProps> = ({ change, onConfirm }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white border notion-card p-0 overflow-hidden",
        change.hasConflict ? "border-red-200 ring-1 ring-red-50" : ""
      )}
    >
      <div className="px-6 py-4 border-b border-notion-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {change.hasConflict ? (
            <AlertCircle size={16} className="text-red-500" />
          ) : (
            <CheckCircle2 size={16} className="text-green-500" />
          )}
          <h3 className="text-sm font-semibold text-notion-text">Proposed Change</h3>
        </div>
        {change.hasConflict && (
          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase tracking-tight">
            Conflict
          </span>
        )}
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <ChangeItem icon={<MapPin size={14} />} label="Location" value={change.location} />
          <ChangeItem icon={<Wrench size={14} />} label="Equipment" value={change.equipment} />
          <ChangeItem icon={<Box size={14} />} label="Action" value={change.action} />
          <ChangeItem icon={<Clock size={14} />} label="Time" value={change.time} />
        </div>
        
        <div className="pt-4 border-t border-notion-border/50">
          <p className="text-[11px] font-bold text-notion-muted uppercase tracking-wider mb-3">Required Parts</p>
          <div className="flex flex-wrap gap-2">
            {change.parts.map((part, idx) => (
              <span key={idx} className="px-2 py-1 bg-notion-sidebar border border-notion-border rounded text-xs text-notion-text">
                {part}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {!change.hasConflict && (
        <div className="px-6 py-4 bg-notion-sidebar/50 border-t border-notion-border flex justify-end">
          <button onClick={onConfirm} className="btn-notion">
            Confirm Changes
          </button>
        </div>
      )}
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

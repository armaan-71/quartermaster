import React from 'react'
import { ArrowRight, Zap, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ValidationConflict } from '../types'

interface ResolutionEngineProps {
  conflicts: ValidationConflict[]
  onSelect: (fix: NonNullable<ValidationConflict['fix']>) => void
}

export const ResolutionEngine: React.FC<ResolutionEngineProps> = ({ conflicts, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-red-50/30 border border-red-100 rounded-lg p-5 space-y-4"
    >
      <div className="flex items-center space-x-2 text-red-600">
        <Zap size={16} />
        <h4 className="text-xs font-bold uppercase tracking-wider">Resolution Engine</h4>
      </div>
      
      <p className="text-xs text-notion-text/70 leading-relaxed">
        {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''} detected. Review each issue and apply a suggested resolution:
      </p>
      
      <div className="space-y-2">
        {conflicts.map((conflict, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="px-3 py-2 bg-white/60 border border-red-100 rounded-md">
              <p className="text-xs text-red-700">
                <span className="font-bold uppercase text-[10px] mr-1">[{conflict.type}]</span>
                {conflict.detail}
              </p>
            </div>
            {conflict.fix && (
              <button
                onClick={() => onSelect(conflict.fix!)}
                className="w-full text-left p-3 hover:bg-white border border-transparent hover:border-notion-border rounded-lg group transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-notion-text truncate">Apply Fix</p>
                    <p className="text-[10px] text-notion-muted mt-0.5">{conflict.suggestedAction}</p>
                  </div>
                  <ArrowRight size={14} className="text-notion-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="pt-4 mt-2 border-t border-notion-border/50">
        <button className="flex items-center space-x-2 text-[10px] font-medium text-notion-muted hover:text-notion-text transition-colors">
          <RefreshCw size={12} />
          <span>REQUEST MANUAL OVERRIDE</span>
        </button>
      </div>
    </motion.div>
  )
}

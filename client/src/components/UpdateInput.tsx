import React, { useState, useRef, useEffect } from 'react'
import { Plus, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UpdateInputProps {
  onUpdate: (text: string) => void
  isParsing?: boolean
}

export const UpdateInput: React.FC<UpdateInputProps> = ({ onUpdate, isParsing }) => {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSend()
    }
  }

  const handleSend = () => {
    if (text.trim()) {
      onUpdate(text)
      setText('')
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  return (
    <div className="w-full border-t border-notion-border pt-4 mt-8">
      <div className="flex items-start space-x-3 group">
        <div className="mt-1 flex-shrink-0">
          <button className="w-6 h-6 rounded hover:bg-notion-hover flex items-center justify-center text-notion-muted transition-colors">
            <Plus size={18} />
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your field update here... (⌘ + Enter to send)"
            className="w-full bg-transparent border-none focus:ring-0 text-base leading-relaxed placeholder:text-notion-muted/50 resize-none overflow-hidden min-h-[1.5em]"
          />
          
          <AnimatePresence>
            {(text.trim() || isParsing) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between mt-4 overflow-hidden pt-2 border-t border-notion-border/50"
              >
                <div className="flex items-center space-x-4 text-[11px] text-notion-muted font-medium uppercase tracking-wider">
                  <span className="flex items-center space-x-1">
                    <Zap size={12} className="text-yellow-500" />
                    <span>AI Analysis Active</span>
                  </span>
                </div>
                
                <button
                  onClick={handleSend}
                  disabled={isParsing}
                  className="btn-notion disabled:opacity-50"
                >
                  {isParsing ? 'Processing...' : 'Send Update'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

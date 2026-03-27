import { useState } from 'react'
import { Layout } from './components/Layout'
import { UpdateInput } from './components/UpdateInput'
import { ProposedChangeCard } from './components/ProposedChangeCard'
import type { ProposedChange } from './components/ProposedChangeCard'
import { ResolutionEngine } from './components/ResolutionEngine'
import { AnimatePresence, motion } from 'framer-motion'

function App() {
  const [isParsing, setIsParsing] = useState(false)
  const [proposedChange, setProposedChange] = useState<ProposedChange | null>(null)

  const handleUpdate = (text: string) => {
    setIsParsing(true)
    setProposedChange(null)

    // Simulate AI Parsing
    setTimeout(() => {
      setIsParsing(false)
      
      const mockResult: ProposedChange = {
        location: "Ghent, NY",
        equipment: "Blue Industrial Boiler #42",
        action: "Swap pressure relief valve",
        parts: ["15mm Copper Valve", "Teflon Tape", "Pressure Gauge"],
        time: "Today, 2:00 PM (2 hours)",
        hasConflict: text.toLowerCase().includes('valve')
      }
      
      setProposedChange(mockResult)
    }, 1500)
  }

  const handleResolutionSelect = (alt: { name: string }) => {
    if (proposedChange) {
      setProposedChange({
        ...proposedChange,
        parts: proposedChange.parts.map(p => p.includes('15mm') ? alt.name : p),
        hasConflict: false
      })
    }
  }

  return (
    <Layout>
      <div className="space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-notion-text">
            New Update
          </h1>
          <p className="text-notion-muted text-lg max-w-xl">
            Technician activity log and automated resolution engine.
          </p>
        </header>

        <section className="space-y-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            {proposedChange ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-12"
              >
                <div className="lg:col-span-2">
                  <ProposedChangeCard 
                    change={proposedChange} 
                    onConfirm={() => alert('Update Committed!')} 
                  />
                </div>
                
                {proposedChange.hasConflict && (
                  <div className="space-y-6">
                    <ResolutionEngine 
                      alternatives={[
                        { id: '1', name: '15mm Steel Valve', reason: 'High durability sub' },
                        { id: '2', name: '12mm Brass + Adapter', reason: 'In local stock' }
                      ]}
                      onSelect={handleResolutionSelect}
                    />
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <UpdateInput onUpdate={handleUpdate} isParsing={isParsing} />
        </section>
      </div>
    </Layout>
  )
}

export default App

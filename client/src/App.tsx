import { useState } from 'react'
import { Layout } from './components/Layout'
import { UpdateInput } from './components/UpdateInput'
import { ProposedChangeCard } from './components/ProposedChangeCard'
import { ResolutionEngine } from './components/ResolutionEngine'
import { AnimatePresence, motion } from 'framer-motion'
import type { ProposedChange, ExtractedEntities, ValidationResult, ValidationConflict } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [isParsing, setIsParsing] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [proposedChange, setProposedChange] = useState<ProposedChange | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rawInput, setRawInput] = useState('')

  const handleUpdate = async (text: string) => {
    setIsParsing(true)
    setProposedChange(null)
    setError(null)
    setRawInput(text)

    try {
      // Step A: Parse with Groq
      const parseRes = await fetch(`${API_URL}/api/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!parseRes.ok) {
        const errData = await parseRes.json().catch(() => ({}))
        throw new Error(errData.error || `Parse failed (${parseRes.status})`)
      }

      const entities: ExtractedEntities = await parseRes.json()

      // Step B: Validate against Supabase
      const validateRes = await fetch(`${API_URL}/api/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entities),
      })

      if (!validateRes.ok) {
        const errData = await validateRes.json().catch(() => ({}))
        throw new Error(errData.error || `Validation failed (${validateRes.status})`)
      }

      const validation: ValidationResult = await validateRes.json()

      setProposedChange({ ...entities, validation })
    } catch (err) {
      console.error('Pipeline error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsParsing(false)
    }
  }

  const handleConfirm = async () => {
    if (!proposedChange) return
    setIsConfirming(true)
    setError(null)

    try {
      const { validation: _, ...entities } = proposedChange
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entities, rawInput }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Order creation failed (${res.status})`)
      }

      const data = await res.json()
      setProposedChange(null)
      setRawInput('')
      alert(`✅ Work order created! ID: ${data.id}`)
    } catch (err) {
      console.error('Confirm error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save order.')
    } finally {
      setIsConfirming(false)
    }
  }

  const handleResolutionSelect = async (fix: NonNullable<ValidationConflict['fix']>) => {
    if (!proposedChange) return

    const updatedParts = proposedChange.parts.map(p => {
      // If the fix is for a specific part name (or a close match), apply it
      const matchesName = fix.partName && (
        p.name.toLowerCase().includes(fix.partName.split(' ')[0].toLowerCase()) || 
        fix.partName.toLowerCase().includes(p.name.split(' ')[0].toLowerCase())
      );

      if (matchesName) {
        return {
          ...p,
          name: fix.partName ?? p.name,
          quantity: fix.quantity ?? p.quantity
        };
      }
      return p;
    });

    const updatedEntities: ProposedChange = {
      ...proposedChange,
      parts: updatedParts,
      time: fix.time ?? proposedChange.time
    }

    // Re-validate with updated parts
    try {
      setIsParsing(true); // Show parsing state while re-validating
      const { validation: _, ...entities } = updatedEntities
      const validateRes = await fetch(`${API_URL}/api/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entities),
      })

      if (validateRes.ok) {
        const validation: ValidationResult = await validateRes.json()
        setProposedChange({ ...entities, validation })
      } else {
        setProposedChange({
          ...updatedEntities,
          validation: { valid: true, conflicts: [] },
        })
      }
    } catch {
      setProposedChange({
        ...updatedEntities,
        validation: { valid: true, conflicts: [] },
      })
    } finally {
      setIsParsing(false);
    }
  }

  const hasConflicts = proposedChange && proposedChange.validation.conflicts.length > 0

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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between"
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold ml-4"
            >
              ✕
            </button>
          </motion.div>
        )}

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
                    onConfirm={handleConfirm}
                    isConfirming={isConfirming}
                  />
                </div>

                {hasConflicts && (
                  <div className="space-y-6">
                    <ResolutionEngine
                      conflicts={proposedChange.validation.conflicts}
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

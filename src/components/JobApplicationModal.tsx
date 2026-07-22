import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, User, Mail, FileText, CheckCircle, GraduationCap, Award } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface JobApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: string
  jobTitle: string
  schoolName: string
}

export default function JobApplicationModal({ isOpen, onClose, jobId, jobTitle, schoolName }: JobApplicationModalProps) {
  const [form, setForm] = useState({
    applicant_name: '',
    applicant_email: '',
    nysc_status: '',
    trcn_number: '',
    cover_letter: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nysc_status) {
      toast.error('Please select your NYSC status')
      return
    }
    setSubmitting(true)

    try {
      const { error } = await supabase.from('applications').insert({
        job_id: jobId,
        applicant_name: form.applicant_name,
        applicant_email: form.applicant_email,
        nysc_status: form.nysc_status as any,
        trcn_number: form.trcn_number || null,
        cover_letter: form.cover_letter || null,
        status: 'applied',
      })

      if (error) throw error

      toast.success('Application submitted successfully!')
      onClose()
      setForm({
        applicant_name: '',
        applicant_email: '',
        nysc_status: '',
        trcn_number: '',
        cover_letter: '',
      })
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-[10%] sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-50 overflow-y-auto rounded-2xl bg-white shadow-2xl border border-emerald-100/60"
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-emerald-100/50 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                  <Send className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-950">Apply for Position</h2>
                  <p className="text-xs text-emerald-600/60 line-clamp-1">{jobTitle} — {schoolName}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-emerald-50 transition-colors">
                <X className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-500" /> Full Name *
                </label>
                <input
                  required
                  value={form.applicant_name}
                  onChange={(e) => update('applicant_name', e.target.value)}
                  placeholder="e.g. Chinwe Okafor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" /> Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={form.applicant_email}
                  onChange={(e) => update('applicant_email', e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                />
              </div>

              {/* NYSC Status */}
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-500" /> NYSC Status *
                </label>
                <select
                  required
                  value={form.nysc_status}
                  onChange={(e) => update('nysc_status', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                >
                  <option value="">Select status</option>
                  <option value="Completed">Completed</option>
                  <option value="Exempted">Exempted</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>

              {/* TRCN Number */}
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-500" /> TRCN Number (optional)
                </label>
                <input
                  value={form.trcn_number}
                  onChange={(e) => update('trcn_number', e.target.value)}
                  placeholder="e.g. TRCN/NG/2023/12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" /> Cover Letter / Notes (optional)
                </label>
                <textarea
                  rows={4}
                  value={form.cover_letter}
                  onChange={(e) => update('cover_letter', e.target.value)}
                  placeholder="Tell us why you're a great fit for this role..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm font-bold hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-200/50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
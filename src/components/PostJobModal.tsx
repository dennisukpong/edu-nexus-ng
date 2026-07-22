import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Building2, MapPin, Briefcase, Currency, Clock, FileText, CheckCircle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

const NIGERIAN_STATES = [
  'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

interface PostJobModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PostJobModal({ isOpen, onClose }: PostJobModalProps) {
  const [form, setForm] = useState({
    title: '',
    organization_name: '',
    contact_email: '',
    institution_type: 'Secondary' as string,
    job_type: 'Full-time' as string,
    category: 'Teaching' as string,
    state: '',
    lga: '',
    salary_range: '',
    description: '',
    requirements: [''],
  })
  const [submitting, setSubmitting] = useState(false)

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const updateReq = (i: number, v: string) => {
    const r = [...form.requirements]
    r[i] = v
    setForm((f) => ({ ...f, requirements: r }))
  }

  const addReq = () => setForm((f) => ({ ...f, requirements: [...f.requirements, ''] }))
  const removeReq = (i: number) => {
    if (form.requirements.length > 1) {
      setForm((f) => ({ ...f, requirements: f.requirements.filter((_, idx) => idx !== i) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // 1. Upsert organization
      const { data: org, error: orgErr } = await supabase
        .from('organizations')
        .upsert({
          name: form.organization_name,
          institution_type: form.institution_type,
          state: form.state,
          lga: form.lga || null,
          contact_email: form.contact_email,
          verified: false,
        }, { onConflict: 'name', ignoreDuplicates: false })
        .select('id')
        .single()

      if (orgErr) throw orgErr

      // 2. Insert job
      const { error: jobErr } = await supabase
        .from('jobs')
        .insert({
          organization_id: org.id,
          title: form.title,
          job_type: form.job_type,
          category: form.category,
          state: form.state,
          lga: form.lga || null,
          salary_range: form.salary_range || null,
          description: form.description,
          requirements: form.requirements.filter((r) => r.trim()),
          status: 'open',
        })

      if (jobErr) throw jobErr

      toast.success('Job posted successfully!')
      onClose()
      setForm({
        title: '',
        organization_name: '',
        contact_email: '',
        institution_type: 'Secondary',
        job_type: 'Full-time',
        category: 'Teaching',
        state: '',
        lga: '',
        salary_range: '',
        description: '',
        requirements: [''],
      })
    } catch (err: any) {
      toast.error(err.message || 'Failed to post job')
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
            className="fixed inset-4 sm:inset-auto sm:top-[5%] sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-50 overflow-y-auto rounded-2xl bg-white shadow-2xl border border-emerald-100/60"
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-emerald-100/50 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-950">Post a Job Opening</h2>
                  <p className="text-xs text-emerald-600/60">Fill in the details below</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-emerald-50 transition-colors">
                <X className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1.5">Job Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. Senior Mathematics Teacher"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                />
              </div>

              {/* Organization & Contact */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1.5">School / Organization Name *</label>
                  <input
                    required
                    value={form.organization_name}
                    onChange={(e) => update('organization_name', e.target.value)}
                    placeholder="e.g. Lagos Preparatory School"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1.5">Contact Email *</label>
                  <input
                    required
                    type="email"
                    value={form.contact_email}
                    onChange={(e) => update('contact_email', e.target.value)}
                    placeholder="hr@school.edu.ng"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  />
                </div>
              </div>

              {/* Institution Type & Job Type */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1.5">Institution Type</label>
                  <select
                    value={form.institution_type}
                    onChange={(e) => update('institution_type', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  >
                    {['Primary', 'Secondary', 'Tertiary', 'EdTech'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1.5">Job Type</label>
                  <select
                    value={form.job_type}
                    onChange={(e) => update('job_type', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  >
                    {['Full-time', 'Part-time', 'Contract'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category & State */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  >
                    {['Teaching', 'Non-Teaching', 'Leadership'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1.5">State *</label>
                  <select
                    required
                    value={form.state}
                    onChange={(e) => update('state', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  >
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LGA & Salary */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1.5">LGA</label>
                  <input
                    value={form.lga}
                    onChange={(e) => update('lga', e.target.value)}
                    placeholder="e.g. Ikeja"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1.5">Salary Range</label>
                  <input
                    value={form.salary_range}
                    onChange={(e) => update('salary_range', e.target.value)}
                    placeholder="e.g. ₦350,000 – ₦500,000/mo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1.5">Job Description *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and ideal candidate..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-none"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1.5">Requirements</label>
                <div className="space-y-2">
                  {form.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={req}
                        onChange={(e) => updateReq(i, e.target.value)}
                        placeholder={`Requirement ${i + 1}`}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-emerald-200/70 bg-emerald-50/30 text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                      />
                      {form.requirements.length > 1 && (
                        <button type="button" onClick={() => removeReq(i)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-red-400 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addReq} className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-500 flex items-center gap-1.5 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add requirement
                </button>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Post Job Opening
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
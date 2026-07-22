import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, ArrowRight, Filter, Briefcase, Building2, Plus, Send, Star, CheckCircle, X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import PostJobModal from './PostJobModal'
import JobApplicationModal from './JobApplicationModal'

interface JobWithOrg {
  id: string
  title: string
  job_type: string
  category: string
  state: string
  lga: string | null
  salary_range: string | null
  description: string
  requirements: string[] | null
  status: string
  created_at: string | null
  organization_id: string
  organizations: {
    name: string
    logo_url: string | null
    verified: boolean | null
  } | null
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<JobWithOrg[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeType, setActiveType] = useState('All')
  const [showPostModal, setShowPostModal] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState<{ jobId: string; jobTitle: string; schoolName: string } | null>(null)
  const [expandedJob, setExpandedJob] = useState<string | null>(null)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`*, organizations(name, logo_url, verified)`)
        .eq('status', 'open')
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (err: any) {
      toast.error(err.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', ...new Set(jobs.map((j) => j.category))]
  const types = ['All', 'Full-time', 'Part-time', 'Contract']

  const filtered = jobs.filter((job) => {
    const matchCategory = activeCategory === 'All' || job.category === activeCategory
    const matchType = activeType === 'All' || job.job_type === activeType
    return matchCategory && matchType
  })

  const timeAgo = (dateStr: string | null) => {
    if (!dateStr) return 'Recently'
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  return (
    <section id="jobs" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-emerald-600">Opportunities</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-emerald-950">
            Featured Openings
          </h2>
          <p className="mt-3 text-emerald-700/60">
            Browse the latest teaching and education roles across Nigeria.
          </p>
        </motion.div>

        {/* Toolbar: Filters + Post Job */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-emerald-500" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200/50'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="w-px h-5 bg-emerald-200 mx-1" />
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeType === t
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200/50'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-400 transition-all shadow-md shadow-amber-200/40 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Post a Job
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-2xl border border-emerald-100/60 animate-pulse">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-emerald-100 rounded w-3/4" />
                    <div className="h-3 bg-emerald-50 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-emerald-50 rounded w-1/3" />
                  <div className="h-3 bg-emerald-50 rounded w-2/3" />
                </div>
                <div className="h-8 bg-emerald-50 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Job grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative p-5 rounded-2xl border border-emerald-100/60 bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/20 transition-all duration-300"
                >
                  {job.organizations?.verified && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/50 text-amber-700 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-emerald-950 text-sm leading-snug">{job.title}</h3>
                      <p className="text-xs text-emerald-600/70 mt-0.5">{job.organizations?.name || 'Unknown School'}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600/60">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.state}{job.lga ? `, ${job.lga}` : ''}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600/60">
                      <Clock className="w-3.5 h-3.5" />
                      {timeAgo(job.created_at)}
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {job.salary_range}
                      </div>
                    )}
                  </div>

                  {/* Expandable description */}
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mb-4 pt-3 border-t border-emerald-100/50"
                    >
                      <p className="text-xs text-emerald-700/70 leading-relaxed mb-3">{job.description}</p>
                      {job.requirements && job.requirements.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-emerald-800 mb-1.5">Requirements:</p>
                          <ul className="space-y-1">
                            {job.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[10px] text-emerald-600/70">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1 shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-emerald-100/50">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                      {job.job_type}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                      >
                        {expandedJob === job.id ? 'Less' : 'Details'}
                      </button>
                      <button
                        onClick={() => setShowApplyModal({
                          jobId: job.id,
                          jobTitle: job.title,
                          schoolName: job.organizations?.name || 'School',
                        })}
                        className="text-xs font-medium text-amber-600 hover:text-amber-500 transition-colors flex items-center gap-1"
                      >
                        Apply <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-emerald-700/50">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No openings match your filters</p>
            <p className="text-sm mt-1">Try adjusting your selection above.</p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="text-center mt-10">
            <a
              href="#all-jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              View All Openings <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Modals */}
      <PostJobModal isOpen={showPostModal} onClose={() => { setShowPostModal(false); loadJobs() }} />
      {showApplyModal && (
        <JobApplicationModal
          isOpen={!!showApplyModal}
          onClose={() => setShowApplyModal(null)}
          jobId={showApplyModal.jobId}
          jobTitle={showApplyModal.jobTitle}
          schoolName={showApplyModal.schoolName}
        />
      )}
    </section>
  )
}
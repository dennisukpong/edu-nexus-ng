import { motion } from 'framer-motion';
import { Search, MapPin, BadgeCheck, GraduationCap } from 'lucide-react';
import { TAGLINE } from '@/constants';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-emerald-200/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/60 border border-emerald-200/50 text-emerald-700 text-xs font-semibold tracking-wide mb-6">
              <BadgeCheck className="w-3.5 h-3.5" />
              Trusted by 2,500+ Nigerian Schools
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-emerald-950 leading-[1.1] tracking-tight">
              Find Your{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                Teaching Career
              </span>{' '}
              in Nigeria
            </h1>

            <p className="mt-5 text-lg text-emerald-800/60 max-w-lg leading-relaxed">
              {TAGLINE}. Whether you're a school looking for top talent or an educator seeking your next opportunity, we connect you with the best.
            </p>

            {/* Search bar */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Search for a role..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-emerald-200 bg-white/80 backdrop-blur-sm text-emerald-900 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Location..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-emerald-200 bg-white/80 backdrop-blur-sm text-emerald-900 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
                />
              </div>
              <button className="h-12 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-sm hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-200/50 hover:shadow-emerald-300/50 flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-emerald-700/60">
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                Verified schools
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                TRCN certified
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                Free for educators
              </span>
            </div>
          </motion.div>

          {/* Right: visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 border border-emerald-200/50 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-200/30 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    {/* Bento card 1 */}
                    <div className="col-span-2 bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-100/50 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-emerald-900">15,000+</p>
                          <p className="text-xs text-emerald-600/60">Teachers Placed</p>
                        </div>
                      </div>
                    </div>
                    {/* Bento card 2 */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-100/50 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-emerald-900">36</p>
                          <p className="text-xs text-emerald-600/60">States</p>
                        </div>
                      </div>
                    </div>
                    {/* Bento card 3 */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-emerald-100/50 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-emerald-900">98%</p>
                          <p className="text-xs text-emerald-600/60">Satisfied</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-amber-200/20 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
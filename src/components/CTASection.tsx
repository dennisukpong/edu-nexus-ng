import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { BRAND_NAME } from '@/constants';

export default function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-8 sm:p-12 lg:p-16 text-center overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-emerald-800/50 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-emerald-300" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to Transform{' '}
              <span className="text-emerald-300">Nigerian Education</span>?
            </h2>
            <p className="mt-4 text-emerald-200/70 text-lg max-w-lg mx-auto">
              Join thousands of educators and schools already building the future of learning in Nigeria.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-emerald-900 font-semibold text-sm hover:bg-emerald-50 transition-all shadow-lg shadow-emerald-950/20"
              >
                Find Teaching Jobs <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#schools"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-emerald-600/50 text-emerald-200 font-semibold text-sm hover:bg-emerald-800/30 transition-all"
              >
                Post a Job Opening <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <p className="mt-6 text-xs text-emerald-300/50">
              Free for educators. Premium plans for schools starting at ₦25,000/year.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
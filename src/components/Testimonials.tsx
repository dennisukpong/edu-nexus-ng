import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/data/mockData';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-emerald-600">Testimonials</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-emerald-950">
            Trusted by Educators & Schools
          </h2>
          <p className="mt-3 text-emerald-700/60">
            Hear from the community that makes EduTalent NG the leading education recruitment platform in Nigeria.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-emerald-100/60 hover:border-emerald-200/80 hover:shadow-lg hover:shadow-emerald-100/20 transition-all duration-300"
            >
              <Quote className="w-6 h-6 text-emerald-300 mb-3" />
              <p className="text-sm text-emerald-800/70 leading-relaxed mb-4 line-clamp-4">
                "{t.text}"
              </p>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3.5 h-3.5 ${
                      j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-emerald-200'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-100"
                />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">{t.name}</p>
                  <p className="text-xs text-emerald-600/60">{t.role}, {t.school}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
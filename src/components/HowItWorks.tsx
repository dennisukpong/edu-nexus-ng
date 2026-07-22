import { motion } from 'framer-motion';
import { UserPlus, Search, BadgeCheck } from 'lucide-react';
import { howItWorks } from '@/data/mockData';

const iconMap: Record<string, React.ReactNode> = {
  UserPlus: <UserPlus className="w-6 h-6" />,
  Search: <Search className="w-6 h-6" />,
  BadgeCheck: <BadgeCheck className="w-6 h-6" />,
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-emerald-600">Simple Process</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-emerald-950">
            How It Works
          </h2>
          <p className="mt-3 text-emerald-700/60">
            Three simple steps to connect educators with Nigeria's best schools.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {howItWorks.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative group"
            >
              <div className="p-6 lg:p-8 rounded-2xl bg-white border border-emerald-100/60 hover:border-emerald-200/80 hover:shadow-lg hover:shadow-emerald-100/20 transition-all duration-300">
                {/* Step number */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm mb-5">
                  {step.step}
                </div>
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                  {iconMap[step.icon]}
                </div>
                <h3 className="text-lg font-bold text-emerald-950 mb-2">{step.title}</h3>
                <p className="text-sm text-emerald-700/60 leading-relaxed">{step.description}</p>
              </div>
              {/* Connector line (desktop) */}
              {i < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-emerald-200" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
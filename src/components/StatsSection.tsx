import { motion } from 'framer-motion';
import { Building2, Users, MapPinned, BadgeCheck } from 'lucide-react';
import { stats } from '@/data/mockData';

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  MapPinned: <MapPinned className="w-6 h-6" />,
  BadgeCheck: <BadgeCheck className="w-6 h-6" />,
};

export default function StatsSection() {
  return (
    <section className="py-16 lg:py-20 bg-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800/30"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-800/50 flex items-center justify-center text-emerald-400">
                {iconMap[stat.icon]}
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</p>
              <p className="mt-1.5 text-sm text-emerald-300/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import { GraduationCap, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { BRAND_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '@/constants';

const footerLinks = {
  Platform: ['Find Jobs', 'Post a Job', 'For Schools', 'For Teachers', 'Pricing'],
  Company: ['About Us', 'Our Team', 'Careers', 'Blog', 'Press Kit'],
  Support: ['Help Center', 'Contact Us', 'FAQ', 'Community', 'Report Issue'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
};

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="text-lg font-bold text-white">{BRAND_NAME}</span>
            </a>
            <p className="text-sm text-emerald-300/60 max-w-xs leading-relaxed mb-6">
              Nigeria's leading educational talent recruitment marketplace, connecting exceptional educators with outstanding schools nationwide.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-emerald-300/50">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-emerald-300 transition-colors">{CONTACT_EMAIL}</a>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-300/50">
                <Phone className="w-4 h-4" />
                <a href={`tel:${CONTACT_PHONE}`} className="hover:text-emerald-300 transition-colors">{CONTACT_PHONE}</a>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-300/50">
                <MapPin className="w-4 h-4" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-emerald-300/50 hover:text-emerald-200 transition-colors flex items-center gap-1 group"
                    >
                      {link}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-emerald-300/40">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Made with ❤️ for Nigerian Education</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
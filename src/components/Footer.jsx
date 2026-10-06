import { useTranslation } from 'react-i18next';
import { Mail, MapPin, ArrowUp, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-white/10 bg-eo-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md">
          {/* About us */}
          <div className="eo-eyebrow mb-4">{t('footer.aboutTitle')}</div>
          <a
            href="https://github.com/Entropyorder"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 text-2xl font-semibold text-eo-ink tracking-tight hover:text-white transition-colors"
          >
            GitHub
            <ArrowUpRight className="w-5 h-5 text-eo-mute transition-all group-hover:text-eo-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Contact info */}
          <ul className="space-y-4 mt-10">
            <li className="flex items-center gap-3 text-eo-dim">
              <Mail className="w-4 h-4 text-eo-mute shrink-0" />
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                {[t('footer.email'), 'yx-su@entropyorder.net'].map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="hover:text-eo-ink transition-colors font-mono text-sm"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </li>
            <li className="flex items-start gap-3 text-eo-dim">
              <MapPin className="w-4 h-4 text-eo-mute shrink-0 mt-0.5" />
              <span className="text-sm">{t('footer.address')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-eo-mute tracking-wide">
            {t('footer.copyright')}
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-eo-dim hover:text-eo-ink transition-colors"
          >
            {t('footer.backToTop')} <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

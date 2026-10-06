import { useRef, Fragment } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, XCircle, ArrowUpRight } from 'lucide-react';
import { stagger, offset, duration } from '../animations/tokens.js';
import * as presets from '../animations/presets.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';
import { MethodologyImageStrip } from './MethodologyImageStrip.jsx';
import { DetailedPipeline } from './DetailedPipeline.jsx';
import { publicAsset } from '../utils/assets.js';

// Paper reference — editorial 行项（不是卡片）
function PaperRow({ paper, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.a
      ref={ref}
      href={paper.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, x: 16 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
      transition={{ duration: duration.normal, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex items-baseline gap-4 border-b border-white/[0.07] py-4 hover:bg-white/[0.02] transition-colors -mx-3 px-3"
    >
      <span className="font-mono text-[11px] text-eo-mute shrink-0 w-7">/{num}</span>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-eo-ink leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {paper.title}
        </h4>
        <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] text-eo-mute">
          <span className="truncate">{paper.authors}</span>
          <span className="flex-shrink-0">·</span>
          <span className="flex-shrink-0">{paper.venue}</span>
        </div>
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 text-eo-mute group-hover:text-eo-ink shrink-0 transition-colors" />
    </motion.a>
  );
}

export function ExpertDataValue() {
  const { t } = useTranslation();
  const rawPapers = t('expertData.pipeline.papers', { returnObjects: true });
  const papers = Array.isArray(rawPapers) ? rawPapers : [];
  const { getChildProps: getStepProps } = useScrollReveal(stagger.normal * 0.9);

  return (
    <section id="expert-data" className="relative py-28 overflow-hidden bg-eo-bg">
      {/* 点阵背景 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1.5px 1.5px, rgb(var(--eo-w) / 0.18) 1.5px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-white/10" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-white/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...presets.fadeUp(offset.medium)} className="mb-16">
          <div className="eo-eyebrow mb-6 inline-flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-eo-ink inline-block eo-pulse-dot" />
            {t('expertData.tag')}
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-eo-ink mb-5 leading-[1.1] tracking-[-0.03em] max-w-3xl">
            {t('expertData.title')}
          </h2>
          <p className="text-lg md:text-xl font-light text-eo-dim max-w-2xl leading-relaxed">
            {t('expertData.subtitle')}
          </p>
        </motion.div>

        {/* Stats — editorial 行式 */}
        {(() => {
          const rawStats = t('expertData.stats', { returnObjects: true });
          const stats = Array.isArray(rawStats) ? rawStats : [];
          return stats.length > 0 ? (
            <motion.div
              {...presets.fadeUp(offset.medium, duration.normal, 0.15)}
              className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.07] border border-white/10 mb-16"
            >
              {stats.map((stat, i) => (
                <div key={i} className="bg-eo-bg px-6 py-8">
                  <div className="font-mono text-3xl md:text-4xl font-semibold text-eo-ink tracking-tight">
                    {stat.value}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-eo-mute mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : null;
        })()}

        {/* Methodology Image Strip */}
        <MethodologyImageStrip />

        {/* Pipeline + Papers 两栏 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
          {/* Left: Pipeline */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="eo-eyebrow">{t('expertData.pipeline.heading')}</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <DetailedPipeline />

            {/* Expert vs Crowd — 行式对比，不是卡片 */}
            {(() => {
              const comp = t('expertData.comparison', { returnObjects: true });
              if (!comp || !comp.expertPoints) return null;
              return (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.07] border border-white/10">
                  <div className="bg-eo-bg p-7">
                    <div className="flex items-center gap-2 mb-5">
                      <Check className="w-4 h-4 text-good" strokeWidth={2.5} />
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-good">{comp.expertTitle}</span>
                    </div>
                    <ul className="space-y-3">
                      {comp.expertPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-eo-ink-2 font-light">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-good flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-eo-bg p-7">
                    <div className="flex items-center gap-2 mb-5">
                      <XCircle className="w-4 h-4 text-eo-mute" strokeWidth={2.5} />
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-eo-mute">{comp.crowdTitle}</span>
                    </div>
                    <ul className="space-y-3">
                      {comp.crowdPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-eo-mute line-through decoration-eo-mute/40 font-light">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-eo-mute flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right: Papers — editorial 行式索引 */}
          {papers.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="eo-eyebrow">{t('expertData.pipeline.papersLabel', 'Related Publications')}</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="border-t border-white/[0.07]">
                {papers
                  .filter((p) => !p.title?.includes('SCBench'))
                  .map((paper, i) => (
                    <PaperRow key={i} paper={paper} index={i} />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: offset.small }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: duration.normal, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 mx-auto max-w-3xl text-center"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-mono text-eo-mute text-sm">❝</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <p className="text-lg sm:text-xl font-light italic text-eo-dim leading-relaxed">
            “{t('expertData.pipeline.quote')}”
          </p>
        </motion.div>
      </div>
    </section>
  );
}

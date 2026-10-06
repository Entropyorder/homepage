import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { stagger, offset, duration } from '../animations/tokens.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';

function PipelineStep({ step, delay, isFinal, index }) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: offset.medium }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: duration.normal, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative grid grid-cols-[auto_1fr] gap-6 sm:gap-8 py-7 border-b border-white/[0.07] last:border-b-0 hover:bg-white/[0.015] transition-colors -mx-4 px-4 ${
        isFinal ? 'bg-white/[0.02]' : ''
      }`}
    >
      {/* 序号 */}
      <div className="flex flex-col items-center pt-1 w-10 shrink-0">
        <span className={`font-mono text-sm tracking-wider transition-colors ${
          isFinal ? 'text-good' : 'text-eo-mute group-hover:text-eo-dim'
        }`}>
          {num}
        </span>
        {!isFinal && <div className="w-px flex-1 bg-white/[0.07] mt-3" />}
      </div>

      {/* 内容 */}
      <div className="min-w-0 pt-0.5">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-eo-ink leading-snug tracking-[-0.01em]">
            {step.title}
          </h3>
          <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
            isFinal
              ? 'border-good/40 text-good'
              : step.type === 'ai'
                ? 'border-white/25 text-eo-ink-2'
                : step.type === 'human'
                  ? 'border-white/40 text-eo-ink'
                  : 'border-white/15 text-eo-dim'
          }`}>
            {step.badge}
          </span>
        </div>
        <p className="text-sm text-eo-dim leading-relaxed font-light max-w-3xl">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

export function DetailedPipeline() {
  const { t } = useTranslation();
  const rawSteps = t('expertData.pipeline.detailedSteps', { returnObjects: true });
  const steps = Array.isArray(rawSteps) ? rawSteps : [];
  const { getChildProps } = useScrollReveal(stagger.normal * 0.8);

  return (
    <div className="border-t border-white/10">
      {steps.map((step, i) => (
        <PipelineStep
          key={i}
          step={step}
          index={i}
          delay={getChildProps(i).delay}
          isFinal={i === steps.length - 1}
        />
      ))}
    </div>
  );
}

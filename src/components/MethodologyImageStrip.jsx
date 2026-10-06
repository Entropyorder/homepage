import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { stagger, offset, duration } from '../animations/tokens.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';
import { publicAsset } from '../utils/assets.js';

const METHODOLOGY_IMAGES = [
  { src: publicAsset('methodology/expert-tagging.png'), key: 'tagging' },
  { src: publicAsset('methodology/knowledge-graph.png'), key: 'graph' },
  { src: publicAsset('methodology/cross-review.png'), key: 'review' },
];

function MethodologyCard({ image, title, index, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offset.medium }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: duration.normal, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1"
    >
      <div className="group relative overflow-hidden border border-white/10 hover:border-white/25 transition-colors duration-300">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={image.src}
            alt={title}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700"
            loading="lazy"
          />
        </div>
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-medium text-eo-ink-2">
            {title}
          </h3>
          <span className="font-mono text-[10px] text-eo-mute">0{index + 1}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function MethodologyImageStrip() {
  const { t } = useTranslation();
  const rawImageTitles = t('expertData.methodologyImages', { returnObjects: true });
  const imageTitles = Array.isArray(rawImageTitles) ? rawImageTitles : [];
  const { getChildProps } = useScrollReveal(stagger.normal);

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row gap-6">
        {METHODOLOGY_IMAGES.map((img, i) => (
          <MethodologyCard
            key={img.key}
            image={img}
            title={imageTitles[i]?.title || ''}
            index={i}
            delay={getChildProps(i).delay}
          />
        ))}
      </div>
    </div>
  );
}

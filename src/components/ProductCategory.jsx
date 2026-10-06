import { motion } from 'framer-motion';
import { DatasetCard } from './DatasetCard.jsx';
import { offset, duration } from '../animations/tokens.js';

export function ProductCategory({ title, artifact: Artifact, datasets, direction, onViewDetail, index = 0 }) {
  const isLeft = direction === 'left';
  const sectionNum = String(index + 1).padStart(2, '0');

  return (
    <div className="py-16 md:py-24 border-t border-white/[0.07] first:border-t-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row：序号 + 标题 + 3D artifact */}
        <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-start lg:items-center gap-10 lg:gap-16 mb-12`}>
          <motion.div
            initial={{ opacity: 0, y: offset.medium }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: duration.normal, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2"
          >
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-sm text-eo-mute tracking-[0.3em]">
                /{sectionNum}
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <h3 className="font-display text-3xl md:text-5xl font-semibold text-eo-ink leading-[1.1] tracking-[-0.03em]">
              {title}
            </h3>
            <p className="mt-4 font-mono text-xs text-eo-mute uppercase tracking-[0.2em]">
              {datasets.length} datasets
            </p>
          </motion.div>

          {/* 3D artifact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: duration.slow, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-5/12"
          >
            <Artifact />
          </motion.div>
        </div>

        {/* Dataset 索引列表 */}
        <motion.div
          initial={{ opacity: 0, y: offset.medium }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: duration.normal, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-white/10"
        >
          {datasets.map((ds, i) => (
            <DatasetCard key={ds.id || ds.name} dataset={ds} index={i} onViewDetail={onViewDetail} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

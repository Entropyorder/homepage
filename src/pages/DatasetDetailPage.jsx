import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExternalLink, X } from 'lucide-react';
import { DATASET_CATEGORIES } from '../data/datasets.js';
import { OverlayShell } from '../components/OverlayShell.jsx';

function findDataset(id, t) {
  for (const cat of DATASET_CATEGORIES) {
    if (cat.datasets.includes(id)) {
      return {
        id,
        categoryKey: cat.key,
        ...t(`datasets.${id}`, { returnObjects: true }),
      };
    }
  }
  return null;
}

export function DatasetDetailPage({ onContactSample }) {
  const { id } = useParams();
  const { t } = useTranslation();
  const dataset = findDataset(id, t);

  return (
    <OverlayShell>
      {({ close }) => {
        if (!dataset || typeof dataset.name !== 'string') {
          return (
            <div className="p-12 text-center">
              <button
                onClick={close}
                className="absolute top-4 right-4 p-2 rounded-full text-eo-dim hover:text-eo-ink hover:bg-white/[0.06] transition-colors"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
              <h1 className="font-display text-2xl font-semibold mb-2 text-eo-ink">数据集未找到</h1>
              <Link to="/" className="text-eo-dim hover:text-eo-ink underline underline-offset-2">返回首页</Link>
            </div>
          );
        }

        const hasPaper = dataset.paper && dataset.paper.title;

        return (
          <div className="relative">
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 p-2 rounded-full
                bg-black/50 backdrop-blur border border-white/10
                text-eo-dim hover:text-eo-ink hover:bg-white/[0.08]
                transition-colors"
              aria-label="关闭"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="px-6 sm:px-10 pt-10 pb-6 border-b border-white/10">
              <div className="flex items-start justify-between gap-4 mb-3">
                <motion.h1
                  layoutId={`dataset-title-${id}`}
                  className="font-display text-2xl md:text-3xl font-semibold leading-tight text-eo-ink tracking-[-0.02em]"
                >
                  {dataset.name}
                </motion.h1>
                <span className="flex-shrink-0 mt-1 px-2.5 py-0.5 font-mono text-[11px] rounded-full
                  bg-white/[0.06] text-eo-ink-2 border border-white/15">
                  {dataset.scale}
                </span>
              </div>
              {dataset.tags && dataset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {dataset.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 text-xs rounded-full border border-white/15 text-eo-dim bg-white/[0.02]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8">
                <div className="space-y-8 min-w-0">
                  <section>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-eo-mute mb-3">
                      {t('products.detail.overview')}
                    </h3>
                    <p className="text-base text-eo-dim leading-relaxed font-light">
                      {dataset.brief || dataset.desc}
                    </p>
                  </section>

                  {dataset.structure && (
                    <section>
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-eo-mute mb-3">
                        {t('products.detail.dataStructure')}
                      </h3>
                      <div className="rounded-xl bg-black/60 border border-white/10 overflow-hidden">
                        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                          <span className="w-3 h-3 rounded-full bg-bad/70" />
                          <span className="w-3 h-3 rounded-full bg-warn/70" />
                          <span className="w-3 h-3 rounded-full bg-good/70" />
                          <span className="ml-3 text-xs text-eo-mute font-mono">sample.jsonl</span>
                        </div>
                        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                          <code className="text-eo-ink-2 font-mono whitespace-pre">
                            {dataset.structure}
                          </code>
                        </pre>
                      </div>
                    </section>
                  )}
                </div>

                {hasPaper && (
                  <aside>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-eo-mute mb-3">
                      {t('products.detail.relatedPaper')}
                    </h3>
                    <a
                      href={dataset.paper.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex flex-col rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] transition-all"
                    >
                      {dataset.paper.img && (
                        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                          <img
                            src={dataset.paper.img}
                            alt={dataset.paper.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-semibold text-sm text-eo-ink leading-snug mb-2 group-hover:text-white transition-colors line-clamp-3">
                          {dataset.paper.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-eo-mute">
                          <span className="truncate">{dataset.paper.authors}</span>
                          <span className="flex-shrink-0">·</span>
                          <span className="flex-shrink-0">{dataset.paper.venue}</span>
                          <ExternalLink className="w-3 h-3 ml-auto flex-shrink-0 text-eo-mute group-hover:text-eo-ink transition-colors" />
                        </div>
                      </div>
                    </a>
                  </aside>
                )}
              </div>

              {/* CTA */}
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => onContactSample?.(dataset)}
                  className="inline-flex items-center gap-2 rounded-lg bg-eo-ink text-eo-bg px-6 py-3 text-sm font-semibold hover:bg-eo-ink-2 transition-all"
                >
                  {t('products.detail.contactSample')}
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </OverlayShell>
  );
}

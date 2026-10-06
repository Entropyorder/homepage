import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, Image, Video, AudioLines, ArrowUpRight, X } from 'lucide-react';
import { SampleDownload } from './SampleDownload.jsx';

const MODALITY_META = {
  text: { Icon: FileText },
  image: { Icon: Image },
  video: { Icon: Video },
  audio: { Icon: AudioLines },
};

function getProductionBadgeStyle(prod) {
  if (prod.includes('专家') || prod.includes('Expert')) {
    return 'border-warn/40 text-warn/90';
  }
  if (prod.includes('人工') || prod.includes('Human')) {
    return 'border-white/30 text-eo-ink-2';
  }
  return 'border-white/15 text-eo-dim';
}

export function DatasetCard({ dataset, index }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);

  const hasPaper = dataset.paper && dataset.paper.title;
  const num = String((index ?? 0) + 1).padStart(2, '0');

  // Esc 关闭 + 打开时锁定背景滚动
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.body.classList.add('overflow-hidden');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleRequestSample = () => {
    const isZh = lang.startsWith('zh');
    const subject = encodeURIComponent(
      isZh ? `[数据集咨询] ${dataset.name}` : `[Dataset Inquiry] ${dataset.name}`
    );
    const body = encodeURIComponent(
      isZh
        ? `熵基秩序团队您好，\n\n我对以下数据集感兴趣：\n\n数据集：${dataset.name}\n简介：${dataset.desc || ''}\n标签：${(dataset.tags || []).join('、')}\n生产方式：${(dataset.production || []).join('、')}\n存量：${dataset.inventory || ''}\n\n请提供样例数据及更多信息。\n\n此致\n[您的姓名]\n[您的单位]`
        : `Dear EntropyOrder Team,\n\nI am interested in the following dataset:\n\nDataset: ${dataset.name}\nDescription: ${dataset.desc || ''}\nTags: ${(dataset.tags || []).join(', ')}\nProduction Method: ${(dataset.production || []).join(', ')}\nInventory: ${dataset.inventory || ''}\n\nPlease provide a sample and further details.\n\nBest regards,\n[Your Name]\n[Your Organization]`
    );
    window.open(`mailto:jscott2402@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <>
      {/* ── Editorial 行项 ── */}
      <div className="group relative border-b border-white/[0.07] transition-colors duration-300 hover:bg-white/[0.025]">
        <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-5 sm:gap-8 px-2 sm:px-4 py-5">
          {/* 序号 */}
          <div className="font-mono text-xs text-eo-mute tracking-wider pt-1 w-8 shrink-0 transition-colors group-hover:text-eo-dim">
            /{num}
          </div>

          {/* 主内容 */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h3 className="font-display text-lg sm:text-xl font-semibold text-eo-ink leading-snug tracking-[-0.01em] group-hover:text-white transition-colors">
                {dataset.name}
              </h3>
              <span className="font-mono text-[11px] text-eo-mute">{dataset.scale}</span>
            </div>
            <p className="text-sm text-eo-dim mt-2 leading-relaxed font-light line-clamp-2 max-w-3xl">
              {dataset.desc}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 items-center">
              <div className="flex flex-wrap gap-1.5">
                {(dataset.tags || []).map((tag, idx) => (
                  <span key={idx} className="font-mono text-[11px] text-eo-mute">
                    #{tag}
                  </span>
                ))}
              </div>
              {(dataset.modalities || []).length > 0 && (
                <div className="flex items-center gap-1.5 ml-auto">
                  {(dataset.modalities || []).map((mod, idx) => {
                    const meta = MODALITY_META[mod];
                    const Icon = meta?.Icon;
                    return Icon ? (
                      <span key={idx} className="text-eo-mute group-hover:text-eo-dim transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 右侧箭头 — 点击弹出详情 */}
          <div className="shrink-0 self-center">
            <button
              onClick={() => setOpen(true)}
              aria-label={`${dataset.name} ${t('products.detail.overview', 'details')}`}
              className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-eo-mute hover:text-eo-ink hover:border-white/40 hover:bg-white/[0.06] cursor-pointer transition-all duration-300 group-hover:text-eo-dim group-hover:border-white/25"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* hover 左侧指示条 */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-eo-ink scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
      </div>

      {/* ── 居中详情模态 via Portal ── */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="dataset-modal"
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* 遮罩 */}
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />

              {/* 面板 */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={dataset.name}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-xl bg-eo-bg-2 border border-white/15 shadow-[0_32px_120px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden max-h-[85vh]"
              >
                {/* 关闭按钮 */}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full border border-white/15 bg-eo-bg-2/80 backdrop-blur flex items-center justify-center text-eo-mute hover:text-eo-ink hover:border-white/40 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-white/10 shrink-0 pr-14">
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h4 className="font-display text-xl font-semibold text-eo-ink tracking-[-0.01em]">
                      {dataset.name}
                    </h4>
                    <span className="shrink-0 font-mono text-[11px] text-eo-mute">
                      {dataset.scale}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                    {dataset.tags.map((tag, idx) => (
                      <span key={idx} className="font-mono text-[11px] text-eo-mute">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  {(dataset.production && dataset.production.length > 0) && (
                    <div className="flex flex-wrap gap-2 items-center">
                      {dataset.production.map((p) => (
                        <span key={p} className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border ${getProductionBadgeStyle(p)}`}>
                          {p}
                        </span>
                      ))}
                      {(dataset.modalities || []).map((mod, idx) => {
                        const meta = MODALITY_META[mod];
                        const Icon = meta?.Icon;
                        return (
                          <span key={`mod-${idx}`} className="inline-flex items-center gap-1 text-eo-mute">
                            {Icon && <Icon className="w-3.5 h-3.5" />}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Scrollable body */}
                <div className="p-6 overflow-y-auto flex-1 min-h-0">
                  <div className="space-y-6">
                    <section>
                      <h5 className="font-mono text-[10px] uppercase tracking-[0.2em] text-eo-mute mb-2.5">
                        {t('products.detail.overview')}
                      </h5>
                      <p className="text-sm text-eo-dim leading-relaxed font-light">
                        {dataset.brief || dataset.desc}
                      </p>
                    </section>

                    {dataset.structure && (
                      <section>
                        <h5 className="font-mono text-[10px] uppercase tracking-[0.2em] text-eo-mute mb-2.5">
                          {t('products.detail.dataStructure')}
                        </h5>
                        <div className="bg-black/60 border border-white/10 overflow-hidden">
                          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
                            <span className="w-2 h-2 rounded-full bg-bad/70" />
                            <span className="w-2 h-2 rounded-full bg-warn/70" />
                            <span className="w-2 h-2 rounded-full bg-good/70" />
                            <span className="ml-2.5 text-[10px] text-eo-mute font-mono">sample.jsonl</span>
                          </div>
                          <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
                            <code className="text-eo-ink-2 font-mono whitespace-pre">
                              {dataset.structure}
                            </code>
                          </pre>
                        </div>
                      </section>
                    )}
                  </div>

                  {hasPaper && (
                    <section className="mt-6 pt-6 border-t border-white/10"><h5 className="font-mono text-[10px] uppercase tracking-[0.2em] text-eo-mute mb-3">
                        {t('products.detail.relatedPaper')}
                      </h5>
                      <a
                        href={dataset.paper.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group/paper flex gap-4 p-3 -mx-3 border border-transparent hover:border-white/15 hover:bg-white/[0.03] transition-all"
                      >
                        {dataset.paper.img && (
                          <div className="relative shrink-0 w-20 overflow-hidden" style={{ aspectRatio: '4/3' }}>
                            <img
                              src={dataset.paper.img}
                              alt={dataset.paper.title}
                              className="w-full h-full object-cover opacity-75 group-hover/paper:opacity-100 transition-opacity"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h6 className="font-semibold text-sm text-eo-ink leading-snug mb-1.5 line-clamp-3">
                            {dataset.paper.title}
                          </h6>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-eo-mute">
                            <span className="truncate">{dataset.paper.authors}</span>
                            <span className="flex-shrink-0">·</span>
                            <span className="flex-shrink-0">{dataset.paper.venue}</span>
                          </div>
                        </div>
                      </a>
                    </section>
                  )}

                  {/* 样例下载 — 密码解锁 */}
                  <SampleDownload datasetId={dataset.id} />
                </div>

                {/* Request Sample Button */}
                <div className="shrink-0 border-t border-white/10 p-4 bg-eo-bg-2">
                  <button
                    onClick={handleRequestSample}
                    className="w-full inline-flex items-center justify-center gap-2 bg-eo-ink text-eo-bg px-5 py-2.5 text-sm font-semibold hover:bg-eo-ink-2 transition-all"
                  >
                    {t('products.detail.contactSample')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

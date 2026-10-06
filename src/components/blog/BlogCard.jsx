import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { localizedTitle, localizedSummary, postPath } from '../../content/blog/index.js';

export function BlogCard({ post, index }) {
  const { i18n } = useTranslation();
  const lng = i18n.language;
  const title = localizedTitle(post, lng);
  const summary = localizedSummary(post, lng);
  const num = String((index ?? 0) + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index ?? 0) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={postPath(post)}
        className="group relative grid grid-cols-[auto_1fr_auto] items-baseline gap-5 sm:gap-8
          border-b border-white/[0.07] px-2 sm:px-4 py-7
          hover:bg-white/[0.025] transition-colors duration-300"
      >
        {/* 序号 */}
        <div className="font-mono text-xs text-eo-mute tracking-wider pt-1 w-8 shrink-0 transition-colors group-hover:text-eo-dim">
          /{num}
        </div>

        {/* 主内容 */}
        <div className="min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <span className="font-mono text-[11px] text-eo-mute">{post.date}</span>
            {post.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="font-mono text-[10px] uppercase tracking-wider text-eo-mute">
                · {tag}
              </span>
            ))}
          </div>
          <motion.h3
            layoutId={`blog-title-${post.slug}`}
            className="font-display text-xl sm:text-2xl font-semibold text-eo-ink leading-snug tracking-[-0.015em] group-hover:text-white transition-colors"
          >
            {title}
          </motion.h3>
          <p className="text-sm text-eo-dim mt-2.5 leading-relaxed font-light line-clamp-2 max-w-2xl">
            {summary}
          </p>
        </div>

        {/* 右侧箭头 */}
        <div className="shrink-0 self-center">
          <div className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-eo-mute group-hover:text-eo-ink group-hover:border-white/40 group-hover:bg-white/[0.04] transition-all duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* hover 左侧指示条 */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-eo-ink scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
      </Link>
    </motion.div>
  );
}

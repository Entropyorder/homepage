import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { offset } from '../animations/tokens.js';
import * as presets from '../animations/presets.js';
import { BlogCard } from '../components/blog/BlogCard.jsx';
import { PageTechBackdrop } from '../components/PageTechBackdrop.jsx';
import { loadPosts } from '../content/blog/index.js';

export function BlogListPage() {
  const { t } = useTranslation();
  const posts = loadPosts();

  return (
    <section id="blog" className="relative min-h-screen bg-eo-bg pt-14">
      {/* Header */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-white/10 overflow-hidden">
        <PageTechBackdrop />
        <motion.div {...presets.fadeUp(offset.medium)} className="relative">
          <div className="eo-eyebrow mb-4">Blog · Index</div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-eo-ink tracking-[-0.035em] leading-[1.05]">
            {t('blog.title')}
          </h1>
          <p className="text-eo-dim mt-4 font-light max-w-xl text-lg">
            {t('blog.subtitle')}
          </p>
          <div className="mt-6 font-mono text-xs text-eo-mute">
            {String(posts.length).padStart(2, '0')} entries
          </div>
        </motion.div>
      </div>

      {/* Index list */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24">
        {posts.length === 0 ? (
          <div className="text-center text-eo-mute py-24 font-mono text-sm">暂无博客</div>
        ) : (
          <div className="border-t border-white/[0.07]">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

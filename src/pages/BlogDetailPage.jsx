import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { findPostBySlug, getAdjacentPosts, localizedTitle, postPath } from '../content/blog/index.js';
import { MarkdownBody } from '../components/blog/MarkdownBody.jsx';

/** 按 slug 渲染对应 blog（统一走 BlogArticle / Markdown）。 */
export function BlogPostView({ slug }) {
  const { i18n } = useTranslation();
  const lng = i18n.language;
  return <BlogArticle slug={slug} lng={lng} />;
}

export function BlogDetailPage() {
  const { slug } = useParams();
  return <BlogPostView slug={slug} />;
}

function BlogArticle({ slug, lng }) {
  const navigate = useNavigate();
  const post = findPostBySlug(slug);
  const { newer, older } = getAdjacentPosts(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-eo-bg pt-14 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold mb-4 text-eo-ink">文章未找到</h1>
          <Link to="/blog" className="text-eo-dim hover:text-eo-ink underline underline-offset-2">
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  const title = localizedTitle(post, lng);

  return (
    <div className="min-h-screen bg-eo-bg pt-14">
      {/* 返回 */}
      <div className="mx-auto max-w-3xl px-6 sm:px-10 pt-8">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 font-mono text-xs text-eo-mute hover:text-eo-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          返回博客
        </button>
      </div>

      {/* Cover */}
      {post.cover && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl px-6 sm:px-10 mt-8"
        >
          <img
            src={post.cover}
            alt={title}
            className="w-full aspect-[21/9] object-cover opacity-90 border border-white/10"
          />
        </motion.div>
      )}

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
        {/* Tags + date */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-eo-mute mb-4">
          <span>{post.date}</span>
          {post.tags?.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded border border-white/15 text-eo-dim">
              {tag}
            </span>
          ))}
          {post.readingMinutes != null && (
            <span className="ml-auto">{post.readingMinutes} 分钟阅读</span>
          )}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-8 text-eo-ink tracking-[-0.02em]"
        >
          {title}
        </motion.h1>

        <MarkdownBody content={post.rawContent} post={post} />

        {/* Prev / Next */}
        {(newer || older) && (
          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between gap-4">
            {newer ? (
              <Link
                to={postPath(newer)}
                className="flex items-center gap-3 text-eo-dim hover:text-eo-ink transition-colors max-w-[45%]"
              >
                <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-eo-mute">较新一篇</div>
                  <div className="font-medium truncate">{localizedTitle(newer, lng)}</div>
                </div>
              </Link>
            ) : <div />}
            {older ? (
              <Link
                to={postPath(older)}
                className="flex items-center gap-3 text-right text-eo-dim hover:text-eo-ink transition-colors max-w-[45%]"
              >
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-eo-mute">较旧一篇</div>
                  <div className="font-medium truncate">{localizedTitle(older, lng)}</div>
                </div>
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </Link>
            ) : <div />}
          </div>
        )}
      </article>
    </div>
  );
}

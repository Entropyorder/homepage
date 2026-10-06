import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { ContactModal } from './components/ContactModal.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { BlogListPage } from './pages/BlogListPage.jsx';
import { BlogDetailPage, BlogPostView } from './pages/BlogDetailPage.jsx';
import { DatasetDetailPage } from './pages/DatasetDetailPage.jsx';
import { ProductsPage } from './pages/ProductsPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import './App.css';

/**
 * Decide the "background" location for an overlay route.
 * - When a user clicked from the list, state.backgroundLocation is already set.
 * - When they landed directly on /blog/:slug (shared link / refresh),
 *   synthesize a background: blog list for /blog/*, home for /datasets/*.
 */
function resolveBackgroundLocation(location) {
  const recorded = location.state?.backgroundLocation;
  if (recorded) return recorded;

  const p = location.pathname;
  if (p.startsWith('/blog/')) {
    return { pathname: '/blog', search: '', hash: '', state: null, key: 'bg-blog' };
  }
  if (p.startsWith('/datasets/')) {
    return { pathname: '/', search: '', hash: '', state: { scrollTo: 'products' }, key: 'bg-products' };
  }
  return null;
}

function isOverlayPath(pathname) {
  return pathname.startsWith('/datasets/');
}

// 每篇 blog 的独立短路径（/blog/N，直接渲染，不重定向）
const BLOG_SHORTCUTS = {
  '/blog/1': 'expert-annotation-pipeline',
  '/blog/2': 'survey-difficult-qa-synthesis',
  '/blog/3': 'entropy-order-demo',
  '/blog/4': 'ai4ss4ai',
  '/blog/5': 'scicode-rsi-project',
};

/**
 * 每次导航切换（含点击当前页链接）都滚回页面顶部。
 * 跳过 overlay 路由（/blog/:slug、/datasets/:id）—— 它们有自己的滚动容器。
 */
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    if (isOverlayPath(location.pathname)) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.key]);
  return null;
}

function App() {
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const [contactDataset, setContactDataset] = useState(null);

  const overlayActive = isOverlayPath(location.pathname);
  const backgroundLocation = overlayActive ? resolveBackgroundLocation(location) : null;
  const routeLocation = backgroundLocation || location;

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <div className="min-h-screen bg-eo-bg text-eo-ink">
        <ScrollToTop />
        <Navbar />

        {/* Background routes — always rendered (using bg location during overlay) */}
        <div
          aria-hidden={overlayActive ? 'true' : undefined}
          style={{
            transition: 'filter 250ms ease-out',
            filter: overlayActive ? 'brightness(0.65) saturate(0.9)' : 'none',
            pointerEvents: overlayActive ? 'none' : 'auto',
          }}
        >
          <Routes location={routeLocation}>
            <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
            <Route path="/products" element={<ErrorBoundary><ProductsPage /></ErrorBoundary>} />
            <Route path="/blog" element={<ErrorBoundary><BlogListPage /></ErrorBoundary>} />
            {/* AI4SS4AI 已迁入 blog —— 旧链接重定向 */}
            <Route path="/ai4ss" element={<Navigate to="/blog/4" replace />} />
            {/* 每篇 blog 的独立短路径 —— 直接渲染，URL 保持 /blogN */}
            {Object.entries(BLOG_SHORTCUTS).map(([path, slug]) => (
              <Route
                key={path}
                path={path}
                element={<ErrorBoundary><BlogPostView slug={slug} /></ErrorBoundary>}
              />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Footer />
        </div>

        {/* Overlay routes — rendered on top, animated mount/unmount */}
        <AnimatePresence mode="wait">
          {overlayActive && (
            <Routes location={location} key={location.pathname}>
              <Route
                path="/datasets/:id"
                element={<ErrorBoundary><DatasetDetailPage onContactSample={setContactDataset} /></ErrorBoundary>}
              />
            </Routes>
          )}
        </AnimatePresence>

        {contactDataset && (
          <ContactModal dataset={contactDataset} onClose={() => setContactDataset(null)} />
        )}
      </div>
    </MotionConfig>
  );
}

export default App;

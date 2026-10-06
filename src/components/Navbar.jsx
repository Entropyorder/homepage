import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { spring } from '../animations/tokens.js';
import logoUrl from '/logo.png';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { currentLang } from '../i18n.js';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(typeof window !== 'undefined' ? window.scrollY : 0);
  const toggleRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { key: 'home', label: t('nav.home'), path: '/' },
    { key: 'products', label: t('nav.products'), path: '/products' },
    { key: 'blog', label: t('nav.blog'), path: '/blog' },
  ];

  const isScrolled = scrollY > 60;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      toggleRef.current?.focus();
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [mobileOpen]);

  // 规范语言：'zh' | 'en'（i18n.language 可能是 zh-CN / en-US）
  const lang = currentLang();
  const toggleLang = () => {
    i18n.changeLanguage(lang === 'zh' ? 'en' : 'zh');
  };

  const isActive = (item) => location.pathname === item.path;

  // 首页 hero 区不显示导航栏（logo 重复）—— 鼠标移到顶部 / 滚过 hero 后拉出
  const isHome = location.pathname === '/';
  const [peekZone, setPeekZone] = useState(false);
  const hideNav = isHome && !isScrolled && !peekZone && !mobileOpen;

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate(item.path);
  };

  return (
    <>
      {/* 顶部隐形触发区 — 首页未滚动时悬停拉出导航（z 低于导航自身） */}
      {isHome && !isScrolled && !peekZone && (
        <div
          className="fixed top-0 left-0 right-0 h-16 z-40"
          onMouseEnter={() => setPeekZone(true)}
          aria-hidden="true"
        />
      )}
      <nav
        onMouseLeave={() => setPeekZone(false)}
        className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-500 ${
          hideNav ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        } ${
          isScrolled
            ? 'backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.07]'
            : 'backdrop-blur-md border-b border-white/[0.04]'
        }`}
        style={{
          backgroundColor: isScrolled
            ? 'rgb(var(--nav-bg) / var(--nav-alpha-scrolled))'
            : 'rgb(var(--nav-bg) / var(--nav-alpha-top))',
        }}
      >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e, navItems[0])}
          className="flex items-center gap-2.5 group"
        >
          <img
            src={logoUrl}
            alt="EntropyOrder"
            className="h-6 w-auto transition-opacity group-hover:opacity-80"
            style={{ filter: 'var(--logo-filter)' }}
          />
          <span className="font-semibold text-sm text-eo-ink tracking-tight">
            熵基秩序
            <span className="hidden sm:inline text-eo-mute font-normal"> · EntropyOrder</span>
          </span>
        </a>

        {/* Desktop nav */}
        {!isMobile && (
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.path}
                onClick={(e) => handleNavClick(e, item)}
                aria-current={isActive(item) ? 'page' : undefined}
                className={`relative px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                  isActive(item) ? 'text-eo-ink' : 'text-eo-dim hover:text-eo-ink'
                }`}
              >
                {isActive(item) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md bg-white/[0.08] border border-white/10"
                    transition={{ type: 'spring', ...spring.heavy }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* Right controls */}
        <div className="flex items-center gap-1">
          {/* 主题切换（浅/深），一次点击即生效 */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
            title={theme === 'dark' ? '浅色模式' : '深色模式'}
            className="p-2 rounded-md text-eo-dim hover:text-eo-ink hover:bg-white/[0.06] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-[15px] h-[15px]" /> : <Moon className="w-[15px] h-[15px]" />}
          </button>
          {/* 语言切换 */}
          <button
            onClick={toggleLang}
            aria-label="Toggle language"
            className="px-2.5 py-1.5 rounded-md text-xs font-mono font-medium text-eo-dim hover:text-eo-ink hover:bg-white/[0.06] transition-colors min-w-[38px]"
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
          {isMobile && (
            <button
              ref={toggleRef}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-md text-eo-dim hover:text-eo-ink hover:bg-white/[0.06] transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && mobileOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="border-t border-white/10 backdrop-blur-xl px-4 py-4"
          style={{ backgroundColor: 'rgb(var(--nav-bg) / 0.95)' }}
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.path}
                onClick={(e) => handleNavClick(e, item)}
                aria-current={isActive(item) ? 'page' : undefined}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'bg-white/[0.08] text-eo-ink border border-white/10'
                    : 'text-eo-dim hover:text-eo-ink'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
    </>
  );
}

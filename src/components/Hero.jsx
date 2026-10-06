import { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import logoUrl from '/logo.png';
import { duration, offset } from '../animations/tokens.js';

/* ══════════════════════════════════════════════════════════
   科技感背景层
   ══════════════════════════════════════════════════════════ */

/** 透视网格 — 无缝循环流动（无地平线线、抗闪烁） */
function PerspectiveGrid() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 120]);
  const opacity = useTransform(scrollY, [0, 700], [1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[85vh] overflow-hidden"
      style={{
        y,
        opacity,
        perspective: '750px',
        maskImage: 'linear-gradient(to top, black 40%, transparent 92%)',
        WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 92%)',
      }}
    >
      <motion.div
        className="absolute left-1/2 bottom-[-30%] w-[300vw] h-[150%]"
        style={{
          x: '-50%',
          rotateX: 68,
          transformOrigin: 'center bottom',
          backgroundImage:
            'linear-gradient(rgb(var(--eo-w) / 0.085) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--eo-w) / 0.085) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          // 抗闪烁：GPU 合成 + 亚像素抗锯齿
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'background-position',
        }}
        animate={{ backgroundPositionY: ['0px', '80px'] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}

/** 漂浮粒子场 — 随滚动视差上移 */
function ParticleField({ count = 40 }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -160]);
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (i * 73.7) % 100,
        y: (i * 41.3) % 100,
        size: 1 + ((i * 7) % 3) * 0.6,
        dur: 6 + ((i * 13) % 9),
        delay: (i * 0.43) % 6,
        drift: 10 + ((i * 11) % 22),
      })),
    [count]
  );
  return (
    <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ y }}>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: '0 0 6px 1px rgb(var(--eo-w) / 0.45)',
          }}
          animate={{ y: [0, -p.drift, 0], opacity: [0.12, 0.7, 0.12] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  );
}

/** 角落 HUD 标记 */
function HudCorners() {
  const cls = 'absolute w-5 h-5 border-white/25';
  return (
    <div className="pointer-events-none absolute inset-6 md:inset-10 z-10 hidden sm:block">
      <span className={`${cls} top-0 left-0 border-t border-l`} />
      <span className={`${cls} top-0 right-0 border-t border-r`} />
      <span className={`${cls} bottom-0 left-0 border-b border-l`} />
      <span className={`${cls} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}

/** 3D Logo 舞台 — 悬浮自转 + 轨道环 + 滚动时大幅翻转后撤淡出 */
function LogoStage() {
  const { scrollY } = useScroll();
  // 加大 3D 翻转幅度，让旋转肉眼可见
  const rotateX = useTransform(scrollY, [0, 700], [0, 55]);
  const rotateY = useTransform(scrollY, [0, 700], [0, -40]);
  const scale = useTransform(scrollY, [0, 700], [1, 0.72]);
  const y = useTransform(scrollY, [0, 700], [0, -60]);

  return (
    <motion.div
      className="relative mb-9"
      style={{ y, perspective: 1200 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0, delay: 0.25 }}
    >
      {/* 中心辉光 — 脉动 */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgb(var(--eo-w) / 0.07) 0%, rgb(var(--eo-w) / 0.02) 40%, transparent 70%)',
        }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 轨道环 — 倾斜平面内反向旋转 */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full border border-dashed border-white/[0.14]"
        style={{ rotateX: 66 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute -top-[3px] left-1/2 w-1.5 h-1.5 rounded-full bg-white/70"
          style={{ boxShadow: '0 0 8px 2px rgb(var(--eo-w) / 0.5)' }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[480px] md:h-[480px] rounded-full border border-white/[0.06]"
        style={{ rotateX: 74 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute top-1/2 -right-[2px] w-1 h-1 rounded-full bg-white/50"
          style={{ boxShadow: '0 0 6px 1px rgb(var(--eo-w) / 0.4)' }}
        />
      </motion.div>

      {/* Logo — 常驻 3D 翻转 + 滚动联动（更大幅度） */}
      <motion.div
        className="relative"
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -10, 0], rotateZ: [0, 2, 0], rotateX: [0, 14, 0], rotateY: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.img
          src={logoUrl}
          alt="EntropyOrder"
          className="h-16 md:h-[76px] w-auto logo-glow mx-auto"
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </motion.div>
  );
}

/** 字符级 stagger 入场 */
function StaggeredTitle({ text, className }) {
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.45 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════ */

export function Hero() {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  // 滚动时标题上飘淡出（比 logo 更快，制造纵深）
  const titleY = useTransform(scrollY, [0, 600], [0, -70]);
  const titleOpacity = useTransform(scrollY, [0, 450], [1, 0]);

  const scrollToExpert = () => {
    const el = document.getElementById('expert-data');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-eo-bg"
    >
      {/* 顶部径向微光 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 42% at 50% 0%, rgb(var(--eo-w) / 0.055), transparent 65%)',
        }}
      />

      <PerspectiveGrid />
      <ParticleField />
      <HudCorners />

      {/* ── 内容 ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto"
        style={{ y: titleY, opacity: titleOpacity }}
      >
        {/* eyebrow — 极简，仅一条 hairline + mono 小字 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.normal, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="eo-eyebrow mb-10 flex items-center gap-3"
        >
          <span className="w-8 h-px bg-white/20" />
          ENTROPY · ORDER
          <span className="w-8 h-px bg-white/20" />
        </motion.div>

        {/* 3D Logo 舞台 */}
        <LogoStage />

        {/* 大标题 — 字符入场后字间距缓缓展开（高级感呼吸） */}
        <motion.h1
          className="font-display font-semibold leading-[1.02] text-[clamp(52px,9vw,118px)] text-eo-ink"
          initial={{ letterSpacing: '-0.06em' }}
          animate={{ letterSpacing: '-0.02em' }}
          transition={{ duration: 2.4, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <StaggeredTitle text="熵基秩序" />
        </motion.h1>

        {/* 微光扫过标题（一次性，低调） */}
        <motion.div
          className="pointer-events-none -mt-[clamp(52px,9vw,118px)] h-[clamp(52px,9vw,118px)] w-full max-w-[7em] overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-1/3"
            style={{
              background:
                'linear-gradient(100deg, transparent 20%, rgb(var(--eo-w) / 0.10) 50%, transparent 80%)',
              filter: 'blur(4px)',
            }}
            initial={{ x: '-120%' }}
            animate={{ x: '380%' }}
            transition={{ duration: 2.2, delay: 1.6, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* 副标题 — 唯一保留的一行点缀 */}
        <motion.p
          initial={{ opacity: 0, y: offset.medium }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow * 0.9, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 text-lg sm:text-xl md:text-2xl font-light text-eo-dim max-w-xl leading-relaxed tracking-[-0.01em]"
        >
          {t('hero.subtitle')}
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        onClick={scrollToExpert}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: duration.normal, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-eo-mute hover:text-eo-ink transition-colors group"
        aria-label="Scroll down"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-70 group-hover:opacity-100">
          {t('hero.scrollHint')}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
}

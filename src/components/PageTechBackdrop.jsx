import { motion } from 'framer-motion';

/**
 * PageTechBackdrop — 页面头部科技感背景
 * 仅在页头顶部区域渲染：透视网格 + 扫描光束 + 顶部辉光
 * 用法：放在页面 header 容器内（容器需 relative overflow-hidden）
 */
export function PageTechBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* 顶部径向辉光 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 50% 0%, rgb(var(--eo-w) / 0.05), transparent 70%)',
        }}
      />

      {/* 透视网格 — 从页头向下流动 */}
      <div
        className="absolute inset-x-0 top-0 h-full"
        style={{
          perspective: '700px',
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 95%)',
        }}
      >
        <motion.div
          className="absolute left-1/2 top-[-30%] w-[200vw] h-[160%]"
          style={{
            x: '-50%',
            rotateX: -58,
            transformOrigin: 'center top',
            backgroundImage:
              'linear-gradient(rgb(var(--eo-w) / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--eo-w) / 0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
          animate={{ backgroundPositionY: ['0px', '64px'] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* 底部 hairline 辉光（衔接页头 border-b） */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgb(var(--eo-w) / 0.22) 50%, transparent)',
        }}
      />
    </div>
  );
}

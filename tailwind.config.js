/** @type {import('tailwindcss').Config} */
export default {
  // 双主题：html[data-theme='dark'|'light'] 驱动 CSS 变量；
  // darkMode 仍保留 class（dark: 变体兼容，但颜色全部走变量）
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* overlay 基色：所有 bg-white/[x]、border-white/x、bg-black/[x]
           自动跟随主题（暗=白 / 亮=黑 ；实底反向）。*/
        white: 'rgb(var(--eo-w) / <alpha-value>)',
        black: 'rgb(var(--eo-b) / <alpha-value>)',
        // ── 单色 surface / ink 系（CSS 变量，随主题切换）──
        eo: {
          bg: 'var(--bg)',
          'bg-2': 'var(--bg-2)',
          'bg-3': 'var(--bg-3)',
          ink: 'var(--ink)',
          'ink-2': 'var(--ink-2)',
          dim: 'var(--dim)',
          mute: 'var(--mute)',
          line: 'var(--line)',
          'line-2': 'var(--line-2)',
          'line-3': 'var(--line-3)',
        },
        // page-bg（兼容旧类名）
        page: {
          bg: 'var(--bg)',
          'bg-dark': 'var(--bg)',
        },
        // 状态点缀色
        good: 'var(--good)',
        warn: 'var(--warn)',
        bad: 'var(--bad)',
      },
      borderColor: {
        'eo-line': 'var(--line)',
        'eo-line-2': 'var(--line-2)',
        'eo-line-3': 'var(--line-3)',
      },
      fontFamily: {
        sans: [
          '"Inter Variable"',
          'Inter',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Noto Sans CJK SC"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        zh: [
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Noto Sans CJK SC"',
          '"Inter Variable"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '"Space Grotesk Variable"',
          '"Space Grotesk"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Noto Sans CJK SC"',
          '"Inter Variable"',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', '"SF Mono"', 'monospace'],
      },
      animation: {
        float: 'eo-float 6s ease-in-out infinite',
        'ring-spin': 'eo-ring-spin 18s linear infinite',
        breathe: 'eo-breathe 2.2s ease-in-out infinite',
        'pulse-dot': 'eo-pulse 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

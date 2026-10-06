import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * 读取一组 CSS 变量的计算颜色值，主题切换时自动刷新。
 * three.js 的 THREE.Color / <*Material color> 不解析 'var(--ink)'，
 * 必须先取计算值再传入。返回 { '--ink': '#f4f4f6', ... }
 *
 * 用法：
 *   const C = useThemeColors(['--ink', '--dim']);
 *   <meshBasicMaterial color={C['--ink']} />
 */
export function useThemeColors(names) {
  const { theme } = useTheme();
  const [colors, setColors] = useState(() => readAll(names));

  useEffect(() => {
    // 主题切换后等一帧，确保 CSS 变量已应用到 :root
    const id = requestAnimationFrame(() => setColors(readAll(names)));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return colors;
}

function readAll(names) {
  const cs = getComputedStyle(document.documentElement);
  const out = {};
  for (const n of names) out[n] = cs.getPropertyValue(n).trim();
  return out;
}

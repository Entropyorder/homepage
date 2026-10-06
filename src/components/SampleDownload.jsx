import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Lock, Unlock, Download, Loader2, AlertCircle } from 'lucide-react';
import { unlock, isUnlocked, getSampleLink, unlockLockRemaining } from '../data/sampleLinks.js';

/**
 * 样例下载区 —— 密码解锁后展示真实下载链接。
 * 用法：<SampleDownload datasetId="hle" />
 */
export function SampleDownload({ datasetId }) {
  const { t } = useTranslation();
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [state, setState] = useState('idle'); // idle | checking | error | locked
  const [lockRemaining, setLockRemaining] = useState(0);
  const [shake, setShake] = useState(0);

  useEffect(() => {
    isUnlocked().then(setUnlocked);
  }, []);

  useEffect(() => {
    if (state !== 'locked') return;
    const timer = setInterval(() => {
      const r = unlockLockRemaining();
      setLockRemaining(r);
      if (r <= 0) setState('idle');
    }, 1000);
    return () => clearInterval(timer);
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || state === 'checking') return;
    setState('checking');
    try {
      await unlock(password);
      setUnlocked(true);
      setState('idle');
      setPassword('');
    } catch (err) {
      setShake((s) => s + 1);
      if (err.message === 'locked') {
        setLockRemaining(unlockLockRemaining());
        setState('locked');
      } else {
        setState('error');
      }
    }
  };

  const link = unlocked ? getSampleLink(datasetId) : null;

  return (
    <div className="mt-6 pt-6 border-t border-white/10">
      <h5 className="font-mono text-[10px] uppercase tracking-[0.2em] text-eo-mute mb-3 flex items-center gap-2">
        {t('products.detail.sampleDownload')}
        {unlocked
          ? <Unlock className="w-3 h-3 text-good" />
          : <Lock className="w-3 h-3" />}
      </h5>

      {link ? (
        <motion.a
          href={link}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="group/dl flex items-center justify-between gap-3 px-4 py-3 border border-white/15 bg-white/[0.03] hover:border-white/35 hover:bg-white/[0.06] transition-all"
        >
          <span className="font-mono text-xs text-eo-dim truncate group-hover/dl:text-eo-ink transition-colors">
            {link.split('/').pop()}
          </span>
          <span className="shrink-0 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-eo-ink">
            {t('products.detail.downloadNow')}
            <Download className="w-3.5 h-3.5" />
          </span>
        </motion.a>
      ) : (
        <form onSubmit={handleSubmit}>
          <motion.div
            key={shake}
            animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : false}
            transition={{ duration: 0.4 }}
            className="flex gap-2"
          >
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (state === 'error') setState('idle'); }}
              placeholder={t('products.detail.samplePasswordPlaceholder')}
              disabled={state === 'checking' || state === 'locked'}
              className="flex-1 min-w-0 px-3 py-2 text-sm font-mono bg-white/[0.03] border border-white/15 text-eo-ink placeholder:text-eo-mute focus:outline-none focus:border-white/40 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!password || state === 'checking' || state === 'locked'}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-eo-ink text-eo-bg text-sm font-semibold hover:bg-eo-ink-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {state === 'checking'
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Unlock className="w-3.5 h-3.5" />}
              {t('products.detail.unlock')}
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            {state === 'error' && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex items-center gap-1.5 text-xs text-bad"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {t('products.detail.wrongPassword')}
              </motion.p>
            )}
            {state === 'locked' && (
              <motion.p
                key="lock"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex items-center gap-1.5 text-xs text-warn"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {t('products.detail.lockedHint', { seconds: Math.ceil(lockRemaining / 1000) })}
              </motion.p>
            )}
            {state === 'idle' && (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-[11px] text-eo-mute font-light"
              >
                {t('products.detail.samplePasswordHint')}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      )}
    </div>
  );
}

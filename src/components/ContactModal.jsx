import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { duration } from '../animations/tokens.js';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xkgjnqyo';

const inputCls =
  'w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-eo-ink placeholder:text-eo-mute focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-colors';

export function ContactModal({ dataset, onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', org: '', email: '', purpose: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, dataset: dataset.name }),
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(onClose, 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.fast }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: duration.normal, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-eo-bg-2 p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-eo-ink">{t('products.modal.title')}</h3>
            <button onClick={onClose} className="p-1 rounded text-eo-dim hover:text-eo-ink hover:bg-white/[0.06] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm font-mono text-eo-dim mb-4">{dataset.name}</p>

          {status === 'success' ? (
            <div className="py-8 text-center text-good font-medium">{t('footer.form.success')}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="contact-name" className="sr-only">{t('products.modal.name')}</label>
                <input id="contact-name" required type="text" placeholder={t('products.modal.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label htmlFor="contact-org" className="sr-only">{t('products.modal.org')}</label>
                <input id="contact-org" required type="text" placeholder={t('products.modal.org')} value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">{t('products.modal.email')}</label>
                <input id="contact-email" required type="email" placeholder={t('products.modal.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label htmlFor="contact-purpose" className="sr-only">{t('products.modal.purpose')}</label>
                <textarea id="contact-purpose" required rows={3} placeholder={t('products.modal.purpose')} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className={inputCls} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-eo-dim hover:text-eo-ink hover:border-white/30 transition-colors">{t('products.modal.cancel')}</button>
                <button type="submit" disabled={status === 'submitting'} className="flex-1 rounded-lg bg-eo-ink text-eo-bg px-4 py-2 text-sm font-semibold hover:bg-eo-ink-2 disabled:opacity-60 transition-colors">{status === 'submitting' ? '...' : t('products.modal.submit')}</button>
              </div>
              {status === 'error' && <p className="text-xs text-bad text-center">{t('footer.form.error')}</p>}
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

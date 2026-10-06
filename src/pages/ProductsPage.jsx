import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { ProductCategory } from '../components/ProductCategory.jsx';
import { ExpertArtifact } from '../components/Artifacts/ExpertArtifact.jsx';
import { MultimodalArtifact } from '../components/Artifacts/MultimodalArtifact.jsx';
import { AgentArtifact } from '../components/Artifacts/AgentArtifact.jsx';
import { CodeArtifact } from '../components/Artifacts/CodeArtifact.jsx';
import { DATASET_CATEGORIES } from '../data/datasets.js';
import { PageTechBackdrop } from '../components/PageTechBackdrop.jsx';
import { Search, X, FileText, Image, Video, AudioLines } from 'lucide-react';

const ARTIFACTS = { ExpertArtifact, MultimodalArtifact, AgentArtifact, CodeArtifact };

const MODALITY_META = {
  text: { Icon: FileText },
  image: { Icon: Image },
  video: { Icon: Video },
  audio: { Icon: AudioLines },
};

export function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activeTab, setActiveTab] = useState(0);
  const sectionRefs = useRef([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);
  const [selectedModalities, setSelectedModalities] = useState([]);

  const onViewDetail = (dataset) => {
    navigate(`/datasets/${dataset.id}`, { state: { backgroundLocation: location } });
  };

  const allCategories = useMemo(() => DATASET_CATEGORIES.map((cat) => ({
    key: cat.key,
    title: t(`${cat.i18nKey}.name`),
    artifact: ARTIFACTS[cat.artifact] || ExpertArtifact,
    datasets: cat.datasets.map((id) => ({
      id,
      ...t(`datasets.${id}`, { returnObjects: true }),
    })),
  })), [t]);

  const filterOptions = useMemo(() => {
    const capabilities = new Set();
    const modalities = new Set();
    allCategories.forEach((cat) => {
      cat.datasets.forEach((ds) => {
        (ds.tags || []).forEach((tag) => capabilities.add(tag));
        (ds.modalities || []).forEach((m) => modalities.add(m));
      });
    });
    return {
      capabilities: Array.from(capabilities),
      modalities: Array.from(modalities),
    };
  }, [allCategories]);

  const filteredCategories = useMemo(() => {
    const hasAnyFilter = searchTerm || selectedCapabilities.length > 0 || selectedModalities.length > 0;
    if (!hasAnyFilter) return allCategories;

    return allCategories.map((cat) => {
      const filteredDatasets = cat.datasets.filter((ds) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (!(ds.name || '').toLowerCase().includes(term) && !(ds.desc || '').toLowerCase().includes(term)) return false;
        }
        if (selectedCapabilities.length > 0) {
          const dsTags = ds.tags || [];
          if (!selectedCapabilities.every((c) => dsTags.includes(c))) return false;
        }
        if (selectedModalities.length > 0) {
          const dsMod = ds.modalities || [];
          if (!selectedModalities.every((m) => dsMod.includes(m))) return false;
        }
        return true;
      });
      return { ...cat, datasets: filteredDatasets };
    }).filter((cat) => cat.datasets.length > 0);
  }, [allCategories, searchTerm, selectedCapabilities, selectedModalities]);

  const hasActiveFilters = searchTerm || selectedCapabilities.length > 0 || selectedModalities.length > 0;
  const totalFiltered = filteredCategories.reduce((sum, cat) => sum + cat.datasets.length, 0);
  const totalDatasets = allCategories.reduce((sum, cat) => sum + cat.datasets.length, 0);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCapabilities([]);
    setSelectedModalities([]);
  };

  const toggleItem = (setter) => (value) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const scrollToCategory = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target);
            if (idx !== -1) setActiveTab(idx);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    const currentRefs = sectionRefs.current;
    currentRefs.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [filteredCategories]);

  const getModalityLabel = (modality) => {
    switch (modality) {
      case 'text': return t('products.filter.modalitiesText');
      case 'image': return t('products.filter.modalitiesImage');
      case 'video': return t('products.filter.modalitiesVideo');
      case 'audio': return t('products.filter.modalitiesAudio');
      default: return modality;
    }
  };

  return (
    <div className="min-h-screen bg-eo-bg pt-14">
      {/* ── Header：editorial 大标题 + 索引 ── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8 border-b border-white/10 overflow-hidden">
        <PageTechBackdrop />
        <div className="relative">
        <div className="eo-eyebrow mb-4">Datasets · Index</div>
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-eo-ink tracking-[-0.035em] leading-[1.05]">
              {t('products.pageTitle')}
            </h1>
            <p className="text-eo-dim mt-4 font-light max-w-xl">
              {t('products.pageSubtitle', { count: totalDatasets })}
            </p>
          </div>
          <div className="font-mono text-sm text-eo-mute pb-1">
            <span className="text-eo-ink text-2xl">{hasActiveFilters ? totalFiltered : totalDatasets}</span>
            <span className="mx-1.5">/</span>
            <span>{totalDatasets}</span>
          </div>
        </div>
        </div>
      </div>

      {/* ── 主体：左侧索引栏 + 右侧内容 ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10 lg:gap-14 py-10">
        {/* 左侧：分类索引 + 过滤器 */}
        {!isMobile && (
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 space-y-10">
              {/* 分类索引 */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-eo-mute mb-4 pb-2 border-b border-white/10">
                  Categories
                </div>
                <div className="space-y-1" role="tablist" aria-label="Product categories">
                  {filteredCategories.map((cat, index) => (
                    <button
                      key={cat.key}
                      role="tab"
                      aria-selected={activeTab === index}
                      aria-controls={`product-panel-${index}`}
                      onClick={() => scrollToCategory(index)}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-all duration-200 flex items-baseline justify-between border-l-2 ${
                        activeTab === index
                          ? 'border-eo-ink text-eo-ink bg-white/[0.03]'
                          : 'border-transparent text-eo-dim hover:text-eo-ink-2 hover:bg-white/[0.02]'
                      }`}
                    >
                      <span>{cat.title}</span>
                      <span className="font-mono text-[11px] text-eo-mute">
                        {cat.datasets.length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 搜索 */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-eo-mute mb-4 pb-2 border-b border-white/10">
                  Search
                </div>
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-eo-mute" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('products.filter.searchPlaceholder')}
                    className="w-full pl-7 pr-6 py-2 text-sm bg-transparent border-b border-white/15 text-eo-ink placeholder:text-eo-mute focus:outline-none focus:border-eo-ink transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-eo-mute hover:text-eo-ink"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 能力领域 */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-eo-mute mb-4 pb-2 border-b border-white/10">
                  {t('products.filter.capabilities')}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {filterOptions.capabilities.map((cap) => {
                    const selected = selectedCapabilities.includes(cap);
                    return (
                      <button
                        key={cap}
                        onClick={() => toggleItem(setSelectedCapabilities)(cap)}
                        className={`font-mono text-xs transition-colors ${
                          selected
                            ? 'text-eo-ink underline underline-offset-4 decoration-white/60'
                            : 'text-eo-mute hover:text-eo-ink-2'
                        }`}
                      >
                        #{cap}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 数据模态 */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-eo-mute mb-4 pb-2 border-b border-white/10">
                  {t('products.filter.modalities')}
                </div>
                <div className="space-y-2">
                  {filterOptions.modalities.map((mod) => {
                    const meta = MODALITY_META[mod];
                    const Icon = meta?.Icon;
                    const selected = selectedModalities.includes(mod);
                    return (
                      <button
                        key={mod}
                        onClick={() => toggleItem(setSelectedModalities)(mod)}
                        className={`w-full flex items-center gap-2.5 text-sm transition-colors ${
                          selected
                            ? 'text-eo-ink'
                            : 'text-eo-mute hover:text-eo-ink-2'
                        }`}
                      >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        <span>{getModalityLabel(mod)}</span>
                        {selected && <span className="ml-auto w-1 h-1 rounded-full bg-eo-ink" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 清除筛选 */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-eo-dim hover:text-eo-ink underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-colors"
                >
                  <X className="w-3 h-3" />
                  {t('products.filter.clearAll')}
                </button>
              )}
            </div>
          </aside>
        )}

        {/* 右侧：分类内容 */}
        <div className="flex-1 min-w-0">
          {/* 移动端分类 tab */}
          {isMobile && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide border-b border-white/10" role="tablist" aria-label="Product categories">
              {filteredCategories.map((cat, index) => (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={activeTab === index}
                  aria-controls={`product-panel-${index}`}
                  onClick={() => scrollToCategory(index)}
                  className={`shrink-0 px-1 py-2 text-sm font-medium transition-all duration-200 flex items-baseline gap-1.5 border-b-2 -mb-px ${
                    activeTab === index
                      ? 'border-eo-ink text-eo-ink'
                      : 'border-transparent text-eo-dim hover:text-eo-ink-2'
                  }`}
                >
                  {cat.title}
                  <span className="font-mono text-[10px] text-eo-mute">
                    {cat.datasets.length}
                  </span>
                </button>
              ))}
            </div>
          )}

          {filteredCategories.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-eo-mute text-lg mb-6 font-light">
                {t('products.filter.empty')}
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 font-mono text-sm text-eo-dim hover:text-eo-ink underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
                {t('products.filter.clearAll')}
              </button>
            </div>
          ) : (
            <div>
              {filteredCategories.map((cat, index) => (
                <div
                  key={cat.key}
                  id={`product-panel-${index}`}
                  ref={(el) => { sectionRefs.current[index] = el; }}
                  role="tabpanel"
                  aria-labelledby={`product-tab-${index}`}
                >
                  <ProductCategory
                    title={cat.title}
                    artifact={cat.artifact}
                    datasets={cat.datasets}
                    direction={index % 2 === 0 ? 'left' : 'right'}
                    onViewDetail={onViewDetail}
                    index={index}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

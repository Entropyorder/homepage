import { motion } from 'framer-motion';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/* ══════════════════════════════════════════════════════════
   博客文章内嵌的自定义组件（ai4ss4ai / 数据合成 两篇用）
   通过 MarkdownBody 的 ::component:name 占位符渲染。
   ══════════════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

export function FadeIn({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 通用：横条指标 ── */
export function BarList({ rows, big = false }) {
  return (
    <div className="space-y-4">
      {rows.map(([label, v]) => (
        <div key={label}>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs text-eo-dim">{label}</span>
            <span className={`font-mono ${big ? 'text-base' : 'text-xs'} text-eo-ink`}>{v.toFixed(2).replace('1.00', '1.0')}</span>
          </div>
          <div className="h-[3px] bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full bg-eo-ink-2"
              initial={{ width: 0 }}
              whileInView={{ width: `${v * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── ai4ss4ai：闭环链 ── */
const LOOP_STAGES = [
  { num: '01', zh: '观察', en: 'Observe' },
  { num: '02', zh: '萃取', en: 'Extract' },
  { num: '03', zh: '建模', en: 'Model' },
  { num: '04', zh: '生成', en: 'Generate' },
  { num: '05', zh: '赋能', en: 'Empower' },
];
export function LoopChain() {
  return (
    <FadeIn className="flex flex-wrap items-center gap-x-3 gap-y-4 my-6">
      <span className="font-mono text-[11px] uppercase tracking-wider text-eo-mute">From Real</span>
      <span className="h-px w-6 bg-white/20" />
      {LOOP_STAGES.map((s, i) => (
        <span key={s.num} className="flex items-center gap-3">
          <span className="group flex items-baseline gap-2 border border-white/15 px-3.5 py-2 hover:border-white/40 hover:bg-white/[0.03] transition-all">
            <span className="font-mono text-[10px] text-eo-mute">{s.num}</span>
            <span className="text-sm font-medium text-eo-ink">{s.zh}</span>
            <span className="font-mono text-[10px] text-eo-mute">{s.en}</span>
          </span>
          {i < LOOP_STAGES.length - 1 && <span className="h-px w-6 bg-white/20" />}
        </span>
      ))}
      <span className="h-px w-6 bg-white/20" />
      <span className="font-mono text-[11px] uppercase tracking-wider text-eo-mute">To Real</span>
    </FadeIn>
  );
}

/* ── ai4ss4ai：雷达图 ── */
export function Radar() {
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto" aria-hidden="true">
      <polygon points="150,42 252,111 210,242 90,242 48,111" fill="none" stroke="rgb(var(--eo-w) / .08)" />
      <polygon points="150,69 226,119 195,221 105,221 74,119" fill="none" stroke="rgb(var(--eo-w) / .08)" />
      <polygon points="150,96 201,128 180,200 120,200 99,128" fill="none" stroke="rgb(var(--eo-w) / .08)" />
      <line x1="150" y1="150" x2="150" y2="42" stroke="rgb(var(--eo-w) / .08)" />
      <line x1="150" y1="150" x2="252" y2="111" stroke="rgb(var(--eo-w) / .08)" />
      <line x1="150" y1="150" x2="210" y2="242" stroke="rgb(var(--eo-w) / .08)" />
      <line x1="150" y1="150" x2="90" y2="242" stroke="rgb(var(--eo-w) / .08)" />
      <line x1="150" y1="150" x2="48" y2="111" stroke="rgb(var(--eo-w) / .08)" />
      <polygon points="150,57 232,117 199,225 96,220 51,116" fill="rgb(var(--eo-w) / .06)" stroke="var(--ink)" strokeWidth="1.5" />
      {[[150,57],[232,117],[199,225],[96,220],[51,116]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--ink)" />
      ))}
      <text x="150" y="32" textAnchor="middle" fill="var(--mute)" fontSize="10" fontFamily="'JetBrains Mono Variable', 'JetBrains Mono', monospace">价值观</text>
      <text x="270" y="108" textAnchor="middle" fill="var(--mute)" fontSize="10" fontFamily="'JetBrains Mono Variable', 'JetBrains Mono', monospace">认知</text>
      <text x="220" y="262" textAnchor="middle" fill="var(--mute)" fontSize="10" fontFamily="'JetBrains Mono Variable', 'JetBrains Mono', monospace">文化</text>
      <text x="80" y="262" textAnchor="middle" fill="var(--mute)" fontSize="10" fontFamily="'JetBrains Mono Variable', 'JetBrains Mono', monospace">技能</text>
      <text x="30" y="108" textAnchor="middle" fill="var(--mute)" fontSize="10" fontFamily="'JetBrains Mono Variable', 'JetBrains Mono', monospace">人格</text>
    </svg>
  );
}

/* ── ai4ss4ai：信号标签云 / 框架列表 / 原则列表 / 样本溯源 / 规模格 ── */
export function SignalTags() {
  return (
    <div className="flex flex-wrap gap-2">
      {['社会行为','文化差异','人际交互','价值判断','情绪反应','群体动力','语言习惯','决策风格','道德推理'].map((s) => (
        <span key={s} className="text-xs text-eo-dim border border-white/12 px-2.5 py-1 hover:text-eo-ink hover:border-white/30 transition-colors cursor-default">{s}</span>
      ))}
    </div>
  );
}

export function FrameworkList() {
  return (
    <ul className="space-y-2">
      {[['PSY','大五人格 · OCEAN'],['PSY','认知风格 · Cognitive Style'],['SOC','文化维度 · Hofstede'],['SOC','价值观 · Schwartz'],['BEH','行为决策 · Kahneman'],['MOR','道德基础 · Haidt']].map(([tag, name]) => (
        <li key={name} className="flex items-center gap-2.5 text-sm text-eo-dim font-light">
          <span className="font-mono text-[9px] text-eo-ink-2 border border-white/20 px-1.5 py-0.5 tracking-wider shrink-0">{tag}</span>
          {name}
        </li>
      ))}
    </ul>
  );
}

export function PrincipleList() {
  return (
    <ul className="space-y-2 text-sm text-eo-dim font-light">
      <li><span className="font-mono text-xs text-eo-ink-2 mr-2">P1</span>第一手自真实场景，非实验室构造</li>
      <li><span className="font-mono text-xs text-eo-ink-2 mr-2">P2</span>保留复杂性，不做过度清洗</li>
      <li><span className="font-mono text-xs text-eo-ink-2 mr-2">P3</span>覆盖多元文化与边缘群体</li>
      <li><span className="font-mono text-xs text-eo-ink-2 mr-2">P4</span>伦理审查与隐私保护先行</li>
    </ul>
  );
}

export function SampleTrace() {
  return (
    <ul className="space-y-3">
      {[['P-000142','“作为一个重视传统的东亚父亲…”'],['P-003871','“作为一位高开放性的北欧设计师…”'],['P-012490','“作为一名风险厌恶的拉美小商户…”']].map(([tag, text]) => (
        <li key={tag} className="flex items-start gap-2.5 text-sm text-eo-dim font-light leading-relaxed">
          <span className="font-mono text-[10px] text-eo-ink-2 border border-white/20 px-1.5 py-0.5 shrink-0 mt-0.5">{tag}</span>
          <span className="italic">{text}</span>
        </li>
      ))}
    </ul>
  );
}

export function ScaleGrid() {
  return (
    <FadeIn>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.07] border border-white/[0.07] my-6">
        {[['1,000,000+', 'Persona × Skills 组合', true], ['200+', '价值观维度'], ['150+', '认知风格'], ['80+', '文化背景'], ['500+', '专业技能']].map(([v, k, big]) => (
          <div key={k} className={`bg-eo-bg p-6 md:p-8 ${big ? 'col-span-2 md:col-span-4 border-b border-white/[0.07]' : ''}`}>
            <div className={`font-mono font-medium text-eo-ink ${big ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>{v}</div>
            <div className="mt-2 text-xs text-eo-mute uppercase tracking-wider">{k}</div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}

export function EmpowerList() {
  return (
    <div className="space-y-0">
      {[['①','教育','因材施教，适配每个学习者的认知风格与文化背景'],['②','医疗','理解患者的价值观与决策偏好，提供有同理心的照护'],['③','决策','在多元利益相关者之间，做出公平且可解释的判断']].map(([no, t, d]) => (
        <div key={t} className="flex items-baseline gap-5 py-5 border-t border-white/15 first:border-t-0 group">
          <span className="text-eo-mute text-lg shrink-0">{no}</span>
          <div>
            <div className="font-medium text-eo-ink group-hover:text-white transition-colors">{t}</div>
            <div className="text-sm text-eo-dim font-light mt-1">{d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 数据合成：任务卡片 / 任意×任意 / 五阶段管线 ── */
const TASK_CARDS = [
  ['Σ', '科学推理'], ['{ }', '代码生成'], ['⌗', 'SQL 查询'],
  ['⚙', '工具调用'], ['▣', 'Agent 长程'], ['∞', '更多任务'],
];
export function TaskCards() {
  return (
    <FadeIn className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/[0.07] border border-white/[0.07] my-6">
      {TASK_CARDS.map(([icon, name]) => (
        <div key={name} className="bg-eo-bg px-5 py-6 flex flex-col items-center gap-3 hover:bg-white/[0.025] transition-colors">
          <span className="font-mono text-2xl text-eo-ink-2">{icon}</span>
          <span className="text-sm text-eo-dim">{name}</span>
        </div>
      ))}
    </FadeIn>
  );
}

export function AnyX() {
  return (
    <FadeIn className="flex flex-col items-center text-center gap-6 py-6">
      <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
        <div>
          <div className="font-display text-3xl md:text-4xl font-semibold text-eo-ink">任意数据</div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-eo-mute">种子 + 验证器</div>
        </div>
        <span className="text-2xl text-eo-mute font-light">×</span>
        <div>
          <div className="font-display text-3xl md:text-4xl font-semibold text-eo-ink">任意模型</div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-eo-mute">目标 + 参照</div>
        </div>
      </div>
      <div className="text-2xl text-eo-mute">↓</div>
      <div>
        <div className="font-display text-3xl md:text-4xl font-semibold text-eo-ink inline-block px-3 py-1 bg-white/[0.08]">
          高价值训练数据
        </div>
        <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-eo-mute">
          可验证 · 可区分 · 可学习 · 可迁移
        </div>
      </div>
    </FadeIn>
  );
}

const PIPELINE_STAGES = [
  { num: '阶段一', title: '生成', en: 'Generate',
    desc: <>种子集合 <InlineMath math="Z" /> 在第 <InlineMath math="t" /> 轮策略 <InlineMath math="r_t" /> 下，由样本生成器产出候选分布，覆盖不同类型的困难区域。</>,
    formula: '(x_i, y_i, \\rho_i) \\sim G(\\cdot \\mid z_i, r_t)',
    points: ['种子可以是题目、论文、教材、法律条文、技术规范、已有 benchmark、真实业务日志、工具 schema、API 文档、UI 流程或 agent 环境状态', <>每个候选包含问题 <InlineMath math="x" />、轨迹 <InlineMath math="y" /> 与评分 rubric <InlineMath math="\rho" /></>] },
  { num: '阶段二', title: '求解', en: 'Solve',
    desc: <>目标模型与参照求解器分别 <InlineMath math="K" /> 次采样。响应落差 <InlineMath math="\delta_i = s_i - w_i" /> 刻画「参照可解、目标仍有空间」，为难度门提供信号。</>,
    formula: '\\delta_i = s_i - w_i',
    points: [<><InlineMath math="w_i \approx 0.44" />（目标模型通过率）</>, <><InlineMath math="s_i \approx 0.86" />（参照求解器通过率）</>, '参照可解 · 目标有空间 → 进入难度窗'] },
  { num: '阶段三', title: '验证', en: 'Verify',
    desc: '七道门逐级过滤。质量与正确性先行，难度窗口保证样本落在目标模型能力边界附近。难度由可观测响应直接定义。',
    formula: '\\mathrm{gate}_1 \\dots \\mathrm{gate}_7',
    points: ['单测、SQL 执行、代码运行、rubric 裁判或成功判定标准', '闭环逻辑不变，三类组件可替换'] },
  { num: '阶段四', title: '分析', en: 'Analyze',
    desc: <>能力响应向量 <InlineMath math="\mathbf{r}_i" /> 刻画多模型在同题上的分布。弱中强分层明显 → 高区分度 <InlineMath math="I_i" />；全高过易，全低过难。</>,
    formula: '\\mathbf{r}_i = (r_i^1, r_i^2, \\dots, r_i^m)',
    points: ['高区分度样本用于评估', '过易/过难样本反馈给生成端'] },
  { num: '阶段五', title: '更新', en: 'Update',
    desc: '未通过门控的样本作为反馈信号进入下一轮。生成策略、门控阈值、种子选择皆可自动更新。数据生产智能体本身也在进化。',
    formula: 'r_t \\to r_{t+1}',
    points: ['策略、阈值、种子三元更新', '数据与模型同步迭代'] },
];

export function PipelineStages() {
  return (
    <div className="space-y-0 my-6">
      {PIPELINE_STAGES.map((s) => (
        <FadeIn key={s.num} className="py-9 border-t border-white/[0.07] first:border-t-0 first:pt-0">
          <div className="flex items-baseline gap-4 mb-3">
            <span className="font-mono text-xs text-eo-mute shrink-0">{s.num}</span>
            <h3 className="font-display text-xl font-semibold text-eo-ink">
              {s.title} <span className="ml-2 font-mono text-xs font-normal text-eo-mute">{s.en}</span>
            </h3>
            <span className="ml-auto font-mono text-xs text-eo-mute hidden sm:block">
              <InlineMath math={s.formula} />
            </span>
          </div>
          <p className="text-eo-dim leading-relaxed font-light mb-4 max-w-2xl">{s.desc}</p>
          <ul className="space-y-1.5">
            {s.points.map((p, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-eo-dim font-light">
                <span className="text-eo-mute shrink-0">—</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      ))}
    </div>
  );
}

/* 两栏布局 helper（ai4ss4ai 五阶段用） */
export function TwoCol({ left, right, leftHead, rightHead }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 my-4">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-eo-mute mb-4">{leftHead}</div>
        {left}
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-eo-mute mb-4">{rightHead}</div>
        {right}
      </div>
    </div>
  );
}

/* 组件注册表：::component:name → 组件 */
export const BLOG_COMPONENTS = {
  // ai4ss4ai
  LoopChain, Radar, SignalTags, FrameworkList, PrincipleList, SampleTrace, ScaleGrid, EmpowerList, BarList,
  // 数据合成
  TaskCards, AnyX, PipelineStages,
};

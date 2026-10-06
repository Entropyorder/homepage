import yaml from 'js-yaml';

// Split YAML frontmatter from markdown body.
function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const [, fm, body] = match;
  let data = {};
  try {
    data = yaml.load(fm) ?? {};
  } catch (err) {
    console.error('[blog] frontmatter parse failed', err);
  }
  return { data, content: body };
}

// Load raw .md sources. Each post lives at ./<slug>/index.md
const rawModules = import.meta.glob(
  './*/index.md',
  { eager: true, query: '?raw', import: 'default' }
);

// Load all assets under each post's ./assets/ folder, resolved to URLs
const assetModules = import.meta.glob(
  './*/assets/*',
  { eager: true, query: '?url', import: 'default' }
);

function resolveAsset(postDir, relPath) {
  const normalized = relPath.replace(/^\.\//, '');
  const key = `./${postDir}/${normalized}`;
  return assetModules[key] ?? relPath;
}

function pickLocalized(field, lng) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lng] ?? field.zh ?? field.en ?? '';
}

function parsePost([path, raw]) {
  const match = path.match(/^\.\/([^/]+)\/index\.md$/);
  if (!match) return null;
  const postDir = match[1];
  const { data, content } = splitFrontmatter(raw);

  // js-yaml parses unquoted ISO dates (e.g. `date: 2026-04-21`) into Date objects.
  // React cannot render Date objects as children, so normalize to string early.
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }
  // Same guard for any other top-level Date-valued field we might add later.
  for (const key of Object.keys(data)) {
    if (data[key] instanceof Date) {
      data[key] = data[key].toISOString().slice(0, 10);
    }
  }

  return {
    ...data,
    slug: data.slug ?? postDir,
    dir: postDir,
    cover: data.cover ? resolveAsset(postDir, data.cover) : null,
    rawContent: content,
    resolveAsset: (rel) => resolveAsset(postDir, rel),
  };
}

let allPosts = [];
try {
  allPosts = Object.entries(rawModules)
    .map(parsePost)
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
} catch (err) {
  console.error('[blog] failed to load posts', err);
  allPosts = [];
}

if (typeof window !== 'undefined') {
  // Make debugging easier if the list is empty or broken
  // eslint-disable-next-line no-underscore-dangle
  window.__BLOG_POSTS__ = allPosts;
}

export function loadPosts() {
  return allPosts;
}

// slug → 独立短路径。新增 blog 时在这里加一行。
const SLUG_SHORTCUTS = {
  'expert-annotation-pipeline': '/blog/1',
  'survey-difficult-qa-synthesis': '/blog/2',
  'entropy-order-demo': '/blog/3',
  'ai4ss4ai': '/blog/4',
  'scicode-rsi-project': '/blog/5',
};

export function postPath(post) {
  return SLUG_SHORTCUTS[post?.slug] ?? `/blog/${post?.slug}`;
}

export function findPostBySlug(slug) {
  return allPosts.find((p) => p.slug === slug) ?? null;
}

export function getAdjacentPosts(slug) {
  const idx = allPosts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { newer: null, older: null };
  return {
    newer: idx > 0 ? allPosts[idx - 1] : null,
    older: idx < allPosts.length - 1 ? allPosts[idx + 1] : null,
  };
}

export function localizedTitle(post, lng) {
  return pickLocalized(post?.title, lng);
}

export function localizedSummary(post, lng) {
  return pickLocalized(post?.summary, lng);
}

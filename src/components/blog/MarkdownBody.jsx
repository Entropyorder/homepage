import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import { BLOG_COMPONENTS } from './embeds.jsx';

// ::component:Name 占位段落 → 渲染 embeds.jsx 里的 React 组件
const COMPONENT_RE = /^::component:([A-Za-z0-9_]+)\s*$/;

export function MarkdownBody({ content, post }) {
  // 把整篇 markdown 按组件占位切成若干段，段内仍走 ReactMarkdown
  const segments = splitByComponent(content);
  return (
    <div className="article-prose">
      {segments.map((seg, i) =>
        seg.type === 'component' ? (
          <EmbeddedComponent key={i} name={seg.name} />
        ) : (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeSlug, rehypeKatex, rehypeHighlight]}
            components={MD_COMPONENTS(post)}
          >
            {seg.text}
          </ReactMarkdown>
        )
      )}
    </div>
  );
}

function EmbeddedComponent({ name }) {
  const C = BLOG_COMPONENTS[name];
  if (!C) return null;
  return <C />;
}

function splitByComponent(content) {
  const lines = content.split('\n');
  const out = [];
  let buf = [];
  const flush = () => {
    const text = buf.join('\n').trim();
    if (text) out.push({ type: 'md', text });
    buf = [];
  };
  for (const line of lines) {
    const m = line.trim().match(COMPONENT_RE);
    if (m) {
      flush();
      out.push({ type: 'component', name: m[1] });
    } else {
      buf.push(line);
    }
  }
  flush();
  return out;
}

function MD_COMPONENTS(post) {
  return {
    img: ({ src, alt, ...rest }) => {
      // 相对路径（./assets/x.png 或 assets/x.png）交给 post.resolveAsset 解析为构建产物 URL
      const isRelative = src && !/^(https?:)?\/\//.test(src) && !src.startsWith('data:');
      const resolved = isRelative && post?.resolveAsset
        ? post.resolveAsset(src.replace(/^\.\//, './'))
        : src;
      return (
        <img
          src={resolved}
          alt={alt ?? ''}
          loading="lazy"
          className="my-6 rounded-xl w-full"
          {...rest}
        />
      );
    },
    a: ({ href, children, ...rest }) => {
      const isRelative = href && !/^(https?:)?\/\//.test(href) && !href.startsWith('#') && !href.startsWith('mailto:');
      const resolved = isRelative && post?.resolveAsset
        ? post.resolveAsset(href.replace(/^\.\//, './'))
        : href;
      return (
        <a href={resolved} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    },
  };
}

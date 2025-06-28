import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import 'highlight.js/styles/a11y-dark.css';
import '@/features/rule/rule.scss';

export default function Rule() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/web/dept.md')
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div className='flex w-full h-full p-[10px]'>
      <div className='prose'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
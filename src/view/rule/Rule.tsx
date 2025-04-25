import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/a11y-dark.css";

import '@/view/rule/rule.scss';

const Rule: React.FC = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch("./dept.md")
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div className='rule'>
      <div className='content'>
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

export default Rule;
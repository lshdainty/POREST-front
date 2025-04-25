import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/a11y-dark.css";

import '@/view/rule/rule.scss';
import { useEffect } from "react";

import { useState } from "react";
const Rule: React.FC = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch("./test.md")
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div className='rule'>
      <h1>rule page</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

export default Rule;
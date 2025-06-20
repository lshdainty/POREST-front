import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/a11y-dark.css";

import { cn } from "@/lib/utils"
import '@/features/rule/rule.scss';

export default function Rule() {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch("./dept.md")
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div
      className={cn(
        "flex w-full h-full p-[10px]" 
      )}
    >
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
'use client';

import { useEffect, useState } from 'react';

import DOMPurify from 'isomorphic-dompurify';
import { FaClipboard } from 'react-icons/fa';

interface CodeBlockProps {
  code: string;
  getHtml: (code: string) => Promise<string>;
  defaultHtml: string;
}

const CodeBlock = ({ code, defaultHtml, getHtml }: CodeBlockProps) => {
  const [html, setHtml] = useState(defaultHtml);
  useEffect(() => {
    getHtml(code).then((html) => setHtml(DOMPurify.sanitize(html)));
  }, [code]);
  return (
    <div className='text-xs'>
      <div className='flex items-center px-4 py-2 border border-b-0 rounded-t bg-slate-200'>
        <p className='mr-auto'>sql</p>
        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => navigator.clipboard.writeText(code)}
        >
          <FaClipboard />
          <p>copy code</p>
        </div>
      </div>
      <div
        className='p-4 overflow-x-auto bg-white border border-t-0 rounded-b'
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  );
};

export default CodeBlock;
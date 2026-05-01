'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { forwardRef } from 'react'

/* Split preview (side-by-side with editor) */
export const SplitPreview = forwardRef(function SplitPreview({ content }, ref) {
  return (
    <div
      ref={ref}
      className="preview-content flex-1 px-12 py-8 border-l border-border overflow-auto text-foreground bg-card font-serif leading-[1.85] text-[15px]"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
        {content}
      </ReactMarkdown>
    </div>
  )
})

/* Full-screen preview (focus mode) */
export function FullPreview({ content }) {
  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-[720px] mx-auto py-14 px-8 font-serif text-[17px] leading-[1.9] text-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

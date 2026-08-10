import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function Markdown({ children }: { children: string }) {
  return (
    <article className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className ?? "");
            const texto = String(children).replace(/\n$/, "");
            if (!match) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <SyntaxHighlighter
                language={match[1]}
                style={vscDarkPlus}
                customStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                  fontSize: "0.8rem",
                  margin: 0,
                }}
                codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
              >
                {texto}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </article>
  );
}

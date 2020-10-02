import dynamic from 'next/dynamic'

function CodeFallback({ children, language }) {
    return (
        <pre>
            <code className="codeblock">
                {children}
            </code>
            <style jsx>{`
                pre {
                    color: hsl(0deg, 0%, 90%);
                    font-family: Consolas, Monaco, "Andale Mono", monospace;
                    direction: ltr;
                    text-align: left;
                    white-space: pre;
                    word-spacing: normal;
                    word-break: normal;
                    line-height: 1.5;
                    tab-size: 4;
                    hyphens: none;
                    padding: 1em;
                    margin: 0.5em 0px;
                    overflow: auto;
                    background: rgb(43, 43, 43);
                    font-size: 18px;
                    line-height: 27px;
                }
                code {
                    font-family: Consolas, Monaco, "Andale Mono", monospace;
                }
            `}</style>
        </pre>
    )
}

export default function Code({ children }) {
    const code = children.props.children;
    const CodeWithSyntax = dynamic(
        () => import('./CodeWithSyntax'),
        {
            loading: () => (
                <CodeFallback>{code}</CodeFallback>
            )
        }
    )

    return (
        <CodeWithSyntax language={"javascript"}>
            {code}
        </CodeWithSyntax>
    )
}
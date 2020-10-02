import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function CodeWithSyntax({ language, children }) {
    return (
        <SyntaxHighlighter style={darcula} language={language}>
            {children}
        </SyntaxHighlighter>
    )
}
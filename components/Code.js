export default function Code({ children }) {
    const code = children.props.children;

    return (
        <pre>
            <code>
                {code}
            </code>
            <style jsx>{`
                pre {
                    padding: 10px 20px;
                    background-color: hsl(0deg, 0%, 20%);
                    color: hsl(0deg, 0%, 90%);
                }
            `}</style>
        </pre>
    )
}
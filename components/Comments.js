import Markdown from 'markdown-to-jsx'
import ms from 'ms'
import useSWR from 'swr'

async function swrFetcher(path) {
    const res = await fetch(path)
    return res.json()
}

export default function Comments({slug}) {
    const {data: comments, mutate} = useSWR(`/api/comments?slug=${slug}`, swrFetcher)

    if (!comments) {
        return (
            <div className="comments">
                <div className="comments-info">
                    loading...
                </div>
            </div>
        )
    }

    return (
        <div>
            {comments && comments.length > 0 ? (
                <div className="comments">
                    {comments.map(c => (
                        <div key={c.id} className={c.clientOnly? 'comment client-only' : 'comment'}>
                            <div className="comment-content">
                                <Markdown>{c.content || ''}</Markdown>
                            </div>
                            <div className="comment-author">
                                <img src={c.avatar} title={c.name}/>
                                <div>{c.name} ({ms(Date.now() - c.createdAt)} ago)</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="comments">
                    <div className="comments-info">
                        No comments so far.
                    </div>
                </div>
            )}
        </div>
    )
}
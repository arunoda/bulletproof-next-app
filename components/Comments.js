import Markdown from 'markdown-to-jsx'
import ms from 'ms'
import useSWR from 'swr'
import AddCommentBox from './AddCommentBox'
import classNames from 'classnames'
import axios from 'axios'

async function swrFetcher(path) {
    const res = await fetch(path)
    return res.json()
}

export default function Comments({slug}) {
    const {data, mutate} = useSWR(
        `/api/comments?slug=${slug}`,
        swrFetcher
    );
    
    let comments = data;

    const handleAddComment = async (content) => {
        try {
            await axios.post(`/api/comments?slug=${slug}`, {
                content
            })
            await mutate()
        } catch(err) {
            const alertMessage = err.response? err.response.data : err.message
            alert(alertMessage)
        }
    }

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
                        <div key={c.id} className={classNames({
                            comment: true,
                            'client-only': c.clientOnly,
                            error: c.error
                        })}>
                            <div className="comment-content">
                                <Markdown>{c.error || c.content || ''}</Markdown>
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
            <AddCommentBox onSubmit={handleAddComment}/>
        </div>
    )
}
import Markdown from 'markdown-to-jsx'
import ms from 'ms'
import useSWR from 'swr'
import AddCommentBox from './AddCommentBox'
import classNames from 'classnames'
import { useSession } from 'next-auth/client'

async function swrFetcher(path) {
    const res = await fetch(path)
    return res.json()
}

export default function Comments({slug}) {
    const [session] = useSession()
    const {data: comments, mutate} = useSWR(`/api/comments?slug=${slug}`, swrFetcher)

    const createComment = async (fakeComment) => {
        const fetchRes = await fetch(`/api/comments?slug=${slug}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: fakeComment.content })
        })
    
        if (!fetchRes.ok) {
            throw new Error(await fetchRes.text())
        }
    
        const addedComment = await fetchRes.json()
        
        mutate((currentComments) => {
            const newComments = []
            for (const c of currentComments) {
                if (c.id === fakeComment.id) {
                    newComments.push(addedComment)
                } else {
                    newComments.push(c)
                }
            }
        
            return newComments
        }, false)
    }

    const handleAddComment = async (content) => {
        const fakeComment = {
            id: Math.random(),
            userId: session.user.id,
            name: session.user.profile.name,
            avatar: session.user.profile.avatar,
            content,
            createdAt: Date.now(),
            clientOnly: true
        }
    
        mutate([...comments, fakeComment], false)

        createComment(fakeComment)
            .catch(err => {
                mutate(currentComments => {
                    const newComments = []
                    for (const c of currentComments) {
                        if (c.id === fakeComment.id) {
                            newComments.push({
                                ...fakeComment,
                                error: err.message
                            })
                        } else {
                            newComments.push(c)
                        }
                    }

                    return newComments
                }, false)
            })
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
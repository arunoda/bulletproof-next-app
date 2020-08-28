import Markdown from 'markdown-to-jsx'
import ms from 'ms'
import useSWR from 'swr'
import AddCommentBox from './AddCommentBox'
import classNames from 'classnames'
import axios from 'axios'
import { useSWRInfinite } from 'swr'

async function swrFetcher(path) {
    const res = await fetch(path)
    return res.json()
}

export default function Comments({ slug }) {
    const pageLimit = 3;
    const getCacheKey = (pageIndex, prevPageData) => {
        // This is first page
        if (pageIndex === 0) {
            return `/api/comments?slug=${slug}&limit=${pageLimit}`
        }

        // This is at the end of the list.
        if (prevPageData.length < pageLimit) {
            return null
        }

        // Here we fetch pages using a offset
        const lastComment = prevPageData[prevPageData.length - 1]
        return `/api/comments?slug=${slug}&limit=${pageLimit}&offset=${lastComment.createdAt}`
    }

    const { data, mutate, size, setSize } = useSWRInfinite(
        getCacheKey,
        swrFetcher
    );

    let comments = null
    if (data) {
        comments = []
        for (const pageData of data) {
            comments = [...comments, ...pageData]
        }
    }

    const handleAddComment = async (content) => {
        try {
            await axios.post(`/api/comments?slug=${slug}`, {
                content
            })
            await mutate()
        } catch (err) {
            const alertMessage = err.response ? err.response.data : err.message
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
                                <img src={c.avatar} title={c.name} />
                                <div>{c.name} ({ms(Date.now() - c.createdAt)} ago)</div>
                            </div>
                        </div>
                    ))}
                    <a
                        href="#"
                        className="load-more"
                        onClick={(e) => {
                            e.preventDefault()
                            setSize(size + 1)
                        }}
                    >
                        Load More
                    </a>
                </div>
            ) : (
                    <div className="comments">
                        <div className="comments-info">
                            No comments so far.
                    </div>
                    </div>
                )}
            <AddCommentBox onSubmit={handleAddComment} />
        </div>
    )
}
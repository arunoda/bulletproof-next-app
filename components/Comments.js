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
            return `/api/comments?slug=${slug}&limit=${pageLimit}&sort=-1`
        }
    
        // This is at the end of the list. We have no more data to fetch
        if (prevPageData.length < pageLimit) {
            console.log('End of the list')
            return null
        }
    
        // Fetch the next page using createdAt time of the lastComment as the offset
        const lastComment = prevPageData[prevPageData.length - 1]
        return `/api/comments?slug=${slug}&limit=${pageLimit}&offset=${lastComment.createdAt}&sort=-1`
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

    const renderLoadMore = () => {
        if (!comments) {
            return null
        }

        // We asked for a page, but we haven't seen that yet.
        if (size > data.length) {
            return (
                <span className="load-more">loading...</span>
            )
        }
    
        // Detecting the end of the list
        if (pageLimit * size > comments.length) {
            return null
        }
    
        return (
            <a
                href="#"
                className="load-more"
                onClick={(e) => {
                    e.preventDefault()
                    setSize(size + 1)
                }}
            >
                Load more
            </a>
        )
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
            <AddCommentBox onSubmit={handleAddComment} />
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
                    { renderLoadMore() }
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
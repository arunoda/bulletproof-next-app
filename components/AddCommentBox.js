import { useState } from "react"

export default function AddCommentBox({onSubmit}) {
    const [commentText, setCommentText] = useState('')
    const [adding, setAdding] = useState(false)

    const handleAddComment = async () => {
        try {
            setAdding(true)
            await onSubmit(commentText)
            setCommentText('')
        } finally {
            setAdding(false)
        }
    }
    
    return (
        <div className="add-comment-box">
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
            />
            <button
                onClick={handleAddComment}
                disabled={adding}
            >
                {adding? 'adding...': 'Add Comment'}
            </button>
        </div>
    )
}
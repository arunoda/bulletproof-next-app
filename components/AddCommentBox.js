import { useState } from "react"
import { useSession, signIn } from 'next-auth/client'

export default function AddCommentBox({onSubmit}) {
    const [commentText, setCommentText] = useState('')
    const [adding, setAdding] = useState(false)
    const [session] = useSession()

    const handleLogin = () => {
        signIn('github')
    }

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
            {session? (
                <>
                    <textarea
                        disabled={!session}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={adding}
                    >
                        {adding? 'adding...': 'Add Comment'}
                    </button>
                </>
            ) : (
                <button onClick={handleLogin}>
                    Login to Add Comment
                </button>
            )}
        </div>
    )
}
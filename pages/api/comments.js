import { getComments, addComment } from '../../lib/data'
import { getSession } from 'next-auth/client'

export default async function comments(req, res) {
    const { slug } = req.query

    if (req.method === 'GET') {
        const comments = await getComments(slug)
        return res.send(comments)
    }

    if (req.method === 'POST') {
        const session = await getSession({ req })

        if (!session) {
            res.status(401).send('Unauthorized')
            return
        }

        if (!req.body.content || req.body.content.trim() === '') {
            res.status(400).send('Comment content should not be empty')
            return
        }

        const comment = {
            userId: session.user.id,
            name: session.user.profile.name,
            avatar: session.user.profile.avatar,
            content: req.body.content,
            createdAt: Date.now()
        }

        // Slow the API to demonstrate real life behavior
        await new Promise((r) => setTimeout(r, 2000))

        await addComment(slug, comment)
        return res.send(comment)
    }

    res.status(404).send('Unsupported Method')
}
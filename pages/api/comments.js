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
            return;
        }

        const comment = {
            userId: session.user.id,
            name: session.user.profile.name,
            avatar: session.user.profile.avatar,
            content: req.body.content,
            createdAt: Date.now()
        }

        // Slow the API to demonstrate real life behavior
        await new Promise((r) => setTimeout(r, 600))

        await addComment(slug, comment)
        return res.send(comment)
    }

    res.status(404).send('Unsupported Method')
}
import { getComments, addComment } from '../../lib/data'
import { getSession } from 'next-auth/client'

export default async function comments(req, res) {
    const { slug, sort, limit, offset } = req.query

    if (req.method === 'GET') {
        const options = {
            sort: sort? parseInt(sort, 10) : undefined,
            limit: limit? parseInt(limit, 10) : undefined,
            offset: offset? parseInt(offset, 10): undefined
        }
        
        const comments = await getComments(slug, options)
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

        await addComment(slug, comment)
        return res.send(comment)
    }

    res.status(404).send('Unsupported Method')
}
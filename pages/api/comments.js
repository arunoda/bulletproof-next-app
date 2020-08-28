import { getComments, addComment } from '../../lib/data'

export default async function comments(req, res) {
    const {slug} = req.query

    if (req.method === 'GET') {
        const comments = await getComments(slug)
        return res.send(comments)
    }
    
    if (req.method === 'POST') {
        const comment = {
            userId: 'user-id',
            name: 'The User',
            avatar: 'https://api.adorable.io/avatars/255/the-user@email.png',
            content: req.body.content,
            createdAt: Date.now()
        }

        // Slow the API to demonstrate real-life behavior.
        await new Promise((r) => setTimeout(r, 600))

        await addComment(slug, comment)
        return res.send(comment)
    }

    res.status(404).send('Unsupported Method')
}
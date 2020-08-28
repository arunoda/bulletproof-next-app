import { createPost, updatePost, getPost, deletePost } from '../../lib/data'
import { getSession } from 'next-auth/client'

export default async function post(req, res) {
    const session = await getSession({ req })

    if (!session) {
        res.status(401).send('Unauthorized')
        return
    }

    if (req.method === 'GET') {
        const post = await getPost(req.query.slug, { ownerId: session.user.id })
        return res.send(post)
    }

    if (req.method === 'POST') {
        const payload = {
            ownerId: session.user.id,
            slug: req.body.slug,
            title: req.body.title,
            content: req.body.content
        }

        const post = await createPost(payload)
        return res.send(post)
    }

    if (req.method === 'PATCH') {
        const payload = {
            ownerId: session.user.id,
            slug: req.query.slug,
            title: req.body.title,
            content: req.body.content
        }

        const post = await updatePost(payload)
        return res.send(post)
    }

    if (req.method === 'DELETE') {
        await deletePost(req.query.slug, { ownerId: session.user.id })
        return res.send({})
    }

    res.status(404).send('Unsupported Method')
}
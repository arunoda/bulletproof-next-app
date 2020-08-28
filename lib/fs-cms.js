import { promises as fsPromises } from 'fs'
import os from 'os'
import path from 'path'

export async function pathExists(filePath) {
    try {
        const stat = await fsPromises.stat(filePath)
        return stat.isFile()
    } catch(err) {
        return false
    }
}

export async function getPostList({ownerId}) {
    const getAllUserBlogPosts = async () => {
        const postPath = await genPostsPath()
        const filenames = await fsPromises.readdir(postPath)
        const posts = []
        for (const filename of filenames) {
            const postText = await fsPromises.readFile(path.join(postPath, filename), 'utf8')
            const post = JSON.parse(postText)
            posts.push(post)
        }

        return posts
    }

    if (ownerId) {
        const posts = await getAllUserBlogPosts()
        
        const ownerPosts = posts.filter(post => post.ownerId === ownerId);
        ownerPosts.sort((a, b) => b.createdAt - a.createdAt)

        return ownerPosts;
    }

    const markdownFiles = await fsPromises.readdir('data')

    const dataDirPostList = markdownFiles.map(filename => {
        const slug = filename.replace(/.md$/, '')
        const [year, month, date, ...rest] = slug.split('-')
        const createdAt = (new Date(`${year} ${month} ${date}`)).getTime()
        const title = rest.join(' ')

        return {
            slug,
            createdAt,
            title
        }
    })

    const allPosts = [
        ...dataDirPostList,
        ...(await getAllUserBlogPosts())
    ]

    allPosts.sort((a, b) => b.createdAt - a.createdAt)

    return allPosts
}

export async function getPost(slug) {
    // Try to fetch from the user's post list
    const filePath = await genPostsFilePath(slug)
    if (await pathExists(filePath)) {
        const postJson = await fsPromises.readFile(filePath, 'utf8')
        return JSON.parse(postJson)
    }

    // Fetch from the data directory
    const [year, month, day, ...rest] = slug.split('-')
    const createdAt = (new Date(`${year} ${month} ${day}`)).getTime()
    const title = rest.join(' ')
    const content = await fsPromises.readFile(`data/${slug}.md`, 'utf8')

    return {
        slug: slug,
        title,
        content,
        createdAt
    }
}

export async function deletePost(slug) {
    // Try to fetch from the user's post list
    const filePath = await genPostsFilePath(slug)
    if (await pathExists(filePath)) {
        await fsPromises.unlink(filePath)
    }
}

export async function createPost({ownerId, slug, title, content}) {
    const createdAt = Date.now()

    const post = {
        ownerId,
        slug,
        title,
        content,
        createdAt,
        updatedAt: createdAt
    }

    const filePath = await genPostsFilePath(slug)
    if (await pathExists(filePath)) {
        throw new Error(`Blog post already exists`)
    }

    await fsPromises.writeFile(filePath, JSON.stringify(post, null, 2), 'utf8')
    return post
}

export async function updatePost({ownerId, slug, title, content}) {
    console.log('UUU', {ownerId, slug, title, content})
    const createdAt = Date.now()

    const post = await getPost(slug, { ownerId })
    if (post.ownerId !== ownerId) {
        throw new Error(`Invalid ownerId`);
    }

    post.title = title
    post.content = content
    post.updatedAt = Date.now()

    const filePath = await genPostsFilePath(slug)
    await fsPromises.writeFile(filePath, JSON.stringify(post, null, 2), 'utf8')
    return post
}

function genUserFilePath(userId) {
    return path.join(os.tmpdir(), 'bulletproof-next-app', 'user', `${userId}.json`)
}

async function genCommentsFilePath(slug) {
    const filePath = path.join(os.tmpdir(), 'bulletproof-next-app', 'comments', `${slug}.json`)
    await fsPromises.mkdir(path.dirname(filePath), { recursive: true })

    if (!await pathExists(filePath)) {
        await fsPromises.writeFile(filePath, '[]', 'utf8')
    }

    return filePath
}

async function genPostsPath() {
    const postsPath = path.join(os.tmpdir(), 'bulletproof-next-app', 'posts')
    await fsPromises.mkdir(postsPath, { recursive: true })
    return postsPath
}

async function genPostsFilePath(slug) {
    const filePath = path.join(await genPostsPath(), `${slug}.json`)
    return filePath
}

export async function saveUser(type, profile) {
    const user = {
        id: `${type}-${profile.id}`,
        [type]: profile,
        profile: {
            name: profile.name,
            avatar: profile.avatar
        }
    }

    const payload = JSON.stringify(user)
    const filePath = genUserFilePath(user.id)
    await fsPromises.mkdir(path.dirname(filePath), { recursive: true })

    await fsPromises.writeFile(filePath, payload, 'utf8')
    return user.id
}

export async function getUser(id) {
    const filePath = genUserFilePath(id)
    try {
        const jsonString = await fsPromises.readFile(filePath, 'utf8')
        return JSON.parse(jsonString)
    } catch(err) {
        if (err.code === 'ENOENT') {
            return null
        }

        throw err
    }
}

export async function getComments(slug) {
    const filePath = await genCommentsFilePath(slug)
    const content = await fsPromises.readFile(filePath, 'utf8')
    return JSON.parse(content)
}

export async function addComment(slug, comment) {
    const filePath = await genCommentsFilePath(slug)
    const comments = await getComments(slug)
    if (!comment.id) {
        comment.id = String(Math.random())
    }
    comments.push(comment)

    await fsPromises.writeFile(filePath, JSON.stringify(comments), 'utf8')
    return comments
}
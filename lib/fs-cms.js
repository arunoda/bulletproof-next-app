import { promises as fsPromises } from 'fs'
import os from 'os'
import path from 'path'

export async function getPostList() {
    const markdownFiles = await fsPromises.readdir('data')

    const postList = markdownFiles.map(filename => {
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

    return postList
}

export async function getPost(slug) {
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

function genUserFilePath(userId) {
    return path.join(os.tmpdir(), 'bulletproof-next-app', 'user', `${userId}.json`)
}

export async function saveUser(user) {
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
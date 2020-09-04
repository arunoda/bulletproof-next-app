import githubCms from './github-cms'
import * as fsCms from './fs-cms'
import { GraphQLClient } from 'graphql-request'

const graphcms = new GraphQLClient(process.env.GRAPHCMS_API_URL)


function canUseGitHub() {
    return Boolean(process.env.GITHUB_PAT)
}

export async function getPostList() {
    const { posts } = await graphcms.request(
        `
        query MyQuery {
            posts {
                title
                slug
                createdAt
                content
            }
        }          
        `
    )

    return posts.map(post => ({
        ...post,
        createdAt: (new Date(post.createdAt)).getTime()
    }))
}

export async function getPost(slug) {
    const { post } = await graphcms.request(
        `
        query MyQuery($slug: String) {
            post(where: {slug: $slug}) {
                title
                slug
                createdAt
                content
            }
        }          
        `,
        { slug }
    )

    return {
        ...post,
        createdAt: (new Date(post.createdAt)).getTime()
    }
}

export async function deletePost(slug, {ownerId} = {}) {
    if (canUseGitHub()) {
        return githubCms.deletePost(slug, {ownerId})
    }

    return fsCms.deletePost(slug, {ownerId})
}

export async function createPost({ownerId, slug, title, content}) {
    if (canUseGitHub()) {
        return githubCms.createPost(slug, {ownerId, title, content})
    }

    return fsCms.createPost({ownerId, slug, title, content})
}

export async function updatePost({ownerId, slug, title, content}) {
    if (canUseGitHub()) {
        return githubCms.updatePost(slug, {ownerId, title, content})
    }

    return fsCms.updatePost({ownerId, slug, title, content})
}

export async function saveUser(type, profile) {
    if (canUseGitHub()) {
        return githubCms.saveUser(type, profile)
    }

    return fsCms.saveUser(type, profile)
}

export async function getUser(id) {
    if (canUseGitHub()) {
        return githubCms.getUser(id)
    }

    return fsCms.getUser(id)
}

export async function getComments(slug, options) {
    if (canUseGitHub()) {
        return githubCms.getCommentsWithPagination(slug, options)
    }

    return fsCms.getComments(slug, options)
}

export async function addComment(slug, comment) {
    if (canUseGitHub()) {
        return githubCms.addComment(slug, comment)
    }

    return fsCms.addComment(slug, comment)
}
